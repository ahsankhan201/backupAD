import { Component, OnInit } from '@angular/core';
import { SUMMARY_COMPONENT } from 'src/app/common/global-constants';
import { BankingServicesService } from '../../../services/banking-services.service';
import { PaymentOrderSummaryScreenModel } from 'src/app/common/models/payment-order';
import { PAYMENT_ORDER_CONST, BANKING_SERVICE_LIST } from '../../../banking-services-module.constants';

@Component({
  selector: 'app-payment-order-confirmation-step',
  templateUrl: './confirmation-step.component.html',
  styleUrls: ['./confirmation-step.component.scss']
})
export class ConfirmationStepComponent implements OnInit {
  showComponent = PAYMENT_ORDER_CONST.summaryComponent;
  backToMainComponent = PAYMENT_ORDER_CONST.successButtonText;
  summaryDetails = {} as PaymentOrderSummaryScreenModel;
  referanceNumber: string;

  constructor(private bankingService: BankingServicesService) { }

  ngOnInit() {
    this.setComponentInitialData();
  }

  /**
   * @methodName setComponentInitialData
   * @parameter none
   * @description used to set the component initial data
   * @return none
   */
  setComponentInitialData(): void {
    this.bankingService.enableSummaryScreen.subscribe(response => {
      if (response) {
        this.bankingService.setPaymentOrderPayload();
        this.summaryDetails = this.bankingService.getPaymentOrderSummaryData();
        this.bankingService.enableSummaryScreen$.next(undefined);
      }
    });
  }

  /**
   * @methodName handleCancelButtonClick
   * @parameter none
   * @description used to handle cancel button click
   * @return none
   */
  handleCancelButtonClick(): void {
    this.bankingService.cancelButtonClick$.next(BANKING_SERVICE_LIST.paymentOrder);
  }

  /**
   * @methodName handleNextButtonClick
   * @parameter none
   * @description used to handle next button click
   * @return none
   */
  handleNextButtonClick(): void {
    this.bankingService.submitPaymentOrderRequest().subscribe(response => {
      if (response && response.serviceRequestNumber) {
        this.referanceNumber = response.serviceRequestNumber;
        this.showComponent = PAYMENT_ORDER_CONST.successScreenComponent;
      }
    });
  }
}

