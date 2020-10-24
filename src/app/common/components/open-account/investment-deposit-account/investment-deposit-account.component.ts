import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { SharedService } from 'src/app/common/services/shared.service';
import { MoneyTransferService } from 'src/app/common/services/money-transfer/money-transfer.service';
import { OpenAccountService } from 'src/app/common/services/open-account/open-account.service';
import {
  NAV_CONTROLS, INVESTMENT_DEPOSIT_COMPONENT,
  TIME_DEPOSIT_ACCOUNT_DURATION,
} from 'src/app/common/global-constants';
import { INVESTMENT_SUMMARY_COMPONENT, TIME_DEPOSIT_ACCOUNT_TEXT } from 'src/app/common/global-constants';
import { INVESMENT_DEPOSIT_ACCOUNT_COMPONENT } from 'src/app/common/global-constants';
import { TIME_DEPOSIT_ACCOUNT_DURATION_MONTH, OPEN_ACCOUNT_CURRENCY_LIST, MATURIY_OPTIONS } from 'src/app/common/global-constants';
import { PROFIT_CREDIT_OPTIONS, TIME_DEPOSIT_ACCOUNT_MIN_AMOUNT, EXCHANGE_TRANSFER_AMOUNT_DEFAULT } from 'src/app/common/global-constants';
import { INTERNATIONAL_TRANSFER_TEXT } from 'src/app/common/global-constants';
import { AccountsList } from 'src/app/common/models/global.model';
import { ExchangeRateRequestPayLoad } from 'src/app/common/models/money-transfer.model';
import { DebitAccount, TransferTo } from 'src/app/common/models/open-account.model';

@Component({
  selector: 'app-investment-deposit-account',
  templateUrl: './investment-deposit-account.component.html',
  styleUrls: ['./investment-deposit-account.component.scss']
})
export class InvestmentDepositAccountComponent implements OnInit {
  @Output() cancelOpenAccountTransaction = new EventEmitter();
  @Output() backButtonClick = new EventEmitter();
  @Output() showSummary = new EventEmitter(false);

  showComponent = INVESTMENT_DEPOSIT_COMPONENT;
  openAccountCurrencyList = OPEN_ACCOUNT_CURRENCY_LIST;
  accountDurationList = TIME_DEPOSIT_ACCOUNT_DURATION;
  MONTH = TIME_DEPOSIT_ACCOUNT_DURATION_MONTH;
  maturityOptionTransferToList = MATURIY_OPTIONS;
  profitCreditOptionTransferToList = PROFIT_CREDIT_OPTIONS;
  openAccountTitle: string;
  openAccountFormGroup: FormGroup;
  maturityOptionAccountList = [] as AccountsList[];
  profitCreditOptionAccountList = [] as AccountsList[];
  summaryComponentData = [];
  accountList = [] as AccountsList[];
  targetAccountCurrency: string;
  sourceAccountCurrency: string;
  showMaturityAccount = false;
  showProfitCreditAccount = false;
  minimumAmountForOpeningAccount: string;
  transferRateForView: string;
  transferRateForCalculation: number;
  preSelectedCurrency: string;

  constructor(
    private sharedService: SharedService,
    private openAccountService: OpenAccountService,
    private formBuilder: FormBuilder,
    private transferService: MoneyTransferService
  ) { }

  ngOnInit() {
    this.createAccountOpenForm();
    this.initializeComponentData();
  }

