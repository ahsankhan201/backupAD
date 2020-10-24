import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { ProductsService } from '../../services/products.service';
import { SharedService } from 'src/app/common/services/shared.service';

import { DOMAINS, ARABIC_LANG_TEXT, MOBILE_NUMBER_LENGTH, FORM_LENGTHS } from 'src/app/common/global-constants';
import { PRODUCTS_ENDPOINTS } from 'src/app/common/api-endpoints';
import {
  ProductCardEmittedObj, ContactModeCheckBox,
  ProductRegisterPayLoad, ProductCategoryResponse, ProductTemplateModel, ProductListType
} from 'src/app/common/models/products-module.model';

import { HTTP_STATUS_CODE } from 'src/app/common/global-constants';
import { PRODUCT_CARD_TEXT, CAR_TYPES, PRODUCT_LABELS, PRODUCT_SCREEN_DIVIDER } from '../../products-module.constants';


@Component({
  selector: 'app-finance-products',
  templateUrl: './finance-products.component.html',
  styleUrls: ['./finance-products.component.scss']
})
export class FinanceProductsComponent implements OnInit {
  @Input() catalogList: ProductCategoryResponse[];
  @Output() showProductCardTab = new EventEmitter();
  subscription$ = new Subscription();

  financeEnquiryFormGroup: FormGroup;
  showComponentName = PRODUCT_CARD_TEXT.PRODUCT_LIST_TEXT;
  financeEquiryModes = [] as ContactModeCheckBox[];
  financeEquiryTimings = [] as ContactModeCheckBox[];
  showContactTimings: boolean;
  selectedProductInfo = {} as ProductCategoryResponse;
  enableNextBtn = false;
  selectedContactMode: string;
  selectedContactTime: string;
  selectedCarType: string;
  selectedCarBrand: string;
  selectedCarModel: string;
  productTitle: string;
  carBrandList = [] as ProductListType[];
  carModelList = [] as ProductListType[];
  financeCarTypes = CAR_TYPES;
  translateLabels = PRODUCT_LABELS;
  typeOfProductEnquired: string;
  selectedLang: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  readonly MOBILE_NUMBER_LENGTH: number = MOBILE_NUMBER_LENGTH;
  readonly AMOUNT_LENGTH = FORM_LENGTHS.FORM_LENGTH_THIRTEEN;
  readonly MOBILE_NUMBER_MIN_LENGTH: number = FORM_LENGTHS.FORM_LENGTH_NINE;

  constructor(
    private productService: ProductsService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.getLanguage();
  }

  /**
   * @methodName createFinanceEnquiryForm
   * @parameter none
   * @description used to create the finance enquiry form group
   * @return none
   */
  createFinanceEnquiryForm(): void {
    this.financeEnquiryFormGroup = this.formBuilder.group({
      financeAmount: ['', [Validators.required]],
      mobileNumber: [this.sharedService.customerFilteredPrimaryAddress.phoneOffice, [Validators.required]],
      emailId: [this.sharedService.customerFilteredPrimaryAddress.email, [Validators.required, this.sharedService.validateEmailId()]]
    });
    if (this.selectedProductInfo.productNameEnglish === PRODUCT_CARD_TEXT.CAR_FINANCE) {
      this.financeEnquiryFormGroup.addControl('carBrand', new FormControl('', [Validators.required]));
      this.financeEnquiryFormGroup.addControl('carModel', new FormControl('', [Validators.required]));
      this.financeEnquiryFormGroup.addControl('carType', new FormControl('', [Validators.required]));
      this.financeEnquiryFormGroup.updateValueAndValidity();
    }
  }

  /**
   * @methodName resetFormControls
   * @parameter none
   * @description used to reset form controls
   * @return boolean
   */
  resetFormControls(): void {
    this.enableNextBtn = false;
    this.selectedCarType = undefined;
    this.selectedContactMode = undefined;
    this.selectedContactTime = undefined;
  }

