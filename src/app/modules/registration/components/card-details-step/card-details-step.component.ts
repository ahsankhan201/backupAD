import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material';
import { Subscription } from 'rxjs/internal/Subscription';

import { ICON, REGISTRATION_CONFIG } from 'src/app/common/global-constants';
import { RegistrationService } from '../../services/registration.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { ERROR_DESCRIPTION_TEXT, COMPONENT_LIST } from 'src/app/modules/auth/auth-module.constants';
import { ERROR_LIST } from 'src/app/common/ciam-error-mapping';
import { DialogService } from 'src/app/common/services/dialog.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-card-details-step',
  templateUrl: './card-details-step.component.html',
  styleUrls: ['./card-details-step.component.scss']
})
export class CardDetailsStepComponent implements OnInit, OnDestroy {
  securityIcon = ICON.securityIcon;
  alertMessage: string;
  subscription$ = new Subscription();
  resetInputValue = false;
  enableComponent = false;
  constructor(
    private registrationService: RegistrationService,
    private router: Router,
    private stepper: MatStepper,
    private authService: AuthService,
    private dialogService: DialogService,
    private sharedService: SharedService) {  }

  ngOnInit() {
  }

  /**
   * @methodName handleCardNumber
   * @param cardNumber<string>
   * @description Used to handle card number response from component
   * @return none
   */
  handleCardNumber(cardNumber: string): void {
    this.registrationService.cardNumber = undefined;
    if (cardNumber) { this.registrationService.cardNumber = cardNumber; }
  }

  /**
   * @methodName handleAtmPinNumber
   * @param pinNumber<string>
   * @description Used to handle pin number response from component
   * @return none
   */
  handleAtmPinNumber(pinNumber: string): void {
    this.registrationService.pinNumber = undefined;
    if (pinNumber) { this.registrationService.pinNumber = pinNumber; }
  }

  /**
   * @methodName isNextButtonEnabled
   * @params none
   * @description Used enable and disable next button
   * @return boolean
   */
  isNextButtonEnabled(): boolean {
    return (this.registrationService.cardNumber && this.registrationService.pinNumber) ? false : true;
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
    this.resetInputValue = true;
    this.router.navigateByUrl(REGISTRATION_CONFIG.loginRouterLink);
  }

/**
 * @methodName validateCardandPinDetails
 * @description used to handle valid card and pin details entered
 * @parameters none
 * @return none
 */
validateCardandPinDetails(event): void {
  this.alertMessage = undefined;
  // event.detail added to prevent multiple click on next button
  if (!event.detail || event.detail === 1) {
    if (this.registrationService.cardNumber && this.registrationService.pinNumber) {
      this.checkValidCardDetails();
    }
  }
}


  /**
   * @methodName checkValidCardDetails
   * @params displaceSession<boolean>
   * @description Used to handle security tips screen
   * @return none
   */
  checkValidCardDetails(displaceSession: boolean = false): void {
    if (this.registrationService.cardNumber && this.registrationService.pinNumber) {
      this.subscription$.add(this.registrationService.checkValidCardDetails(displaceSession).subscribe(res => {
        if (res.body.access_token) {
          this.sharedService.accessToken = res.body.access_token;
          this.handleNewUserRegistration();
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
 * @methodName handleNewUserRegistration
 * @description used to verify accessToken and new user registration step before OTP
 * @parameters none
 * @return none
 */
  handleNewUserRegistration(): void {
  if (this.sharedService.accessToken) {
    this.subscription$.add(this.registrationService.newUserRegistration().subscribe(res => {
      if (res) {
        // Used to udpate the location value for otp screen
        this.registrationService.newUserRegistrationSubject$.next(res);
        // reset location value for next instance
        this.registrationService.newUserRegistrationSubject$.next(undefined);
        this.stepper.next();
      }
    },
    errors => {
      if (errors.error && errors.error.details) { this.alertMessage = errors.error.details.description; }
    }));
  }
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
  this.resetInputValue = true;
  this.registrationService.cardNumber = undefined;
  this.registrationService.pinNumber = undefined;
  this.subscription$.unsubscribe();
}

}

