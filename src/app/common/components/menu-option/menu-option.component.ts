import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SharedService } from '../../services/shared.service';

// include constant and model
import {
  ICON, MENU_OPTION_CDK_CONTAINER_CLASS,
  ARABIC_LANG_TEXT, LOGOUT_DROPDOWN_CLASSES, SIDE_NAV_SELECTOR
} from '../../global-constants';
import { MenuOption, MenuOptionItem } from '../../models/menu-option.model';

@Component({
  selector: 'app-menu-option',
  templateUrl: './menu-option.component.html',
  styleUrls: ['./menu-option.component.scss']
})
export class MenuOptionComponent implements OnInit {
  @Input() menuOptions: MenuOptionItem[];
  @Input() item: any;
  @Input() isLogoutDropdown?: string;
  @Output() clickedItem = new EventEmitter();
  iconsConst = ICON;
  selectedLanguage: string;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.getSelectedLanguage();
  }

  /**
   * @methodName clickHandler
   * @description get the action type from menu option and emit it to the parent component with clicked item object
   * @parameters type: string
   * @return void
   */
  clickHandler(type: string): void {
    const response: MenuOption = { actionType: type, actionItem: this.item };
    this.clickedItem.emit(response);

    // close the mobile side nav on click of profile menu option, if side nav opened
    if (document.querySelector(SIDE_NAV_SELECTOR)) {
      const element: HTMLElement = document.querySelector(SIDE_NAV_SELECTOR) as HTMLElement;
      element.click();
    }
  }

  /**
   * @methodName getSelectedLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getSelectedLanguage(): void {
    this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLanguage = selectedLanguage;
    });
  }

  /**
   * @methodName setDropDownStyles
   * @description used to add the closs to the mat-menu box
   * @parameters none
   * @return void
   */
  setDropDownStyles(): void {
    if (this.isLogoutDropdown) {
      const LOGOUT_DROPDOWN = document.querySelector(`.${MENU_OPTION_CDK_CONTAINER_CLASS}`);
      this.selectedLanguage === ARABIC_LANG_TEXT ?
        (LOGOUT_DROPDOWN.classList.remove(LOGOUT_DROPDOWN_CLASSES.ENGLISH), LOGOUT_DROPDOWN.classList.add(LOGOUT_DROPDOWN_CLASSES.ARABIC)) :
        (LOGOUT_DROPDOWN.classList.remove(LOGOUT_DROPDOWN_CLASSES.ARABIC), LOGOUT_DROPDOWN.classList.add(LOGOUT_DROPDOWN_CLASSES.ENGLISH));
    }
  }

}
