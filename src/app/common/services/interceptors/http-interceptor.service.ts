import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap, finalize, filter, take } from 'rxjs/operators';
// Include services here
import { SnackBarService } from '../snack-bar.service';
import { CryptionService } from '../../../common/services/cryption.service';
import { HttpHeaderService } from '../http-headers/http-header.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { LogoutService } from 'src/app/modules/logout/services/logout.service';
import { SharedService } from '../shared.service';

// Include constants and models here
import { AuthTokenModel } from '../../models/user.model';
import { ErrorModel } from '../../models/errors.model';
import { ACCESS_TOKEN_TEXT, REFRESH_TOKEN_TEXT } from 'src/app/modules/auth/auth-module.constants';
import {
    TEXT_PLAIN, CONTENT_TYPE_TEXT, HTTP_STATUS_CODE, API_ERROR_LIST,
    RESPONSE_TYPE_TEXT, SNACK_BAR_RESTRICTED_MESSAGES, SNACK_BAR_RESTRICTED_ERROR_CODES, codeText, descText
} from '../../global-constants';
import { environment } from '../../../../environments/environment';
import { CIAM_ERROR_MAPPING, GENERIC_ERROR_MESSAGE } from '../../ciam-error-mapping';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    private BODY = 'body';
    private STRING = 'string';
    responseType = RESPONSE_TYPE_TEXT;
    private requests: HttpRequest<any>[] = [];
    refreshTokenInProgress = false;
    tokenRefreshedSource$ = new BehaviorSubject<string>(null);
    loaderStatus = false;
    constructor(
        private snackBarService: SnackBarService,
        private cryptionService: CryptionService,
        private httpHeaderService: HttpHeaderService,
        private authService: AuthService,
        private sharedService: SharedService,
        private logoutService: LogoutService
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        this.requests.push(req);
        this.showLoader();
        this.responseType = req.responseType;
        // clone and modify request
        let cloneReq: HttpRequest<any>;
        cloneReq = req.clone({
            headers: this.httpHeaderService.generateHttpHeaders(req)
                .append('X-IBM-Client-Id', environment.IBM_CLIENT_ID)
        });
        // Enable encryption only if responseType = 'text'
        if (this.responseType === RESPONSE_TYPE_TEXT &&
            environment.CRYPTOGRAPHY_ENABLED && cloneReq.headers.get(CONTENT_TYPE_TEXT) === TEXT_PLAIN) {
            cloneReq[this.BODY] = this.cryptionService.encrypt(cloneReq[this.BODY]);
        }
        return next.handle(cloneReq).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this.removeRequest(req);
                }
                return this.decryptResponse(event);
            }),
            catchError((error: HttpErrorResponse) => {
                this.removeRequest(req);
                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    return throwError(`Error: ${error.error.message}`);
                } else if (error instanceof HttpErrorResponse && error.status === 401) {
                    if (!this.refreshTokenInProgress) {
                        this.refreshTokenInProgress = true;
                        // making unauthorized API's in Que
                        this.tokenRefreshedSource$.next(null);
                        // making refresh token request
                        return this.authService.refreshAccessToken().pipe(
                            switchMap((authResponse: AuthTokenModel) => {
                                this.settingAccessTokenInfo(authResponse);
                                cloneReq = this.updateReqHeaderWithNewAccessToken(cloneReq);
                                return next.handle(cloneReq).pipe(
                                    map((event: HttpEvent<any>) => {
                                        return this.decryptResponse(event);
                                    }));
                            }),
                            catchError((errorResponse: HttpErrorResponse) => {
                                // incase of refresh token expired logout the user
                                this.logoutService.logoutUser();
                                return throwError(errorResponse);
                            }),
                            finalize(() => {
                                this.refreshTokenInProgress = false;
                            })
                        );
                    } else {
                        // making unautherized API's in Que and call API once new access token received
                        return this.tokenRefreshedSource$.pipe(
                            filter(token => token != null),
                            take(1),
                            switchMap(token => {
                                cloneReq = this.updateReqHeaderWithNewAccessToken(cloneReq);
                                return next.handle(cloneReq).pipe(
                                    map((event: HttpEvent<any>) => {
                                        return this.decryptResponse(event);
                                    }));
                            })
                        );
                    }
                } else {
                    // errorData may vary for different types of errors
                    const errorData: any = this.checkErrorCodes(error);
                    this.showErrorInSnackBar(errorData);
                    return throwError({ httpCode: error.status, error: errorData });
                }
            }));
    }

    /**
     * @methodName showLoader
     * @description used show loader effect
     * @parameters none
     * @return null
     */
    showLoader(): void {
        if (!(this.loaderStatus) && this.requests.length !== 0) {
            this.sharedService.loaderSubject.next(true);
            this.loaderStatus = true;
        }
    }

    /**
     * @methodName removeRequest
     * @description used remove loader effect
     * @parameters req<HttpRequest>
     * @return null
     */
    removeRequest(req: HttpRequest<any>): void {
        this.requests.pop();
        if (this.requests.length === 0 && this.loaderStatus) {
            this.sharedService.loaderSubject.next(false);
            this.loaderStatus = false;
        }
    }

    /**
     * @methodName checkErrorCodes
     * @description used to generate x-unique-id
     * @parameters error<HttpErrorRespons>
     * @return HttpErrorResponse
     */
    checkErrorCodes(error: HttpErrorResponse): HttpErrorResponse {
        // errorData may vary for different types of errors
        const errorInfo = {} as HttpErrorResponse;
        let errorData: any;
        if (error.error) {
            errorData = (this.responseType === RESPONSE_TYPE_TEXT || error.headers.get('content-type') === TEXT_PLAIN) ?
                JSON.parse(this.cryptionService.decrypt(error.error)) : error.error;
        }
        if ((error.status === HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR && error.statusText && error.statusText !== 'undefined') ||
            error.status === HTTP_STATUS_CODE.SERVICE_UNAVAILABLE ||
            error.status === HTTP_STATUS_CODE.GATEWAY_TIME_OUT) {
            if (errorData && errorData.exceptionMsg) {
                errorInfo[HTTP_STATUS_CODE.vendorStatus] = this.sharedService.getCIAMErrorMessage(errorData.exceptionMsg);
            } else if (errorData && errorData.error_message) {
                errorInfo[HTTP_STATUS_CODE.vendorStatus] = errorData.error_message;
            } else {
                errorInfo[HTTP_STATUS_CODE.vendorStatus] = error.statusText;
            }
        } else if (error.status === HTTP_STATUS_CODE.EXPECTATION_FAILED && errorData && errorData.desc) {
            errorInfo['desc'] = errorData.desc;
        } else if (error.error) {
            if (error.error instanceof Blob && error.error.type === 'text/plain') {
                errorInfo['desc'] = API_ERROR_LIST.NO_STATEMENT_AVAILABLE;
            } else {
                errorInfo['details'] = this.getErrorDesciption(error);
            }
            if (errorInfo && errorInfo[HTTP_STATUS_CODE.vendorStatus]) {
                // It will return the vendorStatus description from API_ERROR_LIST list
                errorInfo[HTTP_STATUS_CODE.vendorStatus] = API_ERROR_LIST[errorInfo[HTTP_STATUS_CODE.vendorStatus]] ?
                    API_ERROR_LIST[errorInfo[HTTP_STATUS_CODE.vendorStatus]] : errorInfo['desc'];
            }
        }
        return errorInfo;
    }

    /**
     * @methodName getErrorDesciption
     * @description used for error desciption mapping
     * @parameters error<HttpErrorRespons>
     * @return ErrorModel
     */
    getErrorDesciption(error: HttpErrorResponse): ErrorModel {
        if (error && error.status) {
            const ERROR = new ErrorModel();
            ERROR.status = error.status;
            const errorData = (this.responseType === RESPONSE_TYPE_TEXT || error.headers.get('content-type') === TEXT_PLAIN) ?
                JSON.parse(this.cryptionService.decrypt(error.error)) : error.error;
            ERROR.description = this.mapErrorDesciption(errorData);
            ERROR.name = error.name;
            return ERROR;
        }
    }

    /**
     * @methodName mapErrorDesciption
     * @description used for map error in traslation
     * @parameters errorData<any>
     * @return string
     */
    mapErrorDesciption(errorData: any): string {
        let errorMeppedValue = '';
        if (errorData && errorData.error_description) {
            errorMeppedValue = (CIAM_ERROR_MAPPING[errorData.error_description]) ? CIAM_ERROR_MAPPING[errorData.error_description]
                : errorData.error_description;
        } else if (errorData && errorData.message) {
            errorMeppedValue = (CIAM_ERROR_MAPPING[errorData.message]) ? CIAM_ERROR_MAPPING[errorData.message] : errorData.message;
        } else {
            errorMeppedValue = errorData;
        }
        return errorMeppedValue;
    }

    /**
     * @methodName updateReqHeaderWithNewAccessToken
     * @description used for updating header new access token
     * @parameters clonedReq: HttpRequest<any>
     * @return HttpRequest<any>
     */
    updateReqHeaderWithNewAccessToken(clonedReq: HttpRequest<any>): HttpRequest<any> {
        clonedReq = clonedReq.clone({
            setHeaders: { Authorization: 'Bearer ' + this.sharedService.accessToken }
        });
        return clonedReq;
    }

    /**
     * @methodName decryptResponse
     * @description used for decrypting api response
     * @parameters event:HttpEvent<any>
     * @return HttpEvent<any>
     */
    decryptResponse(event: HttpEvent<any>): HttpEvent<any> {
        if (environment.CRYPTOGRAPHY_ENABLED && event[this.BODY] && typeof (event[this.BODY]) === this.STRING) {
            event[this.BODY] = this.cryptionService.decrypt(event[this.BODY]);
        }
        return event;
    }

    /**
     * @methodName settingAccessTokenInfo
     * @description used for setting access token info
     * @parameters authResponse:TokenModel
     * @return none
     */
    settingAccessTokenInfo(authResponse: AuthTokenModel): void {
        if (authResponse) {
            this.refreshTokenInProgress = false;
            this.sharedService.accessToken = authResponse[ACCESS_TOKEN_TEXT];
            this.sharedService.refreshToken = authResponse[REFRESH_TOKEN_TEXT];
            // dispatch token for calling qued API's
            this.tokenRefreshedSource$.next(this.sharedService.accessToken);
        }
    }

    /**
     * @methodName showErrorInSnackBar
     * @description used for showing snackbar incase of API error
     * @parameters errorData<any>
     * @return void
     */
    showErrorInSnackBar(errorData: any): void {
        let errorDescription = GENERIC_ERROR_MESSAGE;
        if (errorData.vendorStatus) {
            errorDescription = errorData.vendorStatus;
        } else if (errorData.httpMessage) {
            errorDescription = errorData.httpMessage;
        } else if (errorData.desc) {
            errorDescription = errorData.desc;
        } else if (errorData && errorData.details && errorData.details.description &&
            typeof errorData.details.description === this.STRING) {
            errorDescription = errorData.details.description;
        } else if (errorData && errorData.details && errorData.details.description && errorData.details.description[descText]) {
            errorDescription = ( errorData.details.description[codeText]
            && SNACK_BAR_RESTRICTED_ERROR_CODES.includes(errorData.details.description[codeText])) ?
             errorData.details.description[codeText] : errorData.details.description[descText];
        }
        if (!SNACK_BAR_RESTRICTED_MESSAGES.includes(errorDescription)) {
            this.snackBarService.showSnackBar({
                showSnackBar: true, message: {
                    msgType: 'error',
                    msgText: errorDescription
                }
            });
        }
    }
}
