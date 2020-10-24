import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MoneyTransferService } from 'src/app/common/services/money-transfer/money-transfer.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { AccountlistService } from 'src/app/modules/dashboard/services/accountlist.service';
import { DialogService } from 'src/app/common/services/dialog.service';
import { TranslateService } from '@ngx-translate/core';

import { InternationalTransferSummaryModel, ChargeCode, TransferBeneficiaryDetails } from 'src/app/common/models/money-transfer.model';
import {
  TRANSFER_SUCCESS_SCREEN_TEXT, DOMAINS,
  INTERNATIONAL_TRANSFER_TEXT, TRANSFER_RECEIPT_LABELS,
  RECEIPT_COPY_TRANSLATION_KEYS, BANK_NAME, BANK_COUNTRY, ARABIC_LANG_TEXT, HTTP_STATUS_CODE
} from 'src/app/common/global-constants';
import { TRANSFER_ENDPOINTS } from 'src/app/common/api-endpoints';
import { ListOfReceiptFields, ReceiptModel } from 'src/app/common/models/global.model';
import { Dialog } from 'src/app/common/models/dialog.model';

@Component({
  selector: 'app-international-summary',
  templateUrl: './international-summary.component.html',
  styleUrls: ['./international-summary.component.scss']
})
export class InternationalTransferSummaryComponent implements OnInit, OnDestroy {
  payAmountButtonLabel = TRANSFER_SUCCESS_SCREEN_TEXT.transferAmount;
  summaryDetails: InternationalTransferSummaryModel;
  showSuccessScreen: boolean;
  referenceNumberForSuccessScreen: string;
  summaryBtnText: string;
  disableTransferButton: boolean;
  subscription$ = new Subscription();
  isBeneficiaryWithinUae = false;
  isSameCurrencyTransaction = false;
  transferReceipt = {} as ReceiptModel;
  transctionTimeStamp: string;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(
    private moneyTransferService: MoneyTransferService,
    private sharedService: SharedService,
    private accountListService: AccountlistService,
    private dialogService: DialogService,
    private translateService: TranslateService) { }

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
   * @description used to set the component intial loda data
   * @return none
   */
  setComponentInitialData(): void {
    this.summaryBtnText = this.moneyTransferService.confirmScreenRoutingButtonText;
    this.subscription$.add(this.moneyTransferService.getInternationalSummaryScreenInfo().subscribe((loadFormComponent: boolean) => {
      if (!loadFormComponent && this.moneyTransferService.selectedBeneficiaryForTransfer &&
        this.moneyTransferService.selectedBeneficiaryForTransfer.beneType === INTERNATIONAL_TRANSFER_TEXT.external
      ) {
        this.disableTransferButton = true;
        this.fetchExchangeRate();
        this.handleCrossCurrencyWithinUAE();
      }
    }));
  }
  /**
   * @methodName makeTransferRequest
   * @parameter none
   * @description used to post the transfer request to the server
   * @return none
   */
  makeTransferRequest(): void {
    this.generateRequestPayLoad();
    this.disableTransferButton = true;
    const URL = this.sharedService.generateApiUrl(DOMAINS.API_SIT_CONNECT, true, false) + TRANSFER_ENDPOINTS.INTERNATIONAL_TRANSFER;
    this.moneyTransferService.makeInternationalTransferReq(URL).subscribe(response => {
      if (response.status === HTTP_STATUS_CODE.CREATED) {
        this.referenceNumberForSuccessScreen = this.sharedService.getReferenceNumber(
          response.headers.get(INTERNATIONAL_TRANSFER_TEXT.location).toString());
        this.showSuccessScreen = true;
        this.transctionTimeStamp = new Date().toString();
        // hiding summary title on successfull transfer
        document.querySelector('.' + INTERNATIONAL_TRANSFER_TEXT.SUMMARY_TITEL_CLASS).classList
          .add(INTERNATIONAL_TRANSFER_TEXT.HIDE_CLASS_TEXT);
        this.updateAccountList();
      }
    });
  }

  /**
   * @methodName generateRequestPayLoad
   * @parameter none
   * @description used to set the beneficiary, beneficiary bank transfer request payload
   * @return none
   */
  generateRequestPayLoad(): void {
    this.setBeneDetailsForTransferReq();
    this.setBeneBankDetailsForTransferReq();
  }

