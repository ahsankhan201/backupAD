import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UTILITY_PAYMENT_ENDPOINTS, TRANSFER_ENDPOINTS } from 'src/app/common/api-endpoints';
import {
  TRANSFER_SUCCESS_SCREEN_TEXT, INTERNATIONAL_TRANSFER_TEXT,
  DOMAINS, PAYMENT_SUCCESS_SCREEN_TEXT, HTTP_STATUS_CODE,
  TRANSFER_TYPES, LOCATION_TEXT, TRANSFER_RECEIPT_LABELS,
  RECEIPT_COPY_TRANSLATION_KEYS, BANK_NAME, BANK_COUNTRY, ARABIC_LANG_TEXT
} from 'src/app/common/global-constants';
import { MoneyTransferService } from 'src/app/common/services/money-transfer/money-transfer.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { AccountlistService } from 'src/app/modules/dashboard/services/accountlist.service';
import { MoneyTransferSummaryModel, CardToAccountPayload, ExchangeRateResponsePayLoad } from 'src/app/common/models/money-transfer.model';
import { ReceiptModel, ListOfReceiptFields } from 'src/app/common/models/global.model';
import { DialogService } from 'src/app/common/services/dialog.service';
import { Dialog } from 'src/app/common/models/dialog.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-money-transfer-confirm-step',
  templateUrl: './money-transfer-confirm-step.component.html',
  styleUrls: ['./money-transfer-confirm-step.component.scss']
})
export class MoneyTransferConfirmStepComponent implements OnInit, OnDestroy {
  payAmountButtonLabel = TRANSFER_SUCCESS_SCREEN_TEXT.transferAmount;
  showInternationalTransferSummary: boolean;
  transferSummaryDetails = {} as MoneyTransferSummaryModel;
  showComponent: string;
  disableConfirmBtn: boolean;
  isTransferToAdibCard: boolean;
  showSuccessScreen: boolean;
  referenceNumberForSuccessScreen: string;
  successComponentName: string;
  confirmScreenRoutingButtonText: string;
  transferReceipt = {} as ReceiptModel;
  transctionTimeStamp: string;
  isCrossCurrencyTransaction = false;
  CARD_TO_ACCOUNT_PAYLOAD = {} as CardToAccountPayload;
  subscription$ = new Subscription();
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(
    private moneyTransferService: MoneyTransferService,
    private sharedService: SharedService,
    private accountListService: AccountlistService,
    private dialogService: DialogService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.setInternationalTransferCompData();
    this.getSummaryDetails();
    this.showTransferToAdibCardSummary();
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
    this.subscription$.add(this.moneyTransferService.getMoneyTransferSummary().subscribe(response => {
      if (response) {
        this.showInternationalTransferSummary = false;
        this.transferSummaryDetails = response;
        this.confirmScreenRoutingButtonText = this.moneyTransferService.confirmScreenRoutingButtonText;
        this.setComponentInitialData();
        // reset the subject details
        this.moneyTransferService.setMoneyTransferSummary(undefined);
      }
    }));
  }

  /**
   * @methodName showTransferToAdibCardSummary
   * @parameter none
   * @description used to hide show fields for transfer to adib card
   * @return none
   */
  showTransferToAdibCardSummary(): void {
    this.subscription$.add(this.moneyTransferService.showTransferToDetailsAndSummary.subscribe((value: string) => {
      this.isTransferToAdibCard = value === TRANSFER_TYPES.transferToAdibCard ? true : false;
    }));
  }

  /**
   * @methodName sendTransferRequest
   * @parameter none
   * @description used to make the transfer request to server
   * @return none
   */
  sendTransferRequest(): void {
    this.showSuccessScreen = false;
    this.disableConfirmBtn = true;
    if (this.isTransferToAdibCard) {
      this.sendTransferToAdibCardRequest();
      this.successComponentName = PAYMENT_SUCCESS_SCREEN_TEXT.COVER_CARD_PAYMENT;
    } else if (this.moneyTransferService.selectedTransferType === TRANSFER_TYPES.transferToAdibAccount) {
      this.moneyTransferService.selectedTransferFromCard ? this.sendCardToAccountRequest() : this.sendAccountToAccountRequest();
      this.successComponentName = TRANSFER_SUCCESS_SCREEN_TEXT.accountTransferText;
    } else if (this.moneyTransferService.isTransferToBeneficiary()) {
      this.sendBeneficiaryTransferRequest();
      this.successComponentName = TRANSFER_SUCCESS_SCREEN_TEXT.internatinalTransferText;
    }
  }

