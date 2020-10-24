import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MoneyTransferService } from 'src/app/common/services/money-transfer/money-transfer.service';
import { SharedService } from 'src/app/common/services/shared.service';

import {
  PAYMENT_SCREEN_TEXT, FORM_LENGTHS, TRANSFER_TYPES,
  INTERNATIONAL_TRANSFER_TEXT, PAYMENT_AMOUNT_SELECTION, INSIDE_UAE_TRANSFER_TEXT, ARABIC_LANG_TEXT
} from 'src/app/common/global-constants';
import { MoneyTransferDetails, DebitORCreditAccount } from 'src/app/common/models/money-transfer.model';
import { PaymentAmountSelectionModel } from 'src/app/common/models/global.model';

@Component({
  selector: 'app-money-transfer-details-step',
  templateUrl: './money-transfer-details-step.component.html',
  styleUrls: ['./money-transfer-details-step.component.scss']
})
export class MoneyTransferDetailsStepComponent implements OnInit, OnDestroy {
  showInternationalTransferForm: boolean;
  subscription$ = new Subscription();
  selectPaymentAmountsList: PaymentAmountSelectionModel[] = PAYMENT_AMOUNT_SELECTION;
  transferDetails = {} as MoneyTransferDetails;
  moneyTransferGroup: FormGroup;
  transferDetailsScreenText = PAYMENT_SCREEN_TEXT;
  memoMaxlength = this.transferDetailsScreenText.MEMO_MAX_LENGTH;
  AMOUNT_LENGTH = FORM_LENGTHS.FORM_LENGTH_SIXTEEN;
  showComponent: string;
  disablePayMinimumAmt = true;
  isTransferToAdibCard: boolean;
  amountEditable = true;
  outStandingBalance: string;
  showCrossCurrencyFields = false;
  debitAccountCurrency: string;
  creditAccountCurrency: string;
  transferRate: string;
  transferRateForCalculation: number;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private moneyTransferService: MoneyTransferService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) { }
  ngOnInit() {
    this.getSelectedLanguage();
    this.setInternationalTransferInfo();
    this.getMoneyTransferDetails();
    this.createMoneyTransferForm();
    this.setTransferDetails();
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
   * @methodName getMoneyTransferDetails
   * @parameter none
   * @description used to get the money transfer details on account/card selection changes
   * @return none
   */
  getMoneyTransferDetails(): void {
    this.subscription$.add(this.moneyTransferService.getMoneyTransferDetails().subscribe((transferDetails: MoneyTransferDetails) => {
      if (transferDetails) {
        this.transferDetails = transferDetails;
        this.createMoneyTransferForm();
        // reset the subject details
      }
    }));
  }

  /**
   * @methodName setInternationalTransferInfo
   * @parameter none
   * @description used to get the money transfer details on account/card selection changes
   * @return none
   */
  setInternationalTransferInfo() {
    this.subscription$.add(this.moneyTransferService.getInternationalMoneyTransferDetailsSubject()
      .subscribe((loadFormComponent: boolean) => {
        if (loadFormComponent) {
          if (this.moneyTransferService.selectedBeneficiaryForTransfer &&
            this.moneyTransferService.selectedBeneficiaryForTransfer.beneType === INTERNATIONAL_TRANSFER_TEXT.external &&
            this.moneyTransferService.selectedBeneficiaryForTransfer.beneExtAccType !== INSIDE_UAE_TRANSFER_TEXT.creditCardText
          ) {
            this.showComponent = undefined;
            this.showInternationalTransferForm = true;
            this.moneyTransferService.isCrossCurrencyTransaction = true;
          } else {
            this.showInternationalTransferForm = false;
            this.moneyTransferService.isCrossCurrencyTransaction = false;
          }
          this.handleCrossCurrency();
          // resetting the subject details to avoid data confliction in next load of this component
          this.moneyTransferService.setInternationalMoneyTransferDetailsSubject(undefined);
        }
      }));
  }

  /**
   * @methodName setTransferDetails
   * @parameter none
   * @description used to set transfer details for various transfers
   * @return none
   */
  setTransferDetails() {
    this.subscription$.add(this.moneyTransferService.showTransferToDetailsAndSummary.subscribe((value: string) => {
      if (value === TRANSFER_TYPES.transferToAdibCard) {
        this.isTransferToAdibCard = true;
        this.disablePayMinimumCheckbox();
      } else {
        this.isTransferToAdibCard = false;
      }
    }));
  }

  /**
   * @methodName createMoneyTransferForm
   * @parameter none
   * @description used to create the money transfer form group
   * @return none
   */
  createMoneyTransferForm(): void {
    this.moneyTransferGroup = this.formBuilder.group({
      amount: ['', [Validators.required]],
      memo: ['']
    });
  }

  /**
   * @methodName setMoneyTransferSummary
   * @parameter none
   * @description used to set the money transfer summary screen details
   * @return none
   */
  setMoneyTransferSummary(): void {
    if (this.moneyTransferService.selectedTransferType === TRANSFER_TYPES.transferToAdibCard &&
      this.moneyTransferService.selectedTransferToCard) {
      this.moneyTransferService.transferToAdibCardPayLoad.optionalMemo = this.moneyTransferGroup.get(PAYMENT_SCREEN_TEXT.MEMO) &&
        this.moneyTransferGroup.get(PAYMENT_SCREEN_TEXT.MEMO).value ?
        this.moneyTransferGroup.get(PAYMENT_SCREEN_TEXT.MEMO).value : undefined;
      this.moneyTransferService.transferToAdibCardPayLoad.amount = this.moneyTransferGroup.get(PAYMENT_SCREEN_TEXT.AMOUNT).value ?
        this.sharedService.removeCommaFromString(this.moneyTransferGroup.get(PAYMENT_SCREEN_TEXT.AMOUNT).value) :
        this.moneyTransferGroup.get(PAYMENT_SCREEN_TEXT.AMOUNT).value;
      this.moneyTransferService.generateSummaryScreenDetails(TRANSFER_TYPES.transferToAdibCard);
    } else if (this.moneyTransferService.selectedTransferType === TRANSFER_TYPES.transferToAdibAccount) {
      this.setToAccountSummary();
    } else if (this.moneyTransferService.selectedTransferType === TRANSFER_TYPES.transferToBeneficiary) {
      if (this.moneyTransferGroup.value && this.moneyTransferGroup.value.amount) {
        this.moneyTransferGroup.value.amount = this.sharedService.removeCommaFromString(this.moneyTransferGroup.value.amount);
      }
      this.moneyTransferService.insideUaeTransferFormData = this.moneyTransferGroup.value;
      this.setInsideUaeMoneyTransferSummary();
    }
  }

  /**
   * @methodName setToAccountSummary
   * @parameter none
   * @description used to set the money transfer summary screen details for accounts
   * @return none
   */
  setToAccountSummary() {
    this.moneyTransferService.transferToAcountPayLoad.debitAccount = {} as DebitORCreditAccount;
    this.moneyTransferService.transferToAcountPayLoad.creditAccount = {} as DebitORCreditAccount;

    this.moneyTransferService.transferToAcountPayLoad.optionalMemo = this.moneyTransferGroup.get(PAYMENT_SCREEN_TEXT.MEMO) &&
      this.moneyTransferGroup.get(PAYMENT_SCREEN_TEXT.MEMO).value ?
      this.moneyTransferGroup.get(PAYMENT_SCREEN_TEXT.MEMO).value : undefined;
    if (this.moneyTransferService.isCrossCurrencyTransaction) {
      this.moneyTransferService.transferToAcountPayLoad.debitAccount.amount =
        this.moneyTransferGroup.get(INSIDE_UAE_TRANSFER_TEXT.DEBIT_AMOUNT).value ?
          this.sharedService.removeCommaFromString(this.moneyTransferGroup.get(INSIDE_UAE_TRANSFER_TEXT.DEBIT_AMOUNT).value) :
          this.moneyTransferGroup.get(INSIDE_UAE_TRANSFER_TEXT.DEBIT_AMOUNT).value;
      this.moneyTransferService.transferToAcountPayLoad.creditAccount.amount =
        this.moneyTransferGroup.get(INSIDE_UAE_TRANSFER_TEXT.CREDIT_AMOUNT).value ?
          this.sharedService.removeCommaFromString(this.moneyTransferGroup.get(INSIDE_UAE_TRANSFER_TEXT.CREDIT_AMOUNT).value) :
          this.moneyTransferGroup.get(INSIDE_UAE_TRANSFER_TEXT.CREDIT_AMOUNT).value;
    } else {
      this.moneyTransferService.transferToAcountPayLoad.amount = this.moneyTransferGroup.get(PAYMENT_SCREEN_TEXT.AMOUNT).value ?
        this.sharedService.removeCommaFromString(this.moneyTransferGroup.get(PAYMENT_SCREEN_TEXT.AMOUNT).value) :
        this.moneyTransferGroup.get(PAYMENT_SCREEN_TEXT.AMOUNT).value;
    }
    this.moneyTransferService.generateSummaryScreenDetails(TRANSFER_TYPES.transferToAdibAccount);

  }
  /**
   * @methodName validateAmount
   * @parameter none
   * @description used to validate the amount field
   * @return none
   */
  validateAmount(): void {
    let AMOUNT = this.moneyTransferGroup.get(PAYMENT_SCREEN_TEXT.AMOUNT).value;
    AMOUNT = AMOUNT ? this.sharedService.removeCommaFromString(AMOUNT) : AMOUNT;
    if (!AMOUNT || Number(AMOUNT) === PAYMENT_SCREEN_TEXT.ZERO) {
      this.moneyTransferGroup.controls.amount.setErrors({ minAmount: { message: PAYMENT_SCREEN_TEXT.minAmountError } });
    } else if (this.moneyTransferService.isBeneficiaryOutsideAdibUAE()
      && Number(AMOUNT < INSIDE_UAE_TRANSFER_TEXT.minimumTransferAmountCrossCurrency)) {
      this.moneyTransferGroup.get(PAYMENT_SCREEN_TEXT.AMOUNT).setErrors(
        { minAmount: { message: INSIDE_UAE_TRANSFER_TEXT.minimumAmountErrorCrossCurrency } });
    }
    this.validateAvailableBalance(AMOUNT);
  }

  /**
   * @methodName validateAvailableBalance
   * @parameter none
   * @description set the error to amount filed if user entered amount is more than AvailableBalance
   * @return none
   */
  validateAvailableBalance(amountValue?: string): void {
    if (Number(amountValue) > Number(this.transferDetails.availableAmount)) {
      this.moneyTransferGroup.controls.amount.setErrors({ notValidAmount: { message: PAYMENT_SCREEN_TEXT.validAmountError } });
    }
  }

  /**
   * @methodName cancelTransaction
   * @parameter showCancelPopUp<boolean>
   * @description used to set the cancel transaction router link value
   * @return none
   */
  cancelTransaction(showCancelPopUp: boolean): void {
    this.sharedService.setCancelTransactionInfo(showCancelPopUp);
  }

  /**
   * @methodName disablePayMinimumCheckbox
   * @parameter none
   * @description used to disable enable pay min based on the value
   * @return none
   */
  disablePayMinimumCheckbox(): void {
    if (this.moneyTransferService.selectedTransferToCard && this.moneyTransferService.selectedTransferToCard.minimumDueBalance) {
      const minimumDueAmt = Number(this.moneyTransferService.selectedTransferToCard.minimumDueBalance);
      this.disablePayMinimumAmt = minimumDueAmt > PAYMENT_SCREEN_TEXT.ZERO ? false : true;
    }
    this.outStandingBalance = this.moneyTransferService.selectedTransferToCard.dueBalance ?
      this.moneyTransferService.selectedTransferToCard.dueBalance : undefined;
  }

  /**
   * @methodName selectedPaymentAmount
   * @parameter selectedPaymentOption<string>
   * @description used to set the value of amount based on selected payment option
   * @return none
   */
  selectedPaymentAmount(selectedPaymentOption: string): void {
    if (selectedPaymentOption === this.transferDetailsScreenText.minimumAmount &&
      this.moneyTransferService.selectedTransferToCard.minimumDueBalance) {
      this.moneyTransferGroup.controls.amount.setValue(this.moneyTransferService.selectedTransferToCard.minimumDueBalance);
      this.amountEditable = false;
    } else if (selectedPaymentOption === this.transferDetailsScreenText.fullAmount &&
      this.moneyTransferService.selectedTransferToCard.dueBalance) {
      this.moneyTransferGroup.controls.amount.setValue(this.moneyTransferService.selectedTransferToCard.dueBalance);
      this.amountEditable = false;
    } else {
      this.moneyTransferGroup.controls.amount.setValue('');
      this.amountEditable = true;
    }
  }

  /**
   * @methodName setInsideUaeMoneyTransferSummary
   * @parameter none
   * @description used to set inside UAE money transfer summary screen details
   * @return none
   */
  setInsideUaeMoneyTransferSummary(): void {
    this.moneyTransferService.insideUaeTransferFormData = {};
    this.moneyTransferService.insideUaeTransferFormData = this.moneyTransferGroup.value;
    this.moneyTransferService.generateSummaryScreenDetails(TRANSFER_TYPES.transferToBeneficiary);
  }

  /**
   * @methodName handleCrossCurrency
   * @parameter none
   * @description used to set cross currency logic
   * @return none
   */
  handleCrossCurrency(): void {
    this.createMoneyTransferForm();
    this.showCrossCurrencyFields = false;
    if (!this.moneyTransferService.selectedTransferToCard) {
      this.debitAccountCurrency = (this.moneyTransferService.selectedTransferFromAccount) ?
        this.moneyTransferService.selectedTransferFromAccount.currencyCode :
        this.moneyTransferService.selectedTransferFromCard.currencyCode;

      if (this.moneyTransferService.selectedTransferType === TRANSFER_TYPES.transferToAdibAccount) {
        this.creditAccountCurrency = this.moneyTransferService.selectedTransferToAccount.currencyCode;
      } else if (this.moneyTransferService.selectedTransferType === TRANSFER_TYPES.transferToBeneficiary) {
        this.creditAccountCurrency = (this.moneyTransferService.selectedBeneficiaryForTransfer) ?
          this.moneyTransferService.selectedBeneficiaryForTransfer.beneAccCurr : undefined;
      }
      // check for cross currency
      if (this.debitAccountCurrency !== this.creditAccountCurrency) {
        this.handleCrossCurrencyForm();
        this.fetchExchangeRate();
        this.showCrossCurrencyFields = true;
        this.moneyTransferService.isCrossCurrencyTransaction = true;
      }
    }

  }

  /**
   * @methodName fetchExchangeRate
   * @parameter none
   * @description used to fetch the exchange rate from the servcer
   * @return none
   */
  fetchExchangeRate(): void {
    if (this.moneyTransferService.selectedTransferFromAccount &&
      (this.moneyTransferService.selectedTransferToAccount || this.moneyTransferService.selectedBeneficiaryForTransfer)) {
      const requestPayLoad = this.moneyTransferService.generateExchangeRateRequestPayLoad();
      this.subscription$.add(this.moneyTransferService.getExchangeRate(requestPayLoad).subscribe(response => {
        if (response && response.rate) {
          this.transferRate = this.sharedService.trimNumberWithoutRounding(Number(response.rate),
            INTERNATIONAL_TRANSFER_TEXT.EXCHANGE_RATE_DECIMAL_LIMIT);
          this.moneyTransferService.exchangeRateResponse = response;
          this.transferRateForCalculation = Number(response.rate);
          this.moneyTransferService.insideUaeTransferPayLoad.debitRates = response.debitRates;
          this.moneyTransferService.insideUaeTransferPayLoad.creditRates = response.creditRates;
        }
      }));
    }
  }

  /**
   * @methodName calcCurrencyConversion
   * @parameter amount<string>,valueType<string>
   * @description used to calculate the transfer amount in beneficiary currency
   * @return none
   */
  calcCurrencyConversion(amount: string, valueType?: string): void {
    if (amount) {
      amount = this.sharedService.removeCommaFromString(amount);
      if (valueType === INSIDE_UAE_TRANSFER_TEXT.external) {
        this.moneyTransferGroup.get(INSIDE_UAE_TRANSFER_TEXT.DEBIT_AMOUNT)
          .setValue(this.sharedService.trimNumberWithoutRounding(Number(amount) / this.transferRateForCalculation,
            INSIDE_UAE_TRANSFER_TEXT.FIXED_AMOUNT_DECIMAL));
      } else {
        this.moneyTransferGroup.get(INSIDE_UAE_TRANSFER_TEXT.CREDIT_AMOUNT)
          .setValue(this.sharedService.trimNumberWithoutRounding(Number(amount) * this.transferRateForCalculation,
            INSIDE_UAE_TRANSFER_TEXT.FIXED_AMOUNT_DECIMAL));
      }
    } else {
      this.moneyTransferGroup.get(INSIDE_UAE_TRANSFER_TEXT.DEBIT_AMOUNT).reset();
      this.moneyTransferGroup.get(INSIDE_UAE_TRANSFER_TEXT.CREDIT_AMOUNT).reset();
    }
  }

  /**
   * @methodName handleCrossCurrencyForm
   * @parameter none
   * @description used to set cross currency form
   * @return none
   */
  handleCrossCurrencyForm(): void {
    if (this.moneyTransferGroup) {
      this.moneyTransferGroup.removeControl(INSIDE_UAE_TRANSFER_TEXT.AMOUNT);
      this.moneyTransferGroup.addControl(INSIDE_UAE_TRANSFER_TEXT.DEBIT_AMOUNT, new FormControl('', [Validators.required]));
      this.moneyTransferGroup.addControl(INSIDE_UAE_TRANSFER_TEXT.CREDIT_AMOUNT, new FormControl('', [Validators.required]));
      this.moneyTransferGroup.updateValueAndValidity();
    }
  }

  /**
   * @methodName validateCrossCurrencyAmount
   * @parameter none
   * @description used to validate the fromAccountcurrency field
   * @return none
   */
  validateCrossCurrencyAmount(): void {
    // validate min amount and more than availableAmount for cross currency for non adib account transfer
    const FORM_CONTROL_AMOUNT = this.moneyTransferGroup.get(INSIDE_UAE_TRANSFER_TEXT.DEBIT_AMOUNT);
    const amountValue = FORM_CONTROL_AMOUNT.value ?
      this.sharedService.removeCommaFromString(FORM_CONTROL_AMOUNT.value) : FORM_CONTROL_AMOUNT.value;
    // min amount for adib account and beneficiary transfer is 1, other 100
    if ((!this.moneyTransferService.isTransferToAdibAccount() && !this.moneyTransferService.isBeneficiaryInsideAdibUAE())
      && (!amountValue
        || Number(amountValue < INSIDE_UAE_TRANSFER_TEXT.minimumTransferAmountCrossCurrency))) {
      // handle error validaiton for min amount is less
      FORM_CONTROL_AMOUNT.setErrors(
        { minAmount: { message: INSIDE_UAE_TRANSFER_TEXT.minimumAmountErrorCrossCurrency } });
    } else if (amountValue > Number(this.transferDetails.availableAmount)) {
      // handle error validaiton for amount is greater than availableAmount
      FORM_CONTROL_AMOUNT.setErrors(
        { notValidAmount: { message: INSIDE_UAE_TRANSFER_TEXT.minimumAmountError } });
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
    this.showInternationalTransferForm = false;
    this.moneyTransferService.isCrossCurrencyTransaction = false;
  }

}
