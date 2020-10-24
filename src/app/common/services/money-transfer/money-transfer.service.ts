import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { APISyncService } from '../sync.service';
import { SharedService } from '../shared.service';

import { AccountListModel } from '../../models/accounts-module.model';
import { CoverCardData } from '../../models/cards-module.model';
import {
  MoneyTransferDetails, MoneyTransferSummaryModel, TransferToAccountPayLoad,
  CardToAccountPayload
} from '../../models/money-transfer.model';
import { AccountPayload } from '../../models/money-transfer.model';
import { BeneficiaryListResponse } from '../../models/beneficiary.model';
import {
  ExchangeRateResponsePayLoad, TransferPurposeModel,
  ExchangeRateRequestPayLoad, InternationalTransferSummaryModel,
  InternationalTransferRequestPayLoad,
  TransferBeneficiaryDetails,
  DebitORCreditAccount,
  CoverCardPaymentPayload,
  CardPayload
} from '../../models/money-transfer.model';
import {
  DOMAINS, ACCOUNT_ALLOWED_TYPE_LIST, INTERNATIONAL_TRANSFER_TEXT,
  ACCOUNT_ALLOWED_FOR_PAYMENTS, PAYMENT_SCREEN_TEXT, TRANSFER_ACCOUNT_PAYLOAD,
  INSIDE_UAE_TRANSFER_TEXT
} from '../../global-constants';
import { TRANSFER_ENDPOINTS, UTILITY_PAYMENT_ENDPOINTS } from '../../api-endpoints';
import { TRANSFER_TYPES } from '../../global-constants';
import { CoverCardPaymentPayLoad, UtilityPaymentCardObj } from '../../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class MoneyTransferService {

  selectedTransferType: string;
  isBeneSelectedForTransfer: boolean;
  confirmScreenRoutingButtonText: string;
  selectedTransferFromAccount = {} as AccountListModel;
  selectedTransferFromCard = {} as CoverCardData;
  selectedBeneficiaryForTransfer = {} as BeneficiaryListResponse;
  internationalTransferRequestPayLoad = {} as InternationalTransferRequestPayLoad;
  exchangeRateResponse = {} as ExchangeRateResponsePayLoad;
  transferToAcountPayLoad = {} as TransferToAccountPayLoad;
  transferToAdibCardPayLoad = {} as CoverCardPaymentPayLoad;
  selectedTransferToAccount = {} as AccountListModel;
  selectedTransferToCard = {} as CoverCardData;
  selectedAccForMoneyTransfer: string;

  transferToAccountList = new BehaviorSubject<AccountListModel[]>(undefined);
  transferToCardList = new BehaviorSubject<CoverCardData[]>(undefined);
  setMoneyTransferDetails$ = new BehaviorSubject(undefined);
  setMoneyTransferSummary$ = new BehaviorSubject(undefined);
  setExchangeRateAPIInfo$ = new BehaviorSubject(undefined);
  loadSummaryScreenComponent$ = new BehaviorSubject(undefined);
  showTransferToCardCheckbox = new BehaviorSubject<boolean>(undefined);
  showTransferToDetailsAndSummary = new BehaviorSubject<string>(undefined);
  updateBeneListInTransferToStep$ = new BehaviorSubject(undefined);
  insideUaeTransferEndPoint: string;
  insideUaeTransferPayLoad: any | CoverCardData = {};
  insideUaeTransferFormData: any;
  isCrossCurrencyTransaction = false;
  isSameCurrencyTransaction = false;
  trasnferRate: number;
  constructor(
    private httpService: APISyncService,
    private sharedService: SharedService) { }

  /**
   * @methodName setInternationalMoneyTransferDetailsSubject
   * @parameter makeExchangeRateAPICall<boolean>
   * @description used to set the transfer details loading info
   * @return none
   */
  setInternationalMoneyTransferDetailsSubject(makeExchangeRateAPICall: boolean): void {
    this.setExchangeRateAPIInfo$.next(makeExchangeRateAPICall);
  }
  /**
   * @methodName getInternationalMoneyTransferDetailsSubject
   * @parameter none
   * @description It'll dispatch the transfer details loading info
   * @return Observable<boolean>
   */
  getInternationalMoneyTransferDetailsSubject(): Observable<boolean> {
    return this.setExchangeRateAPIInfo$.asObservable();
  }

  /**
   * @methodName updateBeneficiaryListInToStep
   * @parameter updateList<boolean>
   * @description used to update the beneficiary list in money transfer to step
   * @return none
   */
  updateBeneficiaryListInToStep(updateList: boolean): void {
    this.updateBeneListInTransferToStep$.next(updateList);
  }
  /**
   * @methodName getBeneficiaryListInfo
   * @parameter none
   * @description It'll dispatch the beneficiary list info which sets in updateBeneficiaryListInToStep
   * @return Observable<boolean>
   */
  getBeneficiaryListInfo(): Observable<boolean> {
    return this.updateBeneListInTransferToStep$.asObservable();
  }
  /**
   * @methodName showInternationalSummaryScreenInfo
   * @parameter showSummaryScreen<boolean>
   * @description used to set summary screen info onload
   * @return none
   */
  showInternationalSummaryScreenInfo(showSummaryScreen: boolean): void {
    this.loadSummaryScreenComponent$.next(showSummaryScreen);
  }
  /**
   * @methodName getInternationalSummaryScreenInfo
   * @parameter none
   * @description It'll dispatch the summary screen show/hide info
   * @return Observable<boolean>
   */
  getInternationalSummaryScreenInfo(): Observable<boolean> {
    return this.loadSummaryScreenComponent$.asObservable();
  }

  /**
   * @methodName getExchangeRate
   * @parameter requestPayLoad<ExchangeRateRequestPayLoad>
   * @description used to fetch the echange rate from the server
   * @return Observable<ExchangeRateResponsePayLoad>
   */
  getExchangeRate(requestPayLoad: ExchangeRateRequestPayLoad): Observable<ExchangeRateResponsePayLoad> {
    const url = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) + TRANSFER_ENDPOINTS.EXCHANGE_RATE;
    return this.httpService.post(url, requestPayLoad).pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName getTransferPurpose
   * @parameter none
   * @description it is used fetch the purpose transfer list from server
   * @return Observable<TransferPurposeModel[]>
   */
  getTransferPurpose(): Observable<TransferPurposeModel[]> {
    const url = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) + TRANSFER_ENDPOINTS.TRANSFER_PURPOSE +
      `?${INTERNATIONAL_TRANSFER_TEXT.CONTRY_CODE}=` + this.selectedBeneficiaryForTransfer.beneCountry +
      `&${INTERNATIONAL_TRANSFER_TEXT.CURRENCY_CODE}=` + this.selectedBeneficiaryForTransfer.beneAccCurr;
    return this.httpService.get(url).pipe(map(res => JSON.parse(res)));
  }
  /**
   * @methodName generateExchangeRateRequestPayLoad
   * @parameter transferType, transferAmount
   * @description it is used fetch the exchange rate from server
   * @return ExchangeRateRequestPayLoad
   */
  generateExchangeRateRequestPayLoad(transferType?: string, transferAmount?: string): ExchangeRateRequestPayLoad {
    const exchangeRateRequestPayLoad = {} as ExchangeRateRequestPayLoad;
    if (this.isTransferToBeneficiary()) {
      // To beneficiary transfer
      exchangeRateRequestPayLoad.creditAccNumber = this.selectedBeneficiaryForTransfer.beneAccNo;
      exchangeRateRequestPayLoad.creditAcctNumberCurrencyCode = this.selectedBeneficiaryForTransfer.beneAccCurr;
      exchangeRateRequestPayLoad.transferType = this.getTransferType();
    } else if (this.isTransferToAdibAccount()) {
      // To account transfer
      exchangeRateRequestPayLoad.creditAccNumber = this.selectedTransferToAccount.accountNumber;
      exchangeRateRequestPayLoad.creditAcctNumberCurrencyCode = this.selectedTransferToAccount.currencyCode;
      exchangeRateRequestPayLoad.transferType = this.getTransferType();
    }
    exchangeRateRequestPayLoad.debitAcctNumber = this.selectedTransferFromAccount.accountNumber;
    exchangeRateRequestPayLoad.transferAccountCurrencyCode = this.selectedTransferFromAccount.currencyCode;
    exchangeRateRequestPayLoad.transferAmount = transferAmount ? this.sharedService.removeCommaFromString(transferAmount)
      : INTERNATIONAL_TRANSFER_TEXT.DEFAULT_TRANSFER_AMOUNT;
    return exchangeRateRequestPayLoad;
  }

  /**
   * @methodName setInternationalTransferSummaryDetails
   * @parameter none
   * @description it is used to set the international summary screen info
   * @return InternationalTransferSummaryModel
   */
  setInternationalTransferSummaryDetails(): InternationalTransferSummaryModel {
    const summaryDetails = {} as InternationalTransferSummaryModel;
    summaryDetails.debitAccountNumber = this.selectedTransferFromAccount.accountNumber;
    summaryDetails.debitCurrency = this.selectedTransferFromAccount.currencyCode;
    summaryDetails.creditAccountNumber = this.selectedBeneficiaryForTransfer.beneAccNo;
    summaryDetails.creditCurrency = this.selectedBeneficiaryForTransfer.beneAccCurr;
    summaryDetails.beneficiaryName = this.selectedBeneficiaryForTransfer.nickName;
    summaryDetails.additionalDetails = this.internationalTransferRequestPayLoad.additionalRemittanceDetails;
    summaryDetails.debitAmount = this.internationalTransferRequestPayLoad.debitAccount.amount ?
      this.sharedService.removeCommaFromString(this.internationalTransferRequestPayLoad.debitAccount.amount) :
      this.internationalTransferRequestPayLoad.debitAccount.amount;
    summaryDetails.creditAmount = this.internationalTransferRequestPayLoad.creditAccount.amount ?
      this.sharedService.removeCommaFromString(this.internationalTransferRequestPayLoad.creditAccount.amount) :
      this.internationalTransferRequestPayLoad.creditAccount.amount;
    summaryDetails.exchangeRate = this.sharedService.trimNumberWithoutRounding(this.internationalTransferRequestPayLoad.creditRates.rate,
      INTERNATIONAL_TRANSFER_TEXT.EXCHANGE_RATE_DECIMAL_LIMIT);
    summaryDetails.fee = this.internationalTransferRequestPayLoad.chargeCode.chargeAmount;
    summaryDetails.memo = this.internationalTransferRequestPayLoad.optionalMemo;
    summaryDetails.purposeOfTransfer = this.internationalTransferRequestPayLoad.transferPurpose;
    summaryDetails.totalAmount = (Number(summaryDetails.fee ? summaryDetails.fee : 0) + Number(summaryDetails.debitAmount)).toString();
    summaryDetails.accountDescription = ACCOUNT_ALLOWED_TYPE_LIST[this.selectedTransferFromAccount.accountType];
    return summaryDetails;
  }
  /**
   * @methodName makeInternationalTransferReq
   * @parameter url
   * @description it is used to post the transfer request to the server
   * @return Observable<any>
   */
  makeInternationalTransferReq(url: string): Observable<any> {
    return this.httpService.post(url, this.internationalTransferRequestPayLoad);
  }

  /**
   * @methodName setMoneyTransferDetails
   * @parameter transferDetails<MoneyTransferDetails>
   * @description used to dispatch the transfer details to it's subscribers
   * @return none
   */
  setMoneyTransferDetails(transferDetails: MoneyTransferDetails): void {
    this.setMoneyTransferDetails$.next(transferDetails);
  }

  /**
   * @methodName getMoneyTransferDetails
   * @parameter none
   * @description used to return the transfer details which sets in setMoneyTransferDetails()
   * @return Observable<MoneyTransferDetails>
   */
  getMoneyTransferDetails(): Observable<MoneyTransferDetails> {
    return this.setMoneyTransferDetails$.asObservable();
  }

  /**
   * @methodName setMoneyTransferSummary
   * @parameter summaryDetails<MoneyTransferSummaryModel>
   * @description used to dispatch the set summary for money transfer
   */
  setMoneyTransferSummary(summaryDetails: MoneyTransferSummaryModel): void {
    this.setMoneyTransferSummary$.next(summaryDetails);
  }

  /**
   * @methodName getMoneyTransferSummary
   * @parameter none
   * @description used to return the summaryInfo which sets in setMoneyTransferSummary()
   * @return Observable<MoneyTransferSummaryModel>
   */
  getMoneyTransferSummary(): Observable<MoneyTransferSummaryModel> {
    return this.setMoneyTransferSummary$.asObservable();
  }

  /**
   * @methodName generateSummaryScreenDetails
   * @parameter transferType<string>
   * @description used to generate the summary screen details
   * @return none
   */
  generateSummaryScreenDetails(transferType: string): void {
    let summaryDetails = {} as MoneyTransferSummaryModel;
    switch (transferType) {
      case TRANSFER_TYPES.transferToAdibCard:
        summaryDetails = this.setTransferToAdibCardSummary();
        break;
      case TRANSFER_TYPES.transferToAdibAccount:
        summaryDetails = this.setTransferToAccountSummary();
        break;
      case TRANSFER_TYPES.transferToBeneficiary:
        summaryDetails = this.generateInsideUaeSummaryScreenDetails();
        break;
    }
    this.setMoneyTransferSummary(summaryDetails);
  }

  /**
   * @methodName setTransferToAdibCardSummary
   * @parameter none
   * @description used to set the cover card summary details
   * @return <MoneyTransferSummaryModel>
   */
  setTransferToAdibCardSummary(): MoneyTransferSummaryModel {
    const summaryDetails = {} as MoneyTransferSummaryModel;
    summaryDetails.memo = this.transferToAdibCardPayLoad.optionalMemo;
    summaryDetails.amount = this.transferToAdibCardPayLoad.amount ?
      this.sharedService.removeCommaFromString(this.transferToAdibCardPayLoad.amount) : this.transferToAdibCardPayLoad.amount;
    summaryDetails.transferfromCurrency = this.selectedTransferFromAccount.currencyCode;
    summaryDetails.transferfromDesc = this.selectedTransferFromAccount.accountType &&
      ACCOUNT_ALLOWED_FOR_PAYMENTS[this.selectedTransferFromAccount.accountType] ?
      ACCOUNT_ALLOWED_FOR_PAYMENTS[this.selectedTransferFromAccount.accountType] : undefined;
    summaryDetails.transferfromNumber = this.selectedTransferFromAccount.accountNumber;
    summaryDetails.transferToCurrency = this.selectedTransferToCard.currencyCode;
    summaryDetails.transferToDesc = this.selectedTransferToCard.productDescription;
    summaryDetails.transferToNumber = this.selectedTransferToCard.cardNumber;
    summaryDetails.outstandingBalance = this.selectedTransferToCard.dueBalance;
    return summaryDetails;
  }

  /**
   * @methodName isMoneyTransferInsideUAE
   * @parameter none
   * @description used to check inside UAE transfer
   * @return boolean
   */
  isMoneyTransferInsideUAE(): boolean {
    return (this.selectedBeneficiaryForTransfer &&
      (this.selectedBeneficiaryForTransfer.beneType === INSIDE_UAE_TRANSFER_TEXT.INTRABANK
        || (this.selectedBeneficiaryForTransfer.beneType === INTERNATIONAL_TRANSFER_TEXT.external &&
          this.selectedBeneficiaryForTransfer.beneBankCountry === INSIDE_UAE_TRANSFER_TEXT.UAE_COUNTRY))) ? true : false;
  }

  /**
   * @methodName isBeneficiaryInsideAdibUAE
   * @parameter none
   * @description used to check inside ADIB  transfer
   * @return boolean
   */
  isBeneficiaryInsideAdibUAE(): boolean {
    return (this.selectedBeneficiaryForTransfer &&
      (this.selectedBeneficiaryForTransfer.beneType === INSIDE_UAE_TRANSFER_TEXT.INTRABANK
        && (this.selectedBeneficiaryForTransfer.beneBankCountry === INSIDE_UAE_TRANSFER_TEXT.UAE_COUNTRY))) ? true : false;
  }

  /**
   * @methodName isBeneficiaryOutsideAdibUAE
   * @parameter none
   * @description used to check OUTSIDE ADIB transfer
   * @return boolean
   */
  isBeneficiaryOutsideAdibUAE(): boolean {
    return (this.selectedBeneficiaryForTransfer &&
      (this.selectedBeneficiaryForTransfer.beneType === INSIDE_UAE_TRANSFER_TEXT.external
        && (this.selectedBeneficiaryForTransfer.beneBankCountry === INSIDE_UAE_TRANSFER_TEXT.UAE_COUNTRY))) ? true : false;
  }

  /**
   * @methodName isTransferToBeneficiary
   * @parameter none
   * @description used to check transfer to beneficiary transfer
   * @return boolean
   */
  isTransferToBeneficiary(): boolean {
    return (this.selectedTransferType && this.selectedTransferType === TRANSFER_TYPES.transferToBeneficiary) ? true : false;
  }

  /**
   * @methodName isTransferToAdibAccount
   * @parameter none
   * @description used to check ADIB account transfer
   * @return boolean
   */
  isTransferToAdibAccount(): boolean {
    return (this.selectedTransferType && this.selectedTransferType === TRANSFER_TYPES.transferToAdibAccount) ? true : false;
  }
  /**
   * @methodName generateInsideUaeRequestPayLoad
   * @parameter none
   * @description used to set the beneficiary, beneficiary bank transfer request payload
   * @return none
   */
  generateInsideUaeRequestPayLoad(): void {
    this.insideUaeTransferPayLoad = {};
    this.setInsideUaeCrossCurrencyPayload();
    this.setInsideUaeBeneficiaryPayload();

    this.insideUaeTransferPayLoad.optionalMemo = this.insideUaeTransferFormData[INTERNATIONAL_TRANSFER_TEXT.memo];
    const date = this.sharedService.getCurrentDate();
    this.insideUaeTransferPayLoad.transferDate = date.substring(0, date.indexOf('T'));
  }
  /**
   * @methodName setInsideUaeBeneficiaryPayload
   * @parameter none
   * @description used to set inside UAE beneficiary payload for payment
   * @return none
   */
  setInsideUaeBeneficiaryPayload(): void {
    this.insideUaeTransferPayLoad.beneficiary = {} as TransferBeneficiaryDetails;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryName = this.selectedBeneficiaryForTransfer.beneName;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryType = INSIDE_UAE_TRANSFER_TEXT.EXTERNAL;
    this.insideUaeTransferPayLoad.beneficiary.customerNumber = this.selectedTransferFromAccount.customerNumber;
    this.insideUaeTransferPayLoad.beneficiary.nickName = this.selectedBeneficiaryForTransfer.nickName;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryAccountCurrency = this.selectedBeneficiaryForTransfer.beneAccCurr;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryAccountNumber = this.selectedBeneficiaryForTransfer.beneAccNo;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryAddress1 = this.selectedBeneficiaryForTransfer.beneAdd1;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryAddress3 = this.selectedBeneficiaryForTransfer.beneAdd3;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryCity = this.selectedBeneficiaryForTransfer.beneCity;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryCountry = this.selectedBeneficiaryForTransfer.beneCountry;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryExternalAccountType = this.selectedBeneficiaryForTransfer.beneExtAccType;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryId = this.selectedBeneficiaryForTransfer.beneID;

    this.insideUaeTransferPayLoad.beneficiary.swiftRoutingCode = this.selectedBeneficiaryForTransfer.swiftRoutingCode;
    this.insideUaeTransferPayLoad.beneficiary.abaNumber = this.selectedBeneficiaryForTransfer.abaNumber;
    this.insideUaeTransferPayLoad.beneficiary.accountBankFormat = this.selectedBeneficiaryForTransfer.accountBankFormat;
    this.insideUaeTransferPayLoad.beneficiary.bankSwiftCode = this.selectedBeneficiaryForTransfer.bankSwiftCode;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryBankAddress1 = this.selectedBeneficiaryForTransfer.beneBankAdd1;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryBankAddress2 = this.selectedBeneficiaryForTransfer.beneBankAdd2;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryBankBranch = this.selectedBeneficiaryForTransfer.beneBankBranch;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryBankCity = this.selectedBeneficiaryForTransfer.beneBankCity;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryBankCountry = this.selectedBeneficiaryForTransfer.beneBankCountry;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryBankId = this.selectedBeneficiaryForTransfer.beneBankId;
    this.insideUaeTransferPayLoad.beneficiary.beneficiaryBankName = this.selectedBeneficiaryForTransfer.beneBankName;
  }

  /**
   * @methodName setInsideUaeCrossCurrencyPayload
   * @parameter none
   * @description used to set inside UAE beneficiary cross currency payload for payment
   * @return none
   */
  setInsideUaeCrossCurrencyPayload(): void {
    this.insideUaeTransferPayLoad.debitAccount = {} as DebitORCreditAccount;
    this.insideUaeTransferPayLoad.creditAccount = {} as DebitORCreditAccount;
    // Verifying cross currency transaction
    if (this.isCrossCurrencyTransaction) {
      this.insideUaeTransferPayLoad.debitAccount.amount = this.insideUaeTransferFormData.debitAmount ?
        this.sharedService.removeCommaFromString(this.insideUaeTransferFormData.debitAmount) : this.insideUaeTransferFormData.debitAmount;
      this.insideUaeTransferPayLoad.creditAccount.amount = this.exchangeRateResponse.creditAmount;
    } else {
      this.insideUaeTransferPayLoad.amount = this.insideUaeTransferFormData.amount ?
        this.sharedService.removeCommaFromString(this.insideUaeTransferFormData.amount) : this.insideUaeTransferFormData.amount;
      this.insideUaeTransferPayLoad.debitAccount.amount = this.insideUaeTransferPayLoad.amount;
      this.insideUaeTransferPayLoad.creditAccount.amount = (this.exchangeRateResponse) ?
        this.exchangeRateResponse.creditAmount : this.insideUaeTransferPayLoad.amount;
    }

    // debitAccount details
    this.insideUaeTransferPayLoad.debitAccount.currencyCode = this.selectedTransferFromAccount.currencyCode;
    this.insideUaeTransferPayLoad.debitAccount.accountNumber = this.selectedTransferFromAccount.accountNumber;
    this.insideUaeTransferPayLoad.debitAccount.description = '';
    this.insideUaeTransferPayLoad.debitAccount.force = '';
    // creditAccount details
    this.insideUaeTransferPayLoad.creditAccount.currencyCode = this.selectedBeneficiaryForTransfer.beneAccCurr;
    this.insideUaeTransferPayLoad.creditAccount.accountNumber = this.selectedBeneficiaryForTransfer.beneAccNo;
    this.insideUaeTransferPayLoad.creditAccount.description = '';
    this.insideUaeTransferPayLoad.creditAccount.force = '';
    this.insideUaeTransferPayLoad.debitRates = this.exchangeRateResponse.debitRates;
    this.insideUaeTransferPayLoad.creditRates = this.exchangeRateResponse.creditRates;
  }

  /**
   * @methodName generateInsideUaeSummaryScreenDetails
   * @parameter none
   * @description used to generate inside UAE summary screen data
   * @return MoneyTransferSummaryModel
   */
  generateInsideUaeSummaryScreenDetails(): MoneyTransferSummaryModel {
    const summaryDetails = {} as MoneyTransferSummaryModel;
    summaryDetails.memo = this.insideUaeTransferFormData.memo;
    // cross currency amount
    if (this.isCrossCurrencyTransaction) {
      // update summary amount based on exchange rate response value
      summaryDetails.amount = this.exchangeRateResponse.creditAmount;
      summaryDetails.debitAmount = this.insideUaeTransferFormData[INSIDE_UAE_TRANSFER_TEXT.DEBIT_AMOUNT];
      summaryDetails.exchangeRate = this.exchangeRateResponse.rate;
    } else {
      summaryDetails.amount = this.insideUaeTransferFormData.amount;
    }
    // set account or card summery data
    summaryDetails.transferfromNumber = (this.selectedTransferFromAccount && this.selectedTransferFromAccount.accountNumber)
      ? this.selectedTransferFromAccount.accountNumber : this.selectedTransferFromCard.cardNumber;
    summaryDetails.transferfromCurrency = (this.selectedTransferFromAccount && this.selectedTransferFromAccount.currencyCode) ?
      this.selectedTransferFromAccount.currencyCode : this.selectedTransferFromCard.currencyCode;
    summaryDetails.transferfromDesc = (this.selectedTransferFromAccount && this.selectedTransferFromAccount.accountType) &&
      ACCOUNT_ALLOWED_FOR_PAYMENTS[this.selectedTransferFromAccount.accountType] ?
      ACCOUNT_ALLOWED_FOR_PAYMENTS[this.selectedTransferFromAccount.accountType] : this.selectedTransferFromCard.customerName;
    // set beneficiary / card summery data
    summaryDetails.transferToNumber = this.selectedBeneficiaryForTransfer.beneAccNo;
    summaryDetails.transferToCurrency = this.selectedBeneficiaryForTransfer.beneAccCurr;
    summaryDetails.transferToDesc = this.selectedBeneficiaryForTransfer.nickName;
    return summaryDetails;
  }

  /**
   * @methodName setTransferToAdibCardSummary
   * @parameter none
   * @description used to set the cover card summary details
   * @return <MoneyTransferSummaryModel>
   */
  setTransferToAccountSummary(): MoneyTransferSummaryModel {
    const summaryDetails = {} as MoneyTransferSummaryModel;
    summaryDetails.memo = this.transferToAcountPayLoad.optionalMemo;
    if (this.selectedTransferFromCard) {
      summaryDetails.transferfromCurrency = this.selectedTransferFromCard.currencyCode;
      summaryDetails.transferfromNumber = this.selectedTransferFromCard.cardNumber;
      summaryDetails.transferfromDesc = this.selectedTransferFromCard.productDescription;
    } else {
      summaryDetails.transferfromCurrency = this.selectedTransferFromAccount.currencyCode;
      summaryDetails.transferfromNumber = this.selectedTransferFromAccount.accountNumber;
      summaryDetails.transferfromDesc = this.selectedTransferFromAccount.classDesc;
    }
    if (this.isCrossCurrencyTransaction) {
      summaryDetails.amount = this.transferToAcountPayLoad.creditAccount.amount ?
        this.sharedService.removeCommaFromString(this.transferToAcountPayLoad.creditAccount.amount) :
        this.transferToAcountPayLoad.creditAccount.amount;
      summaryDetails.debitAmount = this.transferToAcountPayLoad.debitAccount.amount ?
        this.sharedService.removeCommaFromString(this.transferToAcountPayLoad.debitAccount.amount) :
        this.transferToAcountPayLoad.debitAccount.amount;
      summaryDetails.exchangeRate = this.exchangeRateResponse.rate;
    } else {
      summaryDetails.amount = this.transferToAcountPayLoad.amount ?
        this.sharedService.removeCommaFromString(this.transferToAcountPayLoad.amount) : this.transferToAcountPayLoad.amount;
    }
    summaryDetails.transferToDesc = this.selectedTransferToAccount.classDesc;
    summaryDetails.transferToNumber = this.selectedTransferToAccount.accountNumber;
    summaryDetails.transferToCurrency = this.selectedTransferToAccount.currencyCode;

    return summaryDetails;
  }

  /**
   * @methodName sendTransferRequest
   * @parameter url<string>, payLoad<UtilityPaymentPayLoad>
   * @description used to post the payment request to the server
   * @return Observable<any>
   */

  // It is consumed by multiple API's so retyrn type is any
  sendTransferRequest(url: string, payLoad: TransferToAccountPayLoad | CoverCardPaymentPayLoad | CardToAccountPayload): Observable<any> {
    return this.httpService.post(url, payLoad);
  }

  /**
   * @methodName setAccountTransferPayLoad
   * @parameter none
   * @description used to set the account payload
   * @return TransferToAccountPayLoad
   */
  setAccountTransferPayLoad(): TransferToAccountPayLoad {
    const debitAccountPayload = {} as AccountPayload;
    const creditAccountPayload = {} as AccountPayload;
    debitAccountPayload.currencyCode = this.selectedTransferFromAccount.currencyCode;
    debitAccountPayload.accountNumber = this.selectedTransferFromAccount.accountNumber;
    creditAccountPayload.accountNumber = this.selectedTransferToAccount.accountNumber;
    creditAccountPayload.currencyCode = this.selectedTransferToAccount.currencyCode;

    if (this.isCrossCurrencyTransaction) {
      debitAccountPayload.amount = this.transferToAcountPayLoad.debitAccount.amount ?
        this.sharedService.removeCommaFromString(this.transferToAcountPayLoad.debitAccount.amount) :
        this.transferToAcountPayLoad.debitAccount.amount;
      creditAccountPayload.amount = this.transferToAcountPayLoad.creditAccount.amount ?
        this.sharedService.removeCommaFromString(this.transferToAcountPayLoad.creditAccount.amount) :
        this.transferToAcountPayLoad.creditAccount.amount;
      // updating debitRates,creditRates from exchangeRateResponse
      this.transferToAcountPayLoad.debitRates = this.exchangeRateResponse.debitRates;
      this.transferToAcountPayLoad.creditRates = this.exchangeRateResponse.creditRates;
    } else {
      debitAccountPayload.amount = this.transferToAcountPayLoad.amount ?
        this.sharedService.removeCommaFromString(this.transferToAcountPayLoad.amount) : this.transferToAcountPayLoad.amount;
      creditAccountPayload.amount = debitAccountPayload.amount;
    }
    this.transferToAcountPayLoad.debitAccount = debitAccountPayload;
    this.transferToAcountPayLoad.creditAccount = creditAccountPayload;
    this.transferToAcountPayLoad.stpTypeCode = TRANSFER_ACCOUNT_PAYLOAD.stpTypeCode;
    this.transferToAcountPayLoad.transferType = TRANSFER_ACCOUNT_PAYLOAD.transferType;
    const date = this.sharedService.getCurrentDate();
    this.transferToAcountPayLoad.transferDate = date.substring(0, date.indexOf('T'));
    return this.transferToAcountPayLoad;

  }

  /**
   * @methodName setCardToAccountTransferPayLoad
   * @parameter none
   * @description used to set the cover card payment payload
   * @return <CoverCardPaymentPayLoad>
   */
  async setCardToAccountTransferPayLoad(): Promise<CardToAccountPayload> {
    if (this.selectedTransferFromCard) {
      const coverCardPaymentPayload = {} as CardToAccountPayload;
      coverCardPaymentPayload.card = {} as UtilityPaymentCardObj;
      // countryCode data from CountryCodeDetails API
      const CURRENCY_CODE = this.selectedTransferFromCard.currencyCode;
      const promise = await this.sharedService.getCountryCodeDetails(CURRENCY_CODE).toPromise().then(response => {
        coverCardPaymentPayload.card.countryCode = response.isoAlpha3;
      });
      coverCardPaymentPayload.accountNumber = this.selectedTransferToAccount && this.selectedTransferToAccount.accountNumber ?
        this.selectedTransferToAccount.accountNumber : '';
      coverCardPaymentPayload.amount = Number(this.transferToAcountPayLoad.amount ?
        this.sharedService.removeCommaFromString(this.transferToAcountPayLoad.amount) : this.transferToAcountPayLoad.amount);
      coverCardPaymentPayload.optionalMemo = (this.transferToAcountPayLoad) ? this.transferToAcountPayLoad.optionalMemo : undefined;
      // beneficiaryID will be empty when paying to own accounts or own cards
      coverCardPaymentPayload.card.cardNumber = this.selectedTransferFromCard.cardNumber;
      // cardType will be CREDIT for cover card transfer
      coverCardPaymentPayload.card.cardType = INSIDE_UAE_TRANSFER_TEXT.CREDIT_TEXT;
      coverCardPaymentPayload.card.expiryDate = this.selectedTransferFromCard.expiryDate;
      coverCardPaymentPayload.card.currencyCode = this.selectedTransferFromCard.currencyCode;
      coverCardPaymentPayload.isIntraBank = true;
      return coverCardPaymentPayload;
    }
  }

  /**
   * @methodName setTransferToAdibCardPayLoad
   * @parameter none
   * @description used to set the cover card payment payload
   * @return <CoverCardPaymentPayLoad>
   */
  setTransferToAdibCardPayLoad(): CoverCardPaymentPayLoad {
    const coverCardPaymentPayload = {} as CoverCardPaymentPayLoad;
    coverCardPaymentPayload.accountNumber = this.selectedTransferFromAccount && this.selectedTransferFromAccount.accountNumber ?
      this.selectedTransferFromAccount.accountNumber : '';
    coverCardPaymentPayload.amount = this.transferToAdibCardPayLoad && this.transferToAdibCardPayLoad.amount ?
      this.sharedService.removeCommaFromString(this.transferToAdibCardPayLoad.amount) : '';
    coverCardPaymentPayload.optionalMemo = this.transferToAdibCardPayLoad && this.transferToAdibCardPayLoad.optionalMemo ?
      this.transferToAdibCardPayLoad.optionalMemo : '';
    // will be empty when paying from own accounts to own cards
    coverCardPaymentPayload.card = {} as UtilityPaymentCardObj;
    coverCardPaymentPayload.card.cardNumber = this.selectedTransferToCard.cardNumber;
    coverCardPaymentPayload.card.cardType = this.selectedTransferToCard.cardType;
    coverCardPaymentPayload.card.expiryDate = this.selectedTransferToCard.expiryDate;
    coverCardPaymentPayload.card.currencyCode = this.selectedTransferToCard.currencyCode;
    // will be false when paying from own accounts to own cards
    coverCardPaymentPayload.intraBank = false;
    // will be UAE for payment from own accounts to own cards
    coverCardPaymentPayload.card.countryCode = PAYMENT_SCREEN_TEXT.uaeCountryCode;
    return coverCardPaymentPayload;
  }

  /**
   * @methodName setInsideUaeTransferFromCoverCardPayLoad
   * @parameter none
   * @description used to set the inside UAE transfer if the user select from CoverCard payment
   * @return <CoverCardPaymentPayLoad>
   */
  async setInsideUaeTransferFromCoverCardPayLoad(): Promise<CoverCardPaymentPayload> {
    if (this.selectedBeneficiaryForTransfer) {
      const coverCardPaymentPayload = {} as CoverCardPaymentPayload;
      coverCardPaymentPayload.card = {} as CardPayload;
      // countryCode data from CountryCodeDetails API
      const CURRENCY_CODE = this.selectedTransferFromCard.currencyCode;
      const promise = await this.sharedService.getCountryCodeDetails(CURRENCY_CODE).toPromise().then(response => {
        coverCardPaymentPayload.card.countryCode = (response) ? response.isoAlpha3 : undefined;
      });
      coverCardPaymentPayload.accountNumber = (this.selectedBeneficiaryForTransfer.beneAccNo) ?
        this.selectedBeneficiaryForTransfer.beneAccNo : '';
      coverCardPaymentPayload.amount = Number((this.insideUaeTransferFormData && this.insideUaeTransferFormData.amount) ?
        this.sharedService.removeCommaFromString(this.insideUaeTransferFormData.amount) : '');
      coverCardPaymentPayload.optionalMemo = (this.insideUaeTransferFormData && this.insideUaeTransferFormData.memo) ?
        this.insideUaeTransferFormData.memo : '';
      coverCardPaymentPayload.beneficiaryID = (this.selectedBeneficiaryForTransfer.beneID) ?
        this.selectedBeneficiaryForTransfer.beneID : '';
      // card details
      coverCardPaymentPayload.card.cardNumber = this.selectedTransferFromCard.cardNumber;
      coverCardPaymentPayload.card.cardType = INSIDE_UAE_TRANSFER_TEXT.CREDIT_TEXT;
      coverCardPaymentPayload.card.expiryDate = this.selectedTransferFromCard.expiryDate;
      coverCardPaymentPayload.card.currencyCode = this.selectedTransferFromCard.currencyCode;
      // will be false when paying from own accounts to own cards
      coverCardPaymentPayload.isIntraBank = true;
      // will be UAE for payment from own accounts to own cards
      return coverCardPaymentPayload;
    }
  }

  /**
   * @methodName setTransferToAdibCardBeneficiaryPayLoad
   * @parameter none
   * @description used to set the cover card payment payload
   * @return <CoverCardPaymentPayLoad>
   */
  async setTransferToAdibCardBeneficiaryPayLoad(): Promise<CoverCardPaymentPayLoad> {
    const coverCardPaymentPayload = {} as CoverCardPaymentPayLoad;
    coverCardPaymentPayload.card = {} as UtilityPaymentCardObj;
    const promise = await this.sharedService.fetchCardDetails(this.selectedBeneficiaryForTransfer.beneAccNo).toPromise().then(res => {
      // cardType will be CREDIT for payment to COVER-CARD
      coverCardPaymentPayload.card.cardType = INSIDE_UAE_TRANSFER_TEXT.CREDIT_TEXT;
      coverCardPaymentPayload.card.expiryDate = res.expiryDate;
      coverCardPaymentPayload.card.currencyCode = res.currencyCode;
      coverCardPaymentPayload.card.countryCode = PAYMENT_SCREEN_TEXT.uaeCountryCode;
    });
    coverCardPaymentPayload.accountNumber = this.selectedTransferFromAccount && this.selectedTransferFromAccount.accountNumber ?
      this.selectedTransferFromAccount.accountNumber : '';
    if (this.isCrossCurrencyTransaction) {
      coverCardPaymentPayload.amount = this.exchangeRateResponse ? this.exchangeRateResponse.creditAmount : '';
    } else {
      coverCardPaymentPayload.amount = this.insideUaeTransferFormData && this.insideUaeTransferFormData.amount ?
        this.sharedService.removeCommaFromString(this.insideUaeTransferFormData.amount) : '';
    }
    coverCardPaymentPayload.optionalMemo = this.insideUaeTransferFormData && this.insideUaeTransferFormData.memo ?
      this.insideUaeTransferFormData.memo : '';
    // beneficiaryId will be empty when paying to own accounts or own cards
    coverCardPaymentPayload.beneficiaryId = (this.selectedBeneficiaryForTransfer) ? this.selectedBeneficiaryForTransfer.beneID : '';
    coverCardPaymentPayload.card.cardNumber = this.selectedBeneficiaryForTransfer.beneAccNo;
    coverCardPaymentPayload.intraBank = true;
    return coverCardPaymentPayload;
  }
  /**
   * @methodName generateInsideUaeEndPoints
   * @parameter none
   * @description used to generate end point for inside UAE transfer
   * @return none
   */
  async generateInsideUaeEndPoints(): Promise<void | boolean> {
    this.insideUaeTransferPayLoad = {} as CoverCardPaymentPayload;
    this.insideUaeTransferEndPoint = '';
    if (this.selectedTransferFromCard) {
      // From cover card to beneficiary transfer
      this.insideUaeTransferEndPoint = TRANSFER_ENDPOINTS.UAE_COVERECARD_ACC_INTERNAL_TRANSFER;
      this.insideUaeTransferPayLoad = await this.setInsideUaeTransferFromCoverCardPayLoad();
      return true;
    } else if (this.isTransferToAdibCardBeneficiary()) {
      // From account to ADIB card beneficiary
      this.insideUaeTransferPayLoad = await this.setTransferToAdibCardBeneficiaryPayLoad();
      this.insideUaeTransferEndPoint = UTILITY_PAYMENT_ENDPOINTS.COVER_CARD_PAYMENT;
      return true;
    } else if (this.isBeneficiaryOutsideAdibUAE()) {
      // To beneficiary outside ADIB within UAE
      this.generateInsideUaeRequestPayLoad();
      this.insideUaeTransferPayLoad.transferType = INSIDE_UAE_TRANSFER_TEXT.TRANSFER_TYPE_OUTSIDE_ADIB;
      this.insideUaeTransferEndPoint = TRANSFER_ENDPOINTS.UAE_EXTERNAL_TRANSFER;
      return true;
    } else if (this.isBeneficiaryInsideAdibUAE()) {
      // To beneficiary inside ADIB within UAE
      this.generateInsideUaeRequestPayLoad();
      this.insideUaeTransferPayLoad.transferType = INSIDE_UAE_TRANSFER_TEXT.TRANSFER_TYPE_INSIDE_ADIB;
      this.insideUaeTransferEndPoint = TRANSFER_ENDPOINTS.UAE_INTERNAL_TRANSFER;
      return true;
    }
  }

  /**
   * @methodName sendInsideUaePaymentRequest
   * @parameter none
   * @description used to set the inside UAE transfer if the user select from CoverCard payment
   * @return Observable<any>
   */
  sendInsideUaePaymentRequest(): Observable<any> {
    const INSIDE_UAE_API_URL = this.sharedService.generateApiUrl(DOMAINS.API_SIT_CONNECT, true, false)
      + this.insideUaeTransferEndPoint;
    return this.httpService.post(INSIDE_UAE_API_URL, this.insideUaeTransferPayLoad);
  }

  /**
   * @methodName isTransferToAdibCardBeneficiary
   * @parameter none
   * @description used to check ADIB card beneficiary
   * @return boolean
   */
  isTransferToAdibCardBeneficiary(): boolean {
    return (this.selectedBeneficiaryForTransfer.beneExtAccType === INSIDE_UAE_TRANSFER_TEXT.creditCardText
      && this.isBeneficiaryInsideAdibUAE()) ? true : false;
  }

  /**
   * @methodName getTransferType
   * @parameter none
   * @description used to return transfer type 1 | 2 | 3
   * @return string
   */
  getTransferType(): string {
    if (this.isBeneficiaryInsideAdibUAE()) {
      return INSIDE_UAE_TRANSFER_TEXT.TRANSFER_TYPE_INSIDE_ADIB;
    } else if (this.isBeneficiaryOutsideAdibUAE()) {
      return INSIDE_UAE_TRANSFER_TEXT.TRANSFER_TYPE_OUTSIDE_ADIB;
    } else if (this.isTransferToAdibAccount()) {
      return TRANSFER_ACCOUNT_PAYLOAD.transferType;
    }
  }
}
