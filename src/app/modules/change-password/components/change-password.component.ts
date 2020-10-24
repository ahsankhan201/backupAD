import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { ChangePasswordService } from '../services/change-password.service';
import { OTPResponse } from 'src/app/common/models/otp.model';
import { NAV_CONTROLS, SNACKBAR_MESSAGETYPE, CIAM_MECHANISMS, OTP_DATA, REMOVE_ARRAY_STRING } from 'src/app/common/global-constants';
import { CHANGE_PASSWORD_DATA } from '../change-password-module.constants';
import {
  PATTERN_DIGIT, STEPPER_CONST, PATTERN_UPPERCASE,
  PATTERN_SPECIAL_CHAR, PATTERN_PASSWORD, STEPPER_TEXT
} from '../../registration/registration-module.constants';
import { CIAM_ERROR_MAPPING } from 'src/app/common/ciam-error-mapping';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  readonly CHANGE_PASSWORD_DATA = CHANGE_PASSWORD_DATA;
  subscription$ = new Subscription();
  changePasswordFormGroup: FormGroup;
  passwordControl: AbstractControl;
  confirmPasswordControl: AbstractControl;
  currentPasswordControl: AbstractControl;
  digit: boolean;
  length: boolean;
  upper: boolean;
  special: boolean;
  pattern: RegExp;
  hide = true;
  visibilityIcon = STEPPER_CONST.invisible;
  enableNextBtn: boolean;
  showOTPScreen: boolean;
  location: string;
  showSuccessScreen: boolean;
  selectedDashboard: string;

  constructor(
    private snackBarService: SnackBarService,
    private sharedService: SharedService,
    private changePasswordService: ChangePasswordService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.sharedService.setHorizontalLineClass(NAV_CONTROLS.CHANGE_PASSWORD_DIVIDER_CLASS);
  }

  ngOnInit() {
    this.setChangePasswordForm();
    this.activateMenuTab();
    this.selectedDashboard = this.sharedService.selectedDashboardText;
  }

  /**
   * @methodName setChangePasswordForm
   * @parameter none
   * @description used to set form elements
   * @return none
   */
  setChangePasswordForm(): void {
    this.enableNextBtn = false;
    this.changePasswordFormGroup = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });
    this.passwordControl = this.changePasswordFormGroup.get('newPassword');
    this.confirmPasswordControl = this.changePasswordFormGroup.get('confirmNewPassword');
    this.currentPasswordControl = this.changePasswordFormGroup.get('currentPassword');
  }

  /**
   * @methodName validatePassword
   * @parameter none
   * @description used to validate password
   * @return none
   */
  validatePassword(): void {
    const password = this.passwordControl.value;
    this.digit = PATTERN_DIGIT.test(password) ? true : false;
    this.length = password.length >= STEPPER_CONST.minLength ? true : false;
    this.upper = PATTERN_UPPERCASE.test(password) ? true : false;
    this.special = PATTERN_SPECIAL_CHAR.test(password) ? true : false;
    this.pattern = new RegExp(PATTERN_PASSWORD);
    if (!this.pattern.test(password) || !PATTERN_SPECIAL_CHAR.test(password)) {
      this.passwordControl.setErrors(
        {
          inValidPassword: { message: STEPPER_TEXT.inValidPasswordError }
        });
    }
    this.matchPassword();
  }

  /**
   * @methodName matchPassword
   * @parameter none
   * @description used to match password and confirm password
   * @return none
   */
  matchPassword(): void {
    if (!this.passwordControl.pristine && !this.confirmPasswordControl.pristine) {
      const password = this.passwordControl.value;
      const confirmPassword = this.confirmPasswordControl.value;
      if (password !== confirmPassword) {
        this.confirmPasswordControl.setErrors(
          {
            confirmValidatorError: { message: STEPPER_TEXT.confirmPasswordError }
          });
      } else {
        this.enableNextBtn = true;
      }
    }
  }

  /**
   * @methodName setVisibility
   * @parameter none
   * @description used to set visibility icon
   * @return none
   */
  setVisibility(): void {
    this.hide = !this.hide;
    this.visibilityIcon = this.hide ? STEPPER_CONST.invisible : STEPPER_CONST.visible;
  }

  /**
   * @methodName showOTPComponent
   * @parameter none
   * @description used to show OTP component
   * @return none
   */
  showOTPComponent(): void {
    this.showOTPScreen = true;
    this.changePasswordService.currentPassword = this.currentPasswordControl.value;
    this.changePasswordService.newPassword = this.passwordControl.value;
    this.changePasswordService.confirmNewPassword = this.confirmPasswordControl.value;
    this.getOTPLocationData();
  }

  /**
   * @methodName getResponse
   * @param <OTPResponse>
   * @description Used to fetch or post the OTP info to CIAM
   * @return none
   */
  getOTPResponse(otpResponseObj: OTPResponse): void {
    if (otpResponseObj && !otpResponseObj.success) {
      this.sharedService.setSnackBarMessage(otpResponseObj, SNACKBAR_MESSAGETYPE.ERROR);
    } else if (otpResponseObj && otpResponseObj.success && otpResponseObj.message
      && otpResponseObj.message['mechanism'] === CIAM_MECHANISMS.otp_success_change_password) {
      // Success OTP response
      this.changePasswordService.otpResponse$.next(otpResponseObj.message);
      this.handleChangePassword();
    } else if (otpResponseObj && Object.keys(otpResponseObj).length
      && otpResponseObj.message['mechanism'] === CIAM_MECHANISMS.otp_failure) {
      // Invalid OTP response
      this.location = otpResponseObj.message['location'];
      const SNACKBAR_MESSAGE = new OTPResponse();
      SNACKBAR_MESSAGE.success = otpResponseObj.success;
      SNACKBAR_MESSAGE.message = OTP_DATA.INVALID_OTP_TEXT;
      this.sharedService.setSnackBarMessage(SNACKBAR_MESSAGE, SNACKBAR_MESSAGETYPE.ERROR);
    }
  }

  /**
   * @methodName resendOTPRequired
   * @param <boolean>
   * @description Used to fetch the OTP location details
   * @return none
   */
  resendOTPRequired(resendOTP: boolean): void {
    if (resendOTP) {
      this.getOTPLocationData();
    }
  }

  /**
   * @methodName getOTPLocationData
   * @params none
   * @description Used for get the otp locationfrom registration step
   * @return none
   */
  getOTPLocationData(): void {
    this.subscription$.add(this.changePasswordService.changePasswordOTP().subscribe(res => {
      if (res) {
        this.location = res.location;
      }
    }));
  }

  /**
   * @methodName handleResetPassword
   * @description used to verify and create new username for new user registration
   * @parameters none
   * @return none
   */
  handleChangePassword(): void {
    this.subscription$.add(this.changePasswordService.changePassword().subscribe(response => {
      if (response && response.message !== '') {
        const errorCode = response.message.replace(REMOVE_ARRAY_STRING, '');
        this.snackBarService.showSnackBar({
          showSnackBar: true, message: {
            msgType: 'error',
            msgText: CIAM_ERROR_MAPPING[errorCode]
          }
        });
        this.showOTPScreen = false;
      } else if (response && response.message === '') {
        this.showOTPScreen = false;
        this.showSuccessScreen = true;
      }
    }));
  }

  /**
   * @methodName handleCancelButtonClick
   * @description used to update handle cancel event
   * @parameters status<boolean>
   * @return none
   */
  handleCancelButtonClick(status: boolean): void {
    if (status) { this.router.navigateByUrl(this.sharedService.getPreviousRoute()); }
  }

  /**
   * @methodName activateMenuTab
   * @params none
   * @description activating the menu tab in side nav
   * @return none
   */
  activateMenuTab(): void {
    const routerLinkClass = this.sharedService.getPreviousRoute() ?
      document.querySelector('[ng-reflect-router-link=' + this.sharedService.getPreviousRoute() + ']') : '';
    if (routerLinkClass) {
      document.querySelector('[ng-reflect-router-link=' + this.sharedService.getPreviousRoute() + ']').classList.add('active');
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
    this.sharedService.setHorizontalLineClass(undefined);
    if (document.querySelector('[ng-reflect-router-link=' + this.sharedService.getPreviousRoute() + ']') &&
      this.sharedService.getPreviousRoute()) {
      document.querySelector('[ng-reflect-router-link=' + this.sharedService.getPreviousRoute() + ']').classList.remove('active');
    }
  }
}
