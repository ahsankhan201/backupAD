import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProductCategoryResponse, ProductCardEmittedObj } from '../../models/products-module.model';
import { ICON } from '../../global-constants';
import { ARABIC_LANG_TEXT } from '../../global-constants';
import { SharedService } from '../../services/shared.service';


@Component({
  selector: 'app-card-categories',
  templateUrl: './card-categories.component.html',
  styleUrls: ['./card-categories.component.scss']
})
export class CardCategoriesComponent implements OnInit {
  @Output() selectedCardCategory = new EventEmitter();
  @Input() cardCategoriesList = [] as string[];
  @Input() componentName: string;
  subscription$ = new Subscription();
  readonly iconsConst = ICON;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(private sharedService: SharedService) { }
  ngOnInit() {
    this.getSelectedLanguage();
  }

  /**
   * @methodName emitSelectedOption
   * @parameter selectedOption<string>
   * @description Used to emit the value to parent component
   * @return none
   */
  emitSelectedOption(selectedOption: string): void {
    this.selectedCardCategory.emit(selectedOption);
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

}
