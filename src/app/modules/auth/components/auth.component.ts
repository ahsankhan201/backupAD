import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { Subscription } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { SharedService } from 'src/app/common/services/shared.service';

import { ADIB_WEBSITE_URL_TEXT, ICON, HIDE_OVERFLOW_CLASS, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { COMPONENT_LIST, AUTH_TEXT, IS_REGISTRED_COOKIE_TEXT } from '../auth-module.constants';
import { LARGE_DEVICE_BREAKPOINT } from '../../registration/registration-module.constants';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  adibWebsiteUrl: string = ADIB_WEBSITE_URL_TEXT;
  componentList = COMPONENT_LIST;
  activeComponent: string = COMPONENT_LIST.LOGIN;
  prevComponent: string;
  width: number;
  height: number;
  securityIcon = ICON.securityIcon;
  authText = AUTH_TEXT;
  subscription$ = new Subscription();
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.handleShowComponent();
    this.checkDeviceRegistration();
    this.getSelectedLanguage();
  }

  /* @methodName checkDeviceRegistration
   * @params none
   * @description used to check the device cookie value in browser
   * @return none
   */
  checkDeviceRegistration(): void {
    if (!this.sharedService.getCookie(IS_REGISTRED_COOKIE_TEXT)) {
      this.authService.openRegistraionConfirmModal();
    }
  }

  /** @methodName handleCloseButtonClick
   * @params status<boolean>
   * @description used to handle close button click event emited
   * @return none
   */
  handleCloseButtonClick(status: boolean): void {
    if (status) {
      this.authService.showComponent$.next(this.prevComponent);
    }
  }

  /** @methodName onResized
   * @params event<ResizedEvent>
   * @description close the popup of security screen in large devices
   * @return none
   */
  onResized(event: ResizedEvent): void {
    if (event.newWidth > LARGE_DEVICE_BREAKPOINT) {
      this.handleCloseButtonClick(true);
    }
  }

  /**
   * @methodName handleSecurityTipsClick
   * @params none
   * @description Used to handle security tips screen
   * @return none
   */
  handleSecurityTipsClick(): void {
    this.subscription$.add(this.authService.securityTipClickStatus.subscribe(res => {
      if (res) {
        this.showSecurityTips();
        this.authService.updateSecurityTipsClick(undefined);
      }
    }));
  }

  /** @methodName showSecurityTips
   * @params none
   * @description show security tips screen
   * @return none
   */
  showSecurityTips(): void {
    this.prevComponent = this.activeComponent;
    this.authService.showComponent$.next(COMPONENT_LIST.SECURITY_TIPS_COMP);
  }

  /**
   * @methodName handleShowComponent
   * @params none
   * @description Used to handle security tips screen
   * @return none
   */
  handleShowComponent(): void {
    this.authService.showComponent$.subscribe(res => {
      if (res) {
        this.activeComponent = res;
      }
    });
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
