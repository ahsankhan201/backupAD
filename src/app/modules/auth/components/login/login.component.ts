import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { HttpHeaderService } from 'src/app/common/services/http-headers/http-header.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { AuthService } from '../../services/auth.service';
import { LogoutService } from 'src/app/modules/logout/services/logout.service';

import { environment } from 'src/environments/environment';
import { AGREEMENT_ENDPOINTS, DEVICE_REGISTRATION, DISPLACE_SESSION } from 'src/app/common/api-endpoints';
import { BrowserRegistrationDetails } from 'src/app/common/models/registration.model';
import { OTPResponse } from 'src/app/common/models/otp.model';
import {
  DASH_BOARD_ROUTE_URL, ACCESS_TOKEN_TEXT,
  ERROR_DESCRIPTION_TEXT, NONE_TEXT, REFRESH_TOKEN_TEXT
} from '../../auth-module.constants';
import { COMPONENT_LIST, IS_REGISTRED_COOKIE_TEXT } from '../../auth-module.constants';
import { CIAM_ERROR_MAPPING, ERROR_LIST } from 'src/app/common/ciam-error-mapping';
import {
  DOMAINS, IS_REGISTERED_TEXT, HTTP_STATUS_CODE, DIALOG_OPTION_USER_AGREEMENT,
  AGREEMENT_CODE, CAPTCHA_TEXT, ARABIC_LANG_TEXT, DIALOG_OPTION_USER_SESSION_MANAGEMENT
} from 'src/app/common/global-constants';
import { Dialog } from 'src/app/common/models/dialog.model';
import { DialogService } from 'src/app/common/services/dialog.service';
import { UserAgreementRequest } from 'src/app/common/models/global.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  showInfoContainer: boolean;
  loginFormGroup: FormGroup;
  loginFromNewDevice: boolean;
  location: string;
  componentList = COMPONENT_LIST;
  enableRecaptcha = false;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  subscription$ = new Subscription();
  @ViewChild('informationContainer', { static: false }) infoContainer: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private httpHeadersService: HttpHeaderService,
    private sharedService: SharedService,
    private dialogService: DialogService,
    private logoutService: LogoutService) {
  }
  ngOnInit() {
    this.createLoginForm();
    this.getSelectedLanguage();
    this.showInfoContainer = this.sharedService.getCookie(IS_REGISTRED_COOKIE_TEXT) ? true : false;
  }

  /**
   * @methodName createLoginForm
   * @parameter none
   * @description used to create the login form group
   * @return none
   */
  createLoginForm(): void {
    this.loginFormGroup = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      captcha: [''],
    });
  }

  /**
   * @methodName showForgetComponent
   * @parameter componentName<string>
   * @description used to show forget username / password component view
   * @return none
   */
  showForgetComponent(componentName: string) {
    this.authService.clearInputFieldValues$.next(true);  // reset input field value for request
    this.authService.forgetComponentName = undefined;
    this.sharedService.userEmailId = undefined; // resetting user email
    if (componentName) {
      this.authService.forgetComponentName = componentName;
      this.authService.showComponent$.next(componentName);
    }
  }

  /** @methodName loginUser
   * @parameter none
   * @description used to get access token using credentials from server
   * @return none
   */
  loginUser(displaceSession: boolean = false): void {
    this.enableRecaptcha = false;
    this.infoContainer.nativeElement.classList.remove('error');
    const reqPayLoad = this.generateLoginPayLoad();
    let LOGIN_URL = `${environment.API_CONNECT_URL}${environment.ADIB}${environment.CIAM.ENDPOINTS.LOGIN}`;
    LOGIN_URL = this.sharedService.handleDisplaceSession(LOGIN_URL, displaceSession);
    this.authService.postLoginDetails(encodeURI(LOGIN_URL), reqPayLoad).subscribe((response) => {
      if (response.status === HTTP_STATUS_CODE.OK && response.body && response.body[ACCESS_TOKEN_TEXT]) {
        this.sharedService.accessToken = response.body[ACCESS_TOKEN_TEXT];
        this.sharedService.customerRIMID = response.body['rimid'];
        this.sharedService.refreshToken = response.body[REFRESH_TOKEN_TEXT];
        this.checkDeviceRegistaration();
        this.resetCaptcha();
      }
    },
      (error) => {
        if (error && error.error && error.error.details &&
          (error.error.details[ERROR_DESCRIPTION_TEXT] === CIAM_ERROR_MAPPING.R02 ||
            error.error.details[ERROR_DESCRIPTION_TEXT] === CIAM_ERROR_MAPPING.R01)) {
          this.infoContainer.nativeElement.classList.add('error');
        } else if (error && error.error && error.error.details &&
          (error.error.details[ERROR_DESCRIPTION_TEXT] === ERROR_LIST.R14)) {
          this.infoContainer.nativeElement.classList.add('error');
          this.loginFormGroup.get(CAPTCHA_TEXT).setValidators(Validators.required);
          this.loginFormGroup.get(CAPTCHA_TEXT).updateValueAndValidity();
          this.enableRecaptcha = true;
        } else if (error && error.error && error.error.details &&
          (error.error.details[ERROR_DESCRIPTION_TEXT] === CIAM_ERROR_MAPPING.R15)) {
          // rest login username and password
          this.loginFormGroup.reset();
          // unlock user and forgot password are using same component - COMPONENT_LIST.FORGET_PASSWORD
          // Error Code - R03
          this.authService.isUserBlockedStatus = true;
          this.authService.isUserBlocked$.next(true);
          this.authService.forgetComponentName = COMPONENT_LIST.UNLOCK_USERNAME;
          this.authService.showComponent$.next(COMPONENT_LIST.FORGET_PASSWORD);
        } else if (error && error.error && error.error.details &&
          (error.error.details[ERROR_DESCRIPTION_TEXT] === ERROR_LIST.R115)) {
            this.handleUserSessionManagment();
        }
        this.resetCaptcha();
        this.loginFormGroup.updateValueAndValidity();
      });
  }

  /**
   * @methodName getUserAgreementData
   * @parameter none
   * @description it will get user agreement content
   * @return none
   */
  getUserAgreementData(): void {
    const GET_AGREEMENT_URL =
      this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      AGREEMENT_ENDPOINTS.AGREEMENT_REQ + '?agreementCode=' + AGREEMENT_CODE;
    this.sharedService.getUserAgreement(GET_AGREEMENT_URL).subscribe((response) => {
      if (response && response.agreementStatus) {
        this.sharedService.agreementVersion = response.agreementVersion;
        this.sharedService.agreementContent = atob(response.agreementContent);
        this.handleTermsAndCondition();
      } else if (response && !response.agreementStatus) {
        this.sharedService.isUserLoggedIn = true;
        this.sharedService.toggleBackgroundImageClasses();
        this.router.navigateByUrl(DASH_BOARD_ROUTE_URL);
      }
    });
  }

  /**
   * @methodName handleTermsAndCondition
   * @parameter none
   * @description used to handle terms and condition after login
   * @return none
   */
  handleTermsAndCondition(): void {
    const OPTIONS: Dialog = DIALOG_OPTION_USER_AGREEMENT;
    this.dialogService.open(OPTIONS);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed === true) {
        this.userAgreementRequest();
      }
    });
  }

  /**
   * @methodName userAgreementRequest
   * @parameter none
   * @description used to make certificate request
   * @return none
   */
  userAgreementRequest(): void {
    const AGREEMENT_REQ_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + AGREEMENT_ENDPOINTS.AGREEMENT_REQ;
    const userAgreementPayload = {} as UserAgreementRequest;
    userAgreementPayload.agreementVersion = this.sharedService.agreementVersion;
    userAgreementPayload.agreementCode = AGREEMENT_CODE;
    userAgreementPayload.agreementStatus = true;
    userAgreementPayload.nickName = this.authService.getDeviceName();
    this.sharedService.makeUserAgreementReq(AGREEMENT_REQ_API, userAgreementPayload).subscribe((response) => {
      if (response) {
        this.sharedService.isUserLoggedIn = true;
        this.sharedService.toggleBackgroundImageClasses();
        this.router.navigateByUrl(DASH_BOARD_ROUTE_URL);
      }
    });
  }

  /**
   * @methodName checkDeviceRegistaration
   * @parameter none
   * @description used to get access token using credentials from server
   * @return none
   */
  checkDeviceRegistaration(): void {
    const CIAM_SESSION_URL = `${environment.API_CONNECT_URL}${environment.ADIB}${environment.CIAM.ENDPOINTS.DEVICE_SESSION_REG}`;
    this.httpHeadersService.customHeaderFunction = this.httpHeadersService.generateDeviceSessionRegHeaders;
    this.authService.getDeviceRegistrationSession(CIAM_SESSION_URL, this.generateBrowserDetailsPayLoad()).subscribe(response => {
      if (response && response.body) {
        document.cookie = `ac.uuid=${response.body};domain=${environment.APPLICATION_SUB_DOMAIN}`;
        this.registerDevice();
      }
    });
  }

  /**
   * @methodName registerDevice
   * @parameter none
   * @description used to get access token using credentials from server
   * @return none
   */
  registerDevice(): void {
    const DEVICE_REG_URL = `${this.sharedService.generateApiUrl(DOMAINS.API_SIT_CONNECT, true, true)}${DEVICE_REGISTRATION}`;
    this.httpHeadersService.customHeaderFunction = this.httpHeadersService.generateDeviceRegHeaders;
    const requestPayLoad = this.generateBrowserDetailsPayLoad();
    requestPayLoad.timestamp = this.sharedService.getTimeStamp().toString();
    this.authService.registerDeviceInfo(DEVICE_REG_URL, requestPayLoad).subscribe(response => {
      if (response && response.body && typeof response.body === 'string') {
        response.body = JSON.parse(response.body);
      }
      if (response && response.headers && response.headers.get(IS_REGISTERED_TEXT)) {
        document.cookie = `${IS_REGISTERED_TEXT}=${response.headers.get(IS_REGISTERED_TEXT)}`;
        this.getUserAgreementData();
      } else if (response && response.body && response.body['location']) {
        this.loginFromNewDevice = true;
        this.location = response.body['location'];
      } else {
        // if any of the above condition fails allow the user to continue with the flow
        this.getUserAgreementData();
      }
    }, error => {
      // if API fails instoring browser data allow the user to continue with the flow
      this.getUserAgreementData();
    });
  }

  /**
   * @methodName generateLoginPayLoad
   * @parameter none
   * @description used to genreate the login request payload
   * @return none
   */
  generateLoginPayLoad(): HttpParams {
    this.httpHeadersService.customHeaderFunction = this.httpHeadersService.generateLoginHeaders;
    let params: HttpParams = new HttpParams();
    params = params.append('grant_type', environment.CIAM.GRANT_TYPE);
    params = params.append('client_id', environment.CIAM.CLIENT_ID);
    params = params.append('username', this.loginFormGroup.get('userName').value);
    params = params.append('password', this.loginFormGroup.get('password').value);
    params = params.append('scope', environment.CIAM.SCOPE);
    params = params.append('mode', environment.CIAM.LOGIN.MODE);
    if (this.httpHeadersService.reCaptchaValue) {
      params = params.append(CAPTCHA_TEXT, this.httpHeadersService.reCaptchaValue);
    }
    return params;
  }

  /**
   * @methodName generateBrowserDetailsPayLoad
   * @parameter none
   * @description used to genreate browser details payload
   * @return BrowserRegistrationDetails
   */
  generateBrowserDetailsPayLoad(): BrowserRegistrationDetails {
    const reqPayLaod = {} as BrowserRegistrationDetails;
    reqPayLaod.browserPlugins = this.authService.getBrowserPlugins();
    // @ts-ignore
    const client = new ClientJS();
    reqPayLaod.deviceFonts = client.getFonts() ? client.getFonts() : NONE_TEXT;
    reqPayLaod.deviceNickname = this.authService.getDeviceName();
    return reqPayLaod;
  }

  /**
   * @methodName getOTPResponse
   * @param <OTPResponse>
   * @description Used to fetch or post the OTP info to CIAM
   * @return none
   */
  getOTPResponse(otpResponseObj: OTPResponse): void {
    if (otpResponseObj && otpResponseObj.success) {
      this.registerDevice();
    }
  }


  /**
   * @methodName resendOTPRequired
   * @param <boolean>
   * @description Used to fetch the OTP Location details
   * @return none
   */
  resendOTPRequired(resendOTP: boolean): void {
    if (resendOTP) {
      this.registerDevice();
    }
  }

  /**
   * @methodName handleOtpCancelButtonClick
   * @description used to update handle cancel event from otp component
   * @parameters status<boolean>
   * @return none
   */
  handleOtpCancelButtonClick(status: boolean): void {
    if (status) {
      this.loginFormGroup.reset();
      this.loginFromNewDevice = false;
      this.logoutService.logoutUser(true);
      if (!this.sharedService.getCookie(IS_REGISTRED_COOKIE_TEXT)) {
        this.authService.openRegistraionConfirmModal();
      }
    }
  }

  /**
   * @methodName handleRecaptchaResponse
   * @description used to handle recaptcha response
   * @parameters response<string>
   * @return none
   */
  handleRecaptchaResponse(response: string): void {
    if (response) {
      // recatcha success response
      this.loginFormGroup.get(CAPTCHA_TEXT).setValue(response);
      this.httpHeadersService.reCaptchaValue = response;
    } else {
      // recatcha time out response
      this.resetCaptcha();
    }
  }

  /**
   * @methodName resetCaptcha
   * @description used to reset captcha
   * @parameters none
   * @return none
   */
  resetCaptcha(): void {
    this.httpHeadersService.reCaptchaValue = undefined;
    if (this.loginFormGroup && this.loginFormGroup.get(CAPTCHA_TEXT)) {
      this.loginFormGroup.get(CAPTCHA_TEXT).reset();
      this.loginFormGroup.get(CAPTCHA_TEXT).setValidators(null);
    }
  }

  /**
   * @methodName getSelectedLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getSelectedLanguage(): void {
    this.subscription$.add(this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLanguage = selectedLanguage;
    }));
  }

  /**
   * @methodName handleUserSessionManagment
   * @parameter none
   * @description used to handle user session managment
   * @return none
   */
  handleUserSessionManagment(): void {
    this.subscription$.add(this.dialogService.handleMultipleUserSessionManagment().subscribe(
      response => {
        if (response === true) {
          this.loginUser(true);
        } else if (response === false) {
          this.authService.showComponent$.next(COMPONENT_LIST.LOGIN);
        }
      }
    ));
  }

  ngOnDestroy() {
    this.resetCaptcha();
    if (this.loginFormGroup && this.loginFormGroup.get(CAPTCHA_TEXT)) { this.loginFormGroup.reset(); }
  }
}
