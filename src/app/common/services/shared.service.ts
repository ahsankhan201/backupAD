import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';

/* Include services here */
import { SnackBarService } from './snack-bar.service';
import { APISyncService } from './sync.service';

/* Include constants and models here */
import { environment } from 'src/environments/environment';
import {
  MOBILE_COUNTRY_CODE_UAE, FORM_LENGTH_VALIDATION, TRANSACTION_GRID_TEXT, PATTERN_SUBSTRING_TWO,
  SNACK_BAR_STATUS, ACCEPTED_COVER_CARDS_FOR_PAYMENT, PAYMENT_SCREEN_TEXT, INTERNATIONAL_TRANSFER_TEXT,
  EMAIL_REGEX, NO_WHITESPACE_REGEX, UNDERSCORE_TEXT, NETWORTH_REQUIRED,
  BODY, E_STATEMENT_DIALOG_DATA, REMOVE_SLASH_REGEX, CUSTOMER_ADDRESS_TYPE, COUNTRY_CODE_ARE, CURRENCY_CODE_AED,
  ACCOUNT_ALLOWED_STATUS_LIST, DOMAINS, ACCOUNT_ALLOWED_TYPE_LIST, ACCOUNT_ALLOWED_FOR_PAYMENTS, DIALOG_OPTION_USER_SESSION_MANAGEMENT,
  REMOVE_ARRAY_STRING, COOLING_PERIOD_CALCULATION, API_HEADERS, INPUT_COMMA_REGEX, PRE_LOGIN_BG_CLASS_NAME
} from '../global-constants';
import { GENERIC_ERROR_MESSAGE, CIAM_ERROR_MAPPING } from '../ciam-error-mapping';
import {
  ACCOUNTS_ENDPOINTS, GET_MFP_CUSTOMER_DETAILS_BY_RIM,
  ACCOUNTS_CARDS_ENDPOINTS, CACHED_DATA_ENDPOINTS, BENEFICIARY_ENDPOINTS, PARTY_ENDPOINTS, TRANSFER_ENDPOINTS, DISPLACE_SESSION
} from 'src/app/common/api-endpoints';
import { PAYEE_ENDPOINTS } from 'src/app/common/api-endpoints';
import { OTPResponse } from '../models/otp.model';
import { SnackBar, SnackBarMessage } from '../models/snackBar.model';
import { BeneficiaryListResponse } from '../models/beneficiary.model';
import { PayeeListResponse } from '../models/payee.model';
import { HeadersOTP } from '../models/headers.model';
import {
  TransactionHistoryInterface, PendingTransactionsPayLoad, AccountsList, DebitCardsListResponse,
  Currency, CurrencyList, UserAgreementResponse, UserAgreementRequest
} from '../models/global.model';
import { AccountsCardsDetailsResponse, CoverCardsListResponse } from '../models/global.model';
import { FinanceData, CustomerDetails, CustomerDetailsPayload } from '../models/finance-module.model';
import { Coupon, AccountListModel } from '../models/accounts-module.model';
import { DebitCardData, CoverCardData } from '../models/cards-module.model';
import { TRANSACTION_GRID_TRANSLATION_TEXT } from '../global.language.translation';
import { PaymentCancelRouting } from '../models/payment.model';
import { HttpHeaders } from '@angular/common/http';
import { CARDS_MASTER_DATA, COVER_CARD_IMAGE_MAPPING } from 'src/app/modules/cards/cards-module.constants';
import { TransferPurposeModel } from '../models/money-transfer.model';
import { CustomerDetailsModel, CustomerAddress, CustomerBasicDetailsModel } from 'src/app/common/models/customer-details.model';
import { GetBranchesListReqModel } from '../models/bank-services-module.model';
import { BranchLocation } from '../models/location.model';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  subscription$ = new Subscription();
  snackBarObject = {} as SnackBar;
  snackBarMessage = {} as SnackBarMessage;
  allBeneficiaryList: BeneficiaryListResponse[];
  allPayeeList: PayeeListResponse[];
  allUtilityPayeeList = [] as PayeeListResponse[];
  typeOfTransactionHistory: string = TRANSACTION_GRID_TEXT.DATE_EFFECTIVE;
  isLoadPendingTransctions = false;
  transactionHistoryPayLoad = {} as TransactionHistoryInterface;
  pendingTransactionsPayload = {} as PendingTransactionsPayLoad;
  transactionHistoryResponseObj: any;
  couponObj = new Subject<Coupon[]>();
  accountsCardsList: AccountsCardsDetailsResponse;
  accountCopyData: string;
  cardCopyData: string;
  financeCopyData: string;
  cancelTransactionInfo$ = new BehaviorSubject<PaymentCancelRouting>(undefined);
  setHorizontalLineInfo$ = new BehaviorSubject<string>(undefined);
  switchLanguage$ = new BehaviorSubject<string>(undefined);
  debitCardsList: DebitCardsListResponse[];
  accountsList: AccountsList[];
  coverCardsList: CoverCardsListResponse[];
  debitCardData: DebitCardData[] = [];
  coverCardData: CoverCardData[] = [];
  utilityBeneficiaryList = [];
  coverCardsListforTransfer: CoverCardData[];
  restrictRegex: RegExp;
  restrictArray: string[];
  networth = new Subject<string>();
  customerDetailsSubject = new Subject<string>();
  accessToken: string;
  refreshToken: string;
  isUserLoggedIn: boolean;
  selectedStatementMonth: number;
  selectedStatementYear: number;
  customerRIMID: string;
  isSessionExpired: boolean;
  userEmailId: string;
  previousRoute: string;
  currentRoute: string;
  selectedDashboardText: string;
  customerDetail: CustomerDetailsModel;
  customerFilteredPrimaryAddress: CustomerAddress;
  customerBasicDetails = {} as CustomerBasicDetailsModel;
  setShowPaybill = new BehaviorSubject<string>(undefined);
  agreementVersion: string;
  agreementContent: string;
  accountsListData = {} as AccountsList;
  xLanguage = API_HEADERS.xLanguage;
  loaderSubject = new BehaviorSubject<boolean>(false);
  selectedBankingServicesOnQuickLink: string;

  constructor(
    private snackBarService: SnackBarService,
    private httpService: APISyncService,
    private router: Router) {
    this.currentRoute = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousRoute = this.currentRoute;
        this.currentRoute = event.url;
      }
    });
  }

  /**
   * @methodName getPreviousUrl
   * @description used to return the previous module route
   * @parameters none
   * @return string
   */
  public getPreviousRoute(): string {
    return this.previousRoute ? this.previousRoute.replace(REMOVE_SLASH_REGEX, '') : '';
  }

  /**
   * @methodName isEmpty
   * @description used to check value is empty or not
   * @param value<string>
   * @return boolean
   */
  isEmpty(value: string): boolean {
    return value === null || value.length === 0;
  }

  /**
   * @methodName retrictWordValidator
   * @description validate that input field must not have restrict word
   * @parameters none
   * @return ValidatorFn
   */
  retrictWordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let restrictKeyWord = null;
      if (control.value !== null && this.restrictRegex !== undefined) {
        const forbidden = this.restrictRegex.test(control.value);
        if (forbidden) {
          this.restrictArray.forEach(word => {
            if (control.value.toUpperCase().includes(word.toUpperCase())) {
              restrictKeyWord = word;
            }
          });
          restrictKeyWord = { restrictWord: { value: restrictKeyWord, message: restrictKeyWord } };
        }
        return restrictKeyWord;
      }
    };
  }

  /**
   * @methodName copyToClipboard
   * @description used to copy the content on clipboard
   * @param copyContent<string>
   * @return boolean
   */
  copyToClipboard(copyContent: string): boolean {
    if (copyContent) {
      if (!navigator.clipboard) {
        const listener = (clipboardEvent: ClipboardEvent) => {
          const clipboard = clipboardEvent.clipboardData || window[TRANSACTION_GRID_TEXT.CLIPBOARD_CMD];
          clipboard.setData(TRANSACTION_GRID_TEXT.TEXT_CMD, copyContent.toString());
          clipboardEvent.preventDefault();
        };
        document.addEventListener(TRANSACTION_GRID_TEXT.COPY_CMD, listener, false);
        const copyStatus = document.execCommand(TRANSACTION_GRID_TEXT.COPY_CMD);
        document.removeEventListener(TRANSACTION_GRID_TEXT.COPY_CMD, listener, false);
        return copyStatus;
      } else {
        // copy functionality for safari
        try {
          navigator.clipboard.writeText(copyContent);
          return true;
        } catch (err) {
          return false;
        }
      }
    }
    return false;
  }

  /**
   * @methodName getSelectedAccountTypeList
   * @description used to get select account type list
   * @parameters list of accounts<AccountsList[]>
   * @return AccountsList[]
   */
  getSelectedAccountTypeList(accountList: AccountsList[]): AccountsList[] {
    return accountList.filter(account => ACCOUNT_ALLOWED_TYPE_LIST.hasOwnProperty(account.accountType) &&
      ACCOUNT_ALLOWED_STATUS_LIST.includes(account.status));
  }

  /**
   * @methodName notifyCopyData
   * @parameter copyStatus<string>
   * @description used to show the snackbar message
   * @return none
   */
  notifyCopyData(copyStatus: boolean): void {
    const MESSAGE = copyStatus ? TRANSACTION_GRID_TRANSLATION_TEXT.tr_transactionGrid_copy_success
      : TRANSACTION_GRID_TRANSLATION_TEXT.tr_transactionGrid_copy_fail;
    const msgStatus = copyStatus ? SNACK_BAR_STATUS.success : SNACK_BAR_STATUS.error;
    this.snackBarService.showSnackBar({ showSnackBar: true, message: { msgType: msgStatus, msgText: MESSAGE } });
  }

  /**
   * @methodName setCouponData
   * @description used to set the account coupon information
   * @parameters none
   * @return string
   */
  setCouponData(value: Coupon[]): void {
    this.couponObj.next(value);
  }

  /**
   * @methodName setAccontsCardsList
   * @description used to set the account cards list as observable
   * @parameters none
   * @return <observable>
   */
  setAccontsCardsList(): Observable<AccountsCardsDetailsResponse> {
    const ALL_CARDS_API = this.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      ACCOUNTS_CARDS_ENDPOINTS +
      `?${NETWORTH_REQUIRED}=` + true;
    return this.httpService.get(ALL_CARDS_API);
  }

  /**
   * @methodName setSnackBarMessage
   * @parameter otpResponseObj<OTPResponse>, messageType<string>
   * @description used to set the snackbar message object
   * @return none
   */
  setSnackBarMessage(otpResponseObj: OTPResponse, messageType: string): void {
    this.snackBarObject.showSnackBar = true;
    this.snackBarObject.message = this.snackBarMessage;
    this.snackBarObject.message.msgText = otpResponseObj.message;
    this.snackBarObject.message.msgType = messageType;
    this.snackBarService.showSnackBar(this.snackBarObject);
  }

  /**
   * @methodName generateApiUrl
   * @parameter domainType<string> isAdib<boolean> isApp<boolean>
   * @description used to generate api domain url
   * @return string
   */
  generateApiUrl(domainType: string, isAdib: boolean, isApp: boolean): string {
    return `${environment[domainType]}${(isAdib ? environment.ADIB : '')}${(isApp ? environment.APP : '')}`;
  }

  /**
   * @methodName getMobileNoWithCountryCode
   * @description used to get mobile number with country code
   * @parameters none
   * @return string
   */
  getMobileNoWithCountryCode(mobileNumber: string): string {
    const MOBILE_NUMBER_WITH_COUNTRY_CODE = `${MOBILE_COUNTRY_CODE_UAE}${(mobileNumber.length > FORM_LENGTH_VALIDATION.mobile.minLength ?
      mobileNumber.substring(1) : mobileNumber)}`;
    return MOBILE_NUMBER_WITH_COUNTRY_CODE;
  }

  /**
   * @methodName sliceElementFromList
   * @description used to remove the particular element from the any elementsList based on any filter value
   * @parameter elementsList<any[]>
   * @return elementsList<any[]>
   */
  sliceElementFromList(elementsList: any[], filterProperty: string | number, filterValue: string | number): any[] {
    return elementsList.filter(ele => ele[filterProperty] !== filterValue);
  }
  /**
   * @methodName getAccountList
   * @description used to fetch the accounts info from the server
   * @parameters none
   * @return none
   */
  getAccountList(): Observable<FinanceData[]> {
    const ACCOUNTS_LIST_API = this.generateApiUrl(DOMAINS.APICONNECT, true, false) + ACCOUNTS_ENDPOINTS.LIST_OF_ACCOUNTS;
    return this.httpService.get(ACCOUNTS_LIST_API).pipe(map(res => JSON.parse(res)));
  }

  /**
   * @methodName getCustomerDetails
   * @description used to fetch the customer details by rim
   * @parameters none
   * @return none
   */
  getCustomerDetails(customerDetailsPayload: CustomerDetailsPayload): Observable<CustomerDetails> {

    // CUSTOMER_DETAILS_API URL will remove after integrating with user login
    const CUSTOMER_DETAILS_API = this.generateApiUrl(DOMAINS.APICONNECT, true, false) + GET_MFP_CUSTOMER_DETAILS_BY_RIM;

    return this.httpService.post(CUSTOMER_DETAILS_API, customerDetailsPayload)
      .pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName sliceElementFromList
   * @description used to remove the particular element from the any elementsList based on any filter value
   * @parameter elementsList<any[]>
   * @return elementsList<any[]>
   */
  clone(object: any): any {
    return JSON.parse(JSON.stringify(object));
  }

  /**
   * @methodName setCancelTransactionInfo
   * @description used to set the cancel tranction routing info
   * @parameter showCancelPopUp<boolean>
   * @return none
   */
  setCancelTransactionInfo(showCancelPopUp: boolean, showPopuUp?: boolean): void {
    this.cancelTransactionInfo$.next({ cancelTransaction: showCancelPopUp, hidePopUp: showPopuUp });
  }
  /**
   * @methodName getCancelTransactionInfo
   * @description used to emit the cancel tranction routing info
   * @parameter none
   * @return Observable<string>
   */
  getCancelTransactionInfo(): Observable<PaymentCancelRouting> {
    return this.cancelTransactionInfo$.asObservable();
  }

  /**
   * @methodName setLanguageInfo
   * @description used to set the selected language
   * @parameter selectedLanguage<string>
   * @return none
   */
  setLanguageInfo(selectedLanguage: string): void {
    this.xLanguage = selectedLanguage;
    this.switchLanguage$.next(selectedLanguage);
  }
  /**
   * @methodName getSelectedLanguge
   * @description used to dispatch selected language
   * @parameter none
   * @return Observable<string>
   */
  getSelectedLanguge(): Observable<string> {
    return this.switchLanguage$.asObservable();
  }

  /**
   * @methodName getAllCardsList
   * @description used to fetch all types of cards list
   * @parameters none
   * @return none
   */
  getAllCardsList(): void {
    if (this.accountsCardsList) {
      const response = this.accountsCardsList;
      this.networth.next(response.myNetWorth);
      this.debitCardData = [];
      this.coverCardData = [];
      if (response.cardsList) {
        this.coverCardsList = response.cardsList;
        this.coverCardsList.forEach(coverCard => {
          this.setCoverCardData(coverCard);
        });
      }
      if (response.debitCardsList) {
        this.debitCardsList = response.debitCardsList;
        if (response.accountsList) {
          this.accountsList = response.accountsList;
          this.accountsList.forEach(account => {
            this.accountsListData[account.accountNumber] = account;
          });
          this.debitCardsList.forEach(debitCard => {
            if (this.accountsListData[debitCard.primaryAccountNumber]) {
              this.setDebitCardData(debitCard, this.accountsListData[debitCard.primaryAccountNumber]);
            }
          });
        }
      }
    }
  }

  /**
   * @methodName setDebitCardData
   * @description set debit card data
   * @parameters accountResponse<AccountsList>, debitCardResponse<DebitCardsListResponse>
   * @return none
   */
  setDebitCardData(debitCardResponse: DebitCardsListResponse, accountResponse: AccountsList): void {
    const debitCardListData = {} as DebitCardData;
    debitCardListData.cardHolderName = debitCardResponse.cardHolderName ?
      debitCardResponse.cardHolderName : accountResponse.accountHolderName;
    debitCardListData.cardExpiryDate = debitCardResponse.cardExpiryDate;
    debitCardListData.cardNumber = debitCardResponse.cardNumber;
    debitCardListData.cardStatus = debitCardResponse.cardStatus;
    debitCardListData.primaryAccountNumber = debitCardResponse.primaryAccountNumber;
    debitCardListData.availableBalance = accountResponse.balanceAvailable;
    debitCardListData.currencyCode = accountResponse.currencyCode;
    debitCardListData.accountType = accountResponse.accountType;
    debitCardListData.accountDesc = accountResponse.classDesc;
    debitCardListData.aliasId = debitCardResponse.aliasId;
    this.debitCardData.push(debitCardListData);
  }

  /**
   * @methodName setCoverCardData
   * @description set cover card data
   * @parameters coverCardResponse<CoverCardsListResponse>
   * @return none
   */
  setCoverCardData(coverCardResponse: CoverCardsListResponse): void {
    const coverCardListData = {} as CoverCardData;
    coverCardListData.cardNumber = coverCardResponse.cardNumber;
    coverCardListData.availableLimit = coverCardResponse.availableLimit;
    coverCardListData.cardStatus = coverCardResponse.cardStatus;
    coverCardListData.coverAmount = coverCardResponse.coverAmount;
    coverCardListData.currencyCode = coverCardResponse.currencyCode;
    coverCardListData.customerName = coverCardResponse.customerName;
    coverCardListData.dueBalance = coverCardResponse.dueBalance;
    coverCardListData.expiryDate = coverCardResponse.expiryDate;
    coverCardListData.lastStmtDate = coverCardResponse.lastStmtDate;
    coverCardListData.minimumDueBalance = coverCardResponse.minimumDueBalance;
    coverCardListData.outStandingAmount = coverCardResponse.outStandingAmount;
    coverCardListData.paymentDueDate = coverCardResponse.paymentDueDate;
    coverCardListData.primaryCardFlag = coverCardResponse.primaryCardFlag;
    coverCardListData.productDescription = coverCardResponse.productDescription;
    coverCardListData.lastStmtBalance = coverCardResponse.lastStmtBalance;
    coverCardListData.creditAvailable = coverCardResponse.creditAvailable;
    coverCardListData.cardType = coverCardResponse.cardType;
    coverCardListData.aliasId = coverCardResponse.aliasId;
    coverCardListData.cardSubType = coverCardResponse.cardSubType.replace(NO_WHITESPACE_REGEX, UNDERSCORE_TEXT);
    coverCardListData.cardImage = COVER_CARD_IMAGE_MAPPING[coverCardListData.cardSubType] ?
      COVER_CARD_IMAGE_MAPPING[coverCardListData.cardSubType] : CARDS_MASTER_DATA.COVER_CARD_PLACEHOLDER;
    this.coverCardData.push(coverCardListData);
    this.getCardsListForTransfer();
  }

  /**
   * @methodName getCardsListForTransfer
   * @description used to get cards list for transfer component
   * @parameters none
   * @return none
   */
  getCardsListForTransfer(): void {
    if (this.coverCardData) {
      this.coverCardsListforTransfer = this.coverCardData.filter(card => (ACCEPTED_COVER_CARDS_FOR_PAYMENT.includes(card.cardType) &&
        card.currencyCode === PAYMENT_SCREEN_TEXT.aedCurrencyCode && card.cardStatus === CARDS_MASTER_DATA.ACTIVE_CARD_STATUS));
    }
  }

  /**
   * @methodName getAllPayeeList
   * @description get list of all utility payee
   * @parameters void
   * @return UtilityBeneficiaryResponse
   */
  getAllPayeeList(): Observable<PayeeListResponse[]> {
    const URL = this.generateApiUrl(DOMAINS.APICONNECT, true, false) + PAYEE_ENDPOINTS.UTILITY_BENEFICIARY;
    return this.httpService.get(URL).pipe(map((response) => {
      response = JSON.parse(response);
      return this.allUtilityPayeeList = response.utilityPayeeList;
    }
    ));
  }

  /**
   * @methodName getAllBeneficiaryList
   * @description to get the list of all beneficiary including mobile beneficiary
   * @parameters void
   * @return BeneficiaryListResponse[]
   */
  getAllBeneficiaryList(): Observable<BeneficiaryListResponse[]> {
    const URL = this.generateApiUrl(DOMAINS.API_SIT_CONNECT, true, false) + ACCOUNTS_ENDPOINTS.GET_ALL_BENIFICIARY;
    return this.httpService.get(URL).pipe(map((response) => {
      response = JSON.parse(response);
      return this.allBeneficiaryList = response && response.retailBeneficiary && response.retailBeneficiary.length ?
        response.retailBeneficiary : undefined;
    }
    ));
  }

  /**
   * @methodName getReferenceNumber
   * @parameter responseHeaderLocationValue<string>
   * @description used to set reference number in success screen
   * @return string
   */
  getReferenceNumber(responseHeaderLocationValue: string): string {
    return (responseHeaderLocationValue) ? responseHeaderLocationValue.substring(responseHeaderLocationValue.lastIndexOf('/') + 1)
      : undefined;
  }

  /**
   * @methodName getFileName
   * @parameter responseHeaderContentDisposition<string>
   * @description used to set file name of downloaded file
   * @return string
   */
  getFileName(responseHeaderContentDisposition: string): string {
    return (responseHeaderContentDisposition) ?
      responseHeaderContentDisposition.substring(responseHeaderContentDisposition.
        lastIndexOf(E_STATEMENT_DIALOG_DATA.EQUAL_TO) + E_STATEMENT_DIALOG_DATA.ONE)
      : undefined;
  }

  /**
   * @methodName trimNumberWithoutRounding
   * @parameter inputNumber<number>, fixedNumber<number>
   * @description used to trim the number to specified decimals
   * @return string
   */
  trimNumberWithoutRounding(inputNumber: number, fixedNumber: number): string {
    const regEx = new RegExp('^-?\\d+(?:\\.\\d{0,' + fixedNumber + '})?', 'g'); // dinamically generating regEx
    const convertedNumber = (inputNumber) ? inputNumber.toString().match(regEx)[0] : undefined;
    if (convertedNumber) {
      const dot = convertedNumber.indexOf('.');
      if (dot === -1) { // integer, insert decimal dot and repeat zeros
        return convertedNumber + '.' + INTERNATIONAL_TRANSFER_TEXT.ZERO_TEXT.repeat(fixedNumber);
      }
      // findig number of 0's to be added
      const numberOfDecimalsToBeAdded = fixedNumber - (convertedNumber.length - dot) + 1;
      return numberOfDecimalsToBeAdded > 0 ? (convertedNumber + INTERNATIONAL_TRANSFER_TEXT.ZERO_TEXT.repeat(numberOfDecimalsToBeAdded)) :
        convertedNumber;
    }
  }

  /**
   * @methodName getCurrentDate
   * @parameter none
   * @description used to return todays date
   * @return string
   */
  getCurrentDate(): string {
    return new Date().toISOString();
  }

  /**
   * @methodName getCountryCodeDetails
   * @parameter currency?<string> to get filtered list
   * @description used to return the data based on the entity list
   * @return string
   */
  getCountryCodeDetails(currency?: string): Observable<any> {
    const COUNTRY_CODE_DETAILS_LIST_API = this.generateApiUrl(DOMAINS.APICONNECT, true, false) + CACHED_DATA_ENDPOINTS.ENTITY_DATA;
    return this.httpService.get(COUNTRY_CODE_DETAILS_LIST_API, 'object').pipe(map(
      response => {
        response = JSON.parse(response);
        return ((currency && response.entityDataMap) ?
          response.entityDataMap.COUNTRY_CODE_DETAILS.find(item => item.currency === currency) :
          JSON.parse(response));
      }
    ));
  }

  /**
   * @methodName formatCardExpiryDate
   * @parameter expiryDate<string>
   * @description used to formate card expiry date from mmyy to yymm
   * @return string
   */
  formatCardExpiryDate(expiryDate: string): string {
    if (expiryDate) {
      return expiryDate.match(PATTERN_SUBSTRING_TWO).reverse().join('');
    }
  }

  /**
   * @methodName fetchCardDetails
   * @parameter beneficiaryCardNumber<string>
   * @description used to set the inside UAE transfer if the user select from CoverCard payment
   * @return Observable<any>
   */
  fetchCardDetails(beneficiaryCardNumber: string): Observable<any> {
    const CARDS_LIST_API = this.generateApiUrl(DOMAINS.APICONNECT, true, false) + BENEFICIARY_ENDPOINTS.CARD_NUMBER_DETAILS;
    const cardDetailsPayload = { cardNumber: beneficiaryCardNumber };
    return this.httpService.post(CARDS_LIST_API, cardDetailsPayload).pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName setHorizontalLineClass
   * @parameter className<string>
   * @description used to set the horizontal line class name
   * @return none
   */
  setHorizontalLineClass(className: string): void {
    this.setHorizontalLineInfo$.next(className);
  }

  /**
   * @methodName getHorizontalLineClass
   * @parameter none
   * @description used to return the horizontal line class name to it's subscribers
   * @return Observable<string>
   */
  getHorizontalLineClass(): Observable<string> {
    return this.setHorizontalLineInfo$.asObservable();
  }

  /**
   * @methodName validateEmailId
   * @description used for validating email id
   * @parameters none
   * @return ValidatorFn
   */
  validateEmailId(): ValidatorFn {
    const emailRegEx = new RegExp(EMAIL_REGEX);
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value !== null && emailRegEx !== undefined) {
        const isEmailValid = emailRegEx.test(control.value);
        return !isEmailValid ? { email: true } : null;
      }
    };
  }
  /**
   * @methodName checkResponse
   * @description used for check if response is in JSON or plain text
   * @parameters response
   * @return response
   */
  checkResponse(response: string | JSON): string | JSON {
    try {
      return (response[BODY]) ? (JSON.parse(response[BODY].toString())) : JSON.parse(response.toString());
    } catch {
      return response;
    }
  }
  /**
   * @methodName generateHTTPHeaders
   * @description used for generate HttpHeaders from object
   * @parameters response
   * @return response
   */
  generateHTTPHeaders(headersData: HeadersOTP): HttpHeaders {
    let headers = new HttpHeaders();
    Object.keys(headersData).forEach(element => {
      headers = headers.append(element, headersData[element]);
    });
    return headers;
  }

  /**
   * @methodName generateUniqueID
   * @description used to generate x-unique-id
   * @parameters string
   * @return unique identifier string
   */
  generateUniqueID(): string {
    const dateString = Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16);
    return [dateString.substr(0, 8), dateString.substr(8, 4), '4000-8' + dateString.substr(13, 3), dateString.substr(16, 12)].join('-');
  }

  /**
   * @methodName getTimeStamp
   * @description used to generate timeStamp in number format with milliseconds ex: '1596007652118'
   * @parameters none
   * @return number
   */
  getTimeStamp(): number {
    return typeof Date.now === 'function' ? Date.now() : new Date().getTime();
  }

  /**
   * @methodName getCookie
   * @description used to get the cookie by name
   * @parameters cookieName<string>
   * @return string
   */
  getCookie(cookieName: string): string {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieList = decodedCookie.split(';');
    for (const eachCookie of cookieList) {
      if (eachCookie.indexOf(name) !== -1) {
        return eachCookie.substring(name.length, eachCookie.length);
      }
    }
    // if the cookie not found return undefined
    return undefined;
  }
  /**
   * @methodName fetchCustomerDetails
   * @parameter validateCustomerIdentification<boolean>
   * @description fetch the customer details from party microservice
   * @return Observable<CustomerDetails>
   */
  fetchCustomerDetails(validateCustomerIdentification: boolean): Observable<CustomerDetailsModel> {
    const CARDS_LIST_API = this.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      PARTY_ENDPOINTS.GET_CUSTOMER_DETAILS + '?validate_customer_identification=' + validateCustomerIdentification;
    return this.httpService.get(CARDS_LIST_API).pipe(map(res => res ? JSON.parse(res) : res));
  }

  /**
   * @methodName getTransferPurpose
   * @parameter none
   * @description it is used fetch the purpose transfer list from server
   * @return Observable<TransferPurposeModel[]>
   */
  getTransferPurpose(countryCode = COUNTRY_CODE_ARE, currencyCode = CURRENCY_CODE_AED): Observable<TransferPurposeModel[]> {
    const url = this.generateApiUrl(DOMAINS.APICONNECT, true, false) + TRANSFER_ENDPOINTS.TRANSFER_PURPOSE +
      `?${INTERNATIONAL_TRANSFER_TEXT.CONTRY_CODE}=` + countryCode +
      `&${INTERNATIONAL_TRANSFER_TEXT.CURRENCY_CODE}=` + currencyCode;
    return this.httpService.get(url).pipe(map(res => JSON.parse(res)));
  }

  /**
   * @methodName customerData
   * @description it will fetch the customer details from the server
   * @parameters none
   * @return none
   */
  customerData(): void {
    this.fetchCustomerDetails(false).subscribe(
      response => {
        this.customerDetail = response;
        const filteredData = this.searchObjInArray(response.customerAddress, CUSTOMER_ADDRESS_TYPE.ADDRESS_TYPE,
          CUSTOMER_ADDRESS_TYPE.PRIMARY);
        this.customerFilteredPrimaryAddress = (filteredData) ? filteredData : response.customerAddress[0];
        this.setCustomerBasicDetails();
        // fetching country name with country code
        this.getCountryNameWithCode(this.customerFilteredPrimaryAddress.country);
      }
    );
  }

  /**
   * @methodName setCustomerBasicDetails
   * @description it will udpate customer basic details like fullname, firstName, lastName etc.
   * @parameters none
   * @return none
   */
  setCustomerBasicDetails(): void {
    const firstName = this.customerDetail.nameLatin.firstName;
    const lastName = this.customerDetail.nameLatin.lastName;
    const middleName = (this.customerDetail.nameLatin.middleName) ? this.customerDetail.nameLatin.middleName : '';
    this.customerBasicDetails.firstName = firstName;
    this.customerBasicDetails.lastName = lastName;
    this.customerBasicDetails.fullName = `${firstName} ${middleName} ${lastName}`;
    this.customerBasicDetails.mobile = this.customerFilteredPrimaryAddress.phoneOffice;
    this.customerBasicDetails.email = this.customerFilteredPrimaryAddress.email;
    this.customerDetailsSubject.next(this.customerBasicDetails.fullName);
  }

  /**
   * @methodName getBranch
   * @description used to get branch name by location
   * @parameters none
   * @return Observable
   */
  getBranch(payload: GetBranchesListReqModel): Observable<BranchLocation[]> {
    const BRANCH_SEARCH_API_URL = this.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + CACHED_DATA_ENDPOINTS.BRANCH_SEARCH;
    return this.httpService.post(BRANCH_SEARCH_API_URL, payload)
      .pipe(map(response => response.body ? JSON.parse(response.body) : response));
  }

  /**
   * @methodName searchObjInArray
   * @description generic function to filter object based on the key valur match
   * @parameters array, key, value
   * @return object <any>
   */
  searchObjInArray(array: Array<any>, key: string, value: string): any {
    return array.find(eachObj => eachObj[key] === value);
  }

  /**
   * @methodName fetchCountryCurrencyData
   * @description used to fetch the countries/Currency data from sever
   * @parameter url
   * @return observable object
   */
  fetchCountryCurrencyData(url: string): Observable<any> {
    return this.httpService.get(url);
  }

  /**
   * @methodName mapCurrencyDetailsWithKeys
   * @description used to map the currncy data as key value pair
   * @parameter currencyList
   * @return object<currencyList>
   */
  mapCurrencyDetailsWithKeys(currencyList: Currency): CurrencyList[] {
    const mappedCurrencyList = [];
    if (currencyList.currency) {
      currencyList.currency.map((element) => {
        mappedCurrencyList.push({ id: element, title: element });
      });
    }
    return mappedCurrencyList;
  }

  /**
   * @methodName getCountryNameWithCode
   * @description used to fetch country name with country code
   * @parameters countryCode<string>
   * @return none
   */
  getCountryNameWithCode(countryCode: string): void {
    const BRANCH_SEARCH_API_URL = this.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + CACHED_DATA_ENDPOINTS.COUNTRY_CODE_DETAILS + '?code=' + countryCode;
    this.httpService.get(BRANCH_SEARCH_API_URL).subscribe((response) => {
      response = response ? JSON.parse(response) : undefined;
      if (response && response.length && response[0] && response[0].country) {
        // updating countryName property in customerFilteredPrimaryAddress and customerDetail object
        this.customerFilteredPrimaryAddress.countryName = response[0].country;
        this.customerDetail.countryName = response[0].country;
      }
    });
  }

  /**
   * @methodName getAccountListByCurrencyCode
   * @description it will return account List based on currency code
   * @parameters currencyCode<string>
   * @return none
   */
  getAccountListByCurrencyCode(currencyCode: string): AccountListModel[] {
    if (this.accountsCardsList) {
      const transferFromAccountList: AccountListModel[] = [];
      const accountList = this.clone(this.accountsCardsList.accountsList);
      accountList.map(account => {
        if (ACCOUNT_ALLOWED_FOR_PAYMENTS[account.accountType] && ACCOUNT_ALLOWED_STATUS_LIST.includes(account.status)) {
          account.accountTypeDescription = account.classDesc;
          transferFromAccountList.push(account);
        }
      });
      return transferFromAccountList.filter(response => response['currencyCode'] === currencyCode);
    }
  }
  /**
   * @methodName getCIAMErrorMessage
   * @description it search for error code in string and return the error message
   * @parameters exceptionMsg<string>
   * @return string
   */
  getCIAMErrorMessage(exceptionMsg: string): string {
    try {
      const errorCode = exceptionMsg.split(':')[1].trim().split(' ')[0].replace(REMOVE_ARRAY_STRING, '');
      return CIAM_ERROR_MAPPING[errorCode];
    } catch (e) {
      return GENERIC_ERROR_MESSAGE;
    }
  }

  /**
   * @methodName getUserAgreement
   * @description it will get user agreement content from server
   * @parameters url<string>
   * @return Observable<UserAgreementResponse>
   */
  getUserAgreement(url: string): Observable<UserAgreementResponse> {
    return this.httpService.get(url).pipe(map(res => res ? JSON.parse(res) : res));
  }

  /**
   * @methodName makeUserAgreementReq
   * @parameter url<string>, reqPayload<UserAgreementRequest>
   * @description using for new making service request
   * @return Observable<any>
   */
  makeUserAgreementReq(url: string, reqPayLoad: UserAgreementRequest): Observable<any> {
    return this.httpService.post(url, reqPayLoad).pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName getLoaderStatus
   * @description used to broadcast the spinner info
   * @parameters none
   * @return boolean
   */
  getLoaderStatus(): Observable<boolean> {
    return this.loaderSubject.asObservable();
  }
  /**
   * @methodName convertMinutesReadbleFormat
   * @description convert minutes to hours if minutes is greater than 60.
   * @parameters number
   * @return string
   */
  convertMinutesReadbleFormat(minutes: number = 0): string {
    return (minutes < COOLING_PERIOD_CALCULATION.MINUTES) ?
      minutes + COOLING_PERIOD_CALCULATION.MIN_TEXT :
      Math.floor(minutes / COOLING_PERIOD_CALCULATION.MINUTES) +
      COOLING_PERIOD_CALCULATION.HRS_TEXT;
  }
  /**
   * @methodName removeKeyFromObject
   * @description returns object after deleting key
   * @parameters object
   * @return object
   */
  removeKeyFromObject(key: string, object: any): any {
    const cloneObj = this.clone(object);
    if (key in object) {
      delete cloneObj[key];
    }
    return cloneObj;
  }


  /**
   * @methodName stopEventPropagation
   * @description used to prevent default event behaviour & prevent event from reaching any registered event listeners or any other objects
   * @parameters event<MouseEvent>|<KeyboardEvent>
   * @return none
   */
  stopEventPropagation(event: MouseEvent | KeyboardEvent): void {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  /**
   * @methodName handleDisplaceSession
   * @description used to generate URL with displaceSession parameter
   * @parameters CIAM_URL: string, displaceSession: boolean
   * @return string
   */
  handleDisplaceSession(CIAM_URL: string, displaceSession: boolean): string {
    return CIAM_URL =  (displaceSession) ?  CIAM_URL + DISPLACE_SESSION : CIAM_URL;
  }

  /* @methodName removeCommaFromString
   * @description used to remove comma from te input string
   * @parameters string | number
   * @return string
   */
  removeCommaFromString(value: string | number): string {
    // if value exist chack for comma
    if (value) {
      value = value.toString().replace(INPUT_COMMA_REGEX, '');
    }
    return value.toString();
  }

  /**
   * @methodName toggleBackgroundImageClasses
   * @description used to toggle the background image classes
   * @parameters none
   * @return none
   */
  toggleBackgroundImageClasses(): void {
    !this.isUserLoggedIn ? document.querySelector(BODY).classList.add(PRE_LOGIN_BG_CLASS_NAME) :
      document.querySelector(BODY).classList.remove(PRE_LOGIN_BG_CLASS_NAME);
  }
}