  /**
   * @methodName setBeneDetailsForTransferReq
   * @parameter none
   * @description used to set the beneficiary details for transfer request
   * @return none
   */
  setBeneDetailsForTransferReq(): void {
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary = {} as TransferBeneficiaryDetails;
    const date = new Date().toISOString();
    this.moneyTransferService.internationalTransferRequestPayLoad.transferDate = date.substring(0, date.indexOf('T'));
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryName =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneName;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryType = INTERNATIONAL_TRANSFER_TEXT.EXTERNAL;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.customerNumber =
      this.moneyTransferService.selectedTransferFromAccount.customerNumber;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.nickName =
      this.moneyTransferService.selectedBeneficiaryForTransfer.nickName;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryAccountCurrency =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneAccCurr;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryAccountNumber =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneAccNo;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryAddress1 =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneAdd1;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryAddress3 =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneAdd3;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryCity =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneCity;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryCountry =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneCountry;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryExternalAccountType =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneExtAccType;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryId =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneID;
  }

  /**
   * @methodName setBeneBankDetailsForTransferReq
   * @parameter none
   * @description used to set the beneficiaryBank details for transfer request
   * @return none
   */
  setBeneBankDetailsForTransferReq(): void {
    this.moneyTransferService.internationalTransferRequestPayLoad.transferType = INTERNATIONAL_TRANSFER_TEXT.TRANSFER_TYPE;
    this.moneyTransferService.internationalTransferRequestPayLoad.branchCode =
      this.moneyTransferService.selectedTransferFromAccount.branchCode;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.swiftRoutingCode =
      this.moneyTransferService.selectedBeneficiaryForTransfer.swiftRoutingCode;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.abaNumber =
      this.moneyTransferService.selectedBeneficiaryForTransfer.abaNumber;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.accountBankFormat =
      this.moneyTransferService.selectedBeneficiaryForTransfer.accountBankFormat;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.bankSwiftCode =
      this.moneyTransferService.selectedBeneficiaryForTransfer.bankSwiftCode;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryBankAddress1 =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankAdd1;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryBankAddress2 =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankAdd2;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryBankBranch =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankBranch;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryBankCity =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankCity;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryBankCountry =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankCountry;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryBankId =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankId;
    this.moneyTransferService.internationalTransferRequestPayLoad.beneficiary.beneficiaryBankName =
      this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankName;
  }

