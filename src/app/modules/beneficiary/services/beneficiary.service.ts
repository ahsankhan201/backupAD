import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { APISyncService } from 'src/app/common/services/sync.service';
import {
  CountriesDetailsList, BankDetailsList, CountryDetails,
  AddInternationalBeneficiary,
  SummaryDetails,
  AddInternalBeneficiary,
  AccountDetailsFromApi,
  CardDetailsFromApi,
  AllUtilityList,
  ValidateIBAN
} from 'src/app/common/models/beneficiary-module.model';
import { ACCOUNT_TYPES, FORM_LENGTH_VALIDATION, DOMAINS } from 'src/app/common/global-constants';
import { BENEFICIARY_ENDPOINTS, ACCOUNTS_ENDPOINTS, PARTY_ENDPOINTS } from 'src/app/common/api-endpoints';
import { OTPLocation } from 'src/app/common/models/otp.model';
import {
  BENEFICIARY_FORM_TEXT,
  PAYEE_TYPE, PAYEE_ID,
  BANK_SELECTION_SCREEN_TEXT,
  ACCOUNTS_OR_CARDS_MAP,
  COUNTRY_CODE_UAE,
  ROMANIA_REGEX,
  ROMANIA_RESTRICTED_WORDS
} from '../beneficiary-module.constants';

