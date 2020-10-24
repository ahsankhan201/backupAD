import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SharedService } from 'src/app/common/services/shared.service';
import { ADIB_WEBSITE_URL_TEXT, ARABIC_LANG_TEXT, SECURITY_TIPS_CONST, LOGOUT_SCREEN_IMAGES } from 'src/app/common/global-constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit, OnDestroy {
  isSessionExpired: boolean;
  adibWebsiteUrl = ADIB_WEBSITE_URL_TEXT;
  subscription$ = new Subscription();
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  readonly SECURITY_TIPS_CONSTANTS = SECURITY_TIPS_CONST;
  APP_STORE_LINK = environment.APP_STORE_DOWNLOAD_LINK;
  GOOGLE_PLAY_LINK = environment.GOOGLE_PLAY_DOWNLOAD_LINK;
  readonly LOGOUT_SCREEN_IMAGES = LOGOUT_SCREEN_IMAGES;
  constructor(private sharedService: SharedService) { }
  ngOnInit() {
    this.isSessionExpired = this.sharedService.isSessionExpired;
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

  /**
   * @methodName openDownloadAppTab
   * @description open download app url in new tab
   * @parameters downloadUrl<string>
   * @return void
   */
  openDownloadAppTab(downloadUrl: string): void {
    window.open(downloadUrl);
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
