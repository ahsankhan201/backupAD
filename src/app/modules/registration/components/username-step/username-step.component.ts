import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { EMAIL_REGEX, ICON, CIAM_MECHANISMS, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { RegistrationService } from '../../services/registration.service';
import { STEPPER_TEXT, PATTERN_NO_SPECIAL_CHAR, STEPPER_CONST } from '../../registration-module.constants';
import { MatStepper } from '@angular/material/stepper';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-username-step',
  templateUrl: './username-step.component.html',
  styleUrls: ['./username-step.component.scss']
})
export class UsernameStepComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  userNameFormGroup: FormGroup;
  enableNextBtn: boolean;
  pattern: RegExp | string;
  errorMessage: string;
  securityIcon = ICON.securityIcon;
  userNameControl: AbstractControl;
  enableUsernameComponent = false;
  isValidUsername = false;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private stepper: MatStepper,
    private formBuilder: FormBuilder,
    private registrationService: RegistrationService,
    private router: Router,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.initializeComponent();
    this.setUserNameForm();
  }

  /**
   * @methodName initializeComponent
   * @parameter none
   * @description used to set component and initialise data if required
   * @return none
   */
  initializeComponent(): void {
    this.subscription$.add(this.registrationService.otpResponse.subscribe(response => {
      if (response) {
        this.getUserEmail(); // used to fetch email id of a user to auto populate username
        this.enableUsernameComponent = response ? true : false;
      }

    }));
  }

  /**
   * @methodName setUserNameForm
   * @parameter none
   * @description used to set the form for userName
   * @return none
   */
  setUserNameForm(): void {
    this.enableNextBtn = false;
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
    this.enableNextBtn = false;
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
    this.userNameFormGroup.reset();
    this.registrationService.deRegister$.next(true);
  }

  /**
   * @methodName handleUsernameRegistration
   * @description used to verify and create new username for new user registration
   * @parameters none
   * @return none
   */
  handleUsernameRegistration(): void {
    this.isValidUsername = false;
    this.enableNextBtn = false;
    this.registrationService.userName = this.userNameControl.value;
    this.subscription$.add(this.registrationService.usernameRegistration().subscribe(response => {
      if (response && response['mechanism'] === CIAM_MECHANISMS.username_success) {
        this.isValidUsername = true;
        this.registrationService.usernameApiResponse$.next(response);
        this.enableNextBtn = true;
        this.stepper.next();
      } else if (response && response['mechanism'] === CIAM_MECHANISMS.otp_success) {
        this.userNameControl.setErrors({ userNameExist: { message: response['message'] } });
        this.registrationService.otpResponse$.next(response);
        this.registrationService.usernameApiResponse$.next(undefined);
      }
    }, errors => {
      if (errors && errors.message) {
        this.userNameControl.setErrors({ userNameExist: { message: errors['message'] } });
      }
    }));
  }

  /**
   * @methodName handleNextButton
   * @description used to validate and enable next component
   * @parameters none
   * @return none
   */
  handleNextButton(): void {
    if (this.userNameControl.valid && this.isValidUsername) {
      this.stepper.next();
    } else if (this.userNameControl.valid && !this.isValidUsername) {
      this.handleUsernameRegistration();
    } else {
      this.enableNextBtn = false;
    }
  }

  /**
   * @methodName getUserEmail
   * @description used to fetch and Auto populate customer Email ID
   * @parameters none
   * @return none
   */
  getUserEmail(): void {
    this.subscription$.add(this.registrationService.getUserEmail().subscribe(res => {
      if (res && res.isRegisteredForEstatement && res.emailId) {
        this.userNameControl.setValue(res.emailId);
      }
    }));
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
