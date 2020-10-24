import { Component, OnInit, OnDestroy } from '@angular/core';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { SummaryDetails } from 'src/app/common/models/beneficiary-module.model';
import { SNACKBAR_MESSAGETYPE, DOMAINS, ARABIC_LANG_TEXT, HTTP_STATUS_CODE, COOLING_PERIOD } from 'src/app/common/global-constants';
import { BENEFICIARY_ENDPOINTS, PAYEE_ENDPOINTS } from 'src/app/common/api-endpoints';
import { SUMMARY_SCREEN_TEXT, BANK_SELECTION_SCREEN_TEXT } from '../../beneficiary-module.constants';
import { SharedService } from 'src/app/common/services/shared.service';
import { OTPResponse } from 'src/app/common/models/otp.model';
import { HttpHeaderService } from 'src/app/common/services/http-headers/http-header.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account-component.html',
  styleUrls: ['./confirm-account-component.scss']
})
export class ConfirmAccountComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  summaryDetails = new SummaryDetails();
  showOrHideOTPComp: boolean;
  showSuccessScreen: boolean;
  beneficiaryName: string;
  location: string;
  summaryLabelText = SUMMARY_SCREEN_TEXT;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  coolingTime: string;
  constructor(private headerService: HttpHeaderService,
              private beneficiaryService: BeneficiaryService,
              private sharedService: SharedService) { }

  ngOnInit() {
    this.summaryDetails = this.beneficiaryService.benSummaryDetails;
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
   * @description Used to post the Beneficiary Payload
   * @return none
   */
  getOTPLocationDetails(isItPostCall?: boolean): void {
    if (!isItPostCall) {
      this.showOrHideOTPComp = true;
    }
    const region = this.beneficiaryService.getRegion();
    const bank = this.beneficiaryService.getBank();
    const isMobileBene = this.beneficiaryService.isMobileBene;
    let OTP_LOCATION_API = this.sharedService.generateApiUrl(DOMAINS.API_SIT_CONNECT, true, true);
    let payLoadObject: any = {};
    if (region === BANK_SELECTION_SCREEN_TEXT.uae && bank === BANK_SELECTION_SCREEN_TEXT.otherBanks) {
      OTP_LOCATION_API += `${BENEFICIARY_ENDPOINTS.ADD_UAE_OTHER_BEN}`;
      payLoadObject = this.beneficiaryService.internationalBenPayLoadObj;
    } else if (isMobileBene) {
      OTP_LOCATION_API += `${BENEFICIARY_ENDPOINTS.ADD_INTERNAL_BEN}`;
      payLoadObject = this.beneficiaryService.internalBenPayLoad;
    } else if (region === BANK_SELECTION_SCREEN_TEXT.uae && bank === BANK_SELECTION_SCREEN_TEXT.adib) {
      OTP_LOCATION_API += `${BENEFICIARY_ENDPOINTS.ADD_INTERNAL_BEN}`;
      payLoadObject = this.beneficiaryService.internalBenPayLoad;
    } else if (bank === BANK_SELECTION_SCREEN_TEXT.otherBanks && region === BANK_SELECTION_SCREEN_TEXT.international) {
      OTP_LOCATION_API += `${BENEFICIARY_ENDPOINTS.ADD_INTERNATIONAL_BEN}`;
      payLoadObject = this.beneficiaryService.internationalBenPayLoadObj;
    } else if (bank === BANK_SELECTION_SCREEN_TEXT.adib && region === BANK_SELECTION_SCREEN_TEXT.international) {
      OTP_LOCATION_API += `${BENEFICIARY_ENDPOINTS.ADD_INTERNATIONAL_BEN}`;
      payLoadObject = this.beneficiaryService.internationalBenPayLoadObj;
    }

    this.subscription$.add(this.beneficiaryService.fetchOTPLocation(OTP_LOCATION_API, payLoadObject).subscribe((response: any) => {
      if (response['body']) {
        response['body'] = JSON.parse(response['body'].toString());
      }
      if (isItPostCall && response['status'] === HTTP_STATUS_CODE.CREATED) {
        this.showOrHideOTPComp = false;
        this.showSuccessScreen = true;
        this.beneficiaryName = payLoadObject.beneficiaryName;
        this.coolingTime = this.sharedService.convertMinutesReadbleFormat(response['headers'].get(COOLING_PERIOD));
      }
      response && response['body'] && response['body'].location ?
        (this.location = response['body'].location, this.showOrHideOTPComp = true) : this.location = null;
    }));
  }
  /**
   * @methodName resendOTPRequired
   * @param <boolean>
   * @description Used to fetch the OTP Location details
   * @return none
   */
  resendOTPRequired(resendOTP): void {
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
  getResponse(otpResponseObj: OTPResponse): void {
    if (otpResponseObj && otpResponseObj.success) {
      this.getOTPLocationDetails(true);
    }
  }

  ngOnDestroy() {
    this.beneficiaryService.isMobileBene = undefined;
    this.subscription$.unsubscribe();
  }
}