  /**
   * @methodName initializeComponentData
   * @parameter none
   * @description used to load and initalize all data related component
   * @return none
   */
  initializeComponentData(): void {
    this.openAccountService.selectedMaturityAccount = {} as AccountsList;
    this.openAccountService.selectedProfitCreditAccount = {} as AccountsList;
    this.accountList = this.openAccountService.generateAccountSelectBoxObj();
    this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.maturityOptionTransferTo)
      .setValue(this.maturityOptionTransferToList[0]);
    this.openAccountService.selectedMaturityTransferTo = this.maturityOptionTransferToList[0];
    this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.profitCreditOptionTransferTo)
      .setValue(this.profitCreditOptionTransferToList[0]);
    this.openAccountService.selectedProfitCreditTransferTo = this.profitCreditOptionTransferToList[0];
    this.maturityOptionAccountList = this.openAccountService.generateAccountSelectBoxObj();
    this.profitCreditOptionAccountList = this.openAccountService.generateAccountSelectBoxObj();
    this.sharedService.setHorizontalLineClass(NAV_CONTROLS.OPEN_ACCOUNT_DIVIDER_CLASS);
    this.openAccountTitle = this.openAccountService.openAccountSelectedCard;
  }
  /**
   * @methodName createAccountOpenForm
   * @parameter none
   * @description used to create time deposit account open form group
   * @return none
   */
  createAccountOpenForm(): void {
    this.openAccountFormGroup = this.formBuilder.group({
      accountCurrency: ['', [Validators.required]],
      accountDuration: ['', [Validators.required]],
      depositAmount: ['', [Validators.required]],
      transferFromAccount: ['', [Validators.required]],
      maturityOptionTransferTo: ['', [Validators.required]],
      maturityOptionAccount: [''],
      profitCreditOptionTransferTo: ['', [Validators.required]],
      profitCreditOptionAccount: [''],
    });
  }

  /**
   * @methodName handleOpenAccountSubmit
   * @parameter none
   * @description used to handle open account submit action, to create summary component
   * @return none
   */
  handleOpenAccountSubmit(): void {
    this.setSummaryComponentData();
    this.showComponent = INVESTMENT_SUMMARY_COMPONENT;
  }

  /**
   * @methodName setSummaryComponentData
   * @parameter none
   * @description used to create summary data
   * @return none
   */
  setSummaryComponentData(): void {
    const summary = this.openAccountService.timeDepositSummaryDetails;
    summary.accountCurrency = this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.accountCurrency).value;
    summary.accountDuration = this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.accountDuration).value;
    summary.depositAmount = this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.depositAmount).value ?
      this.sharedService.removeCommaFromString(this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.depositAmount).value) :
      this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.depositAmount).value;
    summary.transferFromAccount = this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.transferFromAccount).value;
    const MATURIY_TRANSFER_TO = this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.maturityOptionTransferTo).value;
    summary.maturityOptionTransferTo = MATURIY_TRANSFER_TO.value;
    summary.maturityOptionAccount = this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.maturityOptionAccount).value;
    const PROFIT_CREDIT_TRANSFER_TO = this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.profitCreditOptionTransferTo).value;
    summary.profitCreditOptionTransferTo = PROFIT_CREDIT_TRANSFER_TO.value;
    summary.profitCreditOptionAccount = this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.profitCreditOptionAccount).value;
  }

  /**
   * @methodName handleAccountDurationChange
   * @parameter none
   * @description used to handle account duration change
   * @return none
   */
  handleAccountDurationChange(accountDuration: string): void {
    if (accountDuration) {
      this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.accountDuration).setValue(accountDuration);
    }
  }

  /**
   * @methodName accountSelectionChange
   * @parameter selectedAccount<string>, accountType<string>
   * @description used to set account selection based on the value selected
   * @return none
   */
  accountSelectionChange(selectedAccount: string, accountType: string): void {
    const ACCOUNT_DATA = this.accountList.find(accountObj => {
      return selectedAccount === accountObj.accountNumber;
    });
    switch (accountType) {
      case TIME_DEPOSIT_ACCOUNT_TEXT.transferFromAccount:
        this.openAccountService.selectedSourceAccount = {} as AccountsList;
        this.openAccountService.selectedSourceAccount = ACCOUNT_DATA;
        this.sourceAccountCurrency = this.openAccountService.selectedSourceAccount.currencyCode;
        this.getExchangeRate();
        break;
      case TIME_DEPOSIT_ACCOUNT_TEXT.maturityAccount:
        this.openAccountService.selectedMaturityAccount = {} as AccountsList;
        this.openAccountService.selectedMaturityAccount = ACCOUNT_DATA;
        break;
      case TIME_DEPOSIT_ACCOUNT_TEXT.profitCreditAccount:
        this.openAccountService.selectedProfitCreditAccount = {} as AccountsList;
        this.openAccountService.selectedProfitCreditAccount = ACCOUNT_DATA;
        break;
    }
  }

  /**
   * @methodName handleSelectedCurrency
   * @parameter none
   * @description used to set selectedCurrency and calculate amount
   * @return none
   */
  handleSelectedCurrency(selectedCurrency: string): void {
    if (selectedCurrency) {
      this.targetAccountCurrency = selectedCurrency;
      this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.accountCurrency).setValue(selectedCurrency);
      this.calculateMinimumAmount();
      this.getExchangeRate();
      this.validateAmount();
    }
  }

  /**
   * @methodName calculateMinimumAmount
   * @parameter none
   * @description used to set min  amount based in the currency value
   * @return none
   */
  calculateMinimumAmount(): void {
    this.minimumAmountForOpeningAccount = TIME_DEPOSIT_ACCOUNT_MIN_AMOUNT[this.targetAccountCurrency];
  }

  /**
   * @methodName validateAmount
   * @parameter none
   * @description used to set min amount validation error
   * @return none
   */
  validateAmount(): void {
    let AMOUNT = this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.depositAmount).value;
    AMOUNT = this.sharedService.removeCommaFromString(AMOUNT);
    if (Number(AMOUNT) < Number(this.minimumAmountForOpeningAccount)) {
      // set min amount form validation error
      this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.depositAmount)
        .setErrors({ openAccountMinError: { message: ` ${this.minimumAmountForOpeningAccount} ${this.targetAccountCurrency}.` } });
    }
    this.calculateDebitAmount();
    this.validateAccountBalance();
  }

  /**
   * @methodName getExchangeRate
   * @parameter none
   * @description used to get the exchange rate
   * @return none
   */
  getExchangeRate(): void {
    if (this.targetAccountCurrency && this.sourceAccountCurrency && this.openAccountService.selectedSourceAccount) {
      const exchangeRatepayLoad = {} as ExchangeRateRequestPayLoad;
      exchangeRatepayLoad.creditAcctNumberCurrencyCode = this.targetAccountCurrency;
      exchangeRatepayLoad.debitAcctNumber = this.openAccountService.selectedSourceAccount.accountNumber;
      exchangeRatepayLoad.transferAccountCurrencyCode = this.sourceAccountCurrency;
      exchangeRatepayLoad.transferAmount = EXCHANGE_TRANSFER_AMOUNT_DEFAULT;
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
   * @methodName onChangeMaturityOption
   * @parameter maturityOption<string>
   * @description used to get the exchange rate
   * @return none
   */
  onChangeMaturityOption(transferTo: TransferTo): void {
    this.showMaturityAccount = false;
    this.openAccountService.selectedMaturityTransferTo = {} as TransferTo;
    if (transferTo && transferTo.id === TIME_DEPOSIT_ACCOUNT_TEXT.Transfer) {
      this.openAccountService.selectedMaturityTransferTo = transferTo;
      this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.maturityOptionAccount)
        .setValidators([Validators.required]);
      this.showMaturityAccount = true;
    } else {
      this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.maturityOptionAccount)
        .setValidators(null);
    }
    this.openAccountFormGroup.updateValueAndValidity();
  }

  /**
   * @methodName accountDurationDisplayFn
   * @parameter accountDuration<string>
   * @description used to display account duration with Month
   * @return string
   */
  accountDurationDisplayFn(accountDuration: string): string {
    return accountDuration ? `${accountDuration} ${TIME_DEPOSIT_ACCOUNT_DURATION_MONTH}` : accountDuration;
  }

  /**
   * @methodName calculateDebitAmount
   * @parameter none
   * @description used to calculate the debit amount
   * @return none
   */
  calculateDebitAmount(): void {
    let AMOUNT = this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.depositAmount).value;
    AMOUNT = Number(this.sharedService.removeCommaFromString(AMOUNT));
    const DEBIT_AMOUNT = this.openAccountService.getDebitAmount(AMOUNT, Number(this.transferRateForCalculation));
    if (DEBIT_AMOUNT) {
      this.openAccountService.timeDepositDebitAmount = {} as DebitAccount;
      this.openAccountService.timeDepositDebitAmount.accountNumber = this.openAccountService.selectedSourceAccount.accountNumber;
      this.openAccountService.timeDepositDebitAmount.amount = DEBIT_AMOUNT;
      this.openAccountService.timeDepositDebitAmount.currencyCode = this.sourceAccountCurrency;
    }
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
   * @methodName onChangeProfitCreditOption
   * @parameter transferTo<string>
   * @description used to get the exchange rate
   * @return none
   */
  onChangeProfitCreditOption(transferTo: TransferTo): void {
    this.showProfitCreditAccount = false;
    this.openAccountService.selectedProfitCreditTransferTo = {} as TransferTo;
    if (transferTo && transferTo.id === TIME_DEPOSIT_ACCOUNT_TEXT.Transfer) {
      this.openAccountService.selectedProfitCreditTransferTo = transferTo;
      this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.profitCreditOptionAccount)
        .setValidators([Validators.required]);
      this.showProfitCreditAccount = true;
    } else {
      this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.profitCreditOptionAccount)
        .setValidators(null);
    }
    this.openAccountFormGroup.updateValueAndValidity();
  }

  /**
   * @methodName showOpenAccountFormComponent
   * @parameter boolean
   * @description used to toggle the form component
   * @return none
   */
  showOpenAccountFormComponent(isBackBtnClicked: boolean): void {
    isBackBtnClicked ? this.cancelOpeningAccountProcess() : (this.showComponent = INVESMENT_DEPOSIT_ACCOUNT_COMPONENT,
      this.preSelectedCurrency = this.openAccountService.timeDepositSummaryDetails.accountCurrency);
  }

  /**
   * @methodName validateAccountBalance
   * @parameter none
   * @description used to validate the account balance
   * @return none
   */
  validateAccountBalance(): void {
    const selectAccountOption = this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.transferFromAccount);
    if (this.openAccountService.selectedSourceAccount &&
      Number(this.openAccountService.timeDepositDebitAmount.amount) >
      Number(this.openAccountService.selectedSourceAccount.balanceAvailable)) {
      selectAccountOption.setErrors({ openAccountBalanceError: { message: undefined } });
    } else if (this.openAccountFormGroup.get(TIME_DEPOSIT_ACCOUNT_TEXT.depositAmount).value) {
      selectAccountOption.setErrors(null);
    }
  }

  /**
   * @methodName transferToDisplayFn
   * @parameter option<string>
   * @description used to display account duration with Month
   * @return string
   */
  transferToDisplayFn(option): string {
    return option ? option.value : option;
  }
}
