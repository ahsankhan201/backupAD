import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  ProductCategoryResponse, ContactModeCheckBox, ProductCardEmittedObj,
  ProductRegisterPayLoad, ProductTemplateModel
} from 'src/app/common/models/products-module.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PRODUCT_CARD_TEXT, PRODUCT_SCREEN_DIVIDER } from '../../products-module.constants';
import { ProductsService } from '../../services/products.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { HTTP_STATUS_CODE, ARABIC_LANG_TEXT, MOBILE_NUMBER_LENGTH, FORM_LENGTHS } from 'src/app/common/global-constants';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-takaful-products',
  templateUrl: './takaful-products.component.html',
  styleUrls: ['./takaful-products.component.scss']
})

export class TakafulProductsComponent implements OnInit {
  @Input() catalogList: ProductCategoryResponse[];
  @Output() showProductCardTab = new EventEmitter();

  takafulEnquiryFormGroup: FormGroup;
  showComponentName = PRODUCT_CARD_TEXT.PRODUCT_LIST_TEXT;
  takafulEquiryModes = [] as ContactModeCheckBox[];
  takafulEquiryTimings = [] as ContactModeCheckBox[];
  showContactTimings: boolean;
  selectedProductInfo = {} as ProductCategoryResponse;
  enableNextBtn = false;
  selectedContactMode: string;
  selectedContactTime: string;
  productTitle: string;
  typeOfProductEnquired: string;
  selectedLang: string;
  subscription$ = new Subscription();
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
    this.createtakafulEnquiryForm();
    this.getLanguage();
  }

  /**
   * @methodName createtakafulEnquiryForm
   * @parameter none
   * @description used to create the takaful enquiry form group
   * @return none
   */
  createtakafulEnquiryForm(): void {
    this.takafulEnquiryFormGroup = this.formBuilder.group({
      mobileNumber: [this.sharedService.customerFilteredPrimaryAddress.phoneOffice,
      [Validators.required, Validators.minLength(PRODUCT_CARD_TEXT.MOBILE_MIN_LENGTH)]],
      emailId: [this.sharedService.customerFilteredPrimaryAddress.email, [Validators.required, this.sharedService.validateEmailId()]]
    });
  }
  /**
   * @methodName getSelectedProductInfo
   * @parameter selectedCardInfo<ProductCardEmittedObj>
   * @description used to get selected product info
   * @return none
   */
  getSelectedProductInfo(selectedCardInfo: ProductCardEmittedObj): void {
    this.selectedProductInfo = selectedCardInfo.selectedOption;
    this.productTitle = this.selectedLang === ARABIC_LANG_TEXT ?
      this.selectedProductInfo.productNameArabic : this.selectedProductInfo.productNameEnglish;
    this.showContactTimings = false;
    this.enableNextBtn = false;
    if (selectedCardInfo.typeOfEvent === PRODUCT_CARD_TEXT.ctaViewMore) {
      this.showProductDetail(selectedCardInfo.selectedOption);
    } else if (selectedCardInfo.typeOfEvent === PRODUCT_CARD_TEXT.ctaApplyNow) {
      this.setEnquiryFormInfo();
    }
  }

  /**
   * @methodName setEnquiryFormInfo
   * @parameter none
   * @description used to set the enquiry form initial data
   * @return none
   */
  setEnquiryFormInfo(): void {
    this.showComponentName = PRODUCT_CARD_TEXT.ENQUIRY_FORM_TEXT;
    this.showProductCardTab.emit(false);
    this.takafulEquiryModes = this.productService.generateContactCheckBoxObj(
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
    this.takafulEquiryTimings = this.productService.generateContactCheckBoxObj(
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
    const takafulEnquiryPayLoad = {} as ProductRegisterPayLoad;
    takafulEnquiryPayLoad.destinationEmailAddress = this.selectedProductInfo.receivingEmail;
    takafulEnquiryPayLoad.productCategory = this.selectedProductInfo.productId;
    takafulEnquiryPayLoad.productName = this.selectedProductInfo.productNameEnglish;
    takafulEnquiryPayLoad.productTemplate = {} as ProductTemplateModel;
    takafulEnquiryPayLoad.productTemplate.customerEmail = this.takafulEnquiryFormGroup.get('emailId').value;
    takafulEnquiryPayLoad.productTemplate.customerMobile = this.takafulEnquiryFormGroup.get('mobileNumber').value;
    takafulEnquiryPayLoad.productTemplate.preferredContactMethod = this.selectedContactMode;
    takafulEnquiryPayLoad.productTemplate.preferredContactTime = this.selectedContactTime;
    takafulEnquiryPayLoad.productTemplate.customerName = this.productService.customerName ? this.productService.customerName : '';
    this.productService.registerProductEnquiry(takafulEnquiryPayLoad).subscribe((response) => {
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
   * @methodName showtakafulsTab
   * @description It will disptach value to parent component to show category tabs
   * @parameters none
   * @return void
   */
  showtakafulsTab(): void {
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
