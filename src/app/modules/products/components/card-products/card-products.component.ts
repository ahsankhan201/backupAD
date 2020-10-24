import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { SharedService } from 'src/app/common/services/shared.service';
import { ProductsService } from '../../services/products.service';

import {
  ProductCategoryResponse, ProductCardEmittedObj, ContactModeCheckBox,
  ProductRegisterPayLoad, ProductTemplateModel
} from 'src/app/common/models/products-module.model';
import { PRODUCT_CARD_TEXT, PRODUCT_SCREEN_DIVIDER } from '../../products-module.constants';
import { FORM_LENGTHS, HTTP_STATUS_CODE, ARABIC_LANG_TEXT, MOBILE_NUMBER_LENGTH } from 'src/app/common/global-constants';

@Component({
  selector: 'app-card-products',
  templateUrl: './card-products.component.html',
  styleUrls: ['./card-products.component.scss']
})
export class CardProductsComponent implements OnInit {
  @Input() cardCategories = [] as string[];
  @Output() showProductCardTab = new EventEmitter();
  @Input() cardsCatalog: ProductCategoryResponse[];

  cardSubCategoriesList: ProductCategoryResponse[];
  showComponentName = PRODUCT_CARD_TEXT.PRODUCT_LIST_TEXT;
  productTitle: string;
  cardEquiryModes = [] as ContactModeCheckBox[];
  cardEnquiryFormGroup: FormGroup;
  selectedProductInfo = {} as ProductCategoryResponse;
  showContactTimings: boolean;
  enableNextBtn = false;
  selectedContactMode: string;
  cardEquiryTimings = [] as ContactModeCheckBox[];
  AMOUNT_LENGTH = FORM_LENGTHS.FORM_LENGTH_TWENTYONE;
  selectedContactTime: string;
  typeOfProductEnquired: string;
  selectedLang: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  readonly MOBILE_NUMBER_LENGTH: number = MOBILE_NUMBER_LENGTH;
  readonly MOBILE_NUMBER_MIN_LENGTH: number = FORM_LENGTHS.FORM_LENGTH_NINE;
  subscription$ = new Subscription();

  constructor(
    private productService: ProductsService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.createCardEnquiryForm();
    this.getLanguage();
  }

  /**
   * @methodName createCardEnquiryForm
   * @parameter none
   * @description used to create the card enquiry form group
   * @return none
   */
  createCardEnquiryForm(): void {
    this.cardEnquiryFormGroup = this.formBuilder.group({
      mobileNumber: [this.sharedService.customerFilteredPrimaryAddress.phoneOffice,
      [Validators.required, Validators.minLength(PRODUCT_CARD_TEXT.MOBILE_MIN_LENGTH)]],
      emailId: [this.sharedService.customerFilteredPrimaryAddress.email,
      [Validators.required, this.sharedService.validateEmailId()]],
      cardLimit: ['', [Validators.required]]
    });
  }

  /**
   * @methodName getCardSubCategories
   * @parameter none
   * @description used to set sub category info
   * @return none
   */
  getCardSubCategories(selectedCardCategory: string): void {
    this.cardSubCategoriesList = this.cardsCatalog.filter(cards =>
      cards.productSubCategoryResponses.subCategoryNameEnglish === selectedCardCategory);
    this.showProductCardTab.emit(false);
    this.showComponentName = PRODUCT_CARD_TEXT.CARD_SUB_CATEGORIES_FORM;
    this.productTitle = selectedCardCategory;
  }

  /**
   * @methodName showCardsTab
   * @description It will disptach value to parent component to show category tabs
   * @parameters none
   * @return void
   */
  showCardsTab(): void {
    this.showComponentName = PRODUCT_CARD_TEXT.PRODUCT_LIST_TEXT;
    document.querySelector('body').classList.remove(PRODUCT_SCREEN_DIVIDER);
    this.showProductCardTab.emit(true);
  }

