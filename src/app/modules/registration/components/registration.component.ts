import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatStepper } from '@angular/material';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Router } from '@angular/router';

import { RegistrationService } from '../services/registration.service';
import { ADIB_WEBSITE_URL_TEXT, CIAM_ERROR_CODE, REGISTRATION_CONFIG, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { STEPPER_TEXT, SECURITY_TIPS_COMP, REGISTRATION_COMP, LARGE_DEVICE_BREAKPOINT } from '../registration-module.constants';
import { ResizedEvent } from 'angular-resize-event';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: false }) stepperRegistration: MatStepper;
  subscription$ = new Subscription();
  stepperText = STEPPER_TEXT;
  showSuccessComponent = false;
  ADIB_WEBSITE_URL_TEXT = ADIB_WEBSITE_URL_TEXT;
  showComponent: string = REGISTRATION_COMP;
  width: number;
  height: number;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(
    private registrationService: RegistrationService,
    private router: Router,
    private sharedService: SharedService) { }
  ngOnInit() {
    this.getSelectedLanguage();
    this.handleSecurityTipsClick();
    this.handleCancelButtonClick();
  }

  /**
   * @methodName stepIndexChanged
   * @param stepper, event
   * @description Used to fetch the current step and set other steps interacted accordingly
   * @return none
   */
  stepIndexChanged(stepper: MatStepper, event: StepperSelectionEvent): void {
    const currentStep = event.selectedIndex;
    stepper.steps.toArray().forEach((step, index) => {
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
    this.registrationService.securityTipClickStatus.subscribe(res => {
      if (res) {
        this.showSecurityTips();
        this.registrationService.updateSecurityTipsClick(undefined);
      }
    });
  }

  /* @methodName showSecurityTips
   * @params none
   * @description show security tips screen
   * @return none
   */
  showSecurityTips(): void {
    this.showComponent = SECURITY_TIPS_COMP;
  }

  /**
   * @methodName handlePasswordStepResponse
   * @params status<boolean>
   * @description to show handle password step response
   * @return none
   */
  handlePasswordStepResponse(status: boolean): void {
    if (status) { this.showSuccessComponent = status; }
  }

  /* @methodName handleCloseButtonClick
   * @params status<boolean>
   * @description used to handle close button click event emited
   * @return none
   */
  handleCloseButtonClick(status: boolean): void {
    this.showComponent = (status) ? REGISTRATION_COMP : SECURITY_TIPS_COMP;
  }

  /* @methodName onResized
   * @params event<ResizedEvent>
   * @description close the popup of security screen in large devices
   * @return none
   */
  onResized(event: ResizedEvent): void {
    this.width = event.newWidth;
    if (this.width > LARGE_DEVICE_BREAKPOINT) {
      this.handleCloseButtonClick(true);
    }
  }

  /**
   * @methodName handleCancelButtonClick
   * @description used to handle cancel button click
   * @parameters none
   * @return none
   */
  handleCancelButtonClick(): void {
    this.subscription$.add(this.registrationService.deRegister.subscribe(response => {
      if (response) {
        this.subscription$.add(this.registrationService.cancelRegistration().subscribe(
          (cancelResponse) => {
            if (cancelResponse && cancelResponse.result === CIAM_ERROR_CODE.cancelRegistration) {
              this.stepperRegistration.reset(); // reseting stepper before canceling
              this.router.navigateByUrl(REGISTRATION_CONFIG.cancelRouterLink);
              this.registrationService.deRegister$.next(undefined);
            }
          }));
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
