import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BENEFICIARY_BANKS, COUNTRY_CODE_UAE,
  BANK_SELECTION_SCREEN_TEXT, COUNTRY_ISO_CODE
} from '../../beneficiary-module.constants';
import { Subscription } from 'rxjs';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { DOMAINS, COUNTRY_NAME_UAE, ARABIC_LANG_TEXT } from '../../../../common/global-constants';
import { BENEFICIARY_ENDPOINTS } from 'src/app/common/api-endpoints';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/common/services/shared.service';
import { CheckBoxEmittedObj } from 'src/app/common/models/payee.model';

@Component({
  selector: 'app-bank-selection',
  templateUrl: './bank-selection-component.html',
  styleUrls: ['./bank-selection-component.scss']
})
export class BankSelectionComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  bankSelectionList: any = BENEFICIARY_BANKS;
  adibInternationalCountriesListWithKeys: any;
  showAdibInternationalBanksView = false;
  showInternationalBanksView = false;
  bankSelectionGroup: FormGroup;
  countriesList: any;
  banksList: any;
  bankBranchesList: any;
  showUaeAdibView = false;
  showUaeOtherBankView = false;
  enableNextBtn: boolean;
  bankSelectionScreenText = BANK_SELECTION_SCREEN_TEXT;
  selectedCountry: string;
  showBankSelection = false;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private beneficiaryService: BeneficiaryService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private changeDetectRef: ChangeDetectorRef,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.setComponentIntialInfo();
    this.getSelectedLanguage();
  }

  /**
   * @methodName setComponentIntialInfo
   * @parameter none
   * @description used to set the component initial information
   * @return none
   */
  setComponentIntialInfo(): void {
    this.bankSelectionGroup = this.formBuilder.group({
      selectedCountry: [''],
      selectedBank: [''],
      selectedBranch: [''],
    });
    this.handleRegionSubscription();
  }

  /**
   * @methodName selectedBank
   * @param bank<String>
   * @description Used to get the selected bank information
   * @return none
   */
  selectedBank(bank: string): void {
    this.beneficiaryService.setBank(bank);
    const region = this.beneficiaryService.getRegion();

    if (region === BANK_SELECTION_SCREEN_TEXT.uae && bank === BANK_SELECTION_SCREEN_TEXT.adib) {
      this.showUaeOtherBankView = false;
      this.showInternationalBanksView = false;
      this.enableNextBtn = true;
      this.bankSelectionGroup = this.formBuilder.group({});
    }
    if (region === BANK_SELECTION_SCREEN_TEXT.uae && bank === BANK_SELECTION_SCREEN_TEXT.otherBanks) {
      // tslint:disable-next-line: no-unused-expression
      this.bankSelectionGroup.get('selectedCountry') ? this.bankSelectionGroup.get('selectedCountry').patchValue(COUNTRY_CODE_UAE) : null;
      this.beneficiaryService.selectedBenCountryDetails = { countryISOCode: COUNTRY_CODE_UAE, value: COUNTRY_NAME_UAE };
      this.getBanksList(COUNTRY_CODE_UAE, true);
      this.beneficiaryService.internationalBenPayLoadObj.beneficiaryBankCountry = COUNTRY_CODE_UAE;
      this.showInternationalBanksView = false;
      this.showUaeOtherBankView = true;
      this.bankSelectionGroup = this.formBuilder.group({
        selectedBank: ['', Validators.required],
        selectedBranch: ['', Validators.required],
      });
      this.enableNextBtn = true;
      this.getCountriesList();
    }
    if (bank === BANK_SELECTION_SCREEN_TEXT.otherBanks && region === BANK_SELECTION_SCREEN_TEXT.international) {
      this.showAdibInternationalBanksView = false;
      this.showInternationalBanksView = true;
      this.bankSelectionGroup = this.formBuilder.group({
        selectedCountry: ['', Validators.required],
        selectedBank: ['', Validators.required],
        selectedBranch: ['', Validators.required]
      });
      this.enableNextBtn = true;
      this.getCountriesList();
    }
    if (region === BANK_SELECTION_SCREEN_TEXT.international && bank === BANK_SELECTION_SCREEN_TEXT.adib) {
      this.beneficiaryService.internationalBenPayLoadObj.beneficiaryBankName = bank;
      this.showAdibInternationalBanksView = true;
      this.showInternationalBanksView = false;
      this.getCountriesList();
      this.bankSelectionGroup = this.formBuilder.group({});
      this.enableNextBtn = false;
    }
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
    this.subscription$.add(this.beneficiaryService.fetchCountriesList(COUNTRY_LIST_API).subscribe(response => {
      response = JSON.parse(response.toString());
      this.beneficiaryService.countriesList = response ? response.allCountryList : undefined;
      this.countriesList = response ?
        this.sharedService.sliceElementFromList(response.allCountryList, COUNTRY_ISO_CODE, COUNTRY_CODE_UAE) : undefined;
      this.adibInternationalCountriesListWithKeys = this.beneficiaryService.fetchAdibInternationalCountriesWithKeys(this.countriesList);
    }));
  }

  /**
   * @methodName onCountryChange
   * @parameters event
   * @description Used to handle the country change selection
   * @return none
   */
  onCountryChange(event: any): void {
    this.banksList = [];
    this.bankBranchesList = [];
    this.resetFormFields();
    this.getBanksList(event.option.id);
    this.selectedCountry = event.option.value;
    this.beneficiaryService.internationalBenPayLoadObj.beneficiaryBankCountry = event.option.id;
    this.beneficiaryService.selectedBenCountryDetails = { countryISOCode: event.option.id, value: event.option.value };
    this.beneficiaryService.setSelectedCountry(event.option.id);
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
    this.beneficiaryService.fetchBanksList(BANKS_LIST_API).subscribe(response => {
      response = JSON.parse(response.toString());
      this.banksList = response && response.bankDetailList ? response.bankDetailList : [];
    });
  }

  /**
   * @methodName onBankChange
   * @parameters event
   * @description Used to handle the bank change selection
   * @return none
   */
  onBankChange(event: any): void {
    this.beneficiaryService.internationalBenPayLoadObj.beneficiaryBankName = event.option.value;
    this.beneficiaryService.internationalBenPayLoadObj.swiftCode = event.option.id;
    this.getBranchesList(event.option.value);
  }

  /**
   * @methodName getBranchesList
   * @parameters bankName
   * @description Used to get the branches list
   * @return none
   */
  getBranchesList(bankName: string): void {
    this.bankBranchesList = this.beneficiaryService.getBranchesList(this.banksList, bankName);
  }

  /**
   * @methodName resetFormFields
   * @parameters none
   * @description Used to reset the form
   * @return none
   */
  resetFormFields(): void {
    this.bankSelectionGroup.get(BANK_SELECTION_SCREEN_TEXT.selectedBank).reset();
    this.bankSelectionGroup.get(BANK_SELECTION_SCREEN_TEXT.selectedBranch).reset();
  }

  /**
   * @methodName onBankBranchChange
   * @parameters event
   * @description Used to check the value on bank branch change
   * @return none
   */
  onBankBranchChange(event: any): void {
    this.beneficiaryService.internationalBenPayLoadObj.beneficiaryBankAddress = event.option.value;
  }

  /**
   * @methodName selectedAdibInternationalCountry
   * @param country<CheckBoxEmittedObj>
   * @description Used to get the selected adib international country information
   * @return none
   */
  selectedAdibInternationalCountry(country: CheckBoxEmittedObj): void {
    this.enableNextBtn = true;
    this.beneficiaryService.setSelectedCountry(country.id);
    this.beneficiaryService.internationalBenPayLoadObj.beneficiaryBankCountry = country.id;
    this.beneficiaryService.internationalBenPayLoadObj.beneficiaryBankAddress =
      this.beneficiaryService.fetchCountryName(country.id, this.countriesList);
    this.beneficiaryService.internationalBenPayLoadObj.swiftCode = this.beneficiaryService.fetchSwiftCode(country.id, this.countriesList);
    this.beneficiaryService.selectedBenCountryDetails = { countryISOCode: country.id, value: country.value };
  }

  /**
   * @methodName checkDrownOptinExist
   * @parameters KeyoardEvent
   * @description Used to clear the dropdown text if it's not present in the dropdown
   * @return none
   */
  checkDrownOptinExist(event: any): void {
    // tslint:disable-next-line: max-line-length
    if (!event.target.classList.contains(BANK_SELECTION_SCREEN_TEXT.matOptionClass) && this.beneficiaryService.getBank() === BANK_SELECTION_SCREEN_TEXT.otherBanks) {
      if (this.beneficiaryService.selectedBenCountryDetails && this.bankSelectionGroup.get(BANK_SELECTION_SCREEN_TEXT.selectedCountry) &&
        this.bankSelectionGroup.get(BANK_SELECTION_SCREEN_TEXT.selectedCountry).value !== this.selectedCountry) {
        this.bankSelectionGroup.get(BANK_SELECTION_SCREEN_TEXT.selectedCountry).setValue('');
        this.bankSelectionGroup.get(BANK_SELECTION_SCREEN_TEXT.selectedBank).setValue('');
        this.bankSelectionGroup.get(BANK_SELECTION_SCREEN_TEXT.selectedBranch).setValue('');
        this.banksList = [];
        this.bankBranchesList = [];
      }
      // tslint:disable-next-line: max-line-length
      if (this.bankSelectionGroup.get(BANK_SELECTION_SCREEN_TEXT.selectedBank).value !== this.beneficiaryService.selectedInternationalBankName) {
        this.bankSelectionGroup.get(BANK_SELECTION_SCREEN_TEXT.selectedBank).setValue('');
        this.bankSelectionGroup.get(BANK_SELECTION_SCREEN_TEXT.selectedBranch).setValue('');
      }
      // tslint:disable-next-line: max-line-length
      if (this.bankSelectionGroup.get(BANK_SELECTION_SCREEN_TEXT.selectedBranch).value !== this.beneficiaryService.internationalBenPayLoadObj.beneficiaryBankAddress) {
        this.bankSelectionGroup.get(BANK_SELECTION_SCREEN_TEXT.selectedBranch).setValue('');
      }
    }
  }

  /**
   * @methodName handleRegionSubscription
   * @parameters none
   * @description Used to clear all preselected options if change in region selection
   * @return none
   */
  handleRegionSubscription(): void {
    this.subscription$.add(this.beneficiaryService.selectedRegion.subscribe(response => {
      if (response) {
        this.showBankSelection = false;
        this.changeDetectRef.detectChanges();
        this.showAdibInternationalBanksView = false;
        this.showInternationalBanksView = false;
        this.showUaeOtherBankView = false;
        this.countriesList = [];
        this.banksList = [];
        this.bankBranchesList = [];
        this.adibInternationalCountriesListWithKeys = [];
        this.showBankSelection = true;
        this.changeDetectRef.detectChanges();
        this.beneficiaryService.selectedRegion.next(undefined);
        this.enableNextBtn = false;
      }
    }));
  }

  /**
   * @methodName getSelectedLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getSelectedLanguage(): void {
    this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLanguage = selectedLanguage;
    });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
