import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { SharedService } from 'src/app/common/services/shared.service';
import { OpenAccountService } from 'src/app/common/services/open-account/open-account.service';
import { SNACKBAR_MESSAGETYPE, DOMAINS, SUMMARY_COMPONENT, DIALOG_OPTION_BANKING_SERVICE_TERMS } from 'src/app/common/global-constants';
import { HTTP_STATUS_CODE, ICON, SUCCESS_SCREEN_COMPONENT, RESPONSE_STATUS_TEXT, OTP_COMPONENT } from 'src/app/common/global-constants';
import { ACCOUNTS_ENDPOINTS } from 'src/app/common/api-endpoints';
import { OTPResponse } from 'src/app/common/models/otp.model';
import { DialogService } from 'src/app/common/services/dialog.service';
import { Dialog } from 'src/app/common/models/dialog.model';

@Component({
  selector: 'app-open-account-summary',
  templateUrl: './open-account-summary.component.html',
  styleUrls: ['./open-account-summary.component.scss']
})
export class OpenAccountSummaryComponent implements OnInit {
  @Output() showOpenAccountFormComponent = new EventEmitter();
  showSuccessScreen = false;
  showOTPComp = false;
  location: string;
  showComponent = SUMMARY_COMPONENT;
  summaryScreenDetails: any;
  sourceDashBoardName: string;
  newAccountNumber: string;
  isTermsAgreed = false;
  bankingServiceTermsTickImage = ICON.tickNonSelectedIcon;
  constructor(
    private openAccountService: OpenAccountService,
    private sharedService: SharedService,
    private dialogService: DialogService,
    ) { }

    ngOnInit() {
      this.summaryScreenDetails =  this.openAccountService.timeDepositSummaryDetails;
      this.sourceDashBoardName = this.openAccountService.openAccountSelectedFrom;
      this.setTermsServiceImages();
    }
  /**
   * @methodName setTermsServiceImages
   * @params none
   * @description used to set terms condition tick images
   * @return none
   */
  setTermsServiceImages(): void {
    this.bankingServiceTermsTickImage = (this.openAccountService.isBankSeviceTermsAgreed) ?
      ICON.tickSelectedIcon : ICON.tickNonSelectedIcon;
  }

  /**
   * @methodName getOTPLocationDetails
   * @param isItPostCall<boolean>
   * @description Used for adding the payee in server
   * @return none
   */
  getOTPLocationDetails(isItPostCall?: boolean): void {
    if (!isItPostCall) {
      this.showComponent  = OTP_COMPONENT;
    }
    // Method to generate open time deposit account request payload
    this.openAccountService.generateTimeDepositPayload();
    const OPEN_ACCOUNT_URL = `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, true)}${ACCOUNTS_ENDPOINTS.OPEN_ACCOUNT}`;
    this.openAccountService.createNewAccount(OPEN_ACCOUNT_URL, this.openAccountService.timeDepositPayload).subscribe(response => {
      if (response && response.body) {
        response.body = JSON.parse(response.body.toString());
      }
      if (isItPostCall && response[RESPONSE_STATUS_TEXT] === HTTP_STATUS_CODE.CREATED) {
        this.showComponent = SUCCESS_SCREEN_COMPONENT;
        this.newAccountNumber = response.body.accountNumber;
      }
      response && response.body && response.body.location ?
        (this.location = response.body.location, this.showComponent  = OTP_COMPONENT) :
        this.location = null;
    });
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

  /**
   * @methodName showOpenAccountForm
   * @param <boolean>
   * @description Used to emit value to parent component to show form in edit mode
   * @return none
   */
  showOpenAccountForm(isBackBtnClicked: boolean): void {
    this.showOpenAccountFormComponent.emit(isBackBtnClicked);
  }


  /**
   * @methodName handleTermsAndCondition
   * @parameter none
   * @description used to handle terms and condition agree | disagree
   * @return none
   */
  handleTermsAndCondition(): void {
    const OPTIONS: Dialog = DIALOG_OPTION_BANKING_SERVICE_TERMS;
    OPTIONS.termsAndCondtionAgreeStatus = this.openAccountService.isBankSeviceTermsAgreed;
    this.dialogService.open(OPTIONS);
    this.dialogService.confirmed().subscribe(confirmed => {
       if (confirmed === true) {
        this.isTermsAgreed = true;
        this.openAccountService.isBankSeviceTermsAgreed = true;
        this.bankingServiceTermsTickImage = ICON.tickSelectedIcon;
      } else if (confirmed === false) {
        this.openAccountService.isBankSeviceTermsAgreed = false;
        this.showOpenAccountForm(true);
      }
    });
  }
}
