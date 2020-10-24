import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatStepper } from '@angular/material';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { ADIB_WEBSITE_URL_TEXT, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { STEPPER_TEXT, REGISTRATION_COMP } from 'src/app/modules/registration/registration-module.constants';
import { AUTH_TEXT, COMPONENT_LIST, ERROR_DESCRIPTION_TEXT } from '../../auth-module.constants';
import { SharedService } from 'src/app/common/services/shared.service';
import { EstatementSubscription } from 'src/app/common/models/registration.model';
import { ERROR_LIST } from 'src/app/common/ciam-error-mapping';
import { DialogService } from 'src/app/common/services/dialog.service';

@Component({
  selector: 'app-forgot-username',
  templateUrl: './forgot-username.component.html',
  styleUrls: ['./forgot-username.component.scss']
})
export class ForgotUsernameComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  @ViewChild('usernameStepper', { static: false }) usernameStepper: MatStepper;
  stepperText = STEPPER_TEXT;
  showSuccessComponent = false;
  ADIB_WEBSITE_URL_TEXT = ADIB_WEBSITE_URL_TEXT;
  showComponent: string = REGISTRATION_COMP;
  width: number;
  height: number;
  authConst = AUTH_TEXT;
  componentList = COMPONENT_LIST;
  alertMessage: string;
  title: string;
  subTitle: string;
  forgetComponentName: string;
  resetInputValue = false;
  enableSuccessComponent = false;
  userEmailId: string;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private authService: AuthService,
    private dialogService: DialogService,
    private sharedService: SharedService) { }

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
    this.subscription$.add(this.authService.showComponent$.subscribe(response => {
      if (response && this.authService.forgetComponentName === this.componentList.FORGET_USERNAME) {
        this.title = AUTH_TEXT.forgotUsernameTitle;
        this.subTitle = AUTH_TEXT.forgotUsernameText;
      }
    }));
  }

  /**
   * @methodName forgetUsernameResponse
   * @params response
   * @description Used to get response from forget-otp component
   * @return none
   */
  forgetUsernameResponse(response: EstatementSubscription): void {
    if (response) {
      this.userEmailId = this.sharedService.userEmailId;
      this.enableSuccessComponent = true;
    }
  }

  /**
   * @methodName stepIndexChanged
   * @param stepper, event
   * @description Used to fetch the current step and set other steps interacted accordingly
   * @return none
   */
  stepIndexChanged(event: StepperSelectionEvent): void {
    const currentStep = event.selectedIndex;
    this.usernameStepper.steps.toArray().forEach((step, index) => {
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
      this.checkValidCardDetails();
    }
  }


  /**
   * @methodName checkValidCardDetails
   * @params displaceSession<boolean>
   * @description Used to handle security tips screen
   * @return none
   */
  checkValidCardDetails(displaceSession: boolean = false): void {
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
   * @description used to verify accessToken and new forgetusername step before OTP
   * @parameters none
   * @return none
   */
  handleNewCiamRequest(): void {
    if (this.sharedService.accessToken) {
      this.subscription$.add(this.authService.forgotUsernameVerify().subscribe(res => {
        if (res) {
          this.authService.forgotUsername$.next(res);
          this.usernameStepper.next();
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
  handleCancelButtonClick(status: boolean): void {
    if (status) {
      this.resetInputValue = true;
      if (this.usernameStepper) { this.usernameStepper.reset(); }
      this.authService.showComponent$.next(COMPONENT_LIST.LOGIN);
    }
  }

  /**
   * @methodName handleLoginRedirect
   * @description used to handle login url redirection / show login component
   * @parameters none
   * @return none
   */
  handleLoginRedirect(): void {
    if (this.usernameStepper) { this.usernameStepper.reset(); }
    this.authService.showComponent$.next(COMPONENT_LIST.LOGIN);
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
    this.subscription$.unsubscribe();
  }
}
