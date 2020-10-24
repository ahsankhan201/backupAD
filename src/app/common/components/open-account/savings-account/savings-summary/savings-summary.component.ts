import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { OpenAccountService } from 'src/app/common/services/open-account/open-account.service';
import { SharedService } from 'src/app/common/services/shared.service';

import {
  OPEN_SAVINGS_ACCOUNT_TEXT, SNACKBAR_MESSAGETYPE,
  DOMAINS, ARABIC_LANG_TEXT, HTTP_STATUS_CODE
} from 'src/app/common/global-constants';
import { ICON, DIALOG_OPTION_BANKING_SERVICE_TERMS } from 'src/app/common/global-constants';
import { SavingsAccountSummaryModel } from 'src/app/common/models/open-account.model';
import { OTPResponse } from 'src/app/common/models/otp.model';
import { ACCOUNTS_ENDPOINTS } from 'src/app/common/api-endpoints';
import { Dialog } from 'src/app/common/models/dialog.model';
import { DialogService } from 'src/app/common/services/dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-savings-summary-account',
  templateUrl: './savings-summary.component.html',
  styleUrls: ['./savings-summary.component.scss']
})
export class SavingsSummaryAccountComponent implements OnInit {
  @Output() showOpenAccountFormComponent = new EventEmitter();

  showedComponentName = OPEN_SAVINGS_ACCOUNT_TEXT.SUMMARY_SCREEN;
  summaryDetailsObj = {} as SavingsAccountSummaryModel;
  location: string;
  newAccountNumber: string;
  sourceDashBoardName: string;
  isTermsAgreed = false;
  bankingServiceTermsTickImage = ICON.tickNonSelectedIcon;
  selectedLang: string;
  subscription$ = new Subscription();
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private openAccountService: OpenAccountService,
    private dialogService: DialogService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.summaryDetailsObj = this.openAccountService.savingsAccountSummaryDetails;
    this.sourceDashBoardName = this.openAccountService.openAccountSelectedFrom;
    this.setTermsServiceImages();
    this.getLanguage();
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
   * @methodName createSavingsAccount
   * @param <boolean>
   * @description used to create the open account request
   * @return none
   */
  createSavingsAccount(isItPostCall?: boolean): void {
    if (!isItPostCall) {
      this.showedComponentName = OPEN_SAVINGS_ACCOUNT_TEXT.OTP_COMPONENT;
    }
    const REGISTER_ACCOUNT_URL = `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, true)}${ACCOUNTS_ENDPOINTS.OPEN_ACCOUNT}`;
    this.openAccountService.generateOpenAccountReqPayLoad();
    this.openAccountService.createNewAccount(REGISTER_ACCOUNT_URL, this.openAccountService.openAccountReqPayLoad).subscribe(response => {
      if (response && response.body) {
        response.body = JSON.parse(response.body.toString());
      }
      if (isItPostCall && response['status'] === HTTP_STATUS_CODE.CREATED) {
        this.showedComponentName = OPEN_SAVINGS_ACCOUNT_TEXT.SUCCESS_SCREEN;
        this.newAccountNumber = response.body.accountNumber;
      }
      response && response.body && response.body.location ?
        (this.location = response.body.location, this.showedComponentName = OPEN_SAVINGS_ACCOUNT_TEXT.OTP_COMPONENT) :
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
      this.createSavingsAccount(false);
    }
  }
  /**
   * @methodName getOTPResponse
   * @param <OTPResponse>
   * @description Used to fetch or post the OTP info to CIAM
   * @return none
   */
  getOTPResponse(otpResponseObj: OTPResponse): void {
    if (otpResponseObj && otpResponseObj.success) {
      this.createSavingsAccount(true);
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

  /**
   * @methodName getLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getLanguage(): void {
    this.subscription$.add(this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLang = selectedLanguage;
    }));
  }
}