  /**
   * @methodName sendTransferToAdibCardRequest
   * @parameter none
   * @description used to make the cover card transfer request to server
   * @return none
   */
  sendTransferToAdibCardRequest(): void {
    const COVER_CARD_PAYMENT_END_POINT =
      `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)}${UTILITY_PAYMENT_ENDPOINTS.COVER_CARD_PAYMENT}`;
    this.moneyTransferService.sendTransferRequest(COVER_CARD_PAYMENT_END_POINT,
      this.moneyTransferService.setTransferToAdibCardPayLoad())
      .subscribe((response) => {
        if (response.status === HTTP_STATUS_CODE.CREATED) {
          this.referenceNumberForSuccessScreen =
            this.sharedService.getReferenceNumber(response.headers.get(PAYMENT_SUCCESS_SCREEN_TEXT.REF_NO_LOCATION).toString());
          this.showSuccessScreen = true;
          this.transctionTimeStamp = new Date().toString();
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
    this.sharedService.setAccontsCardsList().subscribe(response => {
      if (response) {
        this.sharedService.accountsCardsList = JSON.parse(response.toString());
        this.updateAccountDetailsData();
        this.sharedService.getAllCardsList();
      }
    });
  }

  /**
   * @methodName updateAccountDetailsData
   * @parameter none
   * @description used to update accountDetailData after the response from setAccontsCardsList()
   * @return none
   */
  updateAccountDetailsData(): void {
    if (this.moneyTransferService.selectedTransferFromAccount && this.sharedService.accountsCardsList) {
      const SELECTED_ACCOUNT = this.sharedService.accountsCardsList.accountsList.find(account => account.accountNumber
        === this.moneyTransferService.selectedTransferFromAccount.accountNumber);
      this.accountListService.accountDetailData = SELECTED_ACCOUNT;
    }
  }

  /**
   * @methodName setInternationalTransferCompData
   * @parameter none
   * @description It will load the international transfer summary page with data
   * @return none
   */
  setInternationalTransferCompData() {
    this.subscription$.add(this.moneyTransferService.getInternationalSummaryScreenInfo().subscribe((loadSummaryComponent: boolean) => {
      if (loadSummaryComponent) {
        this.showInternationalTransferSummary = false;
        this.moneyTransferService.selectedBeneficiaryForTransfer &&
          this.moneyTransferService.selectedBeneficiaryForTransfer.beneType === INTERNATIONAL_TRANSFER_TEXT.external ?
          this.showInternationalTransferSummary = true : this.showInternationalTransferSummary = false;
        // resetting the subject details to avoid data confliction in next load of this component
        this.moneyTransferService.showInternationalSummaryScreenInfo(undefined);
      }
    }));
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
   * @methodName setComponentInitialData
   * @parameter none
   * @description used to set the component intial loda data
   * @return none
   */
  setComponentInitialData(): void {
    this.fetchExchangeRate();
    this.isCrossCurrencyTransaction = false;
    this.isCrossCurrencyTransaction = this.moneyTransferService.isCrossCurrencyTransaction;
  }

  /**
   * @methodName sendAccountToAccountRequest
   * @parameter none
   * @description used to make transfer from account to account
   * @return none
   */
  sendAccountToAccountRequest(): void {
    const TRANSFER_END_POINT =
      `${this.sharedService.generateApiUrl(DOMAINS.API_SIT_CONNECT, true, false)}${TRANSFER_ENDPOINTS.ACCOUNT_INTERNAL_TRANSFER}`;
    this.moneyTransferService.sendTransferRequest(TRANSFER_END_POINT,
      this.moneyTransferService.setAccountTransferPayLoad()).subscribe((response) => {
        if (response.status === HTTP_STATUS_CODE.CREATED) {
          this.referenceNumberForSuccessScreen =
            this.sharedService.getReferenceNumber(response.headers.get(PAYMENT_SUCCESS_SCREEN_TEXT.REF_NO_LOCATION).toString());
          this.transctionTimeStamp = new Date().toString();
          this.showSuccessScreen = true;
          this.updateAccountAndCards();
        }
      });
  }

  /**
   * @methodName sendCardToAccountRequest
   * @parameter none
   * @description used to make the cover card transfer request to server
   * @return none
   */
  sendCardToAccountRequest(): void {
    const COVER_CARD_PAYMENT_END_POINT =
      `${this.sharedService.generateApiUrl(DOMAINS.API_SIT_CONNECT, true, false)}${TRANSFER_ENDPOINTS.CARD_ACCOUNT_TRANSFER}`;
    this.moneyTransferService.setCardToAccountTransferPayLoad().then(cardToAccountPayload => {
      // async response from setCardToAccountTransferPayLoad
      if (cardToAccountPayload) {
        this.moneyTransferService.sendTransferRequest(COVER_CARD_PAYMENT_END_POINT, cardToAccountPayload)
          .subscribe((response) => {
            if (response.status === HTTP_STATUS_CODE.CREATED) {
              this.referenceNumberForSuccessScreen =
                this.sharedService.getReferenceNumber(response.headers.get(PAYMENT_SUCCESS_SCREEN_TEXT.REF_NO_LOCATION).toString());
              this.showSuccessScreen = true;
              this.transctionTimeStamp = new Date().toString();
              this.updateAccountAndCards();
            }
          });
      }
    });

  }

  /**
   * @methodName sendBeneficiaryTransferRequest
   * @parameter none
   * @description used to post beneficiary transfer request to the server
   * @return none
   */
  sendBeneficiaryTransferRequest(): void {
    this.moneyTransferService.generateInsideUaeEndPoints().then(payloadResponse => {
      if (payloadResponse) {
        this.moneyTransferService.sendInsideUaePaymentRequest().subscribe(response => {
          if (response.status === HTTP_STATUS_CODE.CREATED) {
            this.referenceNumberForSuccessScreen =
              this.sharedService.getReferenceNumber(response.headers.get(LOCATION_TEXT).toString());
            this.showSuccessScreen = true;
            this.transctionTimeStamp = new Date().toString();
            this.updateAccountAndCards();
          }
        });
      }
    }
    );
  }

  /**
   * @methodName updateAccountList
   * @parameter none
   * @description used to udpated  accountsCardsList
   * @return none
   */
  updateAccountList(): void {
    this.sharedService.setAccontsCardsList().subscribe(response => {
      this.sharedService.accountsCardsList = JSON.parse(response.toString());
    });
  }

  /**
   * @methodName fetchExchangeRate
   * @parameter none
   * @description used to fetch udpated exchange rate from the server
   * @return none
   */
  fetchExchangeRate(): void {
    if (this.allowExchangeRate()) {
      this.disableConfirmBtn = true;
      let DEBIT_AMOUNT = (this.transferSummaryDetails) ? this.transferSummaryDetails.debitAmount : undefined;
      if (!this.moneyTransferService.isCrossCurrencyTransaction) {
        DEBIT_AMOUNT = this.transferSummaryDetails.amount;
      }
      const requestPayLoad = this.moneyTransferService.generateExchangeRateRequestPayLoad('', DEBIT_AMOUNT);
      this.moneyTransferService.getExchangeRate(requestPayLoad).subscribe(response => {
        this.moneyTransferService.exchangeRateResponse = response;
        if (response && response.rate) {
          this.handleExchangeRateResponse(response);
        }
      });
    }
  }

  /**
   * @methodName allowExchangeRate
   * @parameter none
   * @description used to check exchangeRate api call allowed or not
   * @return boolean
   */
  allowExchangeRate(): boolean {
    return (
      this.moneyTransferService.isCrossCurrencyTransaction
      || (this.moneyTransferService.selectedBeneficiaryForTransfer
        && this.moneyTransferService.selectedTransferFromAccount
        && !(this.moneyTransferService.isTransferToAdibCardBeneficiary())
      )
    );
  }

  /**
   * @methodName handleExchangeRateResponse
   * @parameter response<ExchangeRateResponsePayLoad>
   * @description used to handle exchangeRate response
   * @return boolean
   */
  handleExchangeRateResponse(response: ExchangeRateResponsePayLoad): void {
    this.disableConfirmBtn = false;
    if (this.moneyTransferService.isTransferToBeneficiary()) {
      this.transferSummaryDetails = this.moneyTransferService.generateInsideUaeSummaryScreenDetails();
      // udpating payload credit amount using response date
      if (this.moneyTransferService.insideUaeTransferPayLoad && this.moneyTransferService.insideUaeTransferPayLoad.creditAccount) {
        this.moneyTransferService.insideUaeTransferPayLoad.creditAccount.amount = response.creditAmount;
      }
      this.moneyTransferService.insideUaeTransferPayLoad.debitRates = response.debitRates;
      this.moneyTransferService.insideUaeTransferPayLoad.creditRates = response.creditRates;
    } else if (this.moneyTransferService.isTransferToAdibAccount()) {
      this.moneyTransferService.transferToAcountPayLoad.creditAccount.amount = response.creditAmount;
      this.moneyTransferService.setTransferToAccountSummary();
    }
  }

  /**
   * @methodName generateTransferReceipt
   * @parameter none
   * @description used to generate the transfer receipt
   * @return none
   */
  generateTransferReceipt(): void {
    this.transferReceipt.currency = this.transferSummaryDetails.transferfromCurrency;
    let receiptObject = {} as ListOfReceiptFields;
    this.transferReceipt.listOfFields = [] as ListOfReceiptFields[];
    receiptObject.name = TRANSFER_RECEIPT_LABELS.statusText;
    receiptObject.value = TRANSFER_RECEIPT_LABELS.successfulText;
    this.transferReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = TRANSFER_RECEIPT_LABELS.referenceNumberText,
      receiptObject.value = this.referenceNumberForSuccessScreen;
    this.transferReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = TRANSFER_RECEIPT_LABELS.dateAndTimeText;
    receiptObject.value = this.transctionTimeStamp;
    this.transferReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = TRANSFER_RECEIPT_LABELS.amountText;
    this.transferSummaryDetails.debitAmount ? receiptObject.value = this.transferSummaryDetails.debitAmount :
      receiptObject.value = this.transferSummaryDetails.amount;
    this.transferReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = TRANSFER_RECEIPT_LABELS.benNameText;
    receiptObject.value = (this.moneyTransferService.selectedBeneficiaryForTransfer &&
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneName) ?
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneName : TRANSFER_RECEIPT_LABELS.selfText;
    this.transferReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = TRANSFER_RECEIPT_LABELS.bankNameText;
    receiptObject.value = (this.moneyTransferService.selectedBeneficiaryForTransfer &&
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankName) ?
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankName : TRANSFER_RECEIPT_LABELS.adibText;
    this.transferReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = TRANSFER_RECEIPT_LABELS.toAccountText;
    receiptObject.value = this.transferSummaryDetails.transferToNumber;
    this.transferReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    if (this.moneyTransferService.selectedTransferFromAccount && this.moneyTransferService.selectedTransferFromAccount.accountNumber) {
      receiptObject.name = TRANSFER_RECEIPT_LABELS.fromAccountNumberText;
    } else if (this.moneyTransferService.selectedTransferFromCard && this.moneyTransferService.selectedTransferFromCard.cardNumber) {
      receiptObject.name = TRANSFER_RECEIPT_LABELS.fromCoverCardText;
    }
    receiptObject.value = this.transferSummaryDetails.transferfromNumber;
    this.transferReceipt.listOfFields.push(receiptObject);
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
    OPTIONS.receiptDetails = this.transferReceipt;
    OPTIONS.dialogClassName = 'receipt-dialog';
    this.dialogService.open(OPTIONS);
    this.dialogService.confirmed().subscribe((response) => {
      if (response) {
        this.translateService.get(RECEIPT_COPY_TRANSLATION_KEYS).subscribe(translatedInfo => {
          const copyInformation =
            `${translatedInfo[TRANSFER_RECEIPT_LABELS.referenceNumberText]} : ${this.referenceNumberForSuccessScreen}
        ${translatedInfo[TRANSFER_RECEIPT_LABELS.transferredToText]} : ${this.transferSummaryDetails.transferToNumber}
        ${translatedInfo[BANK_NAME]} : ${this.moneyTransferService.selectedBeneficiaryForTransfer &&
              this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankName ?
              this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankName : translatedInfo[TRANSFER_RECEIPT_LABELS.adibText]}
        ${translatedInfo[BANK_COUNTRY]}  : ${this.moneyTransferService.selectedBeneficiaryForTransfer &&
              this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankCountryName ?
              this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankCountryName : TRANSFER_RECEIPT_LABELS.UAE_TEXT}
        ${translatedInfo[TRANSFER_RECEIPT_LABELS.transferAmountText]} : ${this.transferSummaryDetails.debitAmount ?
              this.transferSummaryDetails.debitAmount : this.transferSummaryDetails.amount}`;
          this.sharedService.notifyCopyData(this.sharedService.copyToClipboard(copyInformation));
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

}
