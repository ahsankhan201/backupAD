import { Component, OnInit } from '@angular/core';
import { DEMAND_DRAFT_DASHBOARD, SUMMARY_COMPONENT } from 'src/app/common/global-constants';
import { BankingServicesService } from '../../../services/banking-services.service';
import { DemandDraftSummaryScreenModel } from 'src/app/common/models/payment-order';
import { BANKING_SERVICE_LIST, PAYMENT_ORDER_CONST } from '../../../banking-services-module.constants';

@Component({
  selector: 'app-draft-confirmation-step',
  templateUrl: './draft-confirmation-step.component.html',
  styleUrls: ['./draft-confirmation-step.component.scss']
})
export class DraftConfirmationStepComponent implements OnInit {

  showComponent = SUMMARY_COMPONENT;
  backToMainComponent = DEMAND_DRAFT_DASHBOARD;
  summaryDetails = {} as DemandDraftSummaryScreenModel;
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
        this.bankingService.setDemandDraftPayload();
        this.summaryDetails = this.bankingService.getDemandDraftSummaryData();
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
    this.bankingService.cancelButtonClick$.next(BANKING_SERVICE_LIST.demandDraft);
  }

  /**
   * @methodName handleNextButtonClick
   * @parameter none
   * @description used to handle next button click
   * @return none
   */
  handleNextButtonClick(): void {
    this.bankingService.submitDemandDraftRequest().subscribe(response => {
      if (response && response.serviceRequestNumber) {
        this.referanceNumber = response.serviceRequestNumber;
        this.showComponent = PAYMENT_ORDER_CONST.successScreenComponent;
      }
    });
  }

}
