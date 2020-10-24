import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

// include services
import { APISyncService } from 'src/app/common/services/sync.service';
import { DialogService } from 'src/app/common/services/dialog.service';
import { SharedService } from 'src/app/common/services/shared.service';

// include model and constants
import {
  ProductsCategoryList, PreferredContactModes,
  ProductCatologList, ContactModeCheckBox, ProductCategoryResponse, ProductRegisterPayLoad
} from 'src/app/common/models/products-module.model';
import { PRODUCT_DIALOG_TEXT, OPEN_ACCOUNT_CTA_LIST, PRODUCT_CARD_TEXT } from '../products-module.constants';
import { Dialog } from 'src/app/common/models/dialog.model';
import { CustomerDetailsModel } from 'src/app/common/models/customer-details.model';
import { DOMAINS, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { PRODUCTS_ENDPOINTS } from 'src/app/common/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  selectedProductCategoryId: string;
  preferredContactModes = {} as PreferredContactModes;
  productCatalogList = [] as ProductCatologList[];
  customerName: string;
  customerDetail: CustomerDetailsModel;

  constructor(
    private httpService: APISyncService,
    private dialogService: DialogService,
    private sharedService: SharedService,
    private translateService: TranslateService,
  ) { }

  /**
   * @methodName generateContactCheckBoxObj
   * @description it is used to genearte contact check box object
   * @parameters contactInfoList<string[]>
   * @return Object<ContactModeCheckBox[]>
   */
  generateContactCheckBoxObj(contactInfoList: string[], trimId: boolean): ContactModeCheckBox[] {
    const timingsInformation = [] as ContactModeCheckBox[];
    if (contactInfoList) {
      contactInfoList.forEach(element => {
        const contactInfo = {} as ContactModeCheckBox;
        contactInfo.id = contactInfo.title = contactInfo.value = element;
        timingsInformation.push(contactInfo);
      });
      return timingsInformation;
    }
  }

  /**
   * @methodName fetchProductsCategory
   * @description it will feth the products category list
   * @parameters url<string>
   * @return Observable<ProductsCategoryList>
   */
  fetchProductsCategory(url: string): Observable<ProductsCategoryList> {
    return this.httpService.get(url).pipe(map(res => res ? JSON.parse(res) : res));
  }

  /**
   * @methodName fetchProductsCatalogInfo
   * @description it will feth the products catalog info
   * @parameters url<string>
   * @return Observable
   */
  fetchProductsCatalogInfo(url: string): Observable<any> {
    return this.httpService.get(url).pipe(map(res => res ? JSON.parse(res) : res));
  }

  /**
   * @methodName fetchApiData
   * @description it will feth the data from given API
   * @parameters url<string>
   * @return Observable
   */
  fetchApiData(url: string): Observable<any> {
    return this.httpService.get(url).pipe(map(res => res ? JSON.parse(res) : res));
  }

  /**
   * @methodName fetchPreferredContactTimings
   * @description it will feth the preferred contact timings
   * @parameters url<string>
   * @return Observable<PreferredContactModes>
   */
  fetchPreferredContactTimings(url: string): Observable<PreferredContactModes> {
    return this.httpService.get(url).pipe(map(res => res ? JSON.parse(res) : res));
  }

  openDetailBox(product: ProductCategoryResponse): Observable<boolean> {
    const OPTIONS = {} as Dialog;
    this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      if (selectedLanguage === ARABIC_LANG_TEXT) {
        OPTIONS.title = product.productNameArabic;
        OPTIONS.message = product.shortDescriptionArabic;
        OPTIONS.productImage = product.imageUrlArabic;
      } else {
        OPTIONS.title = product.productNameEnglish;
        OPTIONS.message = product.shortDescriptionEnglish;
        OPTIONS.productImage = product.imageUrlEnglish;
      }
    });

    OPTIONS.cancelText = PRODUCT_DIALOG_TEXT.cancel;
    OPTIONS.confirmText = OPEN_ACCOUNT_CTA_LIST.includes(product.productNameEnglish)
      ? PRODUCT_CARD_TEXT.openAccountCTAText : PRODUCT_DIALOG_TEXT.enquiry;
    OPTIONS.bulletPoints = product.productBulletsResponses;
    this.dialogService.open(OPTIONS);
    return this.dialogService.confirmed();
  }

  /**
   * @methodName registerProductEnquiry
   * @description it will post the product enquiry data to the server
   * @parameters payLoad<ProductRegisterPayLoad>
   * @return Observable<any>
   */
  registerProductEnquiry(payLoad: ProductRegisterPayLoad): Observable<any> {
    const PRODUCTS_REGISTER_URL = `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)}${PRODUCTS_ENDPOINTS.REGISTER}`;
    return this.httpService.post(PRODUCTS_REGISTER_URL, payLoad).pipe(map(res => res && res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName generateAccountCatalogInfo
   * @description it will generate the account catalog button text
   * @parameters accountCatalogInfo<ProductCategoryResponse[]>
   * @return ProductCategoryResponse[]
   */
  generateAccountCatalogButtonInfo(accountCatalogInfo: ProductCategoryResponse[]): ProductCategoryResponse[] {
    accountCatalogInfo.forEach(product => {
      OPEN_ACCOUNT_CTA_LIST.includes(product.productNameEnglish) ?
        product.enquiryCTAText = PRODUCT_CARD_TEXT.openAccountCTAText : product.enquiryCTAText = PRODUCT_CARD_TEXT.applyNowCTAText;
    });
    return accountCatalogInfo;
  }

  /**
   * @methodName generateProductCatalogButtonInfo
   * @description it will generate the product catalog button text
   * @parameters productCatalogInfo<ProductCategoryResponse[]>
   * @return ProductCategoryResponse[]
   */
  generateProductCatalogButtonInfo(productCatalogInfo: ProductCategoryResponse[]): ProductCategoryResponse[] {
    productCatalogInfo.forEach(product => {
      product.enquiryCTAText = PRODUCT_DIALOG_TEXT.enquiry;
    });
    return productCatalogInfo;
  }
  /**
   * @methodName generateInvestmentCatalogButtonInfo
   * @description it will generate the investment catalog button text
   * @parameters investmentCatalogInfo<ProductCategoryResponse[]>
   * @return ProductCategoryResponse[]
   */
  generateInvestmentCatalogButtonInfo(investmentCatalogInfo: ProductCategoryResponse[]): ProductCategoryResponse[] {
    investmentCatalogInfo.forEach(product => {
      product.enquiryCTAText = PRODUCT_DIALOG_TEXT.enquiry;
    });
    return investmentCatalogInfo;
  }

  /**
   * @methodName getCustomerDetails
   * @description it will fetch the customer details from the server
   * @parameters none
   * @return none
   */
  getCustomerDetails(): void {
    this.customerName = this.sharedService.customerDetail.nameLatin.firstName +
      ' ' + this.sharedService.customerDetail.nameLatin.lastName;
  }
}
