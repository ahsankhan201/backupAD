import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SharedService } from 'src/app/common/services/shared.service';

import { ADIB_WEBSITE_URL_TEXT, FOOTER_LINKS, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';

@Component({
  selector: 'app-footer-dashboard',
  templateUrl: './footer-dashboard.component.html',
  styleUrls: ['./footer-dashboard.component.scss']
})
export class FooterDashboardComponent implements OnInit, OnDestroy {

  ADIB_WEBSITE_URL_TEXT = ADIB_WEBSITE_URL_TEXT;
  termsConditionLink = FOOTER_LINKS.termsCondition;
  bankingFeesLink = FOOTER_LINKS.bankingFees;
  securityTipsLink = FOOTER_LINKS.securityTips;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  subscription$ = new Subscription();

  constructor(private sharedService: SharedService) { }

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
    }));
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
