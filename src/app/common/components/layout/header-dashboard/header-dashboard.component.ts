import { Component, OnInit, OnDestroy, AfterContentChecked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { UserService } from 'src/app/common/services/user.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { LogoutService } from 'src/app/modules/logout/services/logout.service';

import {
  HEADER_INFO, HEADER_CONST, TRANSLATION_DATA, LOCALE,
  PAYMENT_SCREEN_TEXT, ARABIC_LANG_TEXT, LOGOUT_DROPDOWN, PROFILE_MENU_DATA
} from '../../../global-constants';
import { User } from 'src/app/common/models/user.model';
import { MenuOption, MenuOptionItem } from 'src/app/common/models/menu-option.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-dashboard',
  templateUrl: './header-dashboard.component.html',
  styleUrls: ['./header-dashboard.component.scss']
})
export class HeaderDashboardComponent implements OnInit, OnDestroy {

  userData: User;
  totalAvailableFundsText: any;
  allLanguages = TRANSLATION_DATA.LANGUAGES;
  isHiddenText: string;
  logo: string;
  userImage: string;
  welcomeText: string;
  totalAvailableFunds: string;
  currencyCode = PAYMENT_SCREEN_TEXT.aedCurrencyCode;
  availableFundsHiddenText: string;
  showAvailableFunds = true;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  subscription$ = new Subscription();
  logoutDropDownList: MenuOptionItem[] = LOGOUT_DROPDOWN;
  customerName: string;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private userService: UserService,
    private sharedService: SharedService,
    private logoutService: LogoutService) { }

  ngOnInit() {
    this.setHeaderConstantData();
    this.loadUserData();
    this.getSelectedLanguage();
    this.sharedService.isSessionExpired = false;
    this.logoutService.getUserIdleTime();
  }

  /**
   * @methodName loadUserData
   * @description used to load userData from userService
   * @parameters none
   * @return none
   */

  loadUserData(): void {
    this.subscription$.add(this.sharedService.customerDetailsSubject.subscribe(response => {
      this.customerName = response;
    }));
    this.subscription$.add(this.sharedService.networth.subscribe(response => {
      this.totalAvailableFunds = response;
    }));
    this.sharedService.setLanguageInfo(this.translateService.currentLang);
  }

  /**
   * @methodName setHeaderConstantData
   * @description used to get header config data
   * @parameters none
   * @return none
   */

  setHeaderConstantData(): void {
    // to set from CONST
    this.isHiddenText = HEADER_INFO.hideText;
    this.logo = HEADER_INFO.logo;
    this.userImage = HEADER_INFO.userImage;
    // to set from HEADER_CONST
    this.welcomeText = HEADER_CONST.welcomeText;
    this.totalAvailableFundsText = HEADER_CONST.totalAvailableFundsText;
    this.availableFundsHiddenText = HEADER_CONST.availableFundsHiddenValue;
  }

  /**
   * @methodName changeFundsStatus
   * @description used to change hide/show for total available funds
   * @parameters none
   * @return none
   */

  changeFundsStatus(event: MouseEvent): void {
    if (event.target && event.target['checked']) {
      this.isHiddenText = HEADER_INFO.showText;
      this.showAvailableFunds = false;
      this.userService.changeValue(true);
    } else {
      this.isHiddenText = HEADER_INFO.hideText;
      this.showAvailableFunds = true;
      this.userService.changeValue(false);
    }
  }

  /**
   * @methodName localStorage
   * @description swtiching between locale languages
   * @parameters lang: string
   * @return none
   */
  switchLang(lang: string) {
    localStorage.setItem(LOCALE, lang);
    this.translateService.use(lang);
    lang === ARABIC_LANG_TEXT ? document.querySelector('body').classList.add(HEADER_CONST.rtlBodyClassName) :
      document.querySelector('body').classList.remove(HEADER_CONST.rtlBodyClassName);
    this.sharedService.setLanguageInfo(lang);
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

  /**
   * @methodName menuClickHandler
   * @description used to recieve clicked menu option and logout from the application
   * @parameters selectedMenuItem<string>
   * @return none
   */
  menuClickHandler(selectedMenuItem: MenuOption): void {
    if (selectedMenuItem.actionType === PROFILE_MENU_DATA.logout) {
      this.logoutService.logoutUser();
    } else if (selectedMenuItem.actionType === PROFILE_MENU_DATA.changePassword) {
      this.router.navigateByUrl(PROFILE_MENU_DATA.changePasswordRoute);
    } else if (selectedMenuItem.actionType === PROFILE_MENU_DATA.myProfile) {
      this.router.navigateByUrl(PROFILE_MENU_DATA.profileRoute);
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
