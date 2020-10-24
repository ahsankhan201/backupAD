import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProductsService } from '../services/products.service';
import { SharedService } from 'src/app/common/services/shared.service';

import { DOMAINS, DASHBOARD_NAMES } from 'src/app/common/global-constants';
import { PRODUCTS_ENDPOINTS } from 'src/app/common/api-endpoints';
import { ProductsCategory, ProductCategoryResponse } from 'src/app/common/models/products-module.model';
import { PRODUCT_SCREEN_TEXT } from '../products-module-test.data';
import { PRODUCT_CATEGORY_LIST } from '../products-module.constants';
import { TranslateService } from '@ngx-translate/core';
import { ARABIC_LANG_TEXT } from '../../../common/global-constants';
import { OpenAccountService } from 'src/app/common/services/open-account/open-account.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  productsCategoryList = [] as ProductsCategory[];
  selectedCategory: string;
  preSelectedCategory: string;
  financeCatalog: ProductCategoryResponse[];
  accountCatalog: ProductCategoryResponse[];
  investmentCatalog: ProductCategoryResponse[];
  cardsCategoriesList: string[];
  cardsCatalogList: ProductCategoryResponse[];
  showProductTab = true;
  selectedLang: string;
  takafulCatalog: ProductCategoryResponse[];
  showOpenAccount = false;
  selectedOpenAccountType: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  subscription$ = new Subscription();

  constructor(
    private productService: ProductsService,
    private sharedService: SharedService,
    private openAccountService: OpenAccountService,
    private changeDetectRef: ChangeDetectorRef,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.getLanguage();
    this.getProductsCategory();
    this.getProductCatalogInfo();
    this.getPreferredContactTimings();
    this.productService.getCustomerDetails();
    this.sharedService.selectedDashboardText = DASHBOARD_NAMES.productsDashBoard;
  }

  /**
   * @methodName getProductsCategory
   * @description used for fetching category list from server
   * @parameters none
   * @return void
   */
  getProductsCategory(): void {
    const PRODUCTS_CATEGORY_URL = `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)}${PRODUCTS_ENDPOINTS.CATEGORY}`;
    this.productService.fetchProductsCategory(PRODUCTS_CATEGORY_URL).subscribe((response) => {
      if (response && response.productCategoryList) {
        response.productCategoryList.map((product) => {
          product.id = `${PRODUCT_SCREEN_TEXT.PRODUCT}${product.categoryId}`;
          product.title = product.categoryNameEnglish;
          if (this.selectedLang === ARABIC_LANG_TEXT && product.categoryNameArabic) {
            product.title = product.categoryNameArabic;
          }
        });
        this.preSelectedCategory = response.productCategoryList[0].id;
        this.productsCategoryList = response.productCategoryList;
      }
    });
    this.sharedService.setHorizontalLineClass('product-catalog-divider');
    this.changeDetectRef.detectChanges();
  }

  /**
   * @methodName getProductCatalogInfo
   * @description used for fetching product catalog info from server
   * @parameters none
   * @return void
   */
  getProductCatalogInfo(): void {
    const CATALOG_URL = `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)}${PRODUCTS_ENDPOINTS.PRODUCT_CATALOG}`;
    this.productService.fetchProductsCatalogInfo(CATALOG_URL).subscribe((response) => {
      this.productService.productCatalogList = response;
      this.productService.productCatalogList.forEach(catalog => {
        if (catalog.categoryNameEnglish === PRODUCT_CATEGORY_LIST.account) {
          this.accountCatalog = this.productService.generateAccountCatalogButtonInfo(catalog.productCatalogResponses);
        } else if (catalog.categoryNameEnglish === PRODUCT_CATEGORY_LIST.finance) {
          this.financeCatalog = this.productService.generateProductCatalogButtonInfo(catalog.productCatalogResponses);
          this.financeCatalog = catalog.productCatalogResponses;
        } else if (catalog.categoryNameEnglish === PRODUCT_CATEGORY_LIST.investmentSolution) {
          this.investmentCatalog = this.productService.generateInvestmentCatalogButtonInfo(catalog.productCatalogResponses);
          this.investmentCatalog = catalog.productCatalogResponses;
        } else if (catalog.categoryNameEnglish === PRODUCT_CATEGORY_LIST.card) {
          const cardCategories = [];
          if (this.selectedLang === ARABIC_LANG_TEXT) {
            catalog.productCatalogResponses.forEach(cardsType => {
              if (cardsType.productSubCategoryResponses && cardsType.productSubCategoryResponses.subCategoryNameArabic) {
                cardCategories.push(cardsType.productSubCategoryResponses.subCategoryNameArabic);
              }
            });
          } else {
            catalog.productCatalogResponses.forEach(cardsType => {
              if (cardsType.productSubCategoryResponses && cardsType.productSubCategoryResponses.subCategoryNameEnglish) {
                cardCategories.push(cardsType.productSubCategoryResponses.subCategoryNameEnglish);
              }
            });
          }
          this.cardsCategoriesList = [...new Set(cardCategories)];
          this.cardsCatalogList = catalog.productCatalogResponses;
        } else if (catalog.categoryNameEnglish === PRODUCT_CATEGORY_LIST.takaful) {
          this.takafulCatalog = this.productService.generateProductCatalogButtonInfo(catalog.productCatalogResponses);
        }
      });
    });
  }

  /**
   * @methodName getPreferredContactTimings
   * @description used for fetching preferred contact modes and timings from server
   * @parameters none
   * @return void
   */
  getPreferredContactTimings(): void {
    const TIMINGS_URL = `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)}${PRODUCTS_ENDPOINTS.CONTACT_MODES}`;
    this.productService.fetchPreferredContactTimings(TIMINGS_URL).subscribe((response) => {
      this.productService.preferredContactModes = response;
    });
  }

  /**
   * @methodName selectedProductCategory
   * @description get the selected category from category tab
   * @parameters selectedProduct<string>
   * @return void
   */
  selectedProductCategory(selectedProduct: string): void {
    this.productService.selectedProductCategoryId = this.preSelectedCategory = this.selectedCategory = selectedProduct;
    this.changeDetectRef.detectChanges();
  }

  /**
   * @methodName showProductCardTab
   * @description It'll show/hide product category tab section
   * @parameters showCategoryTab<boolean>
   * @return void
   */
  showProductCardTab(showCategoryTab: boolean): void {
    this.showProductTab = showCategoryTab;
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

  /**
   * @methodName handleShowOpenAccount
   * @parameter accountType<string>
   * @description Used to open account based on the account type selected
   * @return none
   */
  handleShowOpenAccount(accountType: string): void {
    this.showOpenAccount = (accountType) ? true : false;
    this.selectedOpenAccountType = accountType;
  }

  /**
   * @methodName handleOpenAccountBackButton
   * @parameter backButtonStatus<boolean>
   * @description handleOpenAccountBackButton
   * @return none
   */
  handleOpenAccountBackButton(backButtonStatus: boolean): void {
    this.showOpenAccount = (backButtonStatus) ? false : true;
    this.openAccountService.openAccountSelectedCard = undefined;
  }

  ngOnDestroy() {
    this.sharedService.setHorizontalLineClass(undefined);
  }
}
