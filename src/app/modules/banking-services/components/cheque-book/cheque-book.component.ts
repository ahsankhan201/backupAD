import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BANKING_SERVICES_ENDPOINTS } from 'src/app/common/api-endpoints';
import { SharedService } from 'src/app/common/services/shared.service';
import { BankingServicesService } from '../../services/banking-services.service';
import { ARABIC_LANG_TEXT, DOMAINS, FORM_LENGTHS } from 'src/app/common/global-constants';
import { PRODUCT_CARD_TEXT } from 'src/app/modules/products/products-module.constants';
import { BANKING_SERVICE_LIST, CHEQUE_BOOK_INFO } from '../../banking-services-module.constants';
import { BankingServiceChargesModel } from 'src/app/common/models/bank-services-module.model';

@Component({
  selector: 'app-cheque-book',
  templateUrl: './cheque-book.component.html',
  styleUrls: ['./cheque-book.component.scss']
})
export class ChequeBookComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  chequeBookFormGroup: FormGroup;
  eligibleAccounts: string[] = [];
  enableNextBtn: boolean;
  showSummaryScreen: boolean;
  mobileMaxLength = FORM_LENGTHS.FORM_LENGTH_TWELVE;
  selectedLang: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private formBuilder: FormBuilder,
    private bankingService: BankingServicesService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.getLanguage();
    this.createChequeBookForm();
    this.getEligibleAccounts();
  }

  /**
   * @methodName getEligibleAccounts
   * @parameter none
   * @description used to get eligible accounts for cheque book request
   * @return none
   */
  getEligibleAccounts(): void {
    if (this.bankingService.validAccountsForChequeBook) {
      this.bankingService.validAccountsForChequeBook.accountList.forEach(account => {
        if (account.allowed === CHEQUE_BOOK_INFO.ALLOWED_ACCOUNTS) {
          this.eligibleAccounts.push(account.accountNumber);
        }
      });
    }
  }

  /**
   * @methodName createChequeBookForm
   * @parameter none
   * @description used to create the open account form group
   * @return none
   */
  createChequeBookForm(): void {
    this.chequeBookFormGroup = this.formBuilder.group({
      selectAccount: ['', [Validators.required]],
      mobileNumber: [this.sharedService.customerFilteredPrimaryAddress.phoneOffice,
      [Validators.required, Validators.minLength(PRODUCT_CARD_TEXT.MOBILE_MIN_LENGTH)]],
    });
  }

  /**
   * @methodName cancelRequest
   * @parameter none
   * @description used to to navigate dashboard screen
   * @return none
   */
  cancelRequest(): void {
    this.bankingService.cancelButtonClick$.next(BANKING_SERVICE_LIST.chequeBook);
  }

  /**
   * @methodName accountSelectionChange
   * @parameter string
   * @description it will set the selected account value
   * @return none
   */
  accountSelectionChange(selectedAccount: string): void {
    this.enableNextBtn = true;
    this.bankingService.chequeBookRequestPayload.accountNumber = selectedAccount;
  }

  /**
   * @methodName showSummaryScreenComp
   * @parameter none
   * @description used to show summary screen
   * @return none
   */
  showSummaryScreenComp(): void {
    this.bankingService.chequeBookRequestPayload.branchName = this.sharedService.customerDetail.branchName;
    this.bankingService.chequeBookRequestPayload.firstName = this.sharedService.customerDetail.nameLatin.firstName;
    this.bankingService.chequeBookRequestPayload.lastName = this.sharedService.customerDetail.nameLatin.lastName;
    this.bankingService.chequeBookRequestPayload.customerName =
      `${this.bankingService.chequeBookRequestPayload.firstName} ${this.bankingService.chequeBookRequestPayload.lastName}`;
    this.bankingService.chequeBookRequestPayload.emailAddress = this.sharedService.customerFilteredPrimaryAddress.email;
    this.bankingService.chequeBookRequestPayload.mobileNumber = this.chequeBookFormGroup.get(CHEQUE_BOOK_INFO.MOBILE_NUMBER).value;
    this.bankingService.chequeBookRequestPayload.deliveryOption = CHEQUE_BOOK_INFO.DELIVERY_OPTION;
    this.bankingService.chequeBookRequestPayload.salutation = this.sharedService.customerDetail.nameLatin.identification;
    this.showSummaryScreen = true;
    this.getChequeBookCharges();
  }

  /**
   * @methodName getChequeBookCharges
   * @parameter none
   * @description used to fetch cheque book charges from server
   * @return none
   */
  getChequeBookCharges(): void {
    const CHEQUE_BOOK_CHARGE_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + BANKING_SERVICES_ENDPOINTS.GET_CHARGES;
    const reqPayload = {} as BankingServiceChargesModel;
    reqPayload.accountNumber = this.bankingService.chequeBookRequestPayload.accountNumber;
    reqPayload.category = 'CHEQUE_BOOK_FEE'; // it's enum
    this.subscription$.add(this.bankingService.fetchBankCertificateCharges(CHEQUE_BOOK_CHARGE_API, reqPayload).subscribe((response) => {
      if (response && response.fee) {
        this.bankingService.chequeBookRequestPayload.standardCharges = response.fee;
      }
    }));
  }

  /**
   * @methodName toggleSummaryScreen
   * @parameter none
   * @description used to toggle form and summary screen
   * @return none
   */
  toggleSummaryScreen(): void {
    this.showSummaryScreen = false;
    this.enableNextBtn = true;
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
