import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatStepper } from '@angular/material';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { NAV_CONTROLS, ARABIC_LANG_TEXT, PAYMENT_VIEW_MAPPING_OBJ, PAYMENT_ROUTING_BUTTONS } from '../../../common/global-constants';
import { ROUTING_URLS } from '../../../common/api-endpoints';
import { STEPPER_TEXT } from '../payee-module.constants';
import { SharedService } from 'src/app/common/services/shared.service';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/common/services/payment/payment.service';

@Component({
  selector: 'app-payee',
  templateUrl: './payee.component.html',
  styleUrls: ['./payee.component.scss']
})
export class PayeeComponent implements OnInit, OnDestroy {
  payeeRoutingURL = ROUTING_URLS.PAYEE;
  stepperText = STEPPER_TEXT;
  navControls = NAV_CONTROLS;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  subscription$ = new Subscription();
  showPayBill = false;
  parentComponentTitle: string;
  selectedComponentTitle: string;

  constructor(
    private sharedService: SharedService, private router: Router, private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.activateTransferAndPaymentTab();
    this.getSelectedLanguage();
    this.getPayBillTab();
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
    this.subscription$.add(this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLanguage = selectedLanguage;
    }));
  }

  /**
   * @methodName getPayBillTab
   * @parameter none
   * @description Used to set show paybill view
   * @return none
   */
  getPayBillTab(): void {
    this.subscription$.add(this.sharedService.setShowPaybill.subscribe(response => {
      if (response) {
        this.parentComponentTitle = PAYMENT_VIEW_MAPPING_OBJ.transferAndPayments;
        this.selectedComponentTitle = PAYMENT_VIEW_MAPPING_OBJ.payBillsText;
        this.paymentService.confirmScreenRoutingButtonText = PAYMENT_ROUTING_BUTTONS.transferAndPayments;
        this.showPayBill = true;
      }
    }));
  }

  /**
   * @methodName changePaymentsView
   * @description used to toggle the payments view
   * @parameters none
   * @return none
   */
  changePaymentsView(): void {
    this.sharedService.setShowPaybill.next(undefined);
    this.router.navigate([NAV_CONTROLS.TRANSFER_PAYMENTS_ROUTE]);

  }


  ngOnDestroy() {
    document.querySelector('[ng-reflect-router-link=' + this.navControls.TRANSFER_PAYMENTS_ROUTE + ']').classList.remove('active');
    this.subscription$.unsubscribe();
  }
}
