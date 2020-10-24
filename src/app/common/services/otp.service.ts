import { Injectable } from '@angular/core';
import { APISyncService } from 'src/app/common/services/sync.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CIAM, OTP_DATA } from '../../common/global-constants';
import { OTP } from '../models/otp.model';
import { HttpHeaderService } from './http-headers/http-header.service';

@Injectable({
  providedIn: 'root'
})
export class OTPService {
  constructor(private apiService: APISyncService, private headerService: HttpHeaderService) { }

  /**
   * @methodName verifyOTP
   * @description used to verify otp from server
   * @param otpData<number>, location<string>
   * @return otp model
   */
  verifyOTP(otpData: number, location: string): Observable<any> {
    const payLoad = {} as OTP;
    payLoad['otp.user.otp'] = otpData;
    payLoad.operation = CIAM.OPERATION_VERIFY;
    payLoad.Submit = 'Submit';
    return this.apiService.post(
        environment.API_CONNECT_URL + environment.ADIB + location, payLoad,
        );
  }

  /**
   * @methodName verifyOTPWithCredential
   * @description used to verify otp from server with passing cookie
   * @param otpData<number>, location<string>
   * @return otp model
   */
  verifyOTPWithCredential(otpData: number, location: string, isPostCall = false): Observable<any> {
    const payLoad = {} as OTP;
    payLoad['otp.user.otp'] = otpData;
    payLoad.operation = CIAM.OPERATION_VERIFY;
    this.headerService.customHeaderFunction = this.headerService.ciamOtpWithCaptchaHeaders;
    if (isPostCall) {
      payLoad.Submit = OTP_DATA.submitPayloadText;
      return this.apiService.post(
          environment.API_CONNECT_URL + environment.ADIB + location, payLoad,
          );
    } else {
      return this.apiService.put(
          environment.API_CONNECT_URL + environment.ADIB + location, payLoad);
    }
  }
}