  /**
   * @methodName setChargeCodeInfo
   * @parameter none
   * @description used to set the chargeCode details for transfer request
   * @return none
   */
  setChargeCodeInfo(): void {
    this.moneyTransferService.internationalTransferRequestPayLoad.chargeCode = {} as ChargeCode;
    this.moneyTransferService.internationalTransferRequestPayLoad.chargeCode.chargeAccount =
      this.moneyTransferService.exchangeRateResponse.chargeAcctNumber;
    this.moneyTransferService.internationalTransferRequestPayLoad.chargeCode.chargeAmount =
      this.moneyTransferService.exchangeRateResponse.chargeAmount;
    this.moneyTransferService.internationalTransferRequestPayLoad.chargeCode.chargeCurrencyCode =
      this.moneyTransferService.exchangeRateResponse.chargeCurrencyCode;
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
   * @methodName fetchExchangeRate
   * @parameter none
   * @description used to fetch the exchange rate from the servcer
   * @return none
   */
  fetchExchangeRate(): void {
    const requestPayLoad = this.moneyTransferService.generateExchangeRateRequestPayLoad(INTERNATIONAL_TRANSFER_TEXT.TRANSFER_TYPE,
      this.moneyTransferService.internationalTransferRequestPayLoad.debitAccount.amount);
    this.moneyTransferService.getExchangeRate(requestPayLoad).subscribe(response => {
      if (response && response.rate) {
        this.setChargeCodeInfo();
        this.moneyTransferService.exchangeRateResponse = response;
        this.moneyTransferService.internationalTransferRequestPayLoad.creditAccount.amount = response.creditAmount;
        this.moneyTransferService.internationalTransferRequestPayLoad.debitRates = response.debitRates;
        this.moneyTransferService.internationalTransferRequestPayLoad.creditRates = response.creditRates;
        this.summaryDetails = this.moneyTransferService.setInternationalTransferSummaryDetails();
        this.disableTransferButton = false;
      }
    });
  }

  /**
   * @methodName updateAccountList
   * @parameter none
   * @description It'll update the account list on successfull transfer
   * @return none
   */
  updateAccountList(): void {
    this.sharedService.setAccontsCardsList().subscribe(response => {
      this.sharedService.accountsCardsList = JSON.parse(response.toString());
      this.sharedService.networth.next(this.sharedService.accountsCardsList.myNetWorth);
      this.updateAccountDetailsInfo();
    });
  }

  /**
   * @methodName updateAccountDetailsInfo
   * @parameter none
   * @description used to update accountDetailData after the response from setAccontsCardsList()
   * @return none
   */
  updateAccountDetailsInfo(): void {
    if (this.moneyTransferService.selectedAccForMoneyTransfer && this.sharedService.accountsCardsList) {
      const SELECTED_ACCOUNT = this.sharedService.accountsCardsList.accountsList.find(account => account.accountNumber
        === this.moneyTransferService.selectedAccForMoneyTransfer);
      this.accountListService.accountDetailData = SELECTED_ACCOUNT;
      // resetting selected account in detals page for transfer
      this.moneyTransferService.selectedAccForMoneyTransfer = undefined;
    }
  }

  /**
   * @methodName handleCrossCurrencyWithinUAE
   * @parameter none
   * @description used to set cross currency logic within UAE
   * @return none
   */
  handleCrossCurrencyWithinUAE(): void {
    this.isBeneficiaryWithinUae = false;
    this.isSameCurrencyTransaction = this.moneyTransferService.isSameCurrencyTransaction;
    if (this.moneyTransferService.isBeneficiaryOutsideAdibUAE()) {
      this.isBeneficiaryWithinUae = true;
    }
  }

  /**
   * @methodName generateTransferReceipt
   * @parameter none
   * @description used to generate the transfer receipt
   * @return none
   */
  generateTransferReceipt(): void {
    this.transferReceipt.currency = this.summaryDetails.debitCurrency;
    let receiptObject = {} as ListOfReceiptFields;
    this.transferReceipt.listOfFields = [] as ListOfReceiptFields[];
    receiptObject.name = TRANSFER_RECEIPT_LABELS.statusText;
    receiptObject.value = TRANSFER_RECEIPT_LABELS.successfulText;
    this.transferReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = TRANSFER_RECEIPT_LABELS.referenceNumberText;
    receiptObject.value = this.referenceNumberForSuccessScreen;
    this.transferReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = TRANSFER_RECEIPT_LABELS.dateAndTimeText;
    receiptObject.value = this.transctionTimeStamp;
    this.transferReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = TRANSFER_RECEIPT_LABELS.amountText;
    receiptObject.value = this.summaryDetails.debitAmount;
    this.transferReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = TRANSFER_RECEIPT_LABELS.benNameText;
    receiptObject.value = this.summaryDetails.beneficiaryName;
    this.transferReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = TRANSFER_RECEIPT_LABELS.bankNameText;
    receiptObject.value = this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankName;
    this.transferReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = TRANSFER_RECEIPT_LABELS.toAccountText;
    receiptObject.value = this.summaryDetails.creditAccountNumber;
    this.transferReceipt.listOfFields.push(receiptObject);
    receiptObject = {} as ListOfReceiptFields;
    receiptObject.name = TRANSFER_RECEIPT_LABELS.fromAccountNumberText;
    receiptObject.value = this.summaryDetails.debitAccountNumber;
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
          ${translatedInfo[TRANSFER_RECEIPT_LABELS.transferredToText]} : ${this.summaryDetails.creditAccountNumber}
          ${translatedInfo[BANK_NAME]} : ${this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankName}
          ${translatedInfo[BANK_COUNTRY]} : ${this.moneyTransferService.selectedBeneficiaryForTransfer.beneBankCountry}
          ${translatedInfo[TRANSFER_RECEIPT_LABELS.transferAmountText]} : ${this.summaryDetails.debitAmount}`;
          this.sharedService.notifyCopyData(this.sharedService.copyToClipboard(copyInformation));
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
