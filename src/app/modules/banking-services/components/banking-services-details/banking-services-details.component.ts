import { Component, Input, OnInit } from '@angular/core';
import { BankingServicesService } from '../../services/banking-services.service';
import { AccountsSummaryResponse, PaymentsSummaryResponse } from 'src/app/common/models/bank-services-module.model';
import { BANKING_SERVICE_LIST, BANK_SERVICES_DETAILS_TEXT, CHEQUE_BOOK_INFO } from '../../banking-services-module.constants';
import { ARABIC_LANG_TEXT, BANKING_SERVICE_TYPE, CURRENCY_CODE_AED } from 'src/app/common/global-constants';
import { SharedService } from 'src/app/common/services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-banking-services-details',
  templateUrl: './banking-services-details.component.html',
  styleUrls: ['./banking-services-details.component.scss']
})
export class BankingServicesDetailsComponent implements OnInit {
  @Input() selectedService: string;
  @Input() accountServiceRequestDetails: AccountsSummaryResponse;
  @Input() paymentServiceRequestDetails: PaymentsSummaryResponse;
  componentTitle: string;
  feeCurrencyCode = CURRENCY_CODE_AED;
  leavesPerBook = CHEQUE_BOOK_INFO.LEAVES_PER_BOOK;
  selectedLang: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  subscription$ = new Subscription();

  constructor(
    private bankingService: BankingServicesService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getLanguage();
    this.getComponentTitle();
  }

  /**
   * @methodName getComponentTitle
   * @parameter none
   * @description used to set details component title
   * @return none
   */
  getComponentTitle(): void {
    if (this.selectedService) {
      switch (this.selectedService) {
        case BANKING_SERVICE_TYPE.PAYMENT_ORDER:
          this.componentTitle = BANK_SERVICES_DETAILS_TEXT.PAYMENT_ORDER_DETAILS;
          break;
        case BANKING_SERVICE_TYPE.CHEQUE_BOOK:
          this.componentTitle = BANK_SERVICES_DETAILS_TEXT.CHEQUE_BOOK_DETAILS;
          break;
        case BANKING_SERVICE_TYPE.DEMAND_DRAFT:
          this.componentTitle = BANK_SERVICES_DETAILS_TEXT.DEMAND_DRAFT_DETAILS;
          break;
        case BANKING_SERVICE_TYPE.BANK_CERTIFICATE:
          this.componentTitle = BANK_SERVICES_DETAILS_TEXT.BANK_CERTIFICATE_DETAILS;
          break;
      }
    }
  }

  /**
   * @methodName onBackButtonClick
   * @parameter none
   * @description used to navigate to respective dashboard screens on back button click
   * @return none
   */
  onBackButtonClick(): void {
    if (this.selectedService) {
      switch (this.selectedService) {
        case BANKING_SERVICE_TYPE.PAYMENT_ORDER:
          this.bankingService.cancelButtonClick$.next(BANKING_SERVICE_LIST.paymentOrder);
          break;
        case BANKING_SERVICE_TYPE.CHEQUE_BOOK:
          this.bankingService.cancelButtonClick$.next(BANKING_SERVICE_LIST.chequeBook);
          break;
        case BANKING_SERVICE_TYPE.DEMAND_DRAFT:
          this.bankingService.cancelButtonClick$.next(BANKING_SERVICE_LIST.demandDraft);
          break;
        case BANKING_SERVICE_TYPE.BANK_CERTIFICATE:
          this.bankingService.cancelButtonClick$.next(BANKING_SERVICE_LIST.bankCertificate);
          break;
      }
    }
  }

  /**
   * @methodName getLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getLanguage(): void {
    this.subscription$.add(this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLang = selectedLanguage;
    }));
  }
}
