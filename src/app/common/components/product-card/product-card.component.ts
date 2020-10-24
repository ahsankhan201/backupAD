import { Component, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ProductCardEmittedObj, ProductCategoryResponse } from '../../models/products-module.model';
import { PRODUCT_CARD_TEXT } from 'src/app/modules/products/products-module.constants';
import { OPEN_ACCOUNT_CTA_LINK_LABEL, ICON, ENGLISH_LANG_TEXT, ARABIC_LANG_TEXT } from '../../global-constants';
import { OpenAccountCard } from '../../models/open-account.model';
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnDestroy {
  @Output() selectedCardOption = new EventEmitter();
  @Output() selectedOpenAccountCardOption = new EventEmitter();

  @Input() productCardsList = [] as ProductCategoryResponse[];
  @Input() openAccountCardsList = [] as OpenAccountCard[];
  linkText = PRODUCT_CARD_TEXT;
  selectedLang: string;
  openAccountCtaLinkLabel = OPEN_ACCOUNT_CTA_LINK_LABEL;
  ICON_HOLDER = ICON.iconHolder;
  arabicLanguageText = ARABIC_LANG_TEXT;
  englishLanguageText = ENGLISH_LANG_TEXT;
  subscription$ = new Subscription();

  constructor(private translateService: TranslateService, private sharedService: SharedService) { this.getLanguage(); }

  /**
   * @methodName emitSelectedOption
   * @parameter selectedOption<ProductCardInputObj>,typeOfEvent<string>
   * @description Used to emit the value to parent component
   * @return none
   */
  emitSelectedOption(selectedOption: ProductCategoryResponse, typeOfEvent: string): void {
    const emittedValue = {} as ProductCardEmittedObj;
    emittedValue.selectedOption = selectedOption;
    emittedValue.typeOfEvent = typeOfEvent;
    this.selectedCardOption.emit(emittedValue);
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
   * @methodName emitOpenAccountSelectedCard
   * @parameter selectedOption<ProductCardInputObj>
   * @description Used to emit the value to parent component
   * @return none
   */
  emitOpenAccountSelectedCard(selectedOption: OpenAccountCard): void {
    this.subscription$.add(this.sharedService.fetchCustomerDetails(true).subscribe(
      response => {
        if (selectedOption) { this.selectedCardOption.emit(selectedOption); }
      }
    ));
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}

