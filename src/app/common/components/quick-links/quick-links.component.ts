import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SharedService } from '../../services/shared.service';

import { QuickLinks } from '../../models/quickLinks.model';
import { QUICKLINK_DEFAULT_COUNT, ARABIC_LANG_TEXT } from '../../global-constants';
import { MenuOption } from '../../models/menu-option.model';

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.scss']
})
export class QuickLinksComponent implements OnInit, OnDestroy {

  @Input() quickLinksData: QuickLinks[];
  @Input() item: any;
  @Output() clickedItem = new EventEmitter();

  itemCounter: number;
  response: MenuOption;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  subscription$ = new Subscription();

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.itemCounter = this.quickLinksData ? this.quickLinksData.length : QUICKLINK_DEFAULT_COUNT;
  }

  /**
   * @methodName clickHandler
   * @description get the action type from menu option and emit it to the parent component with clicked item object
   * @parameters type: string
   * @return void
   */
  clickHandler(type: string): void {
    this.response = { actionType: type, actionItem: this.item };
    this.clickedItem.emit(this.response);
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

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
