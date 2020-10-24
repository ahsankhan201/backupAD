import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/common/services/shared.service';
import { BankingServicesService } from '../../services/banking-services.service';
import { BANKING_SERVICES_ENDPOINTS } from 'src/app/common/api-endpoints';
import { ChequeBookRequestModel } from 'src/app/common/models/bank-services-module.model';
import { CHEQUE_BOOK_INFO, BANKING_SERVICE_LIST } from '../../banking-services-module.constants';
import { ARABIC_LANG_TEXT, CURRENCY_CODE_AED, DOMAINS } from 'src/app/common/global-constants';


@Component({
  selector: 'app-cheque-book-summary',
  templateUrl: './cheque-book-summary.component.html',
  styleUrls: ['./cheque-book-summary.component.scss']
})
export class ChequeBookSummaryComponent implements OnInit, OnDestroy {
  @Output() showChequeBookForm = new EventEmitter();
  subscription$ = new Subscription();
  summaryDetails = {} as ChequeBookRequestModel;
  deliveryOption: string;
  leavesPerBook: number;
  showSuccessScreen: boolean;
  disableSubmitBtn: boolean;
  referenceNumberForSuccessScreen: string;
  feeCurrencyCode = CURRENCY_CODE_AED;
  selectedLang: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private bankingService: BankingServicesService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.getLanguage();
    this.setComponentInitialData();
  }

  /**
   * @methodName setComponentInitialData
   * @parameter none
   * @description used to set the component initial data
   * @return none
   */
  setComponentInitialData(): void {
    this.summaryDetails = this.bankingService.chequeBookRequestPayload;
    this.deliveryOption = CHEQUE_BOOK_INFO.DELIVER_TO_ME;
    this.leavesPerBook = CHEQUE_BOOK_INFO.LEAVES_PER_BOOK;
  }

  /**
   * @methodName showChequeBookDashboard
   * @parameter none
   * @description used to navigate to dashboard screen
   * @return none
   */
  showChequeBookDashboard(): void {
    this.bankingService.cancelButtonClick$.next(BANKING_SERVICE_LIST.chequeBook);
  }

  /**
   * @methodName showPreviousScreen
   * @parameter none
   * @description used to navigate to the previos screen
   * @return none
   */
  showPreviousScreen(): void {
    this.showChequeBookForm.emit();
  }

  /**
   * @methodName makeChequeBookRequest
   * @parameter none
   * @description used to make cheque book request
   * @return none
   */
  makeChequeBookRequest(): void {
    const CHEQUE_BOOK_REQ_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + BANKING_SERVICES_ENDPOINTS.CHEQUE_BOOK_REQ;
    this.disableSubmitBtn = true;
    this.subscription$.add(this.bankingService.makeChequeBookReq(CHEQUE_BOOK_REQ_API, this.bankingService.chequeBookRequestPayload)
      .subscribe((response) => {
        if (response && response.serviceRequestNumber) {
          this.referenceNumberForSuccessScreen = response.serviceRequestNumber;
          this.showSuccessScreen = true;
        }
      }));
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
  }

}
