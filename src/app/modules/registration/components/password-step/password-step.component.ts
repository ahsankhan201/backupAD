import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { RegistrationService } from '../../services/registration.service';
import { DialogService } from 'src/app/common/services/dialog.service';
import {
  STEPPER_CONST, PATTERN_DIGIT, PATTERN_UPPERCASE, PATTERN_SPECIAL_CHAR,
  PATTERN_PASSWORD, STEPPER_TEXT
} from '../../registration-module.constants';
import {
  ICON, DIALOG_OPTION_TERMS_CONDITIONS_REGISTRATION, CIAM_MECHANISMS,
  REMOVE_ARRAY_STRING, ARABIC_LANG_TEXT
} from 'src/app/common/global-constants';
import { Dialog } from 'src/app/common/models/dialog.model';
import { CIAM_ERROR_MAPPING } from 'src/app/common/ciam-error-mapping';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-password-step',
  templateUrl: './password-step.component.html',
  styleUrls: ['./password-step.component.scss']
})
export class PasswordStepComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  @Output() response = new EventEmitter<boolean>(false);
  enableNextBtn: boolean;
  passwordFormGroup: FormGroup;
  digit: boolean;
  length: boolean;
  upper: boolean;
  special: boolean;
  passwordControl: AbstractControl;
  confirmPasswordControl: AbstractControl;
  hide = true;
  pattern: RegExp;
  visibilityIcon = STEPPER_CONST.invisible;
  securityIcon = ICON.securityIcon;
  enableComponent = false;
  alertMessage: string;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private dialogService: DialogService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.initializeComponent();
    this.setPasswordForm();
  }

  /**
   * @methodName initializeComponent
   * @parameter none
   * @description used to set component and initialise data if required
   * @return none
   */
  initializeComponent(): void {
    this.subscription$.add(this.registrationService.usernameApiResponse.subscribe(response => {
      if (response) { this.enableComponent = response ? true : false; }
    }));
  }

  /**
   * @methodName setPasswordForm
   * @parameter none
   * @description used to set form elements
   * @return none
   */
  setPasswordForm(): void {
    this.enableNextBtn = false;
    this.passwordFormGroup = this.formBuilder.group({
      password: ['', [Validators.required,
      Validators.minLength(STEPPER_CONST.minLength),
      Validators.maxLength(STEPPER_CONST.maxLength)
      ]],
      confirmPassword: ['', [Validators.required, Validators.minLength(STEPPER_CONST.minLength),
      Validators.maxLength(STEPPER_CONST.maxLength)]],
    });
    this.passwordControl = this.passwordFormGroup.get('password');
    this.confirmPasswordControl = this.passwordFormGroup.get('confirmPassword');
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
        this.registrationService.password = this.passwordControl.value;
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
   * @methodName setPassword
   * @parameter none
   * @description used to set pwd in registeration service
   * @return none
   */
  setPassword(): void {
    this.registrationService.password = this.passwordControl.value;
    this.handleTermsAndCondition();
  }

  /**
   * @methodName handleTermsAndCondition
   * @parameter none
   * @description used to handle terms and condition for registration
   * @return none
   */
  handleTermsAndCondition(): void {
    const OPTIONS: Dialog = DIALOG_OPTION_TERMS_CONDITIONS_REGISTRATION;
    this.dialogService.open(OPTIONS);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed === true) {
        this.submitPasswordRequest();
      } else if (confirmed === false) {
        // functionality will implement later for  cancel registation
        this.handleCancelButtonClick();
      }
    });
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
   * @methodName handleCancelButtonClick
   * @description used to handle cancel button click
   * @parameters none
   * @return none
   */
  handleCancelButtonClick(): void {
    this.passwordFormGroup.reset();
    this.registrationService.deRegister$.next(true);
  }

  /**
   * @methodName submitPasswordRequest
   * @description used to handle forget password
   * @parameters none
   * @return none
   */
  submitPasswordRequest(): void {
    this.subscription$.add(this.registrationService.passwordRegistration().subscribe(
      response => {
        if (response && response['mechanism'] === CIAM_MECHANISMS.password_success) {
          this.response.emit(true);
        } else if (response && response['mechanism'] === CIAM_MECHANISMS.username_success) {
          this.registrationService.usernameApiResponse$.next(response);
          if (response.message) {
            const errorCode = response.message.replace(REMOVE_ARRAY_STRING, '');
            this.passwordControl.setErrors({ inValidPassword: { message: CIAM_ERROR_MAPPING[errorCode] } });
          }
        }
      },
      errors => {
        if (errors.error && errors.error.details) {
          this.alertMessage = errors.error.details.description;
          this.passwordControl.setErrors({ inValidPassword: { message: this.alertMessage } });
        }
      }
    ));
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

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
