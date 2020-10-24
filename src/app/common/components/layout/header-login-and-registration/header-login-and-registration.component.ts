import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TRANSLATION_DATA, HEADER_INFO, ARABIC_LANG_TEXT, LOCALE, HEADER_CONST } from 'src/app/common/global-constants';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-header-login-and-registration',
  templateUrl: './header-login-and-registration.component.html',
  styleUrls: ['./header-login-and-registration.component.scss']
})
export class HeaderLoginAndRegistrationComponent implements OnInit, OnDestroy {
  allLanguages = TRANSLATION_DATA.LANGUAGES;
  logo = HEADER_INFO.logo;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  subscription$ = new Subscription();
  constructor(
    private translateService: TranslateService,
    private sharedService: SharedService) { this.getSelectedLanguage(); }

  ngOnInit() {
    this.getSelectedLanguage();
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
      this.selectedLanguage === ARABIC_LANG_TEXT ? document.querySelector('body').classList.add(HEADER_CONST.rtlBodyClassName) :
        document.querySelector('body').classList.remove(HEADER_CONST.rtlBodyClassName);
    }));
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

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
