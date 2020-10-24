import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { APISyncService } from 'src/app/common/services/sync.service';
import {
  PaymentOrderPayload, BaneficiaryDetailsForm,
  PaymentOrderSummaryScreenModel, DemandDraftPayload, DemandDraftSummaryScreenModel
} from 'src/app/common/models/payment-order';
import { AccountListModel } from 'src/app/common/models/accounts-module.model';
import { BANKING_CERTIFICATE_INFO, REQUEST_TYPE } from '../banking-services-module.constants';
import { SharedService } from 'src/app/common/services/shared.service';
import { DOMAINS } from 'src/app/common/global-constants';
import { BANKING_SERVICES_ENDPOINTS, PAYMENTS_ENDPOINTS } from 'src/app/common/api-endpoints';
import {
  BankCertificateReqModel,
  GetBranchesListReqModel,
  EligibleAccountsResponse,
  ChequeBookRequestModel,
  BankingServiceChargesModel,
  ChequeBookResponse,
  BankingServiceChargesResponse, AccountsSummaryResponse, PaymentsSummaryResponse
} from 'src/app/common/models/bank-services-module.model';

@Injectable({
  providedIn: 'root'
})

export class BankingServicesService {
  bankCertificateRequestPayload = {} as BankCertificateReqModel;
  deliveryBranchType: string;
  accountNumberDescription: string;
  selectedBankingService: string;
  amount: string;
  selectedCurrency: string;
  paymentOrderPayload = {} as PaymentOrderPayload;
  selectedTransferFromAccount = {} as AccountListModel;
  baneficiaryDetailsFormData = {} as BaneficiaryDetailsForm;
  enableSummaryScreen$ = new BehaviorSubject<boolean>(undefined);
  enableSummaryScreen = this.enableSummaryScreen$.asObservable();
  demandDraftPayload = {} as DemandDraftPayload;
  cancelButtonClick$ = new BehaviorSubject<string>(undefined);
  cancelButtonClick = this.cancelButtonClick$.asObservable();
  validAccountsForChequeBook: EligibleAccountsResponse;
  chequeBookRequestPayload = {} as ChequeBookRequestModel;
  constructor(private httpService: APISyncService, private sharedService: SharedService) { }

  /**
   * @methodName getAccountsServiceSummary
   * @description get accounts service summary from server
   * @parameters serviceRequestType<string>
   * @return Observable<AccountsSummaryResponse>
   */
  getAccountsServiceSummary(serviceRequestType: string): Observable<AccountsSummaryResponse[]> {
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      BANKING_SERVICES_ENDPOINTS.ACCOUNTS_SERVICE_SUMMARY + '?requestType=' + serviceRequestType;
    return this.httpService.get(URL).pipe(map(res => res ? JSON.parse(res) : res));
  }

  /**
   * @methodName getPaymentsServiceSummary
   * @description get payments service summary from server
   * @parameters serviceRequestType<string>
   * @return Observable<AccountsSummaryResponse>
   */
  getPaymentsServiceSummary(serviceRequestType: string): Observable<PaymentsSummaryResponse[]> {
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      BANKING_SERVICES_ENDPOINTS.PAYMENTS_SERVICE_SUMMARY + '?requestType=' + serviceRequestType;
    return this.httpService.get(URL).pipe(map(res => res ? JSON.parse(res) : res));
  }

  /**
   * @methodName getAccountsServiceDetails
   * @description get accounts service details from server
   * @parameters requestId<number>
   * @return Observable<AccountsSummaryResponse>
   */
  getAccountsServiceDetails(requestId: number): Observable<AccountsSummaryResponse> {
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      BANKING_SERVICES_ENDPOINTS.ACCOUNTS_SERVICE_DETAILS + requestId;
    return this.httpService.get(URL).pipe(map(res => res ? JSON.parse(res) : res));
  }

  /**
   * @methodName getPaymentsServiceDetails
   * @description get payments service details from server
   * @parameters requestId<number>
   * @return Observable<PaymentsSummaryResponse>
   */
  getPaymentsServiceDetails(requestId: number): Observable<PaymentsSummaryResponse> {
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      BANKING_SERVICES_ENDPOINTS.PAYMENTS_SERVICE_DETAILS + requestId;
    return this.httpService.get(URL).pipe(map(res => res ? JSON.parse(res) : res));
  }

