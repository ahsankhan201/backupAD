import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatStepper } from '@angular/material';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { TranslateService } from '@ngx-translate/core';

import { SharedService } from 'src/app/common/services/shared.service';

import { SnackBar } from 'src/app/common/models/snackBar.model';
import { NAV_CONTROLS, ARABIC_LANG_TEXT } from '../../../common/global-constants';
import { STEPPER_TEXT } from '../beneficiary-module.constants';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss']
})
export class BeneficiaryComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  showSnackBar = false;
  snackBarMessageObj: SnackBar;
  navControls = NAV_CONTROLS;
  stepperText = STEPPER_TEXT;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private sharedService: SharedService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.activateTransferAndPaymentTab();
    this.getSelectedLanguage();
  }

  /**
   * @methodName activateTransferAndPaymentTab
   * @params none
   * @description activating the transfer and paymnets tab in side nav
   * @return none
   */
  activateTransferAndPaymentTab() {
    const routerLinkClass = document.querySelector('[ng-reflect-router-link=' + this.navControls.TRANSFER_PAYMENTS_ROUTE + ']');
    if (routerLinkClass) {
      document.querySelector('[ng-reflect-router-link=' + this.navControls.TRANSFER_PAYMENTS_ROUTE + ']').classList.add('active');
      this.sharedService.setHorizontalLineClass(NAV_CONTROLS.ADD_BEN_DIVIDER_CLASS);
    }
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
   * @methodName getSelectedLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getSelectedLanguage(): void {
    this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLanguage = selectedLanguage;
    });
  }

  ngOnDestroy() {
    // de-activating the transfer and paymnets tab in side nav
    document.querySelector('[ng-reflect-router-link=' + this.navControls.TRANSFER_PAYMENTS_ROUTE + ']').classList.remove('active');
    this.sharedService.setHorizontalLineClass(undefined);
  }
}
