import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatStepper } from '@angular/material';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { SharedService } from 'src/app/common/services/shared.service';

import {
  ADIB_WEBSITE_URL_TEXT, EMAIL_REGEX, CIAM_MECHANISMS,
  MECHANISM_TEXT, MESSAGE_TEXT, REMOVE_ARRAY_STRING, ARABIC_LANG_TEXT
} from 'src/app/common/global-constants';
import {
  STEPPER_TEXT, REGISTRATION_COMP, STEPPER_CONST, PATTERN_NO_SPECIAL_CHAR
} from 'src/app/modules/registration/registration-module.constants';
import { AUTH_TEXT, COMPONENT_LIST, FORGET_PASSWORD_TEXT, ERROR_DESCRIPTION_TEXT } from '../../auth-module.constants';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PasswordModel } from 'src/app/common/models/registration.model';
import { CIAM_ERROR_MAPPING, ERROR_LIST } from 'src/app/common/ciam-error-mapping';
import { DialogService } from 'src/app/common/services/dialog.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  @ViewChild('stepperPassword', { static: false }) stepperPassword: MatStepper;
  subscription$ = new Subscription();
  stepperText = STEPPER_TEXT;
  showSuccessComponent = false;
  ADIB_WEBSITE_URL_TEXT = ADIB_WEBSITE_URL_TEXT;
  showComponent: string = REGISTRATION_COMP;
  width: number;
  height: number;
  authConst = AUTH_TEXT;
  alertMessage: string;
  title: string;
  subTitle: string;
  componentList = COMPONENT_LIST;
  resetInputValue = false;
  forgetPasswordText = FORGET_PASSWORD_TEXT;
  userNameFormGroup: FormGroup;
  userNameControl: AbstractControl;
  pattern: RegExp | string;
  errorMessage: string;
  passwordErros: string;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.handleSecurityTipsClick();
    this.initializeComponent();
  }

  /**
   * @methodName initializeComponent
   * @params none
   * @description Used to fetch the initial component logic
   * @return none
   */
  initializeComponent() {
    this.authService.showComponent$.subscribe(response => {
      if (response && this.authService.forgetComponentName === this.componentList.FORGET_PASSWORD) {
        // logic for forgot password
        this.title = AUTH_TEXT.forgotHeading;
        this.setUserNameForm();
      } else if (response && this.authService.forgetComponentName === this.componentList.UNLOCK_USERNAME) {
        // logic when account has been locked, as a user entered wrong credentials for 5 times
        this.title = AUTH_TEXT.unlockUsernameTitle;
        // reset subject for next call
        this.authService.showComponent$.next(undefined);
      }
    });
  }
  /**
   * @methodName stepIndexChanged
   * @param stepper, event
   * @description Used to fetch the current step and set other steps interacted accordingly
   * @return none
   */
  stepIndexChanged(event: StepperSelectionEvent): void {
    const currentStep = event.selectedIndex;
    this.stepperPassword.steps.toArray().forEach((step, index) => {
      step.interacted = index < currentStep ? true : false;
    });
  }

  /**
   * @methodName handleSecurityTipsClick
   * @params none
   * @description Used to handle security tips screen
   * @return none
   */
  handleSecurityTipsClick(): void {
    this.authService.updateSecurityTipsClick(true);
  }

  /**
   * @methodName handlePasswordStepResponse
   * @params status<boolean>
   * @description to show handle password step response
   * @return none
   */
  handlePasswordStepResponse(passwordObj: PasswordModel): void {
    if (passwordObj) {
      this.authService.password = passwordObj.password;
      this.authService.confirmPassword = passwordObj.confirmPassword;
      this.handleResetPassword();
    }
  }

  /**
   * @methodName handleResetPassword
   * @description used to verify and create new username for new user registration
   * @parameters none
   * @return none
   */
  handleResetPassword(): void {
    this.errorMessage = undefined;
    this.subscription$.add(this.authService.setPassword().subscribe(response => {
      if (response && response[MECHANISM_TEXT] === CIAM_MECHANISMS.forget_password_success) {
        this.authService.showComponent$.next(COMPONENT_LIST.SUCCESS_SCREEN);
      } else if (response && response[MECHANISM_TEXT] === CIAM_MECHANISMS.forget_password_username_success) {
        if (response.message) {
          this.userNameControl.setErrors({ userNameExist: { message: response[MESSAGE_TEXT] } });
          const errorCode = response.message.replace(REMOVE_ARRAY_STRING, '');
          this.errorMessage = CIAM_ERROR_MAPPING[errorCode];
        }
        this.authService.usernameApiResponse$.next(response);
      } else if (response && response[MECHANISM_TEXT] === CIAM_MECHANISMS.unlock_username_otp_success) {
        this.authService.otpResponse$.next(response);
        if (response.message) {
          this.errorMessage = response.message;
        }
      } else if (response && response[MECHANISM_TEXT] === CIAM_MECHANISMS.unlock_username_password_success) {
        this.authService.showComponent$.next(COMPONENT_LIST.SUCCESS_SCREEN);
      }
    }, errors => {
      if (errors.error && errors.error.details) { this.alertMessage = errors.error.details.description; }
    }));
  }

  /**
   * @methodName handleCardNumberStepResponse
   * @params cardData<any>
   * @description to show handle card-number, pin step response
   * @return none
   */
  handleCardNumberStepResponse(cardData: any) {
    this.alertMessage = undefined;
    this.authService.cardNumber = cardData.cardNumber;
    this.authService.pinNumber = cardData.pinNumber;
    if (this.authService.cardNumber && this.authService.pinNumber) {
      this.subscription$.add(this.authService.checkValidCardDetails().subscribe(res => {
        if (res.body.access_token) {
          this.sharedService.accessToken = res.body.access_token;
          this.handleNewCiamRequest();
        }
      }, errors => {
        if (errors.error && errors.error.details) { this.alertMessage = errors.error.details.description; }
      }));
    }
  }

  /**
   * @methodName checkValidCardDetails
   * @params displaceSession<boolean>
   * @description Used to handle security tips screen
   * @return none
   */
  checkValidCardDetails(displaceSession = false): void {
    if (this.authService.cardNumber && this.authService.pinNumber) {
      this.subscription$.add(this.authService.checkValidCardDetails(displaceSession).subscribe(res => {
        if (res.body.access_token) {
          this.sharedService.accessToken = res.body.access_token;
          this.handleNewCiamRequest();
        }
      }, errors => {
        if (errors && errors.error && errors.error.details &&
          (errors.error.details[ERROR_DESCRIPTION_TEXT] === ERROR_LIST.R115)) {
            this.handleUserSessionManagment();
        } else if (errors.error && errors.error.details) { this.alertMessage = errors.error.details.description; }
      }));
    }
  }

  /**
   * @methodName handleNewCiamRequest
   * @description used to verify accessToken and new user registration step before OTP
   * @parameters none
   * @return none
   */
  handleNewCiamRequest(): void {
    if (this.sharedService.accessToken) {
      this.subscription$.add(this.authService.forgotPasswordOtpCall().subscribe(res => {
        if (res) {
          this.authService.forgotPassword$.next(res);
          this.stepperPassword.next();
        }
      },
        errors => {
          if (errors.error && errors.error.details) { this.alertMessage = errors.error.details.description; }
        }));
    }
  }

  /**
   * @methodName handleCancelButtonClick
   * @description used to handle cancel button click
   * @parameters none
   * @return none
   */
  handleCancelButtonClick(): void {
    this.resetInputValue = true;
    this.alertMessage = undefined;
    this.authService.isUserBlockedStatus = false;
    this.authService.clearInputFieldValues$.next(true);
    if (this.userNameFormGroup) { this.userNameFormGroup.reset(); }
    if (this.stepperPassword) { this.stepperPassword.reset(); }
    this.authService.showComponent$.next(COMPONENT_LIST.LOGIN);
  }


  /**
   * @methodName setUserNameForm
   * @parameter none
   * @description used to set the form for userName
   * @return none
   */
  setUserNameForm(): void {
    this.userNameFormGroup = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(STEPPER_CONST.minLength), Validators.maxLength(STEPPER_CONST.maxLength)]],
    });
    this.userNameControl = this.userNameFormGroup.get('userName');
  }

  /**
   * @methodName validateUserName
   * @parameter none
   * @description used to validate the username
   * @return none
   */
  validateUserName(): void {
    if (this.userNameControl.value) {
      if (this.userNameControl.value.search('@') !== -1) {
        this.pattern = new RegExp(EMAIL_REGEX);
        this.errorMessage = STEPPER_TEXT.emailError;
      } else {
        this.pattern = new RegExp(PATTERN_NO_SPECIAL_CHAR);
        this.errorMessage = STEPPER_TEXT.userNameError;
      }
      if (!this.pattern.test(this.userNameControl.value)) {
        this.userNameControl.setErrors({ userNameVarCharError: { message: this.errorMessage } });
      }
    }
  }

  /**
   * @methodName handleVerifyUsername
   * @description used to verify and new username for forgot password flow
   * @parameters none
   * @return none
   */
  handleVerifyUsername(): void {
    if (this.userNameControl.valid) {
      this.subscription$.add(this.authService.verifyUsername(this.userNameControl.value).subscribe(response => {
        if (response && response[MECHANISM_TEXT] === CIAM_MECHANISMS.forget_password_username_success) {
          this.authService.usernameApiResponse$.next(response);
          this.stepperPassword.next();
        } else if (response && response[MECHANISM_TEXT] === CIAM_MECHANISMS.forget_password_otp_success) {
          if (response.message) {
            const errorCode = response.message.replace(REMOVE_ARRAY_STRING, '');
            this.userNameControl.setErrors({ userNameExist: { message: CIAM_ERROR_MAPPING[errorCode] } });
          }
          this.authService.otpResponse$.next(response);
        }
      }, errors => {
        if (errors && errors.message) { this.userNameControl.setErrors({ userNameExist: { message: errors[MESSAGE_TEXT] } }); }
      }));
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
          this.checkValidCardDetails(true);
        } else if (response === false) {
          this.authService.showComponent$.next(COMPONENT_LIST.LOGIN);
        }
      }
    ));
  }

  ngOnDestroy() {
    this.authService.isUserBlockedStatus = false;
    this.alertMessage = undefined;
    if (this.userNameFormGroup) { this.userNameFormGroup.reset(); }
    this.subscription$.unsubscribe();
  }
}
