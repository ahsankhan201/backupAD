import { Component, OnInit, OnDestroy, } from '@angular/core';

/* Include services here */
import { PayeeService } from '../../services/payee.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { Subscription } from 'rxjs';

/* Include constants and models here */
import { SNACKBAR_MESSAGETYPE, DOMAINS, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { PAYEE_ENDPOINTS } from 'src/app/common/api-endpoints';
import { PayeeSummaryDetails } from 'src/app/common/models/payee.model';
import { OTPResponse } from 'src/app/common/models/otp.model';

@Component({
  selector: 'app-confirm-payee',
  templateUrl: './confirm-payee.component.html',
  styleUrls: ['./confirm-payee.component.scss']
})
export class ConfirmPayeeComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  payeeSummaryInfo = {} as PayeeSummaryDetails;
  showOrHideOTPComp: boolean;
  showSuccessScreen: boolean;
  payeeName: string;
  location: string;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(private payeeService: PayeeService, private sharedService: SharedService) {
  }

  ngOnInit() {
    this.payeeSummaryInfo = this.payeeService.payeeSummaryDetails;
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
   * @methodName getOTPLocationDetails
   * @param <boolean>
   * @description Used for adding the payee in server
   * @return none
   */
  getOTPLocationDetails(isItPostCall?: boolean) {
    if (!isItPostCall) {
      this.showOrHideOTPComp = true;
    }
    const ADD_PAYEE_API = `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, true)}${PAYEE_ENDPOINTS.UTILITY_BENEFICIARY}`;
    const data = this.payeeService.addPayeePayLoad;
    this.subscription$.add(this.payeeService.fetchOTPLocation(ADD_PAYEE_API, data).subscribe(response => {
      if (response && isItPostCall && response.status === 201) {
        this.showOrHideOTPComp = false;
        this.showSuccessScreen = true;
        this.payeeName = this.payeeService.addPayeePayLoad ? this.payeeService.addPayeePayLoad.nickName : null;
      }
      if (response && response.body) {
        const BODY = JSON.parse((response.body).toString());
        (BODY && BODY.location) ?
          (this.location = BODY.location, this.showOrHideOTPComp = true) : this.location = null;
      }
    }));
  }

  /**
   * @methodName resendOTPRequired
   * @param <boolean>
   * @description Used to fetch the OTP Location details
   * @return none
   */
  resendOTPRequired(resendOTP: boolean): void {
    if (resendOTP) {
      this.getOTPLocationDetails(false);
    }
  }
  /**
   * @methodName getResponse
   * @param <OTPResponse>
   * @description Used to fetch or post the OTP info to CIAM
   * @return none
   */
  getOTPResponse(otpResponseObj: OTPResponse): void {
    if (otpResponseObj && otpResponseObj.success) {
      this.getOTPLocationDetails(true);
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
