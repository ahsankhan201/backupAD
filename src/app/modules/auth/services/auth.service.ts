import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

import { HttpHeaderService } from 'src/app/common/services/http-headers/http-header.service';
import { APISyncService } from 'src/app/common/services/sync.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { DialogService } from 'src/app/common/services/dialog.service';

import { environment } from 'src/environments/environment';
import { COMPONENT_LIST, UNKNOWN_DEVICE_TEXT, NONE_TEXT, AUTH_DIALOG_CLASS } from '../auth-module.constants';
import { NEW_USER_REG_CIAM_PAYLOAD, NO_WHITESPACE_REGEX, HIDE_OVERFLOW_CLASS } from '../../../common/global-constants';
import { BrowserRegistrationDetails } from 'src/app/common/models/registration.model';
import { VerifyUsernamePayload, ForgetUsernamePayload } from 'src/app/common/models/password.model';
import { CiamForgetUsername } from 'src/app/common/models/ciam.model';
import { Dialog } from 'src/app/common/models/dialog.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  subscription$ = new Subscription();
  password: string;
  confirmPassword: string;
  cardNumber: string;
  pinNumber: string;
  securityTipClickStatus$ = new BehaviorSubject<boolean>(false);
  securityTipClickStatus = this.securityTipClickStatus$.asObservable();
  showComponent$ = new BehaviorSubject<string>(COMPONENT_LIST.LOGIN);
  forgotPassword$ = new BehaviorSubject(undefined);
  forgotPassword = this.forgotPassword$.asObservable();
  otpResponse$ = new BehaviorSubject(undefined);
  otpResponse = this.otpResponse$.asObservable();
  usernameApiResponse$ = new BehaviorSubject(undefined);
  usernameApiResponse = this.usernameApiResponse$.asObservable();
  forgetComponentName: string;
  forgotUsername$ = new BehaviorSubject(undefined);
  forgotUsername = this.forgotUsername$.asObservable();
  isUserBlocked$ = new BehaviorSubject(undefined);
  isUserBlocked = this.isUserBlocked$.asObservable();
  isUserBlockedStatus: boolean;
  userEmailId: string;
  clearInputFieldValues$ = new BehaviorSubject(undefined);
  clearInputFieldValues = this.clearInputFieldValues$.asObservable();
  constructor(
    private apiService: APISyncService,
    private httpHeaderService: HttpHeaderService,
    private sharedService: SharedService,
    private dialogService: DialogService) { }

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
   * @methodName forgotPasswordOtpCall
   * @description initiate the forgot password/ unlockusername flow
   * @parameter void
   * @return void
   */
  forgotPasswordOtpCall(): Observable<any> {
    const payloadObj = NEW_USER_REG_CIAM_PAYLOAD;
    const END_POINT = (this.isUserBlockedStatus) ? environment.CIAM.ENDPOINTS.UNLOCK_USERNAME :
      environment.CIAM.ENDPOINTS.FORGET_PASSWORD; // default endpointis for forget password
    const CIAM_URL = environment.API_CONNECT_URL + environment.ADIB + END_POINT;
    // Assigning generateCiamOTPHeaders  method to generate custom header
    this.httpHeaderService.customHeaderFunction = this.httpHeaderService.generateCiamOTPHeaders;
    return this.apiService.post(encodeURI(CIAM_URL), payloadObj, 'text', undefined, true)
      .pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName setPassword
   * @description initiate the new username for registration
   * @parameter void
   * @return Observable<any>
   */
  setPassword(): Observable<any> {
    const payloadObj = { newPassword: this.password, newPasswordConfirm: this.confirmPassword };
    let stateId: string;
    if (this.isUserBlockedStatus) {
      // unlock username flow
      this.subscription$.add(this.otpResponse.subscribe(response => { stateId = response.location; }));
    } else {
      // unlock username flow with verify username step
      this.subscription$.add(this.usernameApiResponse.subscribe(response => { stateId = response.location; }));
    }
    const CIAM_URL = environment.API_CONNECT_URL + environment.ADIB + stateId;

    // Assigning generateCIAMUsernameHeaders method to generate custom header for creating Username
    this.httpHeaderService.customHeaderFunction = this.httpHeaderService.generateCIAMUsernameHeaders;
    return this.apiService.put(encodeURI(CIAM_URL), payloadObj)
      .pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName postLoginDetails
   * @description used to get the access token from server
   * @parameters url<string>,reqPayLoad<any>
   * @return Observable<any>
   */
  postLoginDetails(url: string, reqPayLoad: any): Observable<any> {
    return this.apiService.post(url, reqPayLoad, 'json');
  }

  /**
   * @methodName getDeviceRegistrationSession
   * @description used to fetch device session from server
   * @parameters url<string>,reqPayLoad<any>
   * @return Observable<any>
   */
  getDeviceRegistrationSession(url: string, reqPayLoad: any): Observable<any> {
    return this.apiService.post(url, reqPayLoad);
  }

  /**
   * @methodName registerDeviceInfo
   * @description used to register the device
   * @parameters url<string>,reqPayLoad<any>
   * @return Observable<any>
   */
  registerDeviceInfo(url: string, reqPayLoad: BrowserRegistrationDetails): Observable<any> {
    return this.apiService.post(url, reqPayLoad, 'text', undefined, true);
  }

  /**
   * @methodName getBrowserPlugins
   * @description to get the plugin names which are installed in browser
   * @parameters none
   * @return string
   */
  getBrowserPlugins(): string {
    let plugins = '';
    Array.from(navigator.plugins).forEach((plugin, index) => {
      plugins += index !== navigator.plugins.length - 1 ? `${plugin.name},` : plugin.name;
    });
    // if plugins not found return 'none'
    return plugins ? plugins : NONE_TEXT;
  }

  /**
   * @methodName getDeviceName
   * @description to get the device name
   * @parameters none
   * @return string
   */
  getDeviceName(): string {
    let deviceName = UNKNOWN_DEVICE_TEXT;
    // @ts-ignore
    const client = new ClientJS();
    const deviceInfo = client.getBrowserData();
    if (Object.keys(deviceInfo).length) {
      // collecting device model/vendor name
      if (deviceInfo.device && Object.keys(deviceInfo.device).length && (deviceInfo.device.model || deviceInfo.device.vendor)) {
        deviceName = deviceInfo.device.model && deviceInfo.device.model.length > 1 ? deviceInfo.device.model : deviceInfo.device.vendor;
      }
      // collecting device OS name and version
      if (deviceInfo.os && Object.keys(deviceInfo.os).length && deviceInfo.os.name) {
        deviceName = deviceName !== UNKNOWN_DEVICE_TEXT ? `${deviceName}_${deviceInfo.os.name}_${deviceInfo.os.version}` :
          `${deviceInfo.os.name} _${deviceInfo.os.version} `;
      }
      // collecting device browser name
      if (client.getBrowser()) {
        deviceName = `${deviceName}_${deviceInfo.browser.name}`;
      }
    }
    return deviceName.replace(NO_WHITESPACE_REGEX, '');
  }

  /**
   * @methodName forgotUsernameVerify
   * @description initiate the forgot username flow
   * @parameter void
   * @return Observable<any>
   */
  forgotUsernameVerify(): Observable<any> {
    const payloadObj = NEW_USER_REG_CIAM_PAYLOAD;
    const END_POINT = environment.CIAM.ENDPOINTS.FORGET_USERNAME; // default endpointis for forget username
    const CIAM_URL = environment.API_CONNECT_URL + environment.ADIB + END_POINT;
    // Assigning generateCiamOTPHeaders  method to generate custom header
    this.httpHeaderService.customHeaderFunction = this.httpHeaderService.generateCiamOTPHeaders;
    return this.apiService.post(encodeURI(CIAM_URL), payloadObj)
      .pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName setUsername
   * @description call CIAM API to reset username
   * @parameter void
   * @return Observable<CiamForgetUsername>
   */
  setUsername(): Observable<CiamForgetUsername> {
    if (this.sharedService.userEmailId) {
      const payloadObj = {} as ForgetUsernamePayload;
      payloadObj.email = [] as string[];
      payloadObj.email.push(this.sharedService.userEmailId);
      let otpLocation = '';
      this.otpResponse.subscribe(response => { otpLocation = response.location; });
      const CIAM_URL = environment.API_CONNECT_URL + environment.ADIB + otpLocation;

      // Assigning forgetUsernameHeaders method to generate custom header for creating Username
      this.httpHeaderService.customHeaderFunction = this.httpHeaderService.forgetUsernameHeaders;
      return this.apiService.put(encodeURI(CIAM_URL), payloadObj)
        .pipe(map(res => res.body ? JSON.parse(res.body) : res));
    }
  }
  /**
   * @methodName setUsername
   * @description call CIAM API to reset username
   * @parameter void
   * @return Observable<any>
   */
  refreshAccessToken(): Observable<any> {
    const LOGIN_URL = `${environment.API_CONNECT_URL}${environment.ADIB}${environment.CIAM.ENDPOINTS.LOGIN}`;
    const requestPayLoad = this.generateRefreshTokenPayLoad();
    return this.apiService.post(encodeURI(LOGIN_URL), requestPayLoad, 'json')
      .pipe(map(res => res.body ? res.body : res));
  }

  /**
   * @methodName generateLoginPayLoad
   * @parameter none
   * @description used to genreate the login request payload
   * @return none
   */
  generateRefreshTokenPayLoad(): HttpParams {
    this.httpHeaderService.customHeaderFunction = this.httpHeaderService.refershTokenHeaders;
    return new HttpParams().set('grant_type', environment.CIAM.REFRESH_TOKEN_GRANT_TYPE)
      .set('client_id', environment.CIAM.CLIENT_ID)
      .set('refresh_token', this.sharedService.refreshToken);
  }

  /**
   * @methodName verifyUsername
   * @description verify Username for forget password step
   * @parameter void
   * @return Observable<any>
   */
  verifyUsername(username: string): Observable<CiamForgetUsername> {
    if (username) {
      const payloadObj: VerifyUsernamePayload = { checkusername: username };
      let otpLocation = '';
      this.subscription$.add(this.otpResponse.subscribe(response => { otpLocation = response.location; }));
      const CIAM_URL = environment.API_CONNECT_URL + environment.ADIB + otpLocation;

      // Assigning generateCIAMUsernameHeaders method to generate custom header for creating Username
      this.httpHeaderService.customHeaderFunction = this.httpHeaderService.generateCIAMUsernameHeaders;
      return this.apiService.put(encodeURI(CIAM_URL), payloadObj)
        .pipe(map(res => res.body ? JSON.parse(res.body) : res));
    }
  }

  /**
   * @methodName openRegistraionConfirmModal
   * @parameter none
   * @description used to open registered device component in modal
   * @return none
   */
  openRegistraionConfirmModal(): void {
    const OPTIONS = {} as Dialog;
    OPTIONS.isRegistarationConfirmDialog = true;
    OPTIONS.dialogClassName = AUTH_DIALOG_CLASS;
    this.dialogService.open(OPTIONS);
    this.dialogService.confirmed().subscribe(() => {
      document.querySelector('body').classList.remove(HIDE_OVERFLOW_CLASS);
    });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
