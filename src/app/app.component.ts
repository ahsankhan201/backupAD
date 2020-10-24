import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogoutService } from 'src/app/modules/logout/services/logout.service';
import { SnackBarService } from './common/services/snack-bar.service';
import { SharedService } from './common/services/shared.service';
import { SnackBar } from './common/models/snackBar.model';
import {
  TRANSLATION_DATA, LANGUAGES_AVAILABLE, LOCALE, DEFAULT_HORIZONTAL_LINE_CLASS,
  LOGIN_HEADER_URLS, EVENT_LIST
} from './common/global-constants';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  subscription$ = new Subscription();
  showSnackBar = false;
  horizontalLineClass = DEFAULT_HORIZONTAL_LINE_CLASS;
  snackBarMessageObj: SnackBar;
  showDashboardComponents = true;
  showLoader: boolean;
  constructor(
    private translateService: TranslateService,
    private snackBarService: SnackBarService,
    private sharedService: SharedService,
    private router: Router,
    private changeDetectRef: ChangeDetectorRef,
    private logoutService: LogoutService
  ) {
  }
  ngOnInit() {
    this.translateService.addLangs(LANGUAGES_AVAILABLE);
    this.setLocale();
    this.showSnackBarWithMessage();
    this.setHorizontalLineStyle();
  }

  /**
   * HostListener will listen DOM event contextmenu,paste,copy,cut and provides handler for preventDefault the event occurs.
   */

  @HostListener(EVENT_LIST.contextmenu, EVENT_LIST.event) onRightClick(event: MouseEvent) {
    this.sharedService.stopEventPropagation(event);
  }

  @HostListener(EVENT_LIST.paste, EVENT_LIST.event) blockPaste(event: KeyboardEvent) {
    this.sharedService.stopEventPropagation(event);
  }

  @HostListener(EVENT_LIST.copy, EVENT_LIST.event) blockCopy(event: KeyboardEvent) {
    this.sharedService.stopEventPropagation(event);
  }

  @HostListener(EVENT_LIST.cut, EVENT_LIST.event) blockCut(event: KeyboardEvent) {
    this.sharedService.stopEventPropagation(event);
  }
  // this will try to make async call to revoke the token or back / refresh button event
  @HostListener(EVENT_LIST.beforeUnload, EVENT_LIST.event) async explicitLogout(event: Event) {
    if (this.sharedService.accessToken || this.sharedService.refreshToken) {
      this.logoutService.logoutUser();
      return undefined;
    }
  }
  /**
   * @methodName showSnackBarWithMessage
   * @description used to show snackbar on errors from API
   * @parameters none
   * @return none
   */
  showSnackBarWithMessage(): void {
    this.subscription$.add(this.snackBarService.getSnackBarInfo().subscribe(response => {
      this.showSnackBar = response.showSnackBar;
      this.snackBarMessageObj = Object.assign({} as SnackBar, response.message);
    }));
  }

  /**
   * @methodName setLocale
   * @description check locale else set to default locale
   * @parameters none
   * @return void
   */
  setLocale(): void {
    let defaultLocale;
    if (localStorage.getItem(LOCALE)) {
      const browserLang = localStorage.getItem(LOCALE);
      defaultLocale = LANGUAGES_AVAILABLE.includes(browserLang) ? browserLang : TRANSLATION_DATA.DEFAULT_LANGUAGE;
      this.translateService.use(defaultLocale);
    } else {
      defaultLocale = TRANSLATION_DATA.DEFAULT_LANGUAGE;
      this.translateService.setDefaultLang(TRANSLATION_DATA.DEFAULT_LANGUAGE);
    }
    localStorage.setItem(LOCALE, defaultLocale);
    // setting value in translation service
    this.translateService.currentLang = defaultLocale;
    // dispatching selected language value to it's subscribers
    this.sharedService.setLanguageInfo(defaultLocale);
  }

  /**
   * @methodName setHorizontalLineStyle
   * @description used to set the horizontal line style class
   * @parameters none
   * @return none
   */
  setHorizontalLineStyle(): void {
    this.subscription$.add(this.sharedService.getHorizontalLineClass().subscribe(response => {
      this.horizontalLineClass = response ? response : DEFAULT_HORIZONTAL_LINE_CLASS;
    }));
    this.sharedService.toggleBackgroundImageClasses();
  }

  /**
   * @methodName hasLoginRoute
   * @description Check if the router url contains the specified route to change layout
   * @parameters none
   * @return boolean
   */
  hasLoginRoute() {
    if (this.router.url !== '/') {
      this.showDashboardComponents = LOGIN_HEADER_URLS.includes(this.router.url);
    }
  }

  ngAfterViewChecked() {
    this.hasLoginRoute();
    this.setLoader();
    this.changeDetectRef.detectChanges();
  }

  /**
   * @methodName setLoader
   * @description used to set loader status
   * @parameters none
   * @return none
   */
  setLoader(): void {
    this.subscription$.add(this.sharedService.getLoaderStatus().subscribe(spinnerInfo => {
      this.showLoader = spinnerInfo;
    }));
  }

  ngOnDestroy() {
    if (this.subscription$) { this.subscription$.unsubscribe(); }
  }
}
