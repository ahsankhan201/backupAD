import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SharedService } from 'src/app/common/services/shared.service';
import { PaymentService } from 'src/app/common/services/payment/payment.service';

import { PaymentTransferDetails } from 'src/app/common/models/payment.model';
import {
  DOMAINS, PAYMENT_TYPES, PAYMENT_SCREEN_TEXT, PAYMENT_AMOUNT_SELECTION,
  ALLOWED_PAYEES_FOR_FULLORMORE_PAYMENT, ARABIC_LANG_TEXT
} from 'src/app/common/global-constants';
import { DONATION_MEMO_MAX_LENGTH, FORM_LENGTHS } from 'src/app/common/global-constants';
import { UTILITY_PAYMENT_ENDPOINTS } from 'src/app/common/api-endpoints';
import { PaymentAmountSelectionModel } from 'src/app/common/models/global.model';

@Component({
  selector: 'app-transfer-details',
  templateUrl: './transfer-details.component.html',
  styleUrls: ['./transfer-details.component.scss']
})
export class TransferDetailsComponent implements OnInit, OnDestroy {
  @Input() isPaymentToCoverCard: boolean;
  selectPaymentAmountsList: PaymentAmountSelectionModel[] = PAYMENT_AMOUNT_SELECTION;
  transferDetails = {} as PaymentTransferDetails;
  outStandingBalance: string;
  subscription$ = new Subscription();
  paymentTransferGroup: FormGroup;
  transferDetailsScreenText = PAYMENT_SCREEN_TEXT;
  amountEditable = true;
  memoMaxlength = this.transferDetailsScreenText.MEMO_MAX_LENGTH;
  showOutStandingBalError: boolean;
  disablePayMinimumAmt = true;
  AMOUNT_LENGTH = FORM_LENGTHS.FORM_LENGTH_TWENTYONE;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(
    private sharedService: SharedService,
    private paymentService: PaymentService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getSelectedLanguage();
    this.getTransferDetails();
    this.createPaymentTransferForm();
    this.handleDonationPaymentAndOutStandingBalanceReq();
    this.disablePayMinimumCheckbox();
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
   * @methodName getTransferDetails
   * @parameter none
   * @description used to get the transfer details on account/card selection changes
   * @return none
   */
  getTransferDetails(): void {
    this.subscription$.add(this.paymentService.getPaymentTransferDetails().subscribe((transferDetails: PaymentTransferDetails) => {
      if (transferDetails) {
        this.transferDetails = transferDetails;
      }
    }));
  }

  /**
   * @methodName makeOutStandingBalanceReq
   * @parameter none
   * @description used to make the outstanding balance request
   * @return none
   */
  makeOutStandingBalanceReq(): void {
    this.subscription$.add(this.paymentService.getOutStandingBalanceSubject().subscribe((response) => {
      if (response) {
        this.paymentTransferGroup.reset();
        if (this.paymentService.isPayeeSelectedForPayment &&
          this.paymentService.selectedPaymentType === PAYMENT_TYPES.utilityPayment) {
          this.getOutStandingBalance();
          this.paymentService.setOutStandingBalanceSubject(undefined);
        } else if (this.paymentService.isCoverCardSelectedForPayment &&
          this.paymentService.selectedPaymentType === PAYMENT_TYPES.ccPayment) {
          this.outStandingBalance = this.paymentService.selectedCoverCardObj.dueBalance;
        }
      }
    }));
  }

  /**
   * @methodName getOutStandingBalance
   * @parameter none
   * @description used to fetch the outstanding balnce from server
   * @return none
   */
  getOutStandingBalance(): void {
    const INQUIRY_END_POINT = `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)}${UTILITY_PAYMENT_ENDPOINTS.INQUIRY}`;
    this.subscription$.add(this.paymentService.fetchUtilityOutStandingBalance(INQUIRY_END_POINT,
      this.paymentService.setUtilityInquiryPayLoad(this.paymentService.selectedPayeeObj)).subscribe(outStandingBalanceRes => {
        if (outStandingBalanceRes) {
          this.outStandingBalance = outStandingBalanceRes.outstandingAmount;
          this.paymentService.utilityPayeeOutStandingBalance = outStandingBalanceRes;
          this.showOutStandingBalError = false;
          if (Number(this.outStandingBalance) > PAYMENT_SCREEN_TEXT.ZERO) {
            this.checkOutStandingBalValidation();
          }
        }
      }));
  }

  /**
   * @methodName createPaymentTransferForm
   * @parameter none
   * @description used to create the payee form group
   * @return none
   */
  createPaymentTransferForm(): void {
    this.paymentTransferGroup = this.formBuilder.group({
      amount: ['', [Validators.required]],
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
   * @methodName setPaymentSummaryDetails
   * @parameter none
   * @description used to set the payment summary screen details
   * @return none
   */
  setPaymentSummaryDetails(): void {
    this.paymentService.utilityPaymentPayLoad.optionalMemo = this.paymentTransferGroup.get(PAYMENT_SCREEN_TEXT.MEMO) &&
      this.paymentTransferGroup.get(PAYMENT_SCREEN_TEXT.MEMO).value ? this.paymentTransferGroup.get(PAYMENT_SCREEN_TEXT.MEMO).value : '';
    this.paymentService.utilityPaymentPayLoad.amount = this.paymentTransferGroup.get(PAYMENT_SCREEN_TEXT.AMOUNT) &&
      this.paymentTransferGroup.get(PAYMENT_SCREEN_TEXT.AMOUNT).value ?
      this.paymentTransferGroup.get(PAYMENT_SCREEN_TEXT.AMOUNT).value : '';
    if (this.paymentService.selectedPaymentType === PAYMENT_TYPES.utilityPayment) {
      this.paymentService.generateSummaryScreenDetails(PAYMENT_TYPES.utilityPayment);
    } else if (this.paymentService.isPaymentTypeDonation()) {
      this.paymentService.generateSummaryScreenDetails(PAYMENT_TYPES.donate);
    } else if (this.paymentService.selectedPaymentType === PAYMENT_TYPES.ccPayment) {
      this.paymentService.coverCardPaymentPayLoad.optionalMemo = this.paymentService.utilityPaymentPayLoad.optionalMemo;
      this.paymentService.coverCardPaymentPayLoad.amount = this.paymentService.utilityPaymentPayLoad.amount;
      this.paymentService.generateSummaryScreenDetails(PAYMENT_TYPES.ccPayment);
    }
  }

  /**
   * @methodName disablePayMinimumCheckbox
   * @parameter none
   * @description used to disable enable pay min based on the value
   * @return none
   */
  disablePayMinimumCheckbox(): void {
    if (this.paymentService.selectedCoverCardObj.minimumDueBalance) {
      const minimumDueAmt = Number(this.paymentService.selectedCoverCardObj.minimumDueBalance);
      this.disablePayMinimumAmt = minimumDueAmt > PAYMENT_SCREEN_TEXT.ZERO ? false : true;
    }
  }

  /**
   * @methodName selectedPaymentAmount
   * @parameter selectedPaymentOption<string>
   * @description used to set the value of amount based on selected payment option
   * @return none
   */
  selectedPaymentAmount(selectedPaymentOption: string): void {
    if (selectedPaymentOption === this.transferDetailsScreenText.minimumAmount &&
      this.paymentService.selectedCoverCardObj.minimumDueBalance) {
      this.paymentTransferGroup.controls.amount.setValue(this.paymentService.selectedCoverCardObj.minimumDueBalance);
      this.amountEditable = false;
    } else if (selectedPaymentOption === this.transferDetailsScreenText.fullAmount && this.paymentService.selectedCoverCardObj.dueBalance) {
      this.paymentTransferGroup.controls.amount.setValue(this.paymentService.selectedCoverCardObj.dueBalance);
      this.amountEditable = false;
    } else {
      this.paymentTransferGroup.controls.amount.setValue('');
      this.amountEditable = true;
    }
  }
  /**
   * @methodName validateAmount
   * @parameter none
   * @description used to validate the amount field
   * @return none
   */
  validateAmount(): void {
    let amountValue = this.paymentTransferGroup.get(PAYMENT_SCREEN_TEXT.AMOUNT).value;
    amountValue = amountValue ? this.sharedService.removeCommaFromString(amountValue) : amountValue;
    if (!amountValue ||
      Number(amountValue) === PAYMENT_SCREEN_TEXT.ZERO) {
      this.paymentTransferGroup.controls.amount.setErrors({ minAmount: { message: PAYMENT_SCREEN_TEXT.minAmountError } });
    } else if (this.paymentService.isPayeeSelectedForPayment &&
      this.paymentService.selectedPaymentType === PAYMENT_TYPES.utilityPayment &&
      Number(this.outStandingBalance) > PAYMENT_SCREEN_TEXT.ZERO) {
      this.checkFullPaymentAmount(amountValue);
    }
    this.validateAvailableBalance(amountValue);
  }

  /**
   * @methodName checkFullPaymentAmount
   * @parameter amountValue
   * @description set the error to amount filed if user not making full payment for particular payees
   * @return none
   */
  checkFullPaymentAmount(amountValue?: string): void {
    if (this.paymentService.selectedPayeeObj &&
      ALLOWED_PAYEES_FOR_FULLORMORE_PAYMENT.includes(this.paymentService.selectedPayeeObj.utilityProviderProductId) &&
      amountValue && Number(amountValue) < Number(this.outStandingBalance)) {
      // set the error for amount in case of partial payment for ['AADC', 'ADDC', 'SEWA']
      this.paymentTransferGroup.controls.amount.setErrors({ minAmount: { message: PAYMENT_SCREEN_TEXT.payFullAmountErrorText } });
    }
  }
  /**
   * @methodName handleDonationPaymentAndOutStandingBalanceReq
   * @parameter none
   * @description used to handle donation payment related logic and OutStandingBalanceReq
   * @return none
   */
  handleDonationPaymentAndOutStandingBalanceReq(): void {
    (this.paymentService.isPaymentTypeDonation()) ?
      this.memoMaxlength = DONATION_MEMO_MAX_LENGTH : this.makeOutStandingBalanceReq();
    this.paymentTransferGroup.updateValueAndValidity();
  }
  /**
   * @methodName checkOutStandingBalValidation
   * @parameter none
   * @description It'll validate the outstanding balance against the available balance
   * @return none
   */
  checkOutStandingBalValidation(): void {
    if (this.paymentService.selectedPayeeObj && this.paymentService.selectedPayeeObj.utilityProviderProductId &&
      ALLOWED_PAYEES_FOR_FULLORMORE_PAYMENT.includes(this.paymentService.selectedPayeeObj.utilityProviderProductId) &&
      Number(this.transferDetails.availableAmount) < Number(this.outStandingBalance)) {
      this.showOutStandingBalError = true;
    }
  }

  /**
   * @methodName validateAvailableBalance
   * @parameter none
   * @description set the error to amount filed if user entered amount is more than AvailableBalance
   * @return none
   */
  validateAvailableBalance(amountValue?: string): void {
    if (Number(amountValue) > Number(this.transferDetails.availableAmount)) {
      this.paymentTransferGroup.controls.amount.setErrors({ notValidAmount: { message: PAYMENT_SCREEN_TEXT.validAmountError } });
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
