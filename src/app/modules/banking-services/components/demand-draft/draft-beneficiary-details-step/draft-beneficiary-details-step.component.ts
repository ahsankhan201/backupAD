import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatStepper } from '@angular/material';
import { BANKING_SERVICE_LIST, PAYMENT_ORDER_BENE_MAX_LENGTH, PAYMENT_ORDER_CONST } from '../../../banking-services-module.constants';
import { SharedService } from 'src/app/common/services/shared.service';
import { Subscription } from 'rxjs';
import { ARABIC_LANG_TEXT, DOMAINS } from 'src/app/common/global-constants';
import { BENEFICIARY_ENDPOINTS } from 'src/app/common/api-endpoints';
import { BankingServicesService } from '../../../services/banking-services.service';

@Component({
  selector: 'app-draft-beneficiary-details-step',
  templateUrl: './draft-beneficiary-details-step.component.html',
  styleUrls: ['./draft-beneficiary-details-step.component.scss']
})
export class DraftBeneficiaryDetailsStepComponent implements OnInit {

  subscription$ = new Subscription();
  draftFormGroup: any;
  purposeOfTransferList = [];
  beneficiaryNameMaxlength = PAYMENT_ORDER_BENE_MAX_LENGTH;
  PAYMENT_ORDER_CONST = PAYMENT_ORDER_CONST;
  countriesList: any;
  currencyList: any;
  selectedCountryCode: string;
  selectedCountry: string;
  collectFromList = [];
  selectedLang: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private stepper: MatStepper,
    private bankingService: BankingServicesService) { }

  ngOnInit() {
    this.getLanguage();
    this.getCountriesList();
    this.fetchTransferPurposeLst();
    this.sharedService.setHorizontalLineClass(this.PAYMENT_ORDER_CONST.horizontalLineClass);
    this.createDemandDraftForm();
  }

  /**
   * @methodName createDemandDraftForm
   * @parameter none
   * @description used to create the open account form group
   * @return none
   */
  createDemandDraftForm(): void {
    this.draftFormGroup = this.formBuilder.group({
      beneficiaryName: ['', [Validators.required]],
      selectedCountry: ['', [Validators.required]],
      purposeOfTransfer: ['', [Validators.required]],
      collectFrom: ['', [Validators.required]],
      currency: ['', [Validators.required]]
    });
  }

  /**
   * @methodName handleCancelButtonClick
   * @parameter none
   * @description used to handle cancel button click
   * @return none
   */
  handleCancelButtonClick(): void {
    this.sharedService.setHorizontalLineClass(undefined);
    this.bankingService.cancelButtonClick$.next(BANKING_SERVICE_LIST.demandDraft);
  }

  /**
   * @methodName handleNextButtonClick
   * @parameter none
   * @description used to handle next button click
   * @return none
   */
  handleNextButtonClick(): void {
    if (this.draftFormGroup.valid) {
      this.bankingService.baneficiaryDetailsFormData = this.draftFormGroup.value;
      this.stepper.next();
    }
  }

  /**
   * @methodName fetchTransferPurposeLst
   * @parameter none
   * @description used to fetch the purpose of transfer list from the server
   * @return none
   */
  fetchTransferPurposeLst(): void {
    this.subscription$.add(this.sharedService.getTransferPurpose().subscribe(response => {
      this.purposeOfTransferList = response['purposeOfTransferList'];
    }));
  }

  /**
   * @methodName getCountriesList
   * @parameters none
   * @description Used to get the countries list
   * @return none
   */
  getCountriesList(): void {
    const COUNTRY_LIST_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + BENEFICIARY_ENDPOINTS.GET_COUNTRIES_LIST;
    this.subscription$.add(this.sharedService.fetchCountryCurrencyData(COUNTRY_LIST_API).subscribe(response => {
      response = JSON.parse(response.toString());
      this.countriesList = response ? response.allCountryList : undefined;
    }));
  }

  /**
   * @methodName onCountryChange
   * @parameters event
   * @description Used to handle the country change selection
   * @return none
   */
  onCountryChange(event: MatAutocompleteSelectedEvent): void {
    this.selectedCountry = event.option.value;
    this.selectedCountryCode = event.option.id;
    this.getCountryCurrencyList();
    this.getBanksList(event.option.id);
  }

  /**
   * @methodName getCountryCurrencyList
   * @parameters none
   * @description Used to get the currency list for selected country
   * @return none
   */
  getCountryCurrencyList(): void {
    const CURRENCY_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      BENEFICIARY_ENDPOINTS.GET_CURRENCY_LIST + this.selectedCountryCode;
    this.subscription$.add(this.sharedService.fetchCountryCurrencyData(CURRENCY_API).subscribe(response => {
      if (response) {
        response = JSON.parse(response.toString());
        this.currencyList = this.sharedService.mapCurrencyDetailsWithKeys(response);
      }
    }));
  }

  /**
   * @methodName selectedCurrency
   * @parameter event
   * @description Used to check selected currency
   * @return none
   */
  selectedCurrency(event: any): void {
    this.draftFormGroup.get('currency').setValue(event);
  }

  /**
   * @methodName getBanksList
   * @parameters countryCode
   * @description Used to get the banks list
   * @return none
   */
  getBanksList(countryCode, status = false): void {
    const PARAMS = `/${countryCode}?${BENEFICIARY_ENDPOINTS.IS_ADIB_UAE_BANK_EXCLUDED}=${status}`;
    const BANKS_LIST_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      BENEFICIARY_ENDPOINTS.GET_BANKS_LIST + PARAMS;
    this.subscription$.add(this.sharedService.fetchCountryCurrencyData(BANKS_LIST_API).subscribe(response => {
      if (response) {
        response = JSON.parse(response.toString());
        this.collectFromList = response && response.bankDetailList ? response.bankDetailList : [];
      }
    }));
  }

  /**
   * @methodName getLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getLanguage(): void {
    this.subscription$.add(this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLang = selectedLanguage;
    }));
  }

  ngDestroy() {
    this.subscription$.unsubscribe();
  }

}