  /**
   * @methodName chequeBookEligibility
   * @description it will check eligility for cheque book
   * @parameters url<string>
   * @return Observable<EligibleAccountsResponse>
   */
  chequeBookEligibility(url: string): Observable<EligibleAccountsResponse> {
    return this.httpService.get(url).pipe(map(res => res ? JSON.parse(res) : res));
  }

  /**
   * @methodName submitPaymentOrderRequest
   * @description used to call payment order payments API Service /service/payment-order
   * @parameters url<string>
   * @return Observable
   */
  submitPaymentOrderRequest(): Observable<any> {
    if (this.paymentOrderPayload) {
      const PAYMENT_ORDER_API_URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
        + PAYMENTS_ENDPOINTS.PAYMENT_ORDER;
      return this.httpService.post(PAYMENT_ORDER_API_URL, this.paymentOrderPayload)
        .pipe(map(response => response.body ? JSON.parse(response.body) : response));
    }
  }

  /**
   * @methodName setPaymentOrderPayload
   * @description used to set payment order payload
   * @parameters none
   * @return void
   */
  setPaymentOrderPayload(): void {
    if (this.baneficiaryDetailsFormData && this.selectedTransferFromAccount) {
      const paymenOrderPayload = {} as PaymentOrderPayload;
      paymenOrderPayload.amount = this.amount;
      paymenOrderPayload.beneficiaryName = this.baneficiaryDetailsFormData.beneficiaryName;
      paymenOrderPayload.collectFrom = this.baneficiaryDetailsFormData.collectFrom;
      paymenOrderPayload.purpose = this.baneficiaryDetailsFormData.purposeOfTransfer;
      if (this.sharedService.customerBasicDetails) {
        paymenOrderPayload.customerName = this.sharedService.customerBasicDetails.fullName;
        paymenOrderPayload.emailAddress = this.sharedService.customerBasicDetails.email;
        paymenOrderPayload.firstName = this.sharedService.customerBasicDetails.firstName;
        paymenOrderPayload.lastName = this.sharedService.customerBasicDetails.lastName;
        paymenOrderPayload.mobileNumber = this.sharedService.customerBasicDetails.mobile.toString();
      }
      paymenOrderPayload.requestType = REQUEST_TYPE.PAYMENT_ORDER;
      paymenOrderPayload.sourceAccountNumber = this.selectedTransferFromAccount.accountNumber;
      paymenOrderPayload.currency = this.selectedTransferFromAccount.currencyCode;
      this.paymentOrderPayload = paymenOrderPayload;
    }
  }

  /**
   * @methodName setDemandDraftPayload
   * @description used to set demand draft payload
   * @parameters none
   * @return void
   */
  setDemandDraftPayload(): void {
    if (this.baneficiaryDetailsFormData && this.selectedTransferFromAccount) {
      const demandDraftPayload = {} as DemandDraftPayload;
      demandDraftPayload.amount = this.amount;
      demandDraftPayload.beneficiaryName = this.baneficiaryDetailsFormData.beneficiaryName;
      demandDraftPayload.collectFrom = this.baneficiaryDetailsFormData.collectFrom;
      demandDraftPayload.purpose = this.baneficiaryDetailsFormData.purposeOfTransfer;
      if (this.sharedService.customerBasicDetails) {
        demandDraftPayload.customerName = this.sharedService.customerBasicDetails.fullName;
        demandDraftPayload.emailAddress = this.sharedService.customerBasicDetails.email;
        demandDraftPayload.firstName = this.sharedService.customerBasicDetails.firstName;
        demandDraftPayload.lastName = this.sharedService.customerBasicDetails.lastName;
        demandDraftPayload.mobileNumber = this.sharedService.customerBasicDetails.mobile.toString();
      }
      demandDraftPayload.requestType = REQUEST_TYPE.DEMAND_DRAFT;
      demandDraftPayload.sourceAccountNumber = this.selectedTransferFromAccount.accountNumber;
      demandDraftPayload.currency = this.baneficiaryDetailsFormData.currency;
      this.demandDraftPayload = demandDraftPayload;
    }
  }

