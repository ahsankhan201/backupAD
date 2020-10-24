import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

// Incude services here
import { PayeeService } from '../../services/payee.service';

// Include constants and models here
import { PAYEE_SELECTION_MASTER_DATA, PAYEE_ACCOUNT_FORM_TEXT } from '../../payee-module.constants';
import {
  NAV_CONTROLS, WATER_ELECTRICITY_PRODUCTS,
  FORM_LENGTHS, TELECOM_PRODUCTS, ARABIC_LANG_TEXT, DuTvText
} from 'src/app/common/global-constants';
import { ERROR_MESSAGES, PATTERN_ALPHA_NUMERIC } from 'src/app/common/global-constants';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-payee-account-form',
  templateUrl: './payee-account-form.component.html',
  styleUrls: ['./payee-account-form.component.scss']
})
export class PayeeAccountFormComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  payeeAccountGroup: FormGroup;
  enableNextBtn = false;
  showPINNumber = false;
  navControlsText = NAV_CONTROLS;
  payeeAccountFormText = PAYEE_ACCOUNT_FORM_TEXT;
  consumerNumberLength: number;
  formControlLabel: string;
  selectedProduct: string;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  allowDotStatus = false;
  constructor(private payeeService: PayeeService, private formBuilder: FormBuilder, private sharedService: SharedService
  ) { this.createPayeeAccountFormGroup(); }

  ngOnInit() {
    this.getSelectedLanguage();
    this.getSlectedProduct();
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
   * @methodName getSlectedProduct
   * @parameter none
   * @description Used to get slected product and initial form
   * @return none
   */
  getSlectedProduct(): void {
    this.subscription$.add(this.payeeService.getSelectedProduct().subscribe(response => {
      if (response) {
        this.allowDotStatus = false;
        this.selectedProduct = response;
        this.createPayeeAccountForm(response);
        // allow account number with dot only for Du-Tv
        if (this.selectedProduct === DuTvText) {
          this.allowDotStatus = true;
        }
      }
    }));
  }
  /**
   * @methodName createPayeeAccountFormGroup
   * @parameter none
   * @description Used to create the payee form group
   * @return none
   */
  createPayeeAccountFormGroup(): void {
    this.payeeAccountGroup = this.formBuilder.group({
      consumerNumber: ['', [Validators.required]],
      nickName: ['', [Validators.required, Validators.pattern(PATTERN_ALPHA_NUMERIC), this.sharedService.retrictWordValidator()]]
    });
  }

  /**
   * @methodName generatePayeePayLoad
   * @parameter none
   * @description Used to generate add payee payload object
   * @return none
   */
  generatePayeePayLoad(): void {
    const NICKNAME = this.payeeAccountGroup.get('nickName').value;
    if (this.sharedService.isEmpty(NICKNAME)) {
      let validNickName = this.selectedProduct;
      if (this.selectedProduct.length > this.payeeAccountFormText.NICK_NAME_MAX) {
        validNickName = this.payeeService.getUtilityProviderByPayeeName(this.selectedProduct).providerID;
      }
      this.payeeAccountGroup.patchValue({ nickName: validNickName });
    }
    if (this.payeeAccountGroup.valid) {
      this.payeeService.setPayeePayLoadObj(this.payeeAccountGroup.value);
    }
  }

  /**
   * @methodName createPayeeAccountForm
   * @parameter product<string>
   * @description Used to generate form for payee account
   * @return none
   */
  createPayeeAccountForm(product: string): void {
    const PRODUCT = product ? this.payeeService.getUtilityProviderByPayeeName(product) : undefined;
    this.showPINNumber = false;
    this.removeFormControls();
    if (this.payeeService.selectedProvider === PAYEE_SELECTION_MASTER_DATA.RTA_TEXT) {
      this.consumerNumberLength = this.payeeAccountFormText.ACCOUNT_NUMBER_MAX;
      this.showPINNumber = true;
      this.payeeAccountGroup.addControl('pin', new FormControl('', [Validators.required]));
      this.formControlLabel = this.payeeAccountFormText.ACCOUNT_NUMBER;
    } else if (this.payeeService.selectedProvider === PAYEE_SELECTION_MASTER_DATA.WATER_ELECTRICITY_TEXT) {
      this.consumerNumberLength = this.getFormControllerLength(PRODUCT.providerID);
      this.formControlLabel = this.payeeAccountFormText.ACCOUNT_NUMBER;
    } else if (this.payeeService.selectedProvider === PAYEE_SELECTION_MASTER_DATA.TELECOM_TEXT) {
      this.consumerNumberLength = this.getFormControllerLength(PRODUCT.payeeName);
      this.formControlLabel = this.getFormControlLabel(PRODUCT.payeeName);
    }
    this.payeeAccountGroup.addControl('consumerNumber', new FormControl('', [Validators.required,
    Validators.minLength(this.consumerNumberLength), Validators.maxLength(this.consumerNumberLength)]));
    this.payeeAccountGroup.updateValueAndValidity();
  }

  /**
   * @methodName removeFormControls
   * @parameter none
   * @description Used to remove form controls
   * @return none
   */
  removeFormControls(): void {
    this.consumerNumberLength = null;
    this.payeeAccountGroup.setValidators(null);
    this.payeeAccountGroup.removeControl('consumerNumber');
    this.payeeAccountGroup.removeControl('pin');
    this.payeeAccountGroup.clearValidators();
    this.payeeAccountGroup.reset();
    this.payeeAccountGroup.updateValueAndValidity();
  }
  /**
   * @methodName getFormControllerLength
   * @parameter product<string>
   * @description Used to set form control lengths for various forms
   * @return none
   */
  getFormControllerLength(product: string): number {
    const PRODUCTID = product;
    let length: number;
    switch (PRODUCTID) {
      case TELECOM_PRODUCTS.DU_BROADBAND:
        length = FORM_LENGTHS.FORM_LENGTH_SIX;
        break;
      case TELECOM_PRODUCTS.ETISALAT_LANDLINE:
      case TELECOM_PRODUCTS.ETISALAT_ALSHAMIL:
      case TELECOM_PRODUCTS.ETISALAT_INTERNET:
        length = FORM_LENGTHS.FORM_LENGTH_NINE;
        break;
      case WATER_ELECTRICITY_PRODUCTS.AADC_PRODUCT:
      case WATER_ELECTRICITY_PRODUCTS.ADDC_PRODUCT:
      case WATER_ELECTRICITY_PRODUCTS.DEWA_PRODUCT:
      case WATER_ELECTRICITY_PRODUCTS.SEWA_PRODUCT:
      case TELECOM_PRODUCTS.DU_TV:
      case TELECOM_PRODUCTS.ETISALAT_GSM:
      case TELECOM_PRODUCTS.ETISALAT_WASEL:
        length = FORM_LENGTHS.FORM_LENGTH_TEN;
        break;
      case TELECOM_PRODUCTS.DU_FIXED_LINE:
        length = FORM_LENGTHS.FORM_LENGTH_ELEVEN;
        break;
      case WATER_ELECTRICITY_PRODUCTS.FEWA_PRODUCT:
      case TELECOM_PRODUCTS.ETISALAT_EVISION:
      case TELECOM_PRODUCTS.DU_POSTPAID:
      case TELECOM_PRODUCTS.DU_PREPAID:
        length = FORM_LENGTHS.FORM_LENGTH_TWELVE;
        break;
      default:
        length = this.payeeAccountFormText.ACCOUNT_NUMBER_MAX;
    }
    return length;
  }
  /**
   * @methodName getFormControlLabel
   * @parameter product<string>
   * @description Used to set form control labels for various forms
   * @return none
   */
  getFormControlLabel(product: string): string {
    const PRODUCT_NAME = product;
    let label: string;
    switch (PRODUCT_NAME) {
      case TELECOM_PRODUCTS.DU_TV:
      case TELECOM_PRODUCTS.DU_FIXED_LINE:
      case TELECOM_PRODUCTS.DU_BROADBAND:
      case TELECOM_PRODUCTS.ETISALAT_ALSHAMIL:
      case TELECOM_PRODUCTS.ETISALAT_INTERNET:
      case TELECOM_PRODUCTS.ETISALAT_EVISION:
        label = this.payeeAccountFormText.ACCOUNT_NUMBER;
        break;
      case TELECOM_PRODUCTS.DU_POSTPAID:
      case TELECOM_PRODUCTS.DU_PREPAID:
      case TELECOM_PRODUCTS.ETISALAT_GSM:
      case TELECOM_PRODUCTS.ETISALAT_WASEL:
        label = this.payeeAccountFormText.MOBILE_NUMBER;
        break;
      case TELECOM_PRODUCTS.ETISALAT_LANDLINE:
        label = this.payeeAccountFormText.LANDLINE_NUMBER;
        break;
    }
    return label;
  }

  /**
   * @methodName isPayeeExisits
   * @description used to check duplicate payee
   * @param formControl<string>,filterField: string
   * @return none
   */
  isPayeeExisits(formControlName: string, filterField: string): void {
    const ACCOUNT_NUMBER: string = (this.payeeAccountGroup.get(formControlName).value).trim();
    const ALL_PAYEE_LIST = this.sharedService.allPayeeList;
    if (ALL_PAYEE_LIST) {
      const user = ALL_PAYEE_LIST.filter(item => item[filterField] === ACCOUNT_NUMBER);
      user.length > 0 ? this.payeeAccountGroup.get(formControlName).setErrors({ isTaken: true, message: ERROR_MESSAGES.isPayeeTaken })
        : this.payeeAccountGroup.get(formControlName).updateValueAndValidity();
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
