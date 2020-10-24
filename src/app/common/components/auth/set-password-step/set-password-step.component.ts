import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {
  STEPPER_CONST, PATTERN_DIGIT, PATTERN_UPPERCASE, PATTERN_SPECIAL_CHAR,
  PATTERN_PASSWORD, STEPPER_TEXT
} from 'src/app/modules/registration/registration-module.constants';
import { ICON } from 'src/app/common/global-constants';
import { RegistrationService } from 'src/app/modules/registration/services/registration.service';

@Component({
  selector: 'app-set-password-step',
  templateUrl: './set-password-step.component.html',
  styleUrls: ['./set-password-step.component.scss']
})
export class SetPasswordStepComponent implements OnInit, OnChanges {
  @Output() response = new EventEmitter<boolean>(false);
  @Input() errorMessage: string;
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

  @Output() nextData = new EventEmitter(undefined);
  @Output() cancelData = new EventEmitter(undefined);
  @Output() securityTipsData = new EventEmitter(undefined);

  constructor(
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private changeDetectRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.setPasswordForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.errorMessage.currentValue) {
      this.passwordControl.setErrors( { inValidPassword: { message: this.errorMessage } });
    }
    this.changeDetectRef.detectChanges();
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
    const response = { password: this.passwordControl.value, confirmPassword: this.confirmPasswordControl.value };
    this.nextData.emit(response);
  }

  /**
   * @methodName handleCancelButtonClick
   * @description used to handle cancel button click
   * @parameters none
   * @return none
   */
  handleCancelButtonClick(): void {
    this.passwordFormGroup.reset();
    this.cancelData.emit();
  }
}
