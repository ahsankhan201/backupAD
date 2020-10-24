import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ProductCategoryResponse, ProductCardEmittedObj } from '../../models/products-module.model';
import { PRODUCT_CARD_TEXT } from 'src/app/modules/products/products-module.constants';
import { CARDS_MASTER_DATA } from 'src/app/modules/cards/cards-module.constants';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { ARABIC_LANG_TEXT } from '../../global-constants';

@Component({
  selector: 'app-card-sub-categories',
  templateUrl: './card-sub-categories.component.html',
  styleUrls: ['./card-sub-categories.component.scss']
})
export class CardSubCategoriesComponent {

  @Output() selectedCardOption = new EventEmitter();
  @Input() cardCategoryCatalog = [] as ProductCategoryResponse[];
  linkText = PRODUCT_CARD_TEXT;
  readonly cardsData = CARDS_MASTER_DATA;
  selectedLang: string;
  subscription$ = new Subscription();
  arabicLanguageText = ARABIC_LANG_TEXT;

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
}
