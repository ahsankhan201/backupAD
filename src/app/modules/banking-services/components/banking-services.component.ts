import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { BankingServicesService } from '../services/banking-services.service';
import { SharedService } from 'src/app/common/services/shared.service';
import {
  BANKING_SERVICE_LIST, BANKING_SERVICES_CONST,
  BANKING_SERVICE_ICON_LIST, BANK_SERVICES_ALERT_TEXT
} from '../banking-services-module.constants';
import {
  ICON, DASHBOARD_NAMES, DOMAINS, BANKING_SERVICE_TYPE,
  ARABIC_LANG_TEXT, HTTP_STATUS_CODE
} from 'src/app/common/global-constants';
import { BANKING_SERVICES_ENDPOINTS } from 'src/app/common/api-endpoints';
import { AccountsSummaryResponse, PaymentsSummaryResponse } from 'src/app/common/models/bank-services-module.model';

@Component({
  selector: 'app-banking-services',
  templateUrl: './banking-services.component.html',
  styleUrls: ['./banking-services.component.scss']
})
export class BankingServicesComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  bankingServiceList = BANKING_SERVICE_LIST; // Banking Services list
  bankingServiceListValues = BANKING_SERVICE_ICON_LIST;
  BANKING_SERVICE_CONST = BANKING_SERVICES_CONST;
  selectedComponent = this.BANKING_SERVICE_CONST.bankingServicesComponent; // default component selected = Banking Service
  selectedBankingService: string;
  iconsConst = ICON;
  requestButtonLabel: string;
  enableBankingServiceRequest = false;
  showChequeBookReqForm = false;
  bankingServiceAlertText: string;
  selectedServiceType: string;
  accountsSummaryReponseList: AccountsSummaryResponse[] = [];
  paymentsSummaryReponseList: PaymentsSummaryResponse[] = [];
  selectedLang: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  selectedAccountRequestDetails: AccountsSummaryResponse;
  selectedPaymentRequestDetails: PaymentsSummaryResponse;
  showDetailsComponents = false;

  constructor(
    private bankingService: BankingServicesService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getLanguage();
    this.setComponentInitialData();
    this.handleCancelButtonClick();
  }

  /**
   * @methodName setComponentInitialData
   * @parameter none
   * @description used to set the component initial data
   * @return none
   */
  setComponentInitialData() {
    this.sharedService.setHorizontalLineClass(this.BANKING_SERVICE_CONST.horizontalLineClass);
    this.sharedService.selectedDashboardText = DASHBOARD_NAMES.bankingServices;
    this.showDetailsComponents = false;
    // check for when it's coming from quick links
    if (this.sharedService.selectedBankingServicesOnQuickLink) {
      this.selectedComponent = this.sharedService.selectedBankingServicesOnQuickLink;
      this.selectedBankingService = this.sharedService.selectedBankingServicesOnQuickLink;
      this.setRequestDashboardDetails();
    }
  }

  /**
   * @methodName getBankingService
   * @parameter none
   * @description used to get selected banking service
   * @return none
   */
  getBankingService(bankingService: string): void {
    if (bankingService) {
      this.bankingServiceAlertText = undefined;
      this.accountsSummaryReponseList = [];
      this.paymentsSummaryReponseList = [];
      this.selectedComponent = this.selectedBankingService = this.bankingService.selectedBankingService = bankingService;
      this.setRequestDashboardDetails();
    }
  }

  /**
   * @methodName handleBackButtonClick
   * @parameter none
   * @description used to handle back button click
   * @return none
   */
  handleBackButtonClick(event: Event): void {
    if (event) {
      this.selectedComponent = this.BANKING_SERVICE_CONST.bankingServicesComponent;
      this.requestButtonLabel = undefined;
    }
  }

  /**
   * @methodName setRequestDashboardDetails
   * @parameter none
   * @description used to set banking services dashboard details
   * @return none
   */
  setRequestDashboardDetails(): void {
    if (this.selectedBankingService) {
      switch (this.selectedBankingService) {
        case BANKING_SERVICE_LIST.paymentOrder:
          this.requestButtonLabel = this.BANKING_SERVICE_CONST.requestPaymentOrderText;
          this.selectedServiceType = BANKING_SERVICE_TYPE.PAYMENT_ORDER;
          break;
        case BANKING_SERVICE_LIST.demandDraft:
          this.requestButtonLabel = this.BANKING_SERVICE_CONST.requestDemandDraftText;
          this.selectedServiceType = BANKING_SERVICE_TYPE.DEMAND_DRAFT;
          break;
        case BANKING_SERVICE_LIST.chequeBook:
          this.requestButtonLabel = this.BANKING_SERVICE_CONST.requestNewChequeBookText;
          this.selectedServiceType = BANKING_SERVICE_TYPE.CHEQUE_BOOK;
          break;
        case BANKING_SERVICE_LIST.bankCertificate:
          this.requestButtonLabel = this.BANKING_SERVICE_CONST.requestBankCertificateText;
          this.selectedServiceType = BANKING_SERVICE_TYPE.BANK_CERTIFICATE;
          break;
      }
      this.getServiceSummary(this.selectedServiceType);
    }
  }

  /**
   * @methodName getServiceSummary
   * @parameter serviceRequestType<string>
   * @description used to make selected service summary request
   * @return none
   */
  getServiceSummary(serviceRequestType: string): void {
    if (serviceRequestType === BANKING_SERVICE_TYPE.BANK_CERTIFICATE || serviceRequestType === BANKING_SERVICE_TYPE.CHEQUE_BOOK) {
      this.subscription$.add(this.bankingService.getAccountsServiceSummary(serviceRequestType).subscribe((response) => {
        if (response) {
          this.accountsSummaryReponseList = response;
        }
      }, errors => {
        if (errors.error && errors.error.details && errors.error.details.status === HTTP_STATUS_CODE.BAD_FORMAT) {
          this.bankingServiceAlertText = this.getAlertMessage();
        }
      }));
    } else if (serviceRequestType === BANKING_SERVICE_TYPE.DEMAND_DRAFT || serviceRequestType === BANKING_SERVICE_TYPE.PAYMENT_ORDER) {
      this.subscription$.add(this.bankingService.getPaymentsServiceSummary(serviceRequestType).subscribe((response) => {
        if (response) {
          this.paymentsSummaryReponseList = response;
        }
      }, errors => {
        if (errors.error && errors.error.details && errors.error.details.status === HTTP_STATUS_CODE.BAD_FORMAT) {
          this.bankingServiceAlertText = this.getAlertMessage();
        }
      }));

    }
  }

  /**
   * @methodName getAlertMessage
   * @parameter none
   * @description used to set alert message text
   * @return string
   */
  getAlertMessage(): string {
    let alertMessgae: string;
    if (this.selectedServiceType) {
      switch (this.selectedServiceType) {
        case BANKING_SERVICE_TYPE.PAYMENT_ORDER:
          alertMessgae = BANK_SERVICES_ALERT_TEXT.NO_PAYMENT_ORDER;
          break;
        case BANKING_SERVICE_TYPE.CHEQUE_BOOK:
          alertMessgae = BANK_SERVICES_ALERT_TEXT.NO_CHEQUE_BOOK;
          break;
        case BANKING_SERVICE_TYPE.DEMAND_DRAFT:
          alertMessgae = BANK_SERVICES_ALERT_TEXT.NO_DEMAND_DRAFT;
          break;
        case BANKING_SERVICE_TYPE.BANK_CERTIFICATE:
          alertMessgae = BANK_SERVICES_ALERT_TEXT.NO_BANK_CERTIFICATE;
          break;
      }
      return alertMessgae;
    }
  }

  /**
   * @methodName getSelectedRequestDetails
   * @parameter selectedRequestId<number>
   * @description used to get the selected service request details
   * @return none
   */
  getSelectedRequestDetails(selectedRequestId: number): void {
    if (this.selectedServiceType === BANKING_SERVICE_TYPE.BANK_CERTIFICATE
      || this.selectedServiceType === BANKING_SERVICE_TYPE.CHEQUE_BOOK) {
      this.subscription$.add(this.bankingService.getAccountsServiceDetails(selectedRequestId).subscribe((response) => {
        if (response) {
          this.selectedAccountRequestDetails = response;
          this.showDetailsComponents = true;
        }
      }));
    } else if (this.selectedServiceType === BANKING_SERVICE_TYPE.DEMAND_DRAFT
      || this.selectedServiceType === BANKING_SERVICE_TYPE.PAYMENT_ORDER) {
      this.subscription$.add(this.bankingService.getPaymentsServiceDetails(selectedRequestId).subscribe((response) => {
        if (response) {
          this.selectedPaymentRequestDetails = response;
          this.showDetailsComponents = true;
        }
      }));
    }
  }

  /**
   * @methodName handleBankingServiceRequest
   * @parameter none
   * @description used to handle banking service request button click
   * @return none
   */
  handleBankingServiceRequest(): void {
    if (this.selectedBankingService) {
      if (this.selectedComponent === this.bankingServiceList.chequeBook) {
        this.handleChequeBookRequest();
      } else {
        this.enableBankingServiceRequest = true;
      }
    }
  }

  /**
   * @methodName handleChequeBookRequest
   * @parameter none
   * @description used to handle cheque book request
   * @return none
   */
  handleChequeBookRequest(): void {
    this.bankingService.validAccountsForChequeBook = undefined;
    const CHEQUE_BOOK_ELIGIBILITY_URL =
      `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)}${BANKING_SERVICES_ENDPOINTS.CHEQUE_BOOK_ELIGIBILITY}`;
    this.subscription$.add(this.bankingService.chequeBookEligibility(CHEQUE_BOOK_ELIGIBILITY_URL).subscribe((response) => {
      if (response) {
        this.enableBankingServiceRequest = true;
        this.showChequeBookReqForm = true;
        this.bankingService.validAccountsForChequeBook = response;
      }
    }));
  }

  /**
   * @methodName handleCancelButtonClick
   * @description used to handle cancel button click
   * @parameters none
   * @return none
   */
  handleCancelButtonClick(): void {
    this.subscription$.add(this.bankingService.cancelButtonClick.subscribe(response => {
      if (response) {
        this.selectedComponent = response;
        this.setComponentInitialData();
        this.enableBankingServiceRequest = false;
        this.showChequeBookReqForm = false;
        this.bankingService.cancelButtonClick$.next(undefined);
      }
    }
    ));
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

  ngOnDestroy() {
    this.subscription$.unsubscribe();
    this.selectedComponent = this.selectedBankingService = undefined;
    this.enableBankingServiceRequest = undefined;
    this.sharedService.setHorizontalLineClass(undefined);
    this.sharedService.selectedBankingServicesOnQuickLink = undefined;
  }

}
