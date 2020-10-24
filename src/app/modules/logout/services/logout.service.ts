import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { SharedService } from 'src/app/common/services/shared.service';
import { APISyncService } from 'src/app/common/services/sync.service';
import { HttpHeaderService } from 'src/app/common/services/http-headers/http-header.service';
import { DialogService } from 'src/app/common/services/dialog.service';

import { environment } from 'src/environments/environment';
import { DOMAINS, PROFILE_MENU_DATA, SESSION_TIMEOUT_CLASS, HTTP_STATUS_CODE } from 'src/app/common/global-constants';
import { Dialog } from 'src/app/common/models/dialog.model';

@Injectable()
export class LogoutService {
  idleSecondsTimer: number;
  idleSecondsCounter: number;

  constructor(
    private sharedService: SharedService,
    private httpService: APISyncService,
    private httpHeaderService: HttpHeaderService,
    private router: Router,
    private dialogService: DialogService) { }

  /**
   * @methodName logout
   * @description used to logout the user
   * @parameters none
   * @return none
   */
  logout(): Observable<any> {
    const LOGOUT_URL = `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)}${environment.CIAM.ENDPOINTS.LOGOUT}`;
    this.httpHeaderService.customHeaderFunction = this.httpHeaderService.generateLoginHeaders;
    const requestPayload = new HttpParams().set('token', this.sharedService.accessToken)
      .set('client_id', environment.CIAM.CLIENT_ID);
    return this.httpService.post(LOGOUT_URL, requestPayload);
  }

  /**
   * @methodName logout
   * @description It'll add event listeners to the document to track browser iddle time
   * @parameters none
   * @return none
   */
  getUserIdleTime() {
    this.idleSecondsTimer = null;
    this.idleSecondsCounter = 0;
    // resetting idle titme to '0' on any user interaction
    document.onclick = () => {
      this.idleSecondsCounter = 0;
    };
    document.onmousemove = () => {
      this.idleSecondsCounter = 0;
    };
    document.onkeypress = () => {
      this.idleSecondsCounter = 0;
    };
    this.idleSecondsTimer = window.setInterval(this.checkBrowserIdleTime.bind(this), 1000);
  }

  /**
   * @methodName checkBrowserIdleTime
   * @description it will call openTimeoutModal based on iddle time calculation
   * @parameters none
   * @return none
   */
  checkBrowserIdleTime(): void {
    this.idleSecondsCounter++;
    if (this.idleSecondsCounter === environment.SESSION_IDLE_TIMEOUT - environment.SESSION_LOGOUT_INDICATION_TIME) {
      this.openTimeoutModal();
    }
  }

  /**
   * @methodName logoutUser
   * @description used to logout the user and clear access token
   * @parameters none
   * @return none
   */
  logoutUser(routeToLogin = false): void {
    clearInterval(this.idleSecondsTimer);
    this.logout().subscribe((response) => {
      if (response.status === HTTP_STATUS_CODE.OK) {
        this.sharedService.accessToken = undefined;
        this.sharedService.refreshToken = undefined;
        this.sharedService.isUserLoggedIn = undefined;
        this.sharedService.toggleBackgroundImageClasses();
        (routeToLogin) ? this.router.navigateByUrl('/')
          : this.router.navigateByUrl(PROFILE_MENU_DATA.logoutRoute);
      }
    });
  }

  /**
   * @methodName openTimeoutModal
   * @description used to open iddle timeout modal
   * @parameters none
   * @return none
   */
  openTimeoutModal(): void {
    const OPTIONS = {} as Dialog;
    OPTIONS.isSessionTimeoutDialog = true;
    OPTIONS.dialogClassName = SESSION_TIMEOUT_CLASS;
    // close the dialog if opened
    this.dialogService.closeDialog();
    this.dialogService.open(OPTIONS);
    this.dialogService.confirmed().subscribe((response) => {
      if (!response) {
        this.logoutUser();
      }
    });
  }
}
