import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';

import { OTPResponse } from 'src/app/common/models/otp.model';
import { ICON, SNACKBAR_MESSAGETYPE, CIAM_MECHANISMS, OTP_DATA } from 'src/app/common/global-constants';
import { SharedService } from 'src/app/common/services/shared.service';
import { COMPONENT_LIST } from '../../auth-module.constants';
import { RegistrationService } from 'src/app/modules/registration/services/registration.service';

@Component({
  selector: 'app-forgot-otp-step',
  templateUrl: './forgot-otp-step.component.html',
  styleUrls: ['./forgot-otp-step.component.scss']
})
export class ForgotOtpStepComponent implements OnInit , OnDestroy {
  subscription$ = new Subscription();
  @Output() usernameResponse = new EventEmitter(undefined);
  location: string;
  enableNextBtn = false;
  securityIcon = ICON.securityIcon;
  otpResponse;
  constructor(
    private authService: AuthService,
    private stepper: MatStepper,
    private sharedService: SharedService,
    private registrationService: RegistrationService) { }

  ngOnInit() {
    this.getOTPLocationData();
  }

  /**
   * @methodName getOTPLocationData
   * @params none
   * @description Used for get the otp locationfrom registration step
   * @return none
   */
  getOTPLocationData() {
    if (this.authService.forgetComponentName === COMPONENT_LIST.FORGET_USERNAME) {
      // forgot username otp location logic
      this.subscription$.add(this.authService.forgotUsername.subscribe(res => {
        if (res) {
          this.location = res.location;
          this.authService.forgotUsername$.next(undefined);
        }
      }));
    } else if (this.authService.forgetComponentName === COMPONENT_LIST.FORGET_PASSWORD
      || this.authService.forgetComponentName === COMPONENT_LIST.UNLOCK_USERNAME) {
      // forgot password and unlock username otp location logic
      this.subscription$.add(this.authService.forgotPassword.subscribe(res => {
        if (res) { this.location = res.location; this.authService.forgotPassword$.next(undefined); }
      }));
    }
  }

  /**
   * @methodName getOTPLocationDetails
   * @param isItPostCall<boolean>
   * @description Used for adding the payee in server
   * @return none
   */
  getOTPLocationDetails(isItPostCall?: boolean): void {
    if (isItPostCall) {
      if (this.authService.forgetComponentName === COMPONENT_LIST.FORGET_USERNAME) {
        this.getUserEmailId();
      } else {
        this.stepper.next();
      }
    }

  }

  /**
   * @methodName getResponse
   * @param <OTPResponse>
   * @description Used to fetch or post the OTP info to CIAM
   * @return none
   */
  getOTPResponse(otpResponseObj: OTPResponse): void {
    if (otpResponseObj && !otpResponseObj.success) {
      // Failed/Expired/Error OTP response
      this.sharedService.setSnackBarMessage(otpResponseObj, SNACKBAR_MESSAGETYPE.ERROR);
      this.getOTPLocationDetails(false);
    } else if (otpResponseObj && otpResponseObj.success && otpResponseObj.message
      && (otpResponseObj.message['mechanism'] === CIAM_MECHANISMS.forget_password_otp_success ||
      otpResponseObj.message['mechanism'] === CIAM_MECHANISMS.unlock_username_otp_success ||
      otpResponseObj.message['mechanism'] === CIAM_MECHANISMS.forget_username_otp_success )) {
      // Success OTP response
      this.otpResponse = otpResponseObj.message;
      this.authService.otpResponse$.next(otpResponseObj.message);
      this.getOTPLocationDetails(true);
    } else if (otpResponseObj && Object.keys(otpResponseObj).length
    && otpResponseObj.message['mechanism'] === CIAM_MECHANISMS.otp_failure) {
      // Invalid OTP response
      this.udpateOtpLocation(otpResponseObj);
      const SNACKBAR_MESSAGE = new OTPResponse();
      SNACKBAR_MESSAGE.success = otpResponseObj.success;
      SNACKBAR_MESSAGE.message = OTP_DATA.INVALID_OTP_TEXT;
      this.sharedService.setSnackBarMessage(SNACKBAR_MESSAGE, SNACKBAR_MESSAGETYPE.ERROR);
      this.getOTPLocationDetails(false);
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
      if (this.stepper) { this.stepper.reset(); }
      this.authService.showComponent$.next(COMPONENT_LIST.LOGIN);
    }
  }

  /**
   * @methodName getUserEmailId
   * @description used to fetch user email
   * @parameters none
   * @return none
   */
  getUserEmailId(): void {
    this.subscription$.add(this.registrationService.getUserEmail().subscribe( response => {
      if ( response  && response.isRegisteredForEstatement && response.emailId) {
          this.sharedService.userEmailId = response.emailId;
          this.handleForgetUsernameFinalApi();
        } else {
          this.sharedService.userEmailId = undefined;
          this.stepper.next();
        }
      if ( response ) { this.usernameResponse.emit(response); }
    }));
  }

/**
 * @methodName handleForgetUsernameFinalApi
 * @description used to call last CIAM API for forget username
 * @parameters none
 * @return none
 */
handleForgetUsernameFinalApi(): void {
  this.subscription$.add(this.authService.setUsername().subscribe( response => {
    if ( response) {
        this.stepper.next();
      }
  }));
}

/**
 * @methodName udpateOtpLocation
 * @description used to update OTP location on invalid otp for forgetusername/unlockusername and forgetpassword
 * @parameters newOtpResponse<OTPResponse>
 * @return none
 */
udpateOtpLocation(newOtpResponse: OTPResponse): void {
  if (newOtpResponse) {
    if (this.authService.forgetComponentName === COMPONENT_LIST.FORGET_PASSWORD) {
      // update otp location for forget password or unlock username
    this.authService.forgotPassword$.next(newOtpResponse.message);
    } else if (this.authService.forgetComponentName === COMPONENT_LIST.FORGET_USERNAME) {
      // update otp location for forget username
    this.authService.forgotUsername$.next(newOtpResponse.message);
    }
  }
}

/**
 * @methodName resendOTPRequired
 * @param <boolean>
 * @description Used to call forget username and forget password/unlockusername API
 * @return none
 */
resendOTPRequired(resendOTP: boolean): void {
  if (resendOTP && this.authService.forgetComponentName === COMPONENT_LIST.FORGET_USERNAME) {
    // forgot username resent otp location logic
    this.subscription$.add(this.authService.forgotUsernameVerify().subscribe(res => {
      if (res) {
        this.authService.forgotUsername$.next(res); // Used to udpate the location value
        this.authService.forgotUsername$.next(undefined); // reset location value for next instance
      }
    }));

  } else if (resendOTP && this.authService.forgetComponentName === COMPONENT_LIST.FORGET_PASSWORD) {
    // forgot password resent otp location logic
    this.subscription$.add(this.authService.forgotPasswordOtpCall().subscribe(res => {
      if (res) {
        this.authService.forgotPassword$.next(res); // Used to udpate the location value
        this.authService.forgotPassword$.next(undefined); // reset location value for next instance
      }
    }));
  }
}
  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