  /**
   * @methodName getSelectedProductInfo
   * @parameter selectedCardInfo<ProductCardEmittedObj>
   * @description used to get selected product info
   * @return none
   */
  getSelectedProductInfo(selectedCardInfo: ProductCardEmittedObj): void {
    this.selectedProductInfo = selectedCardInfo.selectedOption;
    this.showContactTimings = false;
    this.enableNextBtn = false;
    if (selectedCardInfo.typeOfEvent === PRODUCT_CARD_TEXT.ctaViewMore) {
      this.showProductDetail(selectedCardInfo.selectedOption);
    } else if (selectedCardInfo.typeOfEvent === PRODUCT_CARD_TEXT.ctaApplyNow) {
      this.setProductTitle();
      this.setEnquiryFormInfo();
    }
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
   * @methodName setEnquiryFormInfo
   * @parameter none
   * @description used to set the enquiry form initial data
   * @return none
   */
  setEnquiryFormInfo(): void {
    this.setProductTitle();
    this.showComponentName = PRODUCT_CARD_TEXT.ENQUIRY_FORM_TEXT;
    this.showProductCardTab.emit(false);
    this.cardEquiryModes = this.productService.generateContactCheckBoxObj(
      this.productService.preferredContactModes.preferredContactMethod, false);
  }

  /**
   * @methodName getSelectedContactMode
   * @parameter selectedMode<ContactModeCheckBox>
   * @description used to get the selected contact mode
   * @return none
   */
  getSelectedContactMode(selectedMode: ContactModeCheckBox): void {
    selectedMode.id === PRODUCT_CARD_TEXT.mobile ? (this.showContactTimings = true, this.setPreferredTimingsInfo(),
      this.enableNextBtn = false) : (this.showContactTimings = false, this.enableNextBtn = true);
    this.selectedContactMode = selectedMode.id;
  }

  /**
   * @methodName setPreferredTimingsInfo
   * @parameter none
   * @description used to set the preferred contact timings
   * @return none
   */
  setPreferredTimingsInfo(): void {
    this.cardEquiryTimings = this.productService.generateContactCheckBoxObj(
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
    const accountEnquiryPayLoad = {} as ProductRegisterPayLoad;
    accountEnquiryPayLoad.destinationEmailAddress = this.selectedProductInfo.receivingEmail;
    accountEnquiryPayLoad.productCategory = this.selectedProductInfo.productId;
    accountEnquiryPayLoad.productName = this.selectedProductInfo.productNameEnglish;
    accountEnquiryPayLoad.productTemplate = {} as ProductTemplateModel;
    accountEnquiryPayLoad.productTemplate.customerEmail = this.cardEnquiryFormGroup.get('emailId').value;
    accountEnquiryPayLoad.productTemplate.customerMobile = this.cardEnquiryFormGroup.get('mobileNumber').value;
    accountEnquiryPayLoad.productTemplate.cardLimit = this.cardEnquiryFormGroup.get('cardLimit').value;
    accountEnquiryPayLoad.productTemplate.preferredContactMethod = this.selectedContactMode;
    accountEnquiryPayLoad.productTemplate.preferredContactTime = this.selectedContactTime;
    accountEnquiryPayLoad.productTemplate.customerName = this.productService.customerName ? this.productService.customerName : '';
    this.productService.registerProductEnquiry(accountEnquiryPayLoad).subscribe((response) => {
      if (response && response.status === HTTP_STATUS_CODE.NO_CONTENT) {
        this.showComponentName = PRODUCT_CARD_TEXT.SUCCESS_SCREEN_TETXT;
        document.querySelector('body').classList.add(PRODUCT_SCREEN_DIVIDER);
        this.typeOfProductEnquired = (this.translateService.getDefaultLang() === ARABIC_LANG_TEXT) ?
          this.selectedProductInfo.productNameArabic : this.selectedProductInfo.productNameEnglish;
      }
    });
  }

  /**
   * @methodName setProductTitle
   * @parameter none
   * @description used to set product title
   * @return none
   */
  setProductTitle(): void {
    // translation added for productTitle based on the language selected
    this.productTitle = (this.translateService.getDefaultLang() === ARABIC_LANG_TEXT) ?
      this.selectedProductInfo.productNameArabic : this.selectedProductInfo.productNameEnglish;
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
