import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';

import { OTPResponse } from 'src/app/common/models/otp.model';
import { SharedService } from 'src/app/common/services/shared.service';
import { SNACKBAR_MESSAGETYPE, ICON, REGISTRATION_CONFIG, CIAM_MECHANISMS, OTP_DATA } from 'src/app/common/global-constants';
import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'app-otp-step',
  templateUrl: './otp-step.component.html',
  styleUrls: ['./otp-step.component.scss']
})
export class OtpStepComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  location: string;
  enableNextBtn = false;
  securityIcon = ICON.securityIcon;
  otpResponse;
  constructor(
    private sharedService: SharedService,
    private registrationService: RegistrationService,
    private stepper: MatStepper,
    private router: Router) { }

  ngOnInit() {
    this.getOTPLocationData();
  }

  /**
   * @methodName getOTPLocationData
   * @params none
   * @description Used for get the otp locationfrom registration step
   * @return none
   */
  getOTPLocationData(): void {
    this.subscription$.add(this.registrationService.newUserRegistrationObservable.subscribe( res => {
      if (res) { this.location = res.location; }
    }));
  }

  /**
   * @methodName getOTPLocationDetails
   * @param isItPostCall<boolean>
   * @description Used for adding the payee in server
   * @return none
   */
  getOTPLocationDetails(isItPostCall?: boolean): void {
    // Functionality will implemement later
    if (isItPostCall) {
      this.stepper.next();
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
      this.subscription$.add(this.registrationService.newUserRegistration().subscribe(res => {
        if (res) {
          // Used to udpate the location value
          this.registrationService.newUserRegistrationSubject$.next(res);
          // reset location value for next instance
          this.registrationService.newUserRegistrationSubject$.next(undefined);
        }
      }));
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
      && otpResponseObj.message['mechanism'] === CIAM_MECHANISMS.otp_success ) {
      // Success OTP response
      this.otpResponse = otpResponseObj.message;
      this.registrationService.otpResponse$.next(otpResponseObj.message);
      this.getOTPLocationDetails(true);
    } else if (otpResponseObj && Object.keys(otpResponseObj).length
    && otpResponseObj.message['mechanism'] === CIAM_MECHANISMS.otp_failure) {
      // Invalid OTP response
      this.registrationService.newUserRegistrationSubject$.next(otpResponseObj.message);
      const SNACKBAR_MESSAGE = new OTPResponse();
      SNACKBAR_MESSAGE.success = otpResponseObj.success;
      SNACKBAR_MESSAGE.message = OTP_DATA.INVALID_OTP_TEXT;
      this.sharedService.setSnackBarMessage(SNACKBAR_MESSAGE, SNACKBAR_MESSAGETYPE.ERROR);
      this.getOTPLocationDetails(false);
    }
  }

  /**
   * @methodName handleSecurityTipClick
   * @description used to update BehaviorSubject on security tips click
   * @parameters none
   * @return none
   */
  handleSecurityTipClick(): void {
    this.registrationService.updateSecurityTipsClick(true);
  }

  /**
   * @methodName handleOtpCancelButtonClick
   * @description used to update handle cancel event from otp component
   * @parameters status<boolean>
   * @return none
   */
  handleOtpCancelButtonClick(status: boolean): void {
    // Method to call de-register API
    if (status) { this.registrationService.deRegister$.next(true); }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
