import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ICON, ANIMATION_JSON, SECURITY_TIPS_CONST } from '../../global-constants';
import { environment } from 'src/environments/environment';
import { AnimationModel } from '../../models/global.model';

@Component({
  selector: 'app-security-tips',
  templateUrl: './security-tips.component.html',
  styleUrls: ['./security-tips.component.scss']
})
export class SecurityTipsComponent implements OnInit {
  @Output() closeButtonClick = new EventEmitter<boolean>(false);
  closeIcon = ICON.closeIcon;
  securityTipsAnimation: AnimationModel;
  doMoreAnimation: AnimationModel;
  doYouKnowAnimation: AnimationModel;
  readonly SECURITY_TIPS_CONSTANTS = SECURITY_TIPS_CONST;
  APP_STORE_LINK = environment.APP_STORE_DOWNLOAD_LINK;
  GOOGLE_PLAY_LINK = environment.GOOGLE_PLAY_DOWNLOAD_LINK;
  constructor(
    private translateService: TranslateService) {
  }

  ngOnInit() {
    this.setAnimations();
  }

  /**
   * @methodName setAnimations
   * @description set all the animations
   * @parameters none
   * @return void
   */
  setAnimations(): void {
    this.securityTipsAnimation = {
      path: ANIMATION_JSON.SECURITY_TIPS_JSON,
      renderer: SECURITY_TIPS_CONST.SVG,
      loop: true,
      autoplay: true
    };
    this.doMoreAnimation = {
      path: ANIMATION_JSON.DO_MORE_JSON,
      renderer: SECURITY_TIPS_CONST.SVG,
      loop: true,
      autoplay: true
    };
    this.doYouKnowAnimation = {
      path: ANIMATION_JSON.DO_YOU_KNOW_JSON,
      renderer: SECURITY_TIPS_CONST.SVG,
      loop: true,
      autoplay: true
    };
  }

  /**
   * @methodName handleCloseAction
   * @description set handle close button action
   * @parameters none
   * @return void
   */
  handleCloseAction() {
    this.closeButtonClick.emit(true);
  }

  /**
   * @methodName openDownloadAppTab
   * @description open download app url in new tab
   * @parameters none
   * @return void
   */
  openDownloadAppTab(downloadUrl: string): void {
    window.open(downloadUrl);
  }
}
