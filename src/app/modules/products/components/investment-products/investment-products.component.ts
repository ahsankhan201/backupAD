import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { ProductsService } from '../../services/products.service';
import { SharedService } from 'src/app/common/services/shared.service';

import {
  ProductCardEmittedObj, ContactModeCheckBox,
  ProductRegisterPayLoad, ProductCategoryResponse, ProductTemplateModel
} from 'src/app/common/models/products-module.model';

import { HTTP_STATUS_CODE, ARABIC_LANG_TEXT, MOBILE_NUMBER_LENGTH, FORM_LENGTHS } from 'src/app/common/global-constants';
import { PRODUCT_CARD_TEXT, PRODUCT_LABELS, PRODUCT_SCREEN_DIVIDER } from '../../products-module.constants';


@Component({
  selector: 'app-investment-products',
  templateUrl: './investment-products.component.html',
  styleUrls: ['./investment-products.component.scss']
})
export class InvestementProductsComponent implements OnInit {
  @Input() catalogList: ProductCategoryResponse[];
  @Output() showProductCardTab = new EventEmitter();
  subscription$ = new Subscription();

  investmentEnquiryFormGroup: FormGroup;
  showComponentName = PRODUCT_CARD_TEXT.PRODUCT_LIST_TEXT;
  investmentEquiryModes = [] as ContactModeCheckBox[];
  investmentEquiryTimings = [] as ContactModeCheckBox[];
  showContactTimings: boolean;
  selectedProductInfo = {} as ProductCategoryResponse;
  enableNextBtn = false;
  selectedContactMode: string;
  selectedContactTime: string;
  productTitle: string;
  translateLabels = PRODUCT_LABELS;
  typeOfProductEnquired: string;
  selectedLang: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  readonly MOBILE_NUMBER_LENGTH: number = MOBILE_NUMBER_LENGTH;
  readonly MOBILE_NUMBER_MIN_LENGTH: number = FORM_LENGTHS.FORM_LENGTH_NINE;

  constructor(
    private productService: ProductsService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.getLanguage();
  }

  /**
   * @methodName createInvestmentEnquiryForm
   * @parameter none
   * @description used to create the investment enquiry form group
   * @return none
   */
  createInvestmentEnquiryForm(): void {
    this.investmentEnquiryFormGroup = this.formBuilder.group({
      mobileNumber: [this.sharedService.customerFilteredPrimaryAddress.phoneOffice, [Validators.required]],
      emailId: [this.sharedService.customerFilteredPrimaryAddress.email, [Validators.required, this.sharedService.validateEmailId()]]
    });
  }

  /**
   * @methodName resetFormControls
   * @parameter none
   * @description used to reset form controls
   * @return boolean
   */
  resetFormControls(): void {
    this.enableNextBtn = false;
    this.selectedContactMode = undefined;
    this.selectedContactTime = undefined;
  }

  /**
   * @methodName getSelectedProductInfo
   * @parameter none
   * @description used to set the contact modes info
   * @return none
   */
  getSelectedProductInfo(selectedCardInfo: ProductCardEmittedObj): void {
    this.selectedProductInfo = selectedCardInfo.selectedOption;
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
    this.createInvestmentEnquiryForm();
    this.resetFormControls();
  }

  /**
   * @methodName setContactModesInfo
   * @parameter none
   * @description used to set the contact modes info
   * @return none
   */
  setContactModesInfo(): void {
    this.investmentEquiryModes = this.productService.generateContactCheckBoxObj(
      this.productService.preferredContactModes.preferredContactMethod, false);
  }

  /**
   * @methodName getSelectedContactMode
   * @parameter selectedMode
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
    this.investmentEquiryTimings = this.productService.generateContactCheckBoxObj(
      this.productService.preferredContactModes.preferredContactTime, true);
  }

  /**
   * @methodName getSelectedTimings
   * @parameter selectedTimings
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
    const investmentEnquiryPayLoad = {} as ProductRegisterPayLoad;
    investmentEnquiryPayLoad.destinationEmailAddress = this.selectedProductInfo.receivingEmail;
    investmentEnquiryPayLoad.productCategory = this.selectedProductInfo.productId.toString();
    investmentEnquiryPayLoad.productName = this.selectedProductInfo.productNameEnglish;
    investmentEnquiryPayLoad.productTemplate = {} as ProductTemplateModel;
    investmentEnquiryPayLoad.productTemplate.customerEmail = this.investmentEnquiryFormGroup.get('emailId').value;
    investmentEnquiryPayLoad.productTemplate.customerMobile = this.investmentEnquiryFormGroup.get('mobileNumber').value;
    investmentEnquiryPayLoad.productTemplate.preferredContactMethod = this.selectedContactMode;
    investmentEnquiryPayLoad.productTemplate.preferredContactTime = this.selectedContactTime;
    this.productService.registerProductEnquiry(investmentEnquiryPayLoad).subscribe((response) => {
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
   * @parameters product<[]>
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
   * @methodName showInvestmentTab
   * @description show Listing
   * @parameters none
   * @return void
   */
  showInvestmentTab(): void {
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