  /**
   * @methodName getPaymentOrderPayload
   * @description used to get payment order payload
   * @parameters none
   * @return PaymentOrderPayload
   */
  getPaymentOrderPayload(): PaymentOrderPayload {
    return this.paymentOrderPayload ? this.paymentOrderPayload : undefined;
  }

  /**
   * @methodName getPaymentOrderSummaryData
   * @description used to get payment order summary data
   * @parameters none
   * @return PaymentOrderSummaryScreenModel
   */
  getPaymentOrderSummaryData(): PaymentOrderSummaryScreenModel {
    if (this.paymentOrderPayload && this.selectedTransferFromAccount) {
      let paymenOrderSummeryData = {} as PaymentOrderSummaryScreenModel;
      paymenOrderSummeryData = this.paymentOrderPayload;
      paymenOrderSummeryData.sourceAccountDetails =
        `${this.selectedTransferFromAccount.classDesc} - ${this.selectedTransferFromAccount.accountNumber}`;
      return paymenOrderSummeryData;
    }
  }

  /**
   * @methodName getDemandDraftSummaryData
   * @description used to get demand draft summary data
   * @parameters none
   * @return DemandDraftSummaryScreenModel
   */
  getDemandDraftSummaryData(): DemandDraftSummaryScreenModel {
    if (this.demandDraftPayload) {
      let demandDraftSummeryData = {} as DemandDraftSummaryScreenModel;
      demandDraftSummeryData = this.demandDraftPayload;
      demandDraftSummeryData.sourceAccountDetails =
        `${this.selectedTransferFromAccount.classDesc} - ${this.selectedTransferFromAccount.accountNumber}`;
      return demandDraftSummeryData;
    }
  }

  /**
   * @methodName submitDemandDraftRequest
   * @description used to call demand draft payments API Service /service/payment-order
   * @parameters url<string>
   * @return Observable
   */
  submitDemandDraftRequest(): Observable<any> {
    if (this.demandDraftPayload) {
      const DEMAND_DRAFT_API_URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
        + PAYMENTS_ENDPOINTS.PAYMENT_ORDER;
      return this.httpService.post(DEMAND_DRAFT_API_URL, this.demandDraftPayload)
        .pipe(map(response => response.body ? JSON.parse(response.body) : response));
    }
  }

  /**
   * @methodName fetchBankBranches
   * @parameter url<string>, reqPayload<GetBranchesListReqModel>
   * @description used to fetch bank branches from server
   * @return Observable<any>
   */
  fetchBankBranches(url: string, reqPayload: GetBranchesListReqModel): Observable<any> {
    return this.httpService.post(url, reqPayload).pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName makeBankCertificateReq
   * @parameter url<string>, reqPayload<BankCertificateReqModel>
   * @description using for new making service request
   * @return Observable<any>
   */
  makeBankCertificateReq(url: string, reqPayLoad: BankCertificateReqModel): Observable<any> {
    return this.httpService.post(url, reqPayLoad).pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName fetchBankCertificateCharges
   * @parameter url<string>, reqPayload<BankingServiceChargesModel>
   * @description used to fetch certificate charges from server
   * @return Observable<BankingServiceChargesResponse>
   */
  fetchBankCertificateCharges(url: string, reqPayload: BankingServiceChargesModel): Observable<BankingServiceChargesResponse> {
    return this.httpService.post(url, reqPayload).pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName getBranch
   * @parameter none
   * @description used to fetch bank branches from server
   * @return Observable<any>
   */
  getBranch(): Observable<any> {
    const reqPayload = {} as GetBranchesListReqModel;
    reqPayload.country = BANKING_CERTIFICATE_INFO.UAE_COUNTRY_CODE_FOR_BRANCHES;
    const COUNTRY_LIST_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + BANKING_SERVICES_ENDPOINTS.BRANCH_LIST;
    return this.httpService.post(COUNTRY_LIST_API, reqPayload)
      .pipe(map(response => response.body ? JSON.parse(response.body) : response));
  }

  /**
   * @methodName makeChequeBookReq
   * @parameter url<string>, reqPayload<ChequeBookRequestModel>
   * @description using for new making service request
   * @return Observable<ChequeBookResponse>
   */
  makeChequeBookReq(url: string, reqPayLoad: ChequeBookRequestModel): Observable<ChequeBookResponse> {
    return this.httpService.post(url, reqPayLoad).pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }
}
