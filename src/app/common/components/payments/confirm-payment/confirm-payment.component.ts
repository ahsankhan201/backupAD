import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { SharedService } from 'src/app/common/services/shared.service';
import { PaymentService } from 'src/app/common/services/payment/payment.service';

import { PaymentSummaryDetailsModel } from 'src/app/common/models/payment.model';
import {
  DOMAINS, PAYMENT_TYPES, HTTP_STATUS_CODE,
  PAYMENT_SUCCESS_SCREEN_TEXT, TRANSFER_RECEIPT_LABELS,
  PAYMENT_RECEIPT_LABELS, PAYMENT_RECEIPT_COPY_TRANSLATION_KEYS, ARABIC_LANG_TEXT
} from 'src/app/common/global-constants';
import { UTILITY_PAYMENT_ENDPOINTS } from 'src/app/common/api-endpoints';
import { AccountlistService } from 'src/app/modules/dashboard/services/accountlist.service';
import { CardsService } from 'src/app/modules/cards/services/cards.service';
import { ReceiptModel, ListOfReceiptFields } from 'src/app/common/models/global.model';
import { Dialog } from 'src/app/common/models/dialog.model';
import { DialogService } from 'src/app/common/services/dialog.service';
import { PAYEE_SELECTION_MASTER_DATA } from 'src/app/modules/payee/payee-module.constants';

@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.scss']
})
export class ConfirmPaymentComponent implements OnInit, OnDestroy {
  @Input() isPaymentToCoverCard: boolean;
  showSuccessScreen: boolean;
  referenceNumberForSuccessScreen: string;
  paymentSummaryDetails = {} as PaymentSummaryDetailsModel;
  confirmScreenRoutingButtonText: string;
  subscription$ = new Subscription();
  paymentType: string;
  selectedPaymentType: string;
  PAYMENT_TYPES = PAYMENT_TYPES;
  successComponentName: string;
  payAmountButtonLabel = PAYMENT_SUCCESS_SCREEN_TEXT.defaultPayAmountButtonText;
  disableConfirmBtn: boolean;
  paymentReceipt = {} as ReceiptModel;
  transctionTimeStamp: string;
  amountSendToTextForCopy: string;
  amountSendToValueForCopy: string;
  fromAccountTextForCopy: string;
  fromAccountValueForCopy: string;
  paymentAmountToTextForCopy: string;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(
    private sharedService: SharedService,
    private paymentService: PaymentService,
    private accountListService: AccountlistService,
    private cardsService: CardsService,
    private dialogService: DialogService,
    private translateService: TranslateService) {
  }

