import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { APISyncService } from 'src/app/common/services/sync.service';
import { NEW_USER_REG_CIAM_PAYLOAD, DOMAINS } from '../../../common/global-constants';
import { HttpHeaderService } from 'src/app/common/services/http-headers/http-header.service';
import { EstatementSubscription } from 'src/app/common/models/registration.model';
import { SUBSCRIPTION_ENDPOINT } from 'src/app/common/api-endpoints';
import { SharedService } from 'src/app/common/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService implements OnDestroy {
  subscription$ = new Subscription();
  userName: string;
  password: string;
  cardNumber: string;
  pinNumber: string;
  securityTipClickStatus$ = new BehaviorSubject<boolean>(false);
  securityTipClickStatus = this.securityTipClickStatus$.asObservable();
  browserData = {};
  fontList: string;
  newUserRegistrationSubject$ = new BehaviorSubject(undefined);
  newUserRegistrationObservable = this.newUserRegistrationSubject$.asObservable();
  otpResponse$ = new BehaviorSubject(undefined);
  otpResponse = this.otpResponse$.asObservable();
  usernameApiResponse$ = new BehaviorSubject(undefined);
  usernameApiResponse = this.usernameApiResponse$.asObservable();
  deRegister$ = new BehaviorSubject(undefined);
  deRegister = this.deRegister$.asObservable();
  constructor(
    private apiService: APISyncService,
    private sharedService: SharedService,
    private httpHeaderService: HttpHeaderService) { }

  /**
   * @methodName updateSecurityTipsClick
   * @description used to update BehaviorSubject this.setSecurityTipClick$ on security tips click
   * @parameters status<boolean>
   * @return none
   */

  updateSecurityTipsClick(status: boolean): void {
    this.securityTipClickStatus$.next(status);
  }

  /**
   * @methodName userExist
   * @parameter username<string>
   * @description used to check username already in record
   * @return boolean
   */
  userExist(username: string): boolean {
    // CIAM call to check user already exist or not
    // if user alreadyexist return true, else return false
    return false;
  }

  /**
   * @methodName checkValidCardDetails
   * @description validates the customer details by card and pin
   * @parameter void
   * @return Observable<any>
   */
  checkValidCardDetails(displaceSession: boolean = false): Observable<any> {
    // Assigning generateCiamValidateCardHeaders  method to generate custom header
    this.httpHeaderService.customHeaderFunction = this.httpHeaderService.generateCiamValidateCardHeaders;
    const payloadObj = new HttpParams().set('grant_type', environment.CIAM.GRANT_TYPE)
      .set('client_id', environment.CIAM.CLIENT_ID)
      .set('username', this.cardNumber)
      .set('password', this.pinNumber)
      .set('mode', environment.CIAM.MODE_CARD_NUM_PIN);
    let CIAM_URL = environment.API_CONNECT_URL + environment.ADIB + environment.CIAM.ENDPOINTS.VALIDATE_CARD_PIN;
    CIAM_URL = this.sharedService.handleDisplaceSession(CIAM_URL, displaceSession);
    return this.apiService.post(encodeURI(CIAM_URL), payloadObj, 'json');
  }

  /**
   * @methodName newUserRegistration
   * @description initiate the new user regisration flow
   * @parameter void
   * @return void
   */
  newUserRegistration(): Observable<any> {
    const payloadObj = NEW_USER_REG_CIAM_PAYLOAD;
    const CIAM_URL = environment.API_CONNECT_URL + environment.ADIB + environment.CIAM.ENDPOINTS.NEW_USER_REGISTRATION;
    // Assigning generateCiamOTPHeaders  method to generate custom header
    this.httpHeaderService.customHeaderFunction = this.httpHeaderService.generateCiamOTPHeaders;
    return this.apiService.post(encodeURI(CIAM_URL), payloadObj)
      .pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName usernameRegistration
   * @description initiate the new username for registration
   * @parameter void
   * @return Observable<any>
   */
  usernameRegistration(): Observable<any> {
    const payloadObj = { username: this.userName };
    let CIAM_URL: string;
    // get the location value from otp response for username API call
    this.subscription$.add(this.otpResponse.subscribe(response => {
      if (response) {
        const locationFromOtpResponse = response.location;
        CIAM_URL = `${environment.API_CONNECT_URL}${environment.ADIB}${locationFromOtpResponse}`;
      }
    }));

    if (CIAM_URL) {
      // Assigning generateCIAMUsernameHeaders method to generate custom header for creating Username
      this.httpHeaderService.customHeaderFunction = this.httpHeaderService.generateCIAMUsernameHeaders;
      return this.apiService.put(encodeURI(CIAM_URL), payloadObj)
        .pipe(map(res => res.body ? JSON.parse(res.body) : res));
    }
  }

  /**
   * @methodName passwordRegistration
   * @description initiate the new user password for registration
   * @parameter void
   * @return Observable<any>
   */
  passwordRegistration(): Observable<any> {
    const payloadObj = { newPassword: this.password, newPasswordConfirm: this.password };
    let CIAM_URL: string;
    // get the location value from username response for password API call
    this.subscription$.add(this.usernameApiResponse.subscribe(response => {
      if (response) {
        const usernameResponseLocation = response.location;
        CIAM_URL = `${environment.API_CONNECT_URL}${environment.ADIB}${usernameResponseLocation}`;
      }
    }));

    if (CIAM_URL) {
      // Assigning generateCIAMPasswordHeaders method to generate custom header for creating password
      this.httpHeaderService.customHeaderFunction = this.httpHeaderService.generateCIAMPasswordHeaders;
      return this.apiService.put(encodeURI(CIAM_URL), payloadObj)
        .pipe(map(res => res.body ? JSON.parse(res.body) : res));
    }
  }

  /**
   * @methodName cancelRegistration
   * @description used to handle cancel registration
   * @parameter void
   * @return Observable<any>
   */
  cancelRegistration() {
    const payloadObj = {};
    const CIAM_URL = `${environment.API_CONNECT_URL}${environment.ADIB}${environment.CIAM.ENDPOINTS.DE_REGISTARTION}`;
    if (CIAM_URL) {
      // Assigning onlyAuthorizationHeader method to generate cancel regitstration header
      this.httpHeaderService.customHeaderFunction = this.httpHeaderService.onlyAuthorizationHeader;
      return this.apiService.post(encodeURI(CIAM_URL), payloadObj)
        .pipe(map(res => res.body ? JSON.parse(res.body) : res));
    }
  }

  /**
   * @methodName getUserEmail
   * @description  used to fetch the user email id from subscription service
   * @parameter void
   * @return Observable<EstatementSubscription>
   */
  getUserEmail(): Observable<EstatementSubscription> {
    const SUBSCRIPTION_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) + SUBSCRIPTION_ENDPOINT;
    this.httpHeaderService.customHeaderFunction = this.httpHeaderService.subscriptionHeaders;
    return this.apiService.get(SUBSCRIPTION_API);
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
