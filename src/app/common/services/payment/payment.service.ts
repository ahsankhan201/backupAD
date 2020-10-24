import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

/* Include services here */
import { APISyncService } from '../sync.service';

import { PayeeListResponse } from '../../models/payee.model';
import { AccountListModel } from '../../models/accounts-module.model';
import {
  UtilityPaymentPayLoad, UtilityInquiryPayLoad,
  PaymentTransferDetails, UtilityOutStandingBalanceResponse, PaymentSummaryDetailsModel, UtilityPaymentCardObj, CoverCardPaymentPayLoad
} from '../../models/payment.model';
import { map } from 'rxjs/operators';
import { PAYMENT_TYPES, ACCOUNT_ALLOWED_FOR_PAYMENTS, PAYMENT_SCREEN_TEXT, DOMAINS } from '../../global-constants';
import { CoverCardData } from '../../models/cards-module.model';
import { SharedService } from '../shared.service';
import { ACCOUNTS_ENDPOINTS } from '../../api-endpoints';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  isPayeeSelectedForPayment: boolean;
  selectedPaymentType: string;
  utilityPaymentPayLoad = {} as UtilityPaymentPayLoad;
  utilityInquiryPayLoad = {} as UtilityInquiryPayLoad;
  selectedPayeeObj = {} as PayeeListResponse;
  selectedCoverCardObj = {} as CoverCardData;
  coverCardPaymentPayLoad = {} as CoverCardPaymentPayLoad;
  isCoverCardSelectedForPayment: boolean;
  selectedAccountForPayment = {} as AccountListModel;
  utilityPayeeOutStandingBalance = {} as UtilityOutStandingBalanceResponse;
  selectedCardObjectForPayment = {};
  confirmScreenRoutingButtonText: string;

  setTransferDetails$ = new BehaviorSubject(undefined);
  setSummaryDetails$ = new BehaviorSubject(undefined);
  setOutStandingBalnce$ = new BehaviorSubject(undefined);

  constructor(
    private httpService: APISyncService,
    private sharedService: SharedService) { }
  /**
   * @methodName setPaymentTransferDetails
   * @parameter transferDetails<PaymentTransferDetails>
   * @description used to dispatch the transfer details to it's subscribers
   * @return none
   */
  setPaymentTransferDetails(transferDetails: PaymentTransferDetails): void {
    this.setTransferDetails$.next(transferDetails);
  }

  /**
   * @methodName getPaymentTransferDetails
   * @parameter none
   * @description used to return the transfer details which sets in setPaymentTransferDetails()
   * @return Observable<PaymentTransferDetails>
   */
  getPaymentTransferDetails(): Observable<PaymentTransferDetails> {
    return this.setTransferDetails$.asObservable();
  }

  /**
   * @methodName setPaymentSummaryDetails
   * @parameter transferDetails<PaymentTransferDetails>
   * @description used to dispatch the transfer details to it's subscribers
   * @return none
   */
  setPaymentSummaryDetails(summaryDetails: PaymentSummaryDetailsModel): void {
    this.setSummaryDetails$.next(summaryDetails);
  }

  /**
   * @methodName getPaymentSummaryDetails
   * @parameter none
   * @description used to return the summaryInfo which sets in setPaymentSummaryDetails()
   * @return Observable<PaymentTransferDetails>
   */
  getPaymentSummaryDetails(): Observable<PaymentSummaryDetailsModel> {
    return this.setSummaryDetails$.asObservable();
  }

  /**
   * @methodName setPaymentSummaryDetails
   * @parameter transferDetails<PaymentTransferDetails>
   * @description used to dispatch the transfer details to it's subscribers
   * @return none
   */
  setOutStandingBalanceSubject(getOutStandingBalance: boolean): void {
    this.setOutStandingBalnce$.next(getOutStandingBalance);
  }
  /**
   * @methodName getOutStandingBalanceSubject
   * @parameter none
   * @description It'll dispatch the outstanding balance details
   * @return Observable<PaymentTransferDetails>
   */
  getOutStandingBalanceSubject(): Observable<boolean> {
    return this.setOutStandingBalnce$.asObservable();
  }
  /**
   * @methodName setUtilityInquiryPayLoad
   * @parameter selectedPayee<PayeeListResponse>
   * @description used to set the Utility Inquiry Payload
   * @return <UtilityInquiryPayLoad>
   */
  setUtilityInquiryPayLoad(selectedPayee: PayeeListResponse): UtilityInquiryPayLoad {
    const utilityInquiryPayLoad = {} as UtilityInquiryPayLoad;
    utilityInquiryPayLoad.pin = selectedPayee.pin;
    utilityInquiryPayLoad.utilityProviderId = selectedPayee.utilityProviderId;
    utilityInquiryPayLoad.utilityProviderProductId = selectedPayee.utilityProviderProductId;
    utilityInquiryPayLoad.utilityServiceNumber = selectedPayee.utilityServiceNumber;
    return utilityInquiryPayLoad;
  }
  /**
   * @methodName generateSummaryScreenDetails
   * @parameter paymentType<string>
   * @description used to generate the summary screen details
   * @return <UtilityInquiryPayLoad>
   */
  generateSummaryScreenDetails(paymentType: string) {
    let summaryDetails = {} as PaymentSummaryDetailsModel;
    switch (paymentType) {
      // It'll form the summary screen details of payee
      case PAYMENT_TYPES.utilityPayment:
      case PAYMENT_TYPES.donate:
        summaryDetails = this.setUtilityPayeeSummaryDetails();
        break;
      case PAYMENT_TYPES.ccPayment:
        summaryDetails = this.setCoverCardPayeeSummaryDetails();
        break;
    }
    this.setPaymentSummaryDetails(summaryDetails);
  }
  /**
   * @methodName setUtilityPayeeSummaryDetails
   * @parameter none
   * @description used to set utility payee summary details
   * @return <PaymentSummaryDetailsModel>
   */
  setUtilityPayeeSummaryDetails(): PaymentSummaryDetailsModel {
    const summaryDetails = {} as PaymentSummaryDetailsModel;
    summaryDetails.accountNumber = this.selectedAccountForPayment.accountNumber;
    summaryDetails.accountTypeDescription = this.selectedAccountForPayment.accountType &&
      ACCOUNT_ALLOWED_FOR_PAYMENTS[this.selectedAccountForPayment.accountType] ?
      ACCOUNT_ALLOWED_FOR_PAYMENTS[this.selectedAccountForPayment.accountType] : undefined;
    summaryDetails.currencyCode = this.selectedAccountForPayment.currencyCode;
    summaryDetails.memo = this.utilityPaymentPayLoad.optionalMemo;
    summaryDetails.payeeName = this.selectedPayeeObj.nickName;
    summaryDetails.utilityServiceNumber = this.selectedPayeeObj.utilityServiceNumber;
    summaryDetails.amount = this.utilityPaymentPayLoad.amount ?
      this.sharedService.removeCommaFromString(this.utilityPaymentPayLoad.amount) : this.utilityPaymentPayLoad.amount;
    summaryDetails.outstandingAmount = this.utilityPayeeOutStandingBalance.outstandingAmount;
    summaryDetails.cardNumber = this.selectedCardObjectForPayment['cardNumber'];
    summaryDetails.cardDescription = this.selectedCardObjectForPayment['productDescription'];
    if (this.isPaymentTypeDonation()) {
      summaryDetails.currencyCode = (this.selectedCardObjectForPayment['cardNumber']) ?
        this.selectedCardObjectForPayment['currencyCode'] : this.selectedAccountForPayment.currencyCode;
      summaryDetails.donationTo = this.selectedPayeeObj ?
        `${this.selectedPayeeObj.payeeCategory}, ${this.selectedPayeeObj.nickName}` : undefined;
    }
    return summaryDetails;
  }
  /**
   * @methodName setUtilityPaymentPayLoad
   * @parameter none
   * @description used to set the Utility payment payload
   * @return <UtilityPaymentPayLoad>
   */
  setUtilityPaymentPayLoad(): UtilityPaymentPayLoad {
    const utilityPaymentPayload = {} as UtilityPaymentPayLoad;
    utilityPaymentPayload.accountNumber = this.selectedAccountForPayment && this.selectedAccountForPayment.accountNumber ?
      this.selectedAccountForPayment.accountNumber : '';
    utilityPaymentPayload.amount = this.utilityPaymentPayLoad && this.utilityPaymentPayLoad.amount ?
      this.sharedService.removeCommaFromString(this.utilityPaymentPayLoad.amount) : '';
    utilityPaymentPayload.optionalMemo = this.utilityPaymentPayLoad && this.utilityPaymentPayLoad.optionalMemo ?
      this.utilityPaymentPayLoad.optionalMemo : '';
    utilityPaymentPayload.utilityProviderId = this.selectedPayeeObj && this.selectedPayeeObj.utilityProviderId ?
      this.selectedPayeeObj.utilityProviderId : '';
    utilityPaymentPayload.utilityProviderProductId = this.selectedPayeeObj && this.selectedPayeeObj.utilityProviderProductId ?
      this.selectedPayeeObj.utilityProviderProductId : '';
    utilityPaymentPayload.beneficiaryId = this.selectedPayeeObj && this.selectedPayeeObj.customerPayeeID ?
      parseInt(this.selectedPayeeObj.customerPayeeID, 10) : undefined; // beneficiaryId udpated as part of V2 migration
    // payload not required for charity donation
    if (!this.isPaymentTypeDonation()) {
      utilityPaymentPayload.payeeId = this.selectedPayeeObj && this.selectedPayeeObj.payeeID ?
        this.selectedPayeeObj.payeeID : ''; // payeeID udpated as part of v2 migration
      utilityPaymentPayload.pin = this.selectedPayeeObj && this.selectedPayeeObj.pin ? this.selectedPayeeObj.pin : '';
      utilityPaymentPayload.referenceNumConsumer = this.utilityPayeeOutStandingBalance &&
        this.utilityPayeeOutStandingBalance.utilityBillReferenceNumber ?
        this.utilityPayeeOutStandingBalance.utilityBillReferenceNumber : '';
      utilityPaymentPayload.utilityServiceNumber = this.selectedPayeeObj && this.selectedPayeeObj.utilityServiceNumber ?
        this.selectedPayeeObj.utilityServiceNumber : '';
    }

    if (this.selectedCardObjectForPayment && Object.keys(this.selectedCardObjectForPayment).length) {
      utilityPaymentPayload.card = {} as UtilityPaymentCardObj;
      utilityPaymentPayload.card.cardNumber = this.selectedCardObjectForPayment['cardNumber'];
      utilityPaymentPayload.card.cardType = this.selectedCardObjectForPayment['cardType'];
      utilityPaymentPayload.card.countryCode = this.selectedCardObjectForPayment['countryCode'] ?
        this.selectedCardObjectForPayment['countryCode'] : '';
      utilityPaymentPayload.card.currencyCode = this.selectedCardObjectForPayment['currencyCode'];
      utilityPaymentPayload.card.expiryDate = this.selectedCardObjectForPayment['expiryDate'];
    }
    return utilityPaymentPayload;
  }
  /**
   * @methodName fetchUtilityOutStandingBalance
   * @parameter url<string>, payLoad<UtilityInquiryPayLoad>
   * @description used to fetch the utility outstanding balance
   * @return Observable<UtilityOutStandingBalanceResponse>
   */
  fetchUtilityOutStandingBalance(url: string, payLoad: UtilityInquiryPayLoad): Observable<UtilityOutStandingBalanceResponse> {
    return this.httpService.post(url, payLoad).pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }
  /**
   * @methodName sendPaymentRequest
   * @parameter url<string>, payLoad<UtilityPaymentPayLoad>
   * @description used to post the payment request to the server
   * @return Observable<any>
   */

  // It is consumed by multiple API's so retyrn type is any
  sendPaymentRequest(url: string, payLoad: UtilityPaymentPayLoad | CoverCardPaymentPayLoad): Observable<any> {
    return this.httpService.post(url, payLoad).pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName getCharityList
   * @parameter none
   * @description used to get charity list from server
   * @return Observable<string>
   */
  getCharityList(): Observable<string> {
    const url = this.sharedService.generateApiUrl(DOMAINS.API_SIT_CONNECT, true, false) + ACCOUNTS_ENDPOINTS.GET_CHARITY_LIST;
    return this.httpService.get(url);
  }

  /**
   * @methodName setCoverCardPayeeSummaryDetails
   * @parameter none
   * @description used to set the cover card summary details
   * @return <PaymentSummaryDetailsModel>
   */
  setCoverCardPayeeSummaryDetails(): PaymentSummaryDetailsModel {
    const summaryDetails = {} as PaymentSummaryDetailsModel;
    summaryDetails.accountNumber = this.selectedAccountForPayment.accountNumber;
    summaryDetails.accountTypeDescription = this.selectedAccountForPayment.accountType &&
      ACCOUNT_ALLOWED_FOR_PAYMENTS[this.selectedAccountForPayment.accountType] ?
      ACCOUNT_ALLOWED_FOR_PAYMENTS[this.selectedAccountForPayment.accountType] : undefined;
    summaryDetails.currencyCode = this.selectedAccountForPayment.currencyCode;
    summaryDetails.memo = this.coverCardPaymentPayLoad.optionalMemo;
    summaryDetails.amount = this.coverCardPaymentPayLoad.amount ?
      this.sharedService.removeCommaFromString(this.coverCardPaymentPayLoad.amount) : this.coverCardPaymentPayLoad.amount;
    summaryDetails.payToCardNumber = this.selectedCoverCardObj.cardNumber;
    summaryDetails.cardDescription = this.selectedCoverCardObj.productDescription;
    summaryDetails.cardCurrencyCode = this.selectedCoverCardObj.currencyCode;
    summaryDetails.outstandingAmount = this.selectedCoverCardObj.dueBalance;
    return summaryDetails;
  }

  /**
   * @methodName setCoverCardPaymentPayLoad
   * @parameter none
   * @description used to set the cover card payment payload
   * @return <CoverCardPaymentPayLoad>
   */
  setCoverCardPaymentPayLoad(): CoverCardPaymentPayLoad {
    const coverCardPaymentPayload = {} as CoverCardPaymentPayLoad;
    coverCardPaymentPayload.accountNumber = this.selectedAccountForPayment && this.selectedAccountForPayment.accountNumber ?
      this.selectedAccountForPayment.accountNumber : '';
    coverCardPaymentPayload.amount = this.coverCardPaymentPayLoad && this.coverCardPaymentPayLoad.amount ?
      this.sharedService.removeCommaFromString(this.coverCardPaymentPayLoad.amount) : '';
    coverCardPaymentPayload.optionalMemo = this.coverCardPaymentPayLoad && this.coverCardPaymentPayLoad.optionalMemo ?
      this.coverCardPaymentPayLoad.optionalMemo : '';
    // will be empty when paying from own accounts to own cards
    coverCardPaymentPayload.beneficiaryId = '';
    coverCardPaymentPayload.card = {} as UtilityPaymentCardObj;
    coverCardPaymentPayload.card.cardNumber = this.selectedCoverCardObj.cardNumber;
    coverCardPaymentPayload.card.cardType = this.selectedCoverCardObj.cardType;
    coverCardPaymentPayload.card.expiryDate = this.selectedCoverCardObj.expiryDate;
    coverCardPaymentPayload.card.currencyCode = this.selectedCoverCardObj.currencyCode;
    // will be false when paying from own accounts to own cards
    coverCardPaymentPayload.intraBank = false;
    // will be UAE for payment from own accounts to own cards
    coverCardPaymentPayload.card.countryCode = PAYMENT_SCREEN_TEXT.uaeCountryCode;
    return coverCardPaymentPayload;
  }

  /**
   * @methodName isPaymentTypeDonate
   * @parameter none
   * @description used to check payment type donation
   * @return boolean
   */
  isPaymentTypeDonation(): boolean {
    return (this.selectedPaymentType === PAYMENT_TYPES.donate) ? true : false;
  }
}