  ngOnInit() {
    this.getSelectedLanguage();
    this.getSummaryDetails();
    this.setComponentName();
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
   * @methodName getSummaryDetails
   * @parameter none
   * @description used to get the summaty details
   * @return none
   */
  getSummaryDetails(): void {
    this.subscription$.add(this.paymentService.getPaymentSummaryDetails().subscribe(response => {
      if (response) {
        this.paymentSummaryDetails = response;
        this.confirmScreenRoutingButtonText = this.paymentService.confirmScreenRoutingButtonText;
      }
    }));
  }

  /**
   * @methodName setComponentName
   * @parameter none
   * @description used to set component name for success screen
   * @return none
   */
  setComponentName(): void {
    this.selectedPaymentType = (this.paymentService.selectedPaymentType) ? this.paymentService.selectedPaymentType : undefined;
    if (this.isPaymentToCoverCard) {
      this.successComponentName = PAYMENT_SUCCESS_SCREEN_TEXT.COVER_CARD_PAYMENT;
    } else if (this.selectedPaymentType === PAYMENT_TYPES.donate) {
      this.successComponentName = PAYMENT_SUCCESS_SCREEN_TEXT.DONATION_PAYMENT;
      this.payAmountButtonLabel = PAYMENT_SUCCESS_SCREEN_TEXT.donationPayAmountButtonText;
    } else {
      this.successComponentName = PAYMENT_SUCCESS_SCREEN_TEXT.PAYMENT;
    }
  }

  /**
   * @methodName sendPaymentRequest
   * @parameter none
   * @description used to make the payment request to server
   * @return none
   */
  sendPaymentRequest(): void {
    this.showSuccessScreen = false;
    this.disableConfirmBtn = true;
    if (this.paymentService.selectedPaymentType === PAYMENT_TYPES.utilityPayment
      || this.paymentService.selectedPaymentType === PAYMENT_TYPES.donate) {
      this.sendUtilityPaymentRequest();
    } else if (this.paymentService.selectedPaymentType === PAYMENT_TYPES.ccPayment) {
      this.sendCoverCardPaymentRequest();
    }
  }

  /**
   * @methodName sendUtilityPaymentRequest
   * @parameter none
   * @description used to make the utility payment request to server
   * @return none
   */
  sendUtilityPaymentRequest(): void {
    const PAYMENT_END_POINT = `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)}${UTILITY_PAYMENT_ENDPOINTS.PAYMENT}`;
    this.paymentService.sendPaymentRequest(PAYMENT_END_POINT, this.paymentService.setUtilityPaymentPayLoad()).subscribe((response) => {
      if (response.status === HTTP_STATUS_CODE.CREATED) {
        this.transctionTimeStamp = new Date().toLocaleString();
        this.setReferenceNumber(response.headers.get(PAYMENT_SUCCESS_SCREEN_TEXT.REF_NO_LOCATION).toString());
        this.showSuccessScreen = true;
        this.updateAccountAndCards();
      }
    });
  }

  /**
   * @methodName sendCoverCardPaymentRequest
   * @parameter none
   * @description used to make the cover card payment request to server
   * @return none
   */
  sendCoverCardPaymentRequest(): void {
    const COVER_CARD_PAYMENT_END_POINT =
      `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)}${UTILITY_PAYMENT_ENDPOINTS.COVER_CARD_PAYMENT}`;
    this.paymentService.sendPaymentRequest(COVER_CARD_PAYMENT_END_POINT, this.paymentService.setCoverCardPaymentPayLoad())
      .subscribe((response) => {
        if (response.status === HTTP_STATUS_CODE.CREATED) {
          this.transctionTimeStamp = new Date().toString();
          this.setReferenceNumber(response.headers.get(PAYMENT_SUCCESS_SCREEN_TEXT.REF_NO_LOCATION).toString());
          this.showSuccessScreen = true;
          this.updateAccountAndCards();
        }
      });
  }

  /**
   * @methodName updateAccountAndCards
   * @parameter none
   * @description used to update the accounts and cards list
   * @return none
   */
  updateAccountAndCards(): void {
    this.paymentService.isPayeeSelectedForPayment = false;
    this.paymentService.isCoverCardSelectedForPayment = false;
    this.sharedService.setAccontsCardsList().subscribe(response => {
      this.sharedService.accountsCardsList = JSON.parse(response.toString());
      this.updateAccountDetailsData();
      this.sharedService.getAllCardsList();
      this.updateCoverCardDetailsData();
    });
  }

  /**
   * @methodName moveToParentComponent
   * @parameter showCancelPopUp<boolean>
   * @description used to route to the parent screen
   * @return none
   */
  moveToParentComponent(showCancelPopUp: boolean): void {
    this.sharedService.setCancelTransactionInfo(showCancelPopUp, true);
  }

  /**
   * @methodName setReferenceNumber
   * @parameter responseHeaderLocationValue<string>
   * @description used to set reference number in success screen
   * @return none
   */
  setReferenceNumber(responseHeaderLocationValue: string): void {
    this.referenceNumberForSuccessScreen = this.sharedService.getReferenceNumber(responseHeaderLocationValue);
  }

  /**
   * @methodName updateAccountDetailsData
   * @parameter none
   * @description used to update accountDetailData after the response from setAccontsCardsList()
   * @return none
   */
  updateAccountDetailsData(): void {
    if (this.paymentService.selectedAccountForPayment && this.sharedService.accountsCardsList) {
      const SELECTED_ACCOUNT = this.sharedService.accountsCardsList.accountsList.find(account => account.accountNumber
        === this.paymentService.selectedAccountForPayment.accountNumber);
      this.accountListService.accountDetailData = SELECTED_ACCOUNT;
    }
  }

  /**
   * @methodName updateCoverCardDetailsData
   * @parameter none
   * @description used to update CoverCardDetailsData after the response from setAccontsCardsList()
   * @return none
   */
  updateCoverCardDetailsData(): void {
    if (this.paymentService.selectedCoverCardObj && this.sharedService.coverCardData) {
      const SELECTED_COVER_CARD = this.sharedService.coverCardData.find(coverCard => coverCard.cardNumber
        === this.paymentService.selectedCoverCardObj.cardNumber);
      this.cardsService.setSelectedCoverCard(SELECTED_COVER_CARD);
    }
  }

  /**
   * @methodName generatePaymentReceipt
   * @parameter none
   * @description used to generate the payment receipt
   * @return none
   */
  generatePaymentReceipt(): void {
    this.paymentReceipt.currency = this.paymentSummaryDetails.currencyCode;
    let receiptObject = {} as ListOfReceiptFields;
    this.paymentReceipt.listOfFields = [] as ListOfReceiptFields[];
    receiptObject.name = TRANSFER_RECEIPT_LABELS.statusText;
    receiptObject.value = TRANSFER_RECEIPT_LABELS.successfulText;
    this.paymentReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = TRANSFER_RECEIPT_LABELS.referenceNumberText;
    receiptObject.value = this.referenceNumberForSuccessScreen;
    this.paymentReceipt.listOfFields.push(receiptObject);

    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = PAYMENT_RECEIPT_LABELS.paymentDateText;
    receiptObject.value = this.transctionTimeStamp.toString().slice(0, 24);
    this.paymentReceipt.listOfFields.push(receiptObject);

    receiptObject = {} as ListOfReceiptFields;
    // checking for card payments
    if (this.paymentSummaryDetails && this.paymentSummaryDetails.hasOwnProperty('payToCardNumber')) {
      receiptObject.name = PAYMENT_RECEIPT_LABELS.paymentAmountText;
    } else {
      receiptObject.name = this.paymentSummaryDetails.utilityServiceNumber ?
        PAYMENT_RECEIPT_LABELS.paymentAmountText : PAYMENT_RECEIPT_LABELS.donationAmountText;
    }
    receiptObject.value = this.paymentSummaryDetails.amount;
    this.paymentAmountToTextForCopy = receiptObject.name;
    this.paymentReceipt.listOfFields.push(receiptObject);
    // checking for card payments
    if (this.paymentSummaryDetails && !this.paymentSummaryDetails.hasOwnProperty('payToCardNumber')) {
      receiptObject = {} as ListOfReceiptFields;
      receiptObject.name = this.paymentSummaryDetails.utilityServiceNumber ?
        PAYMENT_RECEIPT_LABELS.utilityProviderText : PAYMENT_RECEIPT_LABELS.donationTypeText;
      receiptObject.value = this.paymentSummaryDetails.utilityServiceNumber ?
        this.paymentService.selectedPayeeObj.utilityProviderId : this.paymentService.selectedPayeeObj.payeeType;
      this.paymentReceipt.listOfFields.push(receiptObject);
    }

    receiptObject = {} as ListOfReceiptFields;
    if (this.paymentSummaryDetails && this.paymentSummaryDetails.hasOwnProperty('payToCardNumber')) {
      receiptObject.name = PAYMENT_RECEIPT_LABELS.paymentToCardNumberText;
      receiptObject.value = this.paymentSummaryDetails.payToCardNumber;
    } else {
      receiptObject.name = this.paymentSummaryDetails.utilityServiceNumber ?
        PAYMENT_RECEIPT_LABELS.serviceProviderNumberText : PAYMENT_RECEIPT_LABELS.donatedToText;
      if (this.paymentService.selectedPayeeObj && this.paymentService.selectedPayeeObj.payeeType &&
        this.paymentService.selectedPayeeObj.payeeType === PAYEE_SELECTION_MASTER_DATA.TELECOM_TEXT) {
        receiptObject.name = PAYMENT_RECEIPT_LABELS.phoneNumberText;
      }
      receiptObject.value = this.paymentSummaryDetails.utilityServiceNumber ?
        this.paymentSummaryDetails.utilityServiceNumber : this.paymentService.selectedPayeeObj.payeeCategory;
    }
    this.amountSendToTextForCopy = receiptObject.name;
    this.amountSendToValueForCopy = receiptObject.value;
    this.paymentReceipt.listOfFields.push(receiptObject);

    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = this.paymentSummaryDetails.accountNumber ?
      TRANSFER_RECEIPT_LABELS.fromAccountNumberText : PAYMENT_RECEIPT_LABELS.cardNumberText;
    receiptObject.value = this.paymentSummaryDetails.accountNumber ?
      this.paymentSummaryDetails.accountNumber : this.paymentSummaryDetails.cardNumber;
    this.fromAccountTextForCopy = receiptObject.name;
    this.fromAccountValueForCopy = receiptObject.value;
    this.paymentReceipt.listOfFields.push(receiptObject);
    this.openReceiptModal();
  }

  /**
   * @methodName openReceiptModal
   * @parameter none
   * @description used to open the transfer recipt in modal
   * @return none
   */
  openReceiptModal(): void {
    const OPTIONS = {} as Dialog;
    OPTIONS.isReceiptDialog = true;
    OPTIONS.receiptDetails = this.paymentReceipt;
    OPTIONS.dialogClassName = 'receipt-dialog';
    this.dialogService.open(OPTIONS);
    this.dialogService.confirmed().subscribe((response) => {
      if (response) {
        this.subscription$.add(this.translateService.get(PAYMENT_RECEIPT_COPY_TRANSLATION_KEYS).subscribe(translatedInfo => {
          const copyInformation = `${translatedInfo[TRANSFER_RECEIPT_LABELS.referenceNumberText]} : ${this.referenceNumberForSuccessScreen}
            ${translatedInfo[this.fromAccountTextForCopy]} : ${this.fromAccountValueForCopy}
            ${translatedInfo[this.paymentAmountToTextForCopy]} : ${this.paymentSummaryDetails.amount}
            ${translatedInfo[this.amountSendToTextForCopy]} : ${this.amountSendToValueForCopy}`;
          this.sharedService.notifyCopyData(this.sharedService.copyToClipboard(copyInformation));
        }));
      }
    });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