  /**
   * @methodName getSelectedProductInfo
   * @parameter selectedCardInfo<ProductCardEmittedObj>
   * @description used to get selected product info
   * @return none
   */
  getSelectedProductInfo(selectedCardInfo: ProductCardEmittedObj): void {
    this.selectedProductInfo = selectedCardInfo.selectedOption;
    this.productTitle = this.selectedProductInfo.productNameEnglish;
    // translation added for productTitle based on the language selected
    this.productTitle = (this.translateService.getDefaultLang() === ARABIC_LANG_TEXT) ?
      this.selectedProductInfo.productNameArabic : this.selectedProductInfo.productNameEnglish;
    if (selectedCardInfo.typeOfEvent === PRODUCT_CARD_TEXT.ctaViewMore) {
      this.showProductDetail(selectedCardInfo.selectedOption);
    } else if (selectedCardInfo.typeOfEvent === PRODUCT_CARD_TEXT.ctaApplyNow) {
      this.setEnquiryFormInfo();
    }
  }

  setEnquiryFormInfo(): void {
    this.showComponentName = PRODUCT_CARD_TEXT.ENQUIRY_FORM_TEXT;
    this.showProductCardTab.emit(false);
    this.setContactModesInfo();
    this.createFinanceEnquiryForm();
    this.resetFormControls();
    if (this.selectedProductInfo.productNameEnglish === PRODUCT_CARD_TEXT.CAR_FINANCE) {
      this.getCarBrandList();
    }
  }

  /**
   * @methodName getCountriesList
   * @parameters none
   * @description Used to get the countries list
   * @return none
   */
  getCarBrandList(): void {
    const COUNTRY_LIST_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + PRODUCTS_ENDPOINTS.CAR_BRAND;
    this.subscription$.add(this.productService.fetchApiData(COUNTRY_LIST_API).subscribe(response => {
      const carBrandList = response ? response.carBrandsEnglish : undefined;
      carBrandList.map(brand => {
        const listObj = {} as ProductListType;
        listObj.id = brand;
        listObj.value = brand;
        this.carBrandList.push(listObj);
      });
    }));
  }

  /**
   * @methodName onBrandChange
   * @parameter event
   * @description set value for car Brand
   * @return none
   */
  onBrandChange(event: any): void {
    this.selectedCarBrand = event.option.value;
    this.getCarModel(event.option.value);
  }

  /**
   * @methodName onModelChange
   * @parameter event
   * @description set value for car model
   * @return none
   */
  onModelChange(event: any): void {
    this.selectedCarModel = event.option.value;
  }

  /**
   * @methodName getCarModel
   * @parameter brand<string>
   * @description used to set the car model list
   * @return none
   */
  getCarModel(brand: string): void {
    const CAR_MODEL_LIST_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + PRODUCTS_ENDPOINTS.CAR_MODEL + PRODUCT_CARD_TEXT.BRQND_QUERY_PARAM + brand;
    this.subscription$.add(this.productService.fetchApiData(CAR_MODEL_LIST_API).subscribe(response => {
      const modelList = response ? response.carModelsEnglish : undefined;
      modelList.map(model => {
        const listObj = {} as ProductListType;
        listObj.id = model;
        listObj.value = model;
        this.carModelList.push(listObj);
      });
    }));
  }

  /**
   * @methodName getSelectedCarType
   * @parameter selectedCarTypeMode
   * @description used to get the selected car type
   * @return none
   */
  getSelectedCarType(selectedCarTypeMode: ContactModeCheckBox): void {
    this.financeEnquiryFormGroup.get('carType').setValue(selectedCarTypeMode.id);
    this.selectedCarType = selectedCarTypeMode.id;
  }

  /**
   * @methodName setContactModesInfo
   * @parameter none
   * @description used to set the contact modes info
   * @return none
   */
  setContactModesInfo(): void {
    this.financeEquiryModes = this.productService.generateContactCheckBoxObj(
      this.productService.preferredContactModes.preferredContactMethod, false);
  }

