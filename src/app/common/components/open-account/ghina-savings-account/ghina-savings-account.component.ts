import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SharedService } from '../../../services/shared.service';
import { OpenAccountService } from '../../../services/open-account/open-account.service';
import { MoneyTransferService } from '../../../services/money-transfer/money-transfer.service';

import {
  OPEN_ACCOUNT_CURRENCY, INTERNATIONAL_TRANSFER_TEXT, CURRENCY_LIST_OBJ,
  MIN_AMOUNT_FOR_OPENING_GHINA_ACCOUNT, OPEN_GHINA_ACCOUNT_TEXT,
  ARABIC_LANG_TEXT, MOBILE_NUMBER_LENGTH
} from '../../../global-constants';
import { TransferFromSelectionModel, AccountsList } from '../../../models/global.model';
import { PRODUCT_CARD_TEXT } from 'src/app/modules/products/products-module.constants';
import { ExchangeRateRequestPayLoad } from '../../../models/money-transfer.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ghina-savings-account',
  templateUrl: './ghina-savings-account.component.html',
  styleUrls: ['./ghina-savings-account.component.scss']
})
export class GhinaSavingsAccountComponent implements OnInit {
  @Output() cancelOpenAccountTransaction = new EventEmitter();

  currencyList = OPEN_ACCOUNT_CURRENCY as TransferFromSelectionModel[];
  openAccountFormGroup: FormGroup;
  enableNextBtn: boolean;
  showSummaryScreen: boolean;
  accountList = [] as AccountsList[];
  transferRateForCalculation: number;
  transferRateForView: string;
  minimumAmountForOpeningAccount: number;
  targetAccountCurrency: string;
  sourceAccountCurrency: string;
  selectedLang: string;
  subscription$ = new Subscription();
  arabicLanguageText = ARABIC_LANG_TEXT;
  mobileNumberLength = MOBILE_NUMBER_LENGTH;
  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private openAccountService: OpenAccountService,
    private transferService: MoneyTransferService) { }

  ngOnInit() {
    this.setComponentInitialData();
    this.getLanguage();
  }

  /**
   * @methodName setComponentInitialData
   * @parameter none
   * @description used to set the component initial data
   * @return none
   */
  setComponentInitialData() {
    this.createOpenAccountForm();
    this.accountList = this.openAccountService.generateAccountSelectBoxObj();
    this.openAccountService.selectedSourceAccount = undefined;
  }

  /**
   * @methodName selectedCurrency
   * @parameter none
   * @description used to set the selected currency for opening account
   * @return none
   */
  selectedCurrency(selectedCurrency: string): void {
    this.openAccountService.savingsAccountSummaryDetails.targetAccountCurency = selectedCurrency;
    this.targetAccountCurrency = selectedCurrency;
    this.enableNextBtn = true;
    this.calculateMinimumAmount();
    this.getExchangeRate();
    this.validateAmount();
  }

  /**
   * @methodName createOpenAccountForm
   * @parameter none
   * @description used to create the open account form group
   * @return none
   */
  createOpenAccountForm(): void {
    this.openAccountFormGroup = this.formBuilder.group({
      mobileNumber: [this.sharedService.customerFilteredPrimaryAddress.phoneOffice,
      [Validators.required, Validators.minLength(MOBILE_NUMBER_LENGTH)]],
      emailId: [this.sharedService.customerFilteredPrimaryAddress.email, [Validators.required, this.sharedService.validateEmailId()]],
      depositAmount: ['', [Validators.required]],
      transferFromAccount: ['', [Validators.required]]
    });
  }

  /**
   * @methodName showSummaryDetails
   * @parameter none
   * @description used to show the summary details
   * @return none
   */
  showSummaryDetails(): void {
    this.setSummaryDetails();
    this.showSummaryScreen = true;
  }

  /**
   * @methodName calculateMinimumAmount
   * @parameter none
   * @description used to calculate the minimum amount based on currency selection
   * @return none
   */
  calculateMinimumAmount(): void {
    switch (this.targetAccountCurrency) {
      case CURRENCY_LIST_OBJ.USD:
        this.minimumAmountForOpeningAccount = MIN_AMOUNT_FOR_OPENING_GHINA_ACCOUNT.USD;
        break;
      case CURRENCY_LIST_OBJ.AED:
        this.minimumAmountForOpeningAccount = MIN_AMOUNT_FOR_OPENING_GHINA_ACCOUNT.AED;
        break;
      case CURRENCY_LIST_OBJ.GBP:
        this.minimumAmountForOpeningAccount = MIN_AMOUNT_FOR_OPENING_GHINA_ACCOUNT.GBP;
        break;
    }
  }

  /**
   * @methodName setSummaryDetails
   * @parameter none
   * @description used to set the summary details for savings account
   * @return none
   */
  setSummaryDetails(): void {
    this.openAccountService.savingsAccountSummaryDetails.depositAmount =
      this.openAccountFormGroup.get(OPEN_GHINA_ACCOUNT_TEXT.DEPOSIT_AMOUNT).value ?
        this.sharedService.removeCommaFromString(this.openAccountFormGroup.get(OPEN_GHINA_ACCOUNT_TEXT.DEPOSIT_AMOUNT).value) :
        this.openAccountFormGroup.get(OPEN_GHINA_ACCOUNT_TEXT.DEPOSIT_AMOUNT).value;
    this.openAccountService.savingsAccountSummaryDetails.mobileNumber =
      this.openAccountFormGroup.get(OPEN_GHINA_ACCOUNT_TEXT.MOBILE_NUMBER).value;
    this.openAccountService.savingsAccountSummaryDetails.emailId =
      this.openAccountFormGroup.get(OPEN_GHINA_ACCOUNT_TEXT.EMAIL_ID).value;
    this.openAccountService.savingsAccountSummaryDetails.payFromAccount =
      this.openAccountFormGroup.get(OPEN_GHINA_ACCOUNT_TEXT.TRANSFER_FROM_ACCOUNT).value;
  }

  /**
   * @methodName accountSelectionChange
   * @parameter string
   * @description it will call the getExchangeRate() on account selection
   * @return none
   */
  accountSelectionChange(selectedAccount: string): void {
    this.openAccountService.selectedSourceAccount = this.accountList.find(accountObj => {
      return selectedAccount === accountObj.accountNumber;
    });
    this.openAccountService.savingsAccountSummaryDetails.sourceAccountCurrency = this.openAccountService.selectedSourceAccount.currencyCode;
    this.sourceAccountCurrency = this.openAccountService.selectedSourceAccount.currencyCode;
    this.getExchangeRate();
  }

  /**
   * @methodName getExchangeRate
   * @parameter none
   * @description used to get the exchange rate
   * @return none
   */
  getExchangeRate(): void {
    if (this.openAccountService.savingsAccountSummaryDetails && this.openAccountService.savingsAccountSummaryDetails.targetAccountCurency
      && this.openAccountService.selectedSourceAccount && this.openAccountService.selectedSourceAccount) {
      const exchangeRatepayLoad = {} as ExchangeRateRequestPayLoad;
      exchangeRatepayLoad.creditAcctNumberCurrencyCode = this.openAccountService.savingsAccountSummaryDetails.targetAccountCurency;
      exchangeRatepayLoad.debitAcctNumber = this.openAccountService.selectedSourceAccount.accountNumber;
      exchangeRatepayLoad.transferAccountCurrencyCode = this.openAccountService.selectedSourceAccount.currencyCode;
      exchangeRatepayLoad.transferAmount = OPEN_GHINA_ACCOUNT_TEXT.EXCHANGE_TRANSFER_AMOUNT;
      this.transferService.getExchangeRate(exchangeRatepayLoad).subscribe((response) => {
        if (response) {
          this.openAccountService.exchangeRateResponse = response;
          this.transferRateForCalculation = Number(response.rate);
          this.transferRateForView = this.sharedService.trimNumberWithoutRounding(this.transferRateForCalculation,
            INTERNATIONAL_TRANSFER_TEXT.FIXED_AMOUNT_DECIMAL);
          this.calculateDebitAmount();
          this.validateAccountBalance();
        }
      });
    }
  }

  /**
   * @methodName validateAccountBalance
   * @parameter none
   * @description used to validate the account balance
   * @return none
   */
  validateAccountBalance(): void {
    const selectAccountOption = this.openAccountFormGroup.get(OPEN_GHINA_ACCOUNT_TEXT.TRANSFER_FROM_ACCOUNT);
    if (this.openAccountService.savingsAccountSummaryDetails && this.openAccountService.selectedSourceAccount &&
      Number(this.openAccountService.savingsAccountSummaryDetails.debitAmount) >
      Number(this.openAccountService.selectedSourceAccount.balanceAvailable)) {
      selectAccountOption.setErrors({ openAccountBalanceError: { message: undefined } });
    } else if (this.openAccountFormGroup.get(OPEN_GHINA_ACCOUNT_TEXT.DEPOSIT_AMOUNT).value) {
      selectAccountOption.setErrors(null);
    }
  }

  /**
   * @methodName calculateDebitAmount
   * @parameter none
   * @description used to calculate the debit amount
   * @return none
   */
  calculateDebitAmount(): void {
    let amount = this.openAccountFormGroup.get(OPEN_GHINA_ACCOUNT_TEXT.DEPOSIT_AMOUNT).value;
    amount = this.sharedService.removeCommaFromString(amount);
    if (amount && this.transferRateForCalculation) {
      this.openAccountService.savingsAccountSummaryDetails.debitAmount =
        this.sharedService.trimNumberWithoutRounding((Number(amount) / this.transferRateForCalculation),
          INTERNATIONAL_TRANSFER_TEXT.FIXED_AMOUNT_DECIMAL);
    }
  }

  /**
   * @methodName validateAmount
   * @parameter none
   * @description used to validate the amount
   * @return none
   */
  validateAmount(): void {
    let amount = this.openAccountFormGroup.get(OPEN_GHINA_ACCOUNT_TEXT.DEPOSIT_AMOUNT).value;
    amount = this.sharedService.removeCommaFromString(amount);
    if (amount) {
      if (amount < this.minimumAmountForOpeningAccount) {
        this.openAccountFormGroup.get(OPEN_GHINA_ACCOUNT_TEXT.DEPOSIT_AMOUNT).setErrors(
          {
            openAccountMinError: { message: ` ${this.minimumAmountForOpeningAccount} ${this.targetAccountCurrency}.` }
          });
      }
    }
    this.calculateDebitAmount();
    this.validateAccountBalance();
  }
  /**
   * @methodName cancelOpeningAccountProcess
   * @parameter none
   * @description used to cancel opening account flow
   * @return none
   */
  cancelOpeningAccountProcess(): void {
    this.openAccountService.isBankSeviceTermsAgreed = false;
    this.openAccountService.ghinaSeviceTermsAgreed = false;
    this.cancelOpenAccountTransaction.emit(true);
  }
  /**
   * @methodName showAccountFormComponent
   * @parameter boolean
   * @description used to toggle the form component
   * @return none
   */
  showAccountFormComponent(isBackBtnClicked: boolean): void {
    isBackBtnClicked ? this.cancelOpeningAccountProcess() : this.showSummaryScreen = false;
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
