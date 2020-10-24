import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { SharedService } from 'src/app/common/services/shared.service';
import { MoneyTransferService } from 'src/app/common/services/money-transfer/money-transfer.service';

import {
  PAYMENT_SCREEN_TEXT, INTERNATIONAL_TRANSFER_TEXT,
  INSIDE_UAE_TRANSFER_TEXT, ARABIC_LANG_TEXT
} from 'src/app/common/global-constants';
import { TRANSFER_TYPES, FORM_LENGTHS } from 'src/app/common/global-constants';
import { TransferPurposeModel, DebitORCreditAccount } from 'src/app/common/models/money-transfer.model';

@Component({
  selector: 'app-international-transfer',
  templateUrl: './international-transfer-form.component.html',
  styleUrls: ['./international-transfer-form.component.scss']
})
export class InternationalTransferFormComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  internationalTransferFormGroup: FormGroup;
  transferDetailsScreenText = PAYMENT_SCREEN_TEXT;
  transferRate: string;
  transferRateForCalculation: number;
  transferPurposeList = [] as TransferPurposeModel[];
  selectedAccountCurrency: string;
  beneficiaryCurrency: string;
  availableBalance: string;
  memoMaxlength = PAYMENT_SCREEN_TEXT.MEMO_MAX_LENGTH;
  showCrossCurrencyFields = true;
  debitAccountCurrency: string;
  creditAccountCurrency: string;
  isBeneficiaryWithinUae = false;
  showCrossCurrencyNote = true;
  AMOUNT_LENGTH = FORM_LENGTHS.FORM_LENGTH_SIXTEEN;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private moneyTransferService: MoneyTransferService) {
  }

  ngOnInit() {
    this.getSelectedLanguage();
    this.setComponentInitialData();
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
   * @methodName setComponentInitialData
   * @parameter none
   * @description used to set the component initial data
   * @return none
   */
  setComponentInitialData(): void {
    this.createInternationalTransferForm();
    this.fetchTransferPurposeLst();
    this.fetchExchangeRate();
    this.subscription$.add(this.moneyTransferService.getInternationalMoneyTransferDetailsSubject()
      .subscribe((loadFormComponent: boolean) => {
        if (loadFormComponent && this.moneyTransferService.selectedBeneficiaryForTransfer &&
          this.moneyTransferService.selectedBeneficiaryForTransfer.beneType === INTERNATIONAL_TRANSFER_TEXT.external
        ) {
          this.fetchExchangeRate();
          this.fetchTransferPurposeLst();
        }
        this.handleCrossCurrencyWithinUAE();
      }));
  }

  /**
   * @methodName createInternationalTransferForm
   * @parameter none
   * @description used to create the international transfer form group
   * @return none
   */
  createInternationalTransferForm(): void {
    this.internationalTransferFormGroup = this.formBuilder.group({
      localAmount: ['', [Validators.required]],
      internationalAmount: ['', [Validators.required]],
      remittanceDetails: [''],
      purposeOfTransfer: ['', [Validators.required]],
      memo: ['']
    });
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
   * @methodName calcCurrencyConversion
   * @parameter amount<string>,valueType<string>
   * @description used to calculate the transfer amount in beneficiary currency
   * @return none
   */
  calcCurrencyConversion(amount: string, valueType?: string): void {
    if (amount) {
      amount = this.sharedService.removeCommaFromString(amount);
      if (valueType === INTERNATIONAL_TRANSFER_TEXT.external) {
        this.internationalTransferFormGroup.get(INTERNATIONAL_TRANSFER_TEXT.localAmount)
          .setValue(this.sharedService.trimNumberWithoutRounding(Number(amount) / this.transferRateForCalculation,
            INTERNATIONAL_TRANSFER_TEXT.FIXED_AMOUNT_DECIMAL));
      } else {
        this.internationalTransferFormGroup.get(INTERNATIONAL_TRANSFER_TEXT.internationalAmount)
          .setValue(this.sharedService.trimNumberWithoutRounding(Number(amount) * this.transferRateForCalculation,
            INTERNATIONAL_TRANSFER_TEXT.FIXED_AMOUNT_DECIMAL));
      }
    } else {
      this.internationalTransferFormGroup.get(INTERNATIONAL_TRANSFER_TEXT.localAmount).reset();
      this.internationalTransferFormGroup.get(INTERNATIONAL_TRANSFER_TEXT.internationalAmount).reset();
    }
  }

  /**
   * @methodName fetchExchangeRate
   * @parameter none
   * @description used to fetch the exchange rate from the servcer
   * @return none
   */
  fetchExchangeRate(): void {
    if (this.moneyTransferService.selectedTransferFromAccount) {
      const requestPayLoad = this.moneyTransferService.generateExchangeRateRequestPayLoad(INTERNATIONAL_TRANSFER_TEXT.TRANSFER_TYPE);
      this.selectedAccountCurrency = requestPayLoad.transferAccountCurrencyCode;
      this.beneficiaryCurrency = requestPayLoad.creditAcctNumberCurrencyCode;
      this.availableBalance = this.moneyTransferService.selectedTransferFromAccount.balanceAvailable;
      this.subscription$.add(this.moneyTransferService.getExchangeRate(requestPayLoad).subscribe(response => {
        if (response && response.rate) {
          this.transferRate = this.sharedService.trimNumberWithoutRounding(Number(response.rate),
            INTERNATIONAL_TRANSFER_TEXT.EXCHANGE_RATE_DECIMAL_LIMIT);
          this.moneyTransferService.exchangeRateResponse = response;
          this.transferRateForCalculation = Number(response.rate);
        }
      }));
    }
  }

  /**
   * @methodName fetchTransferPurposeLst
   * @parameter none
   * @description used to fetch the purpose of transfer list from the server
   * @return none
   */
  fetchTransferPurposeLst(): void {
    this.subscription$.add(this.moneyTransferService.getTransferPurpose().subscribe(response => {
      this.transferPurposeList = response['purposeOfTransferList'];
    }));
  }

  /**
   * @methodName setInternationalTransferSummaryDetails
   * @parameter none
   * @description used to set the form data to the request payload
   * @return none
   */
  setInternationalTransferSummaryDetails(): void {
    this.moneyTransferService.internationalTransferRequestPayLoad.debitAccount = {} as DebitORCreditAccount;
    this.moneyTransferService.internationalTransferRequestPayLoad.creditAccount = {} as DebitORCreditAccount;
    this.moneyTransferService.internationalTransferRequestPayLoad.additionalRemittanceDetails =
      this.internationalTransferFormGroup.get(INTERNATIONAL_TRANSFER_TEXT.remittanceDetails).value;
    this.moneyTransferService.internationalTransferRequestPayLoad.optionalMemo =
      this.internationalTransferFormGroup.get(INTERNATIONAL_TRANSFER_TEXT.memo).value;
    this.moneyTransferService.internationalTransferRequestPayLoad.transferPurpose =
      this.internationalTransferFormGroup.get(INTERNATIONAL_TRANSFER_TEXT.purposeOfTransfer).value;
    if (this.moneyTransferService.isCrossCurrencyTransaction) {
      this.moneyTransferService.internationalTransferRequestPayLoad.debitAccount.amount =
        this.internationalTransferFormGroup.get(INTERNATIONAL_TRANSFER_TEXT.localAmount).value;
      this.moneyTransferService.internationalTransferRequestPayLoad.creditAccount.amount =
        this.internationalTransferFormGroup.get(INTERNATIONAL_TRANSFER_TEXT.internationalAmount).value;
    } else {
      this.moneyTransferService.internationalTransferRequestPayLoad.debitAccount.amount =
        this.internationalTransferFormGroup.get(INSIDE_UAE_TRANSFER_TEXT.AMOUNT).value;
      this.moneyTransferService.internationalTransferRequestPayLoad.creditAccount.amount =
        this.internationalTransferFormGroup.get(INSIDE_UAE_TRANSFER_TEXT.AMOUNT).value;

    }

    this.moneyTransferService.showInternationalSummaryScreenInfo(true);
    this.setAccountDetails();
  }

  /**
   * @methodName onPurposeOfTransferChange
   * @parameter selectedOption
   * @description used to set the transfer purpose id to the request payLoad
   * @return none
   */
  onPurposeOfTransferChange(selectedOption: string): void {
    this.moneyTransferService.internationalTransferRequestPayLoad.stpTypeCode = selectedOption;
  }

  /**
   * @methodName setAccountDetails
   * @parameter none
   * @description used to set the account details for the post request
   * @return none
   */
  setAccountDetails(): void {
    // Account holder details
    this.moneyTransferService.internationalTransferRequestPayLoad.debitAccount.currencyCode =
      this.moneyTransferService.selectedTransferFromAccount.currencyCode;
    this.moneyTransferService.internationalTransferRequestPayLoad.debitAccount.accountNumber =
      this.moneyTransferService.selectedTransferFromAccount.accountNumber;
    this.moneyTransferService.internationalTransferRequestPayLoad.debitAccount.description = '';
    this.moneyTransferService.internationalTransferRequestPayLoad.debitAccount.force = '';

    // Beneficiary details
    this.moneyTransferService.internationalTransferRequestPayLoad.creditAccount.currencyCode =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneAccCurr;
    this.moneyTransferService.internationalTransferRequestPayLoad.creditAccount.accountNumber =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneAccNo;
    this.moneyTransferService.internationalTransferRequestPayLoad.creditAccount.description = '';
    this.moneyTransferService.internationalTransferRequestPayLoad.creditAccount.force = '';

    this.moneyTransferService.internationalTransferRequestPayLoad.debitRates = this.moneyTransferService.exchangeRateResponse.debitRates;
    this.moneyTransferService.internationalTransferRequestPayLoad.creditRates = this.moneyTransferService.exchangeRateResponse.creditRates;
  }

  /**
   * @methodName validateAmount
   * @parameter none
   * @description used to validate the amount field for international transfer
   * @return none
   */
  validateAmount(): void {
    if (!this.moneyTransferService.isCrossCurrencyTransaction && !this.showCrossCurrencyFields) {
      let localAmountValue = this.internationalTransferFormGroup.get(INSIDE_UAE_TRANSFER_TEXT.AMOUNT).value;
      localAmountValue = localAmountValue ? this.sharedService.removeCommaFromString(localAmountValue) : localAmountValue;
      if (!localAmountValue ||
        Number(localAmountValue <
          INTERNATIONAL_TRANSFER_TEXT.minimumTransferAmount)) {
        this.internationalTransferFormGroup.get(INSIDE_UAE_TRANSFER_TEXT.AMOUNT).setErrors(
          { minAmount: { message: INTERNATIONAL_TRANSFER_TEXT.minimumAmountError } });
      } else if (localAmountValue > Number(this.availableBalance)) {
        this.internationalTransferFormGroup.get(INSIDE_UAE_TRANSFER_TEXT.AMOUNT).setErrors(
          { notValidAmount: { message: INTERNATIONAL_TRANSFER_TEXT.insufficientBalanceError } });
      }
    } else {
      let amountValue = this.internationalTransferFormGroup.get(INTERNATIONAL_TRANSFER_TEXT.localAmount).value;
      amountValue = amountValue ? this.sharedService.removeCommaFromString(amountValue) : amountValue;
      if (!amountValue ||
        Number(amountValue <
          INTERNATIONAL_TRANSFER_TEXT.minimumTransferAmount)) {
        this.internationalTransferFormGroup.controls.localAmount.setErrors(
          { minAmount: { message: INTERNATIONAL_TRANSFER_TEXT.minimumAmountError } });
      } else if (amountValue > Number(this.availableBalance)) {
        this.internationalTransferFormGroup.controls.localAmount.setErrors(
          { notValidAmount: { message: INTERNATIONAL_TRANSFER_TEXT.insufficientBalanceError } });
      }
    }
  }

  /**
   * @methodName handleCrossCurrencyWithinUAE
   * @parameter none
   * @description used to set cross currency logic within UAE
   * @return none
   */
  handleCrossCurrencyWithinUAE(): void {
    this.showCrossCurrencyNote = true;
    this.moneyTransferService.isSameCurrencyTransaction = false;
    if (this.moneyTransferService.isBeneficiaryOutsideAdibUAE()) {
      this.isBeneficiaryWithinUae = true;
      this.showCrossCurrencyNote = true;
      this.createInternationalTransferForm();
      this.moneyTransferService.isCrossCurrencyTransaction = true;
      this.showCrossCurrencyFields = true;
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
      if (this.debitAccountCurrency === this.creditAccountCurrency) {
        this.moneyTransferService.isSameCurrencyTransaction = true;
        this.handleSameCurrencyTransfer();
        this.showCrossCurrencyFields = this.showCrossCurrencyNote = false;
        this.moneyTransferService.isCrossCurrencyTransaction = false;
      }
    }
  }

  /**
   * @methodName handleSameCurrencyTransfer
   * @parameter none
   * @description used to set non cross currency form
   * @return none
   */
  handleSameCurrencyTransfer(): void {
    if (this.internationalTransferFormGroup) {
      this.internationalTransferFormGroup.removeControl('localAmount');
      this.internationalTransferFormGroup.removeControl('internationalAmount');
      this.internationalTransferFormGroup.addControl(INSIDE_UAE_TRANSFER_TEXT.AMOUNT, new FormControl('', [Validators.required]));
      this.internationalTransferFormGroup.updateValueAndValidity();
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