  /**
   * @methodName getSelectedContactMode
   * @parameter selectedMode<ContactModeCheckBox>
   * @description used to get the selected contact mode
   * @return none
   */
  getSelectedContactMode(selectedMode: ContactModeCheckBox): void {
    selectedMode.id === 'Mobile' ? (this.showContactTimings = true, this.setPreferredTimingsInfo(), this.enableNextBtn = false) :
      (this.showContactTimings = false, this.enableNextBtn = true);
    this.selectedContactMode = selectedMode.id;
  }

  /**
   * @methodName setContactModesInfo
   * @parameter none
   * @description used to set the preferred contact timings
   * @return none
   */
  setPreferredTimingsInfo(): void {
    this.financeEquiryTimings = this.productService.generateContactCheckBoxObj(
      this.productService.preferredContactModes.preferredContactTime, true);
  }

  /**
   * @methodName getSelectedTimings
   * @parameter selectedTimings<ContactModeCheckBox>
   * @description used to set the preferred contact timings
   * @return none
   */
  getSelectedTimings(selectedTimings: ContactModeCheckBox): void {
    this.enableNextBtn = true;
    this.selectedContactTime = selectedTimings.id;
  }

  /**
   * @methodName registerProductEnquiry
   * @parameter none
   * @description used to post enquiry payload to the server
   * @return none
   */
  registerProductEnquiry(): void {
    this.enableNextBtn = false;
    const financeEnquiryPayLoad = {} as ProductRegisterPayLoad;
    financeEnquiryPayLoad.destinationEmailAddress = this.selectedProductInfo.receivingEmail;
    financeEnquiryPayLoad.productCategory = this.selectedProductInfo.productId.toString();
    financeEnquiryPayLoad.productName = this.selectedProductInfo.productNameEnglish;
    financeEnquiryPayLoad.productTemplate = {} as ProductTemplateModel;
    financeEnquiryPayLoad.productTemplate.customerEmail = this.financeEnquiryFormGroup.get('emailId').value;
    financeEnquiryPayLoad.productTemplate.customerMobile = this.financeEnquiryFormGroup.get('mobileNumber').value;
    financeEnquiryPayLoad.productTemplate.preferredContactMethod = this.selectedContactMode;
    financeEnquiryPayLoad.productTemplate.preferredContactTime = this.selectedContactTime;
    if (this.selectedProductInfo.productNameEnglish === PRODUCT_CARD_TEXT.CAR_FINANCE) {
      financeEnquiryPayLoad.productTemplate.carBrand = this.selectedCarBrand ? this.selectedCarBrand : undefined;
      financeEnquiryPayLoad.productTemplate.carModel = this.selectedCarModel ? this.selectedCarModel : undefined;
      financeEnquiryPayLoad.productTemplate.carType = this.selectedCarType ? this.selectedCarType : undefined;
    }
    this.productService.registerProductEnquiry(financeEnquiryPayLoad).subscribe((response) => {
      if (response && response.status === HTTP_STATUS_CODE.NO_CONTENT) {
        this.showComponentName = PRODUCT_CARD_TEXT.SUCCESS_SCREEN_TETXT;
        document.querySelector('body').classList.add(PRODUCT_SCREEN_DIVIDER);
        this.typeOfProductEnquired = (this.translateService.getDefaultLang() === ARABIC_LANG_TEXT) ?
          this.selectedProductInfo.productNameArabic : this.selectedProductInfo.productNameEnglish;
      }
    });
  }

  /**
   * @methodName showProductDetail
   * @description open popup for product description
   * @parameters product<ProductCategoryResponse>
   * @return void
   */
  showProductDetail(product: ProductCategoryResponse): void {
    this.productService.openDetailBox(product).subscribe((response) => {
      if (response) {
        this.setEnquiryFormInfo();
      }
    });
  }

  /**
   * @methodName showFinancesTab
   * @description show Listing
   * @parameters none
   * @return void
   */
  showFinancesTab(): void {
    this.showComponentName = PRODUCT_CARD_TEXT.PRODUCT_LIST_TEXT;
    document.querySelector('body').classList.remove(PRODUCT_SCREEN_DIVIDER);
    this.showProductCardTab.emit(true);
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

}