import { SharedService } from 'src/app/common/services/shared.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService implements OnDestroy {
  subscription$ = new Subscription();
  region: string;
  bank: string;
  countriesList: CountryDetails[];
  addedBy: string;
  currency: string;
  formData: object;
  selectedAccountType: string;
  selectedBenCountryDetails: any = {};
  internationalBenPayLoadObj = new AddInternationalBeneficiary();
  internalBenPayLoad = new AddInternalBeneficiary();
  selectedInternationalBankName: string;
  benSummaryDetails = new SummaryDetails();
  public selectedCountry = new BehaviorSubject<string>('');
  beneficiaryList = [];
  isMobileBene = false;
  selectedRegion = new BehaviorSubject<string>(undefined);
  restrictRegex: RegExp;
  restrictArray: string[];
  constructor(private syncService: APISyncService, private sharedService: SharedService) { }
  /**
   * @methodName setRegion
   * @description used to set Region
   * @parameters none
   * @return none
   */
  setRegion(region): void {
    this.region = region;
    this.selectedRegion.next(region);
  }
  /**
   * @methodName getRegion
   * @description used to get getRegion
   * @parameters none
   * @return string
   */
  getRegion(): string {
    return this.region;
  }

  /**
   * @methodName setBank
   * @description used to set bank name
   * @parameters none
   * @return none
   */
  setBank(bank): void {
    this.bank = bank;
  }
  /**
   * @methodName getBank
   * @description used to return bank
   * @parameters none
   * @return string
   */
  getBank(): string {
    return this.bank;
  }
  /**
   * @methodName setAddedBy
   * @description used to  set added By
   * @parameters none
   * @return none
   */
  setAddedBy(addedBy): void {
    this.addedBy = addedBy;
  }
  /**
   * @methodName getAddedBy
   * @description used to return addedBy
   * @parameters none
   * @return string
   */
  getAddedBy(): string {
    return this.addedBy;
  }
  /**
   * @methodName setCurrency
   * @description used to set currency
   * @parameters none
   * @return none
   */
  setCurrency(currency): void {
    this.currency = currency;
  }
  /**
   * @methodName getCurrency
   * @description used to get currency
   * @parameters none
   * @return string
   */
  getCurrency(): string {
    return this.currency;
  }
  /**
   * @methodName setformData
   * @description used to set account formData
   * @parameters none
   * @return string
   */
  setformData(formData): void {
    this.formData = formData;
  }
  /**
   * @methodName getCurrency
   * @description used to get account formData
   * @parameters none
   * @return string
   */
  getformData() {
    return this.formData;
  }
  /**
   * @methodName setSelectedCountry
   * @description used to get account formData
   * @parameters none
   * @return string
   */
  setSelectedCountry(value) {
    this.selectedCountry.next(value);
  }

  /**
   * @methodName getSelectedCountry
   * @description used to get account formData
   * @parameters none
   * @return string
   */
  getSelectedCountry(): Observable<any> {
    return this.selectedCountry.asObservable();
  }

  /**
   * @methodName getCountriesList
   * @description used to fetch all the countries data from sever
   * @parameter none
   * @return observable object
   */

  getCountriesList(): Observable<CountriesDetailsList> {
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) + BENEFICIARY_ENDPOINTS.GET_COUNTRIES_LIST;
    return this.syncService.get(URL);
  }

  /**
   * @methodName fetchCountriesList
   * @description used to fetch the countries data from sever
   * @parameter none
   * @return observable object
   */
  fetchCountriesList(url: string): Observable<CountriesDetailsList> {
    return this.syncService.get(url);
  }

  /**
   * @methodName fetchAdibInternationalCountries
   * @description used to fetch the adib international countries data from sever and push it to key value pair
   * @parameter countriesList
   * @return object<countriesList>
   */
  fetchAdibInternationalCountriesWithKeys(countriesList): any {
    const adibInternationalCountriesListWithKeys = [];
    if (countriesList) {
      countriesList.filter((object) => {
        if (object.adibPresence === 'Yes') {
          return adibInternationalCountriesListWithKeys.push({ id: object.countryISOCode, title: object.countryName });
        }
      });
    }
    return adibInternationalCountriesListWithKeys;
  }

  /**
   * @methodName fetchSwiftCode
   * @description used to fetch the swift code from countries api data from sever
   * @parameter country countriesList
   * @return string
   */
  fetchSwiftCode(country, countriesList): string {
    let swiftCode = '';
    countriesList.filter((object) => {
      if (object.countryISOCode === country) {
        swiftCode = object.swiftCode;
      }
    });
    return swiftCode;
  }

  /**
   * @methodName fetchCountryName
   * @description used to fetch the country name from countries api data from sever
   * @parameter country countriesList
   * @return string
   */
  fetchCountryName(country, countriesList): string {
    let countryName = '';
    countriesList.filter((object) => {
      if (object.countryISOCode === country) {
        countryName = object.countryName;
      }
    });
    return countryName;
  }

  /**
   * @methodName fetchBanksList
   * @description used to fetch the banks data from sever
   * @parameter none
   * @return observable object
   */
  fetchBanksList(url: string): Observable<BankDetailsList> {
    return this.syncService.get(url);
  }

  /**
   * @methodName fetchCurrencyList
   * @description used to fetch currency list from server
   * @parameter none
   * @return observable object
   */
  fetchCurrencyList(url: string) {
    return this.syncService.get(url);
  }

  /**
   * @methodName getBranchesList
   * @description used to map the branches of the selected bank
   * @parameter none
   * @return object<banksList>
   */
  getBranchesList(banksList, bankName): BankDetailsList {
    this.selectedInternationalBankName = bankName;
    const banksListArray = banksList.filter((object) => {
      if (object.bankName === bankName) {
        object.addressLine1 = object.address ? object.address.addressLine1 : '';
        return object;
      }
    });
    return banksListArray;
  }

  /**
   * @methodName mapCurrencyDetailsWithKeys
   * @description used to map the currncy data as key value pair
   * @parameter currencyList
   * @return object<currencyList>
   */
  mapCurrencyDetailsWithKeys(currencyList): any {
    const mappedCurrencyList = [];
    if (currencyList.currency) {
      currencyList.currency.map((element) => {
        mappedCurrencyList.push({ id: element, title: element });
      });
    }
    return mappedCurrencyList;
  }

  /**
   * @methodName checkIBANRequied
   * @description used to check IBANRequied or NOT based on country
   * @parameter selectedCountry countryList
   * @return boolean
   */
  checkIBANRequied(selectedCountry: string, countriesList: CountryDetails[]): boolean {
    let isIBANRequired = false;
    if (countriesList) {
      countriesList.forEach((element) => {
        if (element.countryISOCode === selectedCountry &&
          element.isIBANRequired === BENEFICIARY_FORM_TEXT.IS_IBAN_REQUIRED) {
          isIBANRequired = true;
        }
      });
    }
    return isIBANRequired;
  }

  /**
   * @methodName fetchAccountDetails
   * @description used to fetch account details
   * @parameter url payload
   * @return boolean
   */
  fetchAccountDetails(url: string, payloadObj): Observable<AccountDetailsFromApi> {
    return this.syncService.post(url, payloadObj);
  }

  /**
   * @methodName fetchCardDetails
   * @description used to fetch card details
   * @parameter url payload
   * @return boolean
   */
  fetchCardDetails(url: string, payloadObj): Observable<CardDetailsFromApi> {
    return this.syncService.post(url, payloadObj);
  }
  /**
   * @methodName setBeneficiaryPayLoad
   * @description used to set all the beneficiary detais except internal benfeciary
   * @parameter url payloadForm
   * @return none
   */
  setBeneficiaryPayLoad(beneficiaryForm): void {
    this.internationalBenPayLoadObj.beneficiaryName = (beneficiaryForm && beneficiaryForm.value && beneficiaryForm.value.name) ?
      beneficiaryForm.value.name : '';
    if (beneficiaryForm && beneficiaryForm.value && beneficiaryForm.value.abaCode) {
      this.internationalBenPayLoadObj.abaNumber = beneficiaryForm.value.abaCode;
    }
    if (beneficiaryForm && beneficiaryForm.value && beneficiaryForm.value.account) {
      this.internationalBenPayLoadObj.accountNumber = beneficiaryForm.value.account;
      this.benSummaryDetails.accountDetails.accountTitle = BENEFICIARY_FORM_TEXT.accountNumber;
      this.benSummaryDetails.accountDetails.accountNumber = beneficiaryForm.value.account;
    }
    if (beneficiaryForm && beneficiaryForm.value && beneficiaryForm.value.ibanNumber) {
      this.internationalBenPayLoadObj.iban = beneficiaryForm.value.ibanNumber;
      this.benSummaryDetails.accountDetails.accountTitle = BENEFICIARY_FORM_TEXT.iban;
      this.benSummaryDetails.accountDetails.accountNumber = beneficiaryForm.value.ibanNumber;
    }
    if (beneficiaryForm && beneficiaryForm.value && beneficiaryForm.value.cardNumber) {
      this.internationalBenPayLoadObj.cardNumber = (beneficiaryForm && beneficiaryForm.value && beneficiaryForm.value.cardNumber) ?
        beneficiaryForm.value.cardNumber : '';

    }
    this.internationalBenPayLoadObj.beneficiaryAddress1 = (beneficiaryForm && beneficiaryForm.value && beneficiaryForm.value.addressOne) ?
      beneficiaryForm.value.addressOne : '';
    this.internationalBenPayLoadObj.beneficiaryAddress2 = (beneficiaryForm && beneficiaryForm.value && beneficiaryForm.value.addressTwo) ?
      beneficiaryForm.value.addressTwo : '';
    this.internationalBenPayLoadObj.beneficiaryCity = (beneficiaryForm && beneficiaryForm.value && beneficiaryForm.value.city) ?
      beneficiaryForm.value.city : '';
    this.internationalBenPayLoadObj.beneficiaryCountry = this.selectedBenCountryDetails.countryISOCode;
    this.internationalBenPayLoadObj.nickName = (beneficiaryForm && beneficiaryForm.value && beneficiaryForm.value.nickName) ?
      beneficiaryForm.value.nickName : beneficiaryForm.value.name;
    this.setBeneficiarySummaryDetails(this.internationalBenPayLoadObj);
  }
  /**
   * @methodName setInternalBeneficiaryPayLoad
   * @description used to set the internal beneficiary
   * @parameter form, boolean
   * @return none
   */
  setInternalBeneficiaryPayLoad(beneficiaryForm, isCardSelected: boolean, adibUaeBeneName: string): void {
    this.internalBenPayLoad.mobileNumber = undefined; // reseting mobile beneficiary value if exists
    this.internalBenPayLoad.nickName = beneficiaryForm && beneficiaryForm.value && beneficiaryForm.value.nickName ?
      beneficiaryForm.value.nickName : adibUaeBeneName;
    if (isCardSelected) {
      this.internalBenPayLoad.cardNumber = beneficiaryForm && beneficiaryForm.value ? beneficiaryForm.value.cardNumber : null;
      this.internalBenPayLoad.accountType = ACCOUNT_TYPES.CARD;
    } else {
      this.internalBenPayLoad.cardNumber = '';
      this.internalBenPayLoad.accountType = ACCOUNT_TYPES.ACCOUNT;
      this.internalBenPayLoad.accountNumber = beneficiaryForm && beneficiaryForm.value ? beneficiaryForm.value.account : null;
    }
  }
  /**
   * @methodName setADIBBenSummaryDetails
   * @description used to set the internal beneficiary
   * @parameter url payload
   * @return none
   */
  setADIBBenSummaryDetails(adibUaeCurrency: string): void {
    this.benSummaryDetails.nickName = this.internalBenPayLoad.nickName;
    this.benSummaryDetails.bank = BANK_SELECTION_SCREEN_TEXT.adib;
    this.benSummaryDetails.accountDetails.currency = adibUaeCurrency;
    this.benSummaryDetails.region = this.region;
    if (this.internalBenPayLoad.cardNumber) {
      this.benSummaryDetails.accountDetails.accountTitle = BENEFICIARY_FORM_TEXT.cardNumber;
      this.benSummaryDetails.accountDetails.accountNumber = this.internalBenPayLoad.cardNumber;
    }
    if (this.internalBenPayLoad.accountNumber) {
      this.benSummaryDetails.accountDetails.accountTitle = BENEFICIARY_FORM_TEXT.accountNumber;
      this.benSummaryDetails.accountDetails.accountNumber = this.internalBenPayLoad.accountNumber;
    }
  }
  /**
   * @methodName setBeneficiarySummaryDetails
   * @description used to set beneficiary summary details
   * @parameter url payload
   * @return none
   */
  setBeneficiarySummaryDetails(payLoadObject): void {
    if (Object.keys(payLoadObject).length) {
      if (payLoadObject && payLoadObject.cardNumber) {
        this.benSummaryDetails.accountDetails.accountTitle = BENEFICIARY_FORM_TEXT.cardNumber;
        this.benSummaryDetails.accountDetails.accountNumber = payLoadObject.cardNumber;
      }
      this.benSummaryDetails.nickName = payLoadObject.hasOwnProperty('nickName') ? payLoadObject.nickName : '-';
      this.benSummaryDetails.bank =
        this.selectedInternationalBankName ? this.selectedInternationalBankName : BANK_SELECTION_SCREEN_TEXT.adib;
      this.benSummaryDetails.region = this.region;
      this.benSummaryDetails.accountDetails.name = payLoadObject.beneficiaryName;
      this.benSummaryDetails.accountDetails.currency = payLoadObject.currency;
      this.benSummaryDetails.accountDetails.address = `${payLoadObject.beneficiaryAddress1},${payLoadObject.beneficiaryAddress2},
      ${payLoadObject.beneficiaryCity},${payLoadObject.beneficiaryCountry}`;
    }
  }
  /**
   * @methodName fetchOTPLocation
   * @description used to fetch the otp loacation details
   * @parameter url payload
   * @return Observable
   */
  fetchOTPLocation(url: string, payloadObj): Observable<OTPLocation> {
    return this.syncService.post(url, payloadObj);
  }
  /**
   * @methodName getBeneficiaryListInfo
   * @description used to fetch  all beneficiary accounts from server
   * @parameters none
   * @return none
   */
  getBeneficiaryListInfo(): void {
    const URL = this.sharedService.generateApiUrl(DOMAINS.API_SIT_CONNECT, true, false) + ACCOUNTS_ENDPOINTS.GET_ALL_BENIFICIARY;
    this.subscription$.add(this.syncService.get(URL).subscribe(res => {
      if (res) {
        res = JSON.parse(res.toString());
        this.beneficiaryList = (res && res.length > 0) ? res.retailBeneficiary : undefined;
      }
    }, error => {
    }
    ));
  }

  /**
   * @methodName isBeneIbanExisits
   * @description used to check IBAN duplication
   * @parameters string
   * @return boolean
   */
  isBeneIbanExisits(iban): Observable<boolean> {
    if (iban != null && iban !== '') {
      const user = this.beneficiaryList.filter(item => item.iban === iban);
      return of((user && user.length) > 0 ? true : false);
    }
  }

  /**
   * @methodName getCustomerNameByMobile
   * @description used to fetch customer name by mobile accounts from server
   * @parameters none
   * @return Observable
   */

  getCustomerNameByMobile(mob): Observable<any> {
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) + PARTY_ENDPOINTS.GET_CUSTOMER_NAME_BY_MOBILE;
    const payLoad = { mobileNumber: mob };
    return this.syncService.post(URL, payLoad);
  }

  /**
   * @methodName getUtilityProviderList
   * @description used to fetch customer name by mobile accounts from server
   * @parameters none
   * @return Observable
   */
  getUtilityProviderList(): Observable<AllUtilityList> {
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) + BENEFICIARY_ENDPOINTS.UTILITY_PROVIDER;
    return this.syncService.get(URL);
  }

  /**
   * @methodName setMobileBeneficiaryPayLoad
   * @description used to fetch mobile beneficiary payload
   * @parameters none
   * @return void
   */

  setMobileBeneficiaryPayLoad(beneficiaryForm): void {
    this.isMobileBene = true;
    let MOBILE_NO = BENEFICIARY_FORM_TEXT.mobileCountyCodeWithoutPlus;
    if (beneficiaryForm.mobileNumber.length > FORM_LENGTH_VALIDATION.mobile.minLength) {
      MOBILE_NO += beneficiaryForm.mobileNumber.substring(1);
    } else {
      MOBILE_NO += beneficiaryForm.mobileNumber;
    }
    this.internalBenPayLoad.mobileNumber = MOBILE_NO;
    this.internalBenPayLoad.accountType = ACCOUNT_TYPES.MOBILE;
    this.internalBenPayLoad.nickName = (beneficiaryForm.nickName).substr(0, FORM_LENGTH_VALIDATION.nickname.maxLength);
    this.setMobileBeneficiarySummaryDetails();
  }

  /**
   * @methodName setMobileBeneficiarySummaryDetails
   * @description used to fetch mobile beneficiary summary
   * @parameters none
   * @return void
   */
  setMobileBeneficiarySummaryDetails(): void {
    this.benSummaryDetails.bank = BANK_SELECTION_SCREEN_TEXT.adib;
    this.benSummaryDetails.accountDetails.accountTitle = BENEFICIARY_FORM_TEXT.mobileNumber;
    this.benSummaryDetails.accountDetails.accountNumber = this.internalBenPayLoad.mobileNumber;
    this.benSummaryDetails.nickName = this.internalBenPayLoad.nickName;
  }

  /**
   * @methodName isBeneficiaryExisits
   * @description used to check duplicate beneficiary
   * @param filterName<string>, data <string>
   * @return boolean
   */
  isBeneficiaryExisits(filterName: string, data: string): Observable<boolean> {
    if (data != null && data !== '') {
      const user = (this.sharedService.allBeneficiaryList) ?
        this.sharedService.allBeneficiaryList.filter((item) => { if (item) { return item[filterName] === data; } }) : undefined;
      return of((user && user.length) > 0 ? true : false);
    }
  }
  /**
   * @methodName checkSelfAccountsCards
   * @description check if user accounts / cards is same of adding beneficiary accounts / cards
   * @param filterName<string>, data <string>
   * @return boolean
   */
  checkSelfAccountsCards(accountsOrCards: string, data: string): Observable<boolean> {
    if (this.sharedService.accountsCardsList && data != null && data !== '') {
      let accountsOrCardsList: string;
      let accountOrCards: string;
      (accountsOrCards === ACCOUNTS_OR_CARDS_MAP.CARD_NUMBER) ?
        (accountsOrCardsList = ACCOUNTS_OR_CARDS_MAP.CARDS_LIST, accountOrCards = accountsOrCards) :
        (accountsOrCardsList = ACCOUNTS_OR_CARDS_MAP.ACCOUNTS_LIST, accountOrCards = ACCOUNTS_OR_CARDS_MAP.ACCOUNT_NUMBER);
      const user = this.sharedService.accountsCardsList[accountsOrCardsList].filter(item => item[accountOrCards] === data);
      return of((user && user.length) > 0 ? true : false);
    }
  }
  /**
   * @methodName validateIBAN
   * @description validates the IBAN entered by user
   * @parameter url payload
   * @return boolean
   */
  validateIBAN(IBAN: string): Observable<void> {
    const payloadObj = {} as ValidateIBAN;
    payloadObj.countryCode = this.selectedBenCountryDetails.countryISOCode;
    payloadObj.ibanNumber = IBAN;
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) + BENEFICIARY_ENDPOINTS.VALIDATE_IBAN;
    return this.syncService.post(URL, payloadObj);
  }

  /**
   * @methodName retrictWordForRomaniaValidator
   * @description validate that input field must not have restrict word for Romania
   * @parameters none
   * @return ValidatorFn
   */
  retrictWordForRomaniaValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let restrictKeyWord = null;
      this.restrictRegex = ROMANIA_REGEX;
      this.restrictArray = ROMANIA_RESTRICTED_WORDS;
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

  ngOnDestroy() {
    this.internalBenPayLoad = new AddInternalBeneficiary(); // reseting internal beneficiary
    this.subscription$.unsubscribe();
  }
}
