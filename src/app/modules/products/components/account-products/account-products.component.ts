import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { ProductsService } from '../../services/products.service';
import { SharedService } from 'src/app/common/services/shared.service';

import {
  ProductCardEmittedObj, ContactModeCheckBox,
  ProductRegisterPayLoad, ProductCategoryResponse, ProductTemplateModel
} from 'src/app/common/models/products-module.model';
import { PRODUCT_CARD_TEXT, OPEN_ACCOUNT_CTA_LIST, PRODUCT_SCREEN_DIVIDER } from '../../products-module.constants';
import { HTTP_STATUS_CODE, ARABIC_LANG_TEXT, MOBILE_NUMBER_LENGTH, FORM_LENGTHS } from 'src/app/common/global-constants';
import { OpenAccountService } from 'src/app/common/services/open-account/open-account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-product',
  templateUrl: './account-products.component.html',
  styleUrls: ['./account-products.component.scss']
})
export class AccountProductsComponent implements OnInit, OnDestroy {
  @Input() catalogList: ProductCategoryResponse[];
  @Output() showProductCardTab = new EventEmitter();
  @Output() showOpenAccount = new EventEmitter();

  accountEnquiryFormGroup: FormGroup;
  showComponentName = PRODUCT_CARD_TEXT.PRODUCT_LIST_TEXT;
  accountEquiryModes = [] as ContactModeCheckBox[];
  accountEquiryTimings = [] as ContactModeCheckBox[];
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
    private openAccountService: OpenAccountService,
  ) { }

  ngOnInit() {
    this.createAccountEnquiryForm();
    this.getLanguage();
  }

  /**
   * @methodName createAccountEnquiryForm
   * @parameter none
   * @description used to create the account enquiry form group
   * @return none
   */
  createAccountEnquiryForm(): void {
    this.accountEnquiryFormGroup = this.formBuilder.group({
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
    // translation added for productTitle based on the language selected
    this.productTitle = (this.selectedLang === ARABIC_LANG_TEXT) ?
      this.selectedProductInfo.productNameArabic : this.selectedProductInfo.productNameEnglish;
    this.showContactTimings = false;
    this.enableNextBtn = false;
    if (selectedCardInfo.typeOfEvent === PRODUCT_CARD_TEXT.ctaViewMore) {
      this.showProductDetail(selectedCardInfo.selectedOption);
    } else if (selectedCardInfo.typeOfEvent === PRODUCT_CARD_TEXT.ctaApplyNow &&
      !OPEN_ACCOUNT_CTA_LIST.includes(this.selectedProductInfo.productNameEnglish)) {
      this.setEnquiryFormInfo();
    } else if (OPEN_ACCOUNT_CTA_LIST.includes(this.selectedProductInfo.productNameEnglish)) {
      this.subscription$.add(this.sharedService.fetchCustomerDetails(true).subscribe(res => {
        this.openAccountService.openAccountSelectedFrom = PRODUCT_CARD_TEXT.PRODUCTS_DASHBOARD;
        this.openAccountService.openAccountSelectedCard = (selectedCardInfo.selectedOption) ?
          selectedCardInfo.selectedOption.productNameEnglish : undefined;
        this.openAccountService.isBankSeviceTermsAgreed = false;
        this.openAccountService.ghinaSeviceTermsAgreed = false;
        this.showOpenAccount.emit(selectedCardInfo.selectedOption.productNameEnglish);
      }));
    } else {
      this.openAccountService.openAccountSelectedFrom = PRODUCT_CARD_TEXT.PRODUCTS_DASHBOARD;
      this.openAccountService.openAccountSelectedCard = (selectedCardInfo.selectedOption) ?
        selectedCardInfo.selectedOption.productNameEnglish : undefined;
      this.openAccountService.isBankSeviceTermsAgreed = false;
      this.openAccountService.ghinaSeviceTermsAgreed = false;
      this.showOpenAccount.emit(selectedCardInfo.selectedOption.productNameEnglish);
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
    this.accountEquiryModes = this.productService.generateContactCheckBoxObj(
      (this.selectedLang === ARABIC_LANG_TEXT) ?
        this.productService.preferredContactModes.preferredContactMethodArabic :
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
    this.accountEquiryTimings = this.productService.generateContactCheckBoxObj(
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
    accountEnquiryPayLoad.productTemplate.customerEmail = this.accountEnquiryFormGroup.get('emailId').value;
    accountEnquiryPayLoad.productTemplate.customerMobile = this.accountEnquiryFormGroup.get('mobileNumber').value;
    accountEnquiryPayLoad.productTemplate.preferredContactMethod = this.selectedContactMode;
    accountEnquiryPayLoad.productTemplate.preferredContactTime = this.selectedContactTime;
    accountEnquiryPayLoad.productTemplate.customerName = this.productService.customerName ? this.productService.customerName : '';
    this.productService.registerProductEnquiry(accountEnquiryPayLoad).subscribe((response) => {
      if (response && response.status === HTTP_STATUS_CODE.NO_CONTENT) {
        document.querySelector('body').classList.add(PRODUCT_SCREEN_DIVIDER);
        this.showComponentName = PRODUCT_CARD_TEXT.SUCCESS_SCREEN_TETXT;
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
      if (response && !OPEN_ACCOUNT_CTA_LIST.includes(this.selectedProductInfo.productNameEnglish)) {
        this.setEnquiryFormInfo();
      } else if (response && OPEN_ACCOUNT_CTA_LIST.includes(this.selectedProductInfo.productNameEnglish)) {
        this.subscription$.add(this.sharedService.fetchCustomerDetails(true).subscribe(res => {
          this.openAccountService.isBankSeviceTermsAgreed = false;
          this.openAccountService.ghinaSeviceTermsAgreed = false;
          this.openAccountService.openAccountSelectedFrom = PRODUCT_CARD_TEXT.PRODUCTS_DASHBOARD;
          this.openAccountService.openAccountSelectedCard = (this.selectedProductInfo) ?
            this.selectedProductInfo.productNameEnglish : undefined;
        }));
      }
    });
  }

  /**
   * @methodName showAccountsTab
   * @description It will disptach value to parent component to show category tabs
   * @parameters none
   * @return void
   */
  showAccountsTab(): void {
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

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
