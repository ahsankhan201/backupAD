import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SharedService } from '../../services/shared.service';

import { ARABIC_LANG_TEXT } from '../../global-constants';

@Component({
  selector: 'app-marketing-banner',
  templateUrl: './marketing-banner.component.html',
  styleUrls: ['./marketing-banner.component.scss']
})
export class MarketingBannerComponent implements OnDestroy, OnInit {

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
