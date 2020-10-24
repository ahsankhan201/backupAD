import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { NEW_USER_REG_CIAM_PAYLOAD } from 'src/app/common/global-constants';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { APISyncService } from 'src/app/common/services/sync.service';
import { HttpHeaderService } from 'src/app/common/services/http-headers/http-header.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  otpResponse$ = new BehaviorSubject(undefined);
  otpResponse = this.otpResponse$.asObservable();

  constructor(private apiService: APISyncService, private httpHeaderService: HttpHeaderService) { }

  /**
   * @methodName changePassword
   * @description initiate the change password otp
   * @parameter void
   * @return void
   */
  changePasswordOTP(): Observable<any> {
    const payloadObj = NEW_USER_REG_CIAM_PAYLOAD;
    const CIAM_URL = environment.API_CONNECT_URL + environment.ADIB + environment.CIAM.ENDPOINTS.CHANGE_PASSWORD;
    // Assigning generateCiamOTPHeaders  method to generate custom header
    this.httpHeaderService.customHeaderFunction = this.httpHeaderService.generateCiamOTPHeaders;
    return this.apiService.post(encodeURI(CIAM_URL), payloadObj, 'text', undefined, true)
      .pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName changePassword
   * @description change password for use
   * @parameter void
   * @return Observable<any>
   */
  changePassword(): Observable<any> {
    const payloadObj = { oldPassword: this.currentPassword, newPassword: this.newPassword, newPasswordConfirm: this.confirmNewPassword };
    let otpLocation = '';
    this.otpResponse.subscribe(response => { otpLocation = response.location; });
    const CIAM_URL = environment.API_CONNECT_URL + environment.ADIB + otpLocation;

    // Assigning generateCIAMUsernameHeaders method to generate custom header for creating Username
    this.httpHeaderService.customHeaderFunction = this.httpHeaderService.generateCIAMUsernameHeaders;
    return this.apiService.put(encodeURI(CIAM_URL), payloadObj, 'text', undefined, true)
      .pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }
}
