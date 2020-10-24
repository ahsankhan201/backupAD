import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CountdownComponent } from 'ngx-countdown';
import { OTP_DATA, HTTP_STATUS_CODE, ARABIC_LANG_TEXT,
  CIAM_MECHANISMS, SESSION_TIMEOUT_CLASS, MECHANISM_TEXT, USER_STATE_TEXT,
   CAPTCHA_TEXT, SNACKBAR_MESSAGETYPE, LOCATION_TEXT } from '../../global-constants';
import { BLOCKED_USER_DIALOG_DATA, REGISTRATION_CONFIG } from '../../global-constants';
import { OTPService } from '../../services/otp.service';
import { OTPResponse } from '../../models/otp.model';
import { SharedService } from '../../services/shared.service';
import { HttpHeaderService } from '../../services/http-headers/http-header.service';
import { DialogService } from '../../services/dialog.service';
import { Dialog } from '../../models/dialog.model';
import { COMPONENT_LIST } from 'src/app/modules/auth/auth-module.constants';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { LogoutService } from 'src/app/modules/logout/services/logout.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OTPComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('countDownTimer', { static: false }) private countdown: CountdownComponent;
  @Input() enableSubmitButton = true;
  @Input() enableRecaptcha = false;
  @Input() location: string;
  @Input() masking = false;
  @Output() response = new EventEmitter<OTPResponse>();
  @Output() resendOTPRequired = new EventEmitter<boolean>();
  @Output() cancelButtonClick = new EventEmitter<boolean>(false);
  otpTextData = OTP_DATA;
  maxLength = OTP_DATA.OTP_MAXLENGTH;
  messageText = OTP_DATA.MESSAGE;
  doneText = OTP_DATA.doneText;
  maskedMobileNumber: string;
  otp: any;
  otpResponse = {} as OTPResponse;
  enableResendOTPButton = false;
  otpConfig = { leftTime: OTP_DATA.RESEND_OTP_TIMER, format: OTP_DATA.TIMER_FORMAT };
  otpNumberlength = 6;
  enableNextBtn = false;
  showRecaptcha = false;
  resetInputValue = false;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  validCaptcha = false;
  alertMessage: string;
  constructor(
    private otpService: OTPService,
    private dialogService: DialogService,
    private logoutService: LogoutService,
    private authService: AuthService,
    private router: Router,
    private sharedService: SharedService,
    private headerService: HttpHeaderService) { }

  ngOnInit() {
    this.validations();
    this.getSelectedLanguage();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.location.currentValue) {
      this.location = changes.location.currentValue;
    }
  }

  /**
   * @methodName getSelectedLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getSelectedLanguage(): void {
    this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLanguage = selectedLanguage;
    });
  }

  /**
   * @methodName maskMobileNumber
   * @description used to mask mobile number
   * @param mobileNumber<string>
   * @return string
   */
  maskMobileNumber(mobileNumber: string) {
    mobileNumber = mobileNumber.toString();
    return OTP_DATA.MASKING_SYMBOL.concat(mobileNumber.substr(mobileNumber.length - OTP_DATA.SHOW_LAST_OF_MOBILE_NUMBER));
  }

  /**
   * @methodName verifyOTP
   * @description used to verify otp
   * @parameters none
   * @return none
   */
  verifyOTP(): void {
    this.resetInputValue = false;
    if (this.otp && this.otp.toString().length === OTP_DATA.OTP_MAXLENGTH) {
      this.otpService.verifyOTP(this.otp, this.location).subscribe(
        data => {
          this.getOTPResponse(data);
        },
        err =>  { this.getOTPErrorResponse(err);  }
      );
    } else {
      this.getOTPResponse(this.otpResponse.success = true);
    }
    this.otp = '';
    this.resetInputValue = true;
  }

  /**
   * @methodName otpTimer
   * @description used to set otp timer
   * @parameters event
   * @return none
   */
  otpTimer(event): void {
    if (event.action === this.doneText) {
      this.enableResendOTPButton = true;
    }
  }

  /**
   * @methodName resendOTP
   * @description used to resend otp
   * @parameters none
   * @return none
   */
  resendOTP(): void {
    this.otp = '';
    this.resetInputValue = true;
    this.enableResendOTPButton = false;
    this.countdown.restart();
    this.resendOTPRequired.emit(true);
  }

  /**
   * @methodName getOTPResponse
   * @description used to get otp response
   * @param data<any>
   * @return none
   */
  getOTPResponse(data: any): void {
    if (data.status === HTTP_STATUS_CODE.OK) {
      this.otpResponse.success = false;
      this.otpResponse.message = data.body.message ? data.body.message : OTP_DATA.INVALID_OTP_TEXT;
    } else if (data.status === HTTP_STATUS_CODE.NO_CONTENT) {
      this.otpResponse.success = true;
      this.otpResponse.message = '';
    }
    this.response.emit(this.otpResponse);
  }

  /**
   * @methodName getOTPErrorResponse
   * @description used to get error response
   * @param error<any>
   * @return none
   */
  getOTPErrorResponse(error: any): void {
    if (error.httpCode === HTTP_STATUS_CODE.BAD_FORMAT) {
      this.resetInputValue = true;
      this.otpResponse.success = false;
      this.otpResponse.message = OTP_DATA.OTP_EXPIRED;
    } else if (error.httpCode === HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR) {
      this.otpResponse.success = false;
      this.otpResponse.message = OTP_DATA.INTERNAL_SERVER_ERROR;
    }
    this.response.emit(this.otpResponse);
  }

  /**
   * @methodName validations
   * @description used to validate otp
   * @parameters none
   * @return none
   */
  validations(): void {
    this.otpResponse.success = false;
    if (!this.location) {
      this.otpResponse.message = OTP_DATA.NO_LOCATION_FOUND;
      this.response.emit(this.otpResponse);
    }
  }

  /**
   * @methodName handleOtpNumber
   * @description used to handle handle OtpNumber from input-generic component
   * @parameters none
   * @return none
   */
  handleOtpNumber(otpNumber: string): void {
    this.enableNextBtn = false;
    // Enable next button without captcha, only OTP value or Enable next button if captcha value and OTP value are valid
    if ( otpNumber ) {
      this.otp = otpNumber;
      this.handleNextButtonStatus();
    }
  }

  /**
   * @methodName handleCancelButton
   * @description used to handle cancel button action to @output emit
   * @parameters none
   * @return none
   */
  handleCancelButton(): void {
    this.resetInputValue = true;
    this.cancelButtonClick.emit(true);
  }


  /**
   * @methodName verifyOTPwithRecaptcha
   * @description used to verify otp and recatcha
   * @parameters isPostCall - used to enable post or put call for OTP
   * @return none
   */
  verifyOTPwithRecaptcha(isPostCall = false): void {
    this.resetInputValue = this.showRecaptcha =  false;
    this.alertMessage = undefined;
    if (this.otp && this.otp.toString().length === OTP_DATA.OTP_MAXLENGTH) {
      // To enable ReCaptcha this.enableRecaptcha = true; this.showRecaptcha = true; need to set true
      const OTP_RESPONSE  =  {} as OTPResponse;
      this.otpService.verifyOTPWithCredential(this.otp, this.location, isPostCall).subscribe(
        data => {
          OTP_RESPONSE.success = true;
          OTP_RESPONSE.message = JSON.parse(data.body);
          if (data.status === HTTP_STATUS_CODE.OK && OTP_RESPONSE.message[MECHANISM_TEXT] === CIAM_MECHANISMS.otp_success) {
            // successfull OTP response
          } else if ( data.status === HTTP_STATUS_CODE.OK
            && OTP_RESPONSE.message[MECHANISM_TEXT] === CIAM_MECHANISMS.otp_failure
            && OTP_RESPONSE.message['mappingRuleData'] === CIAM_MECHANISMS.mappingRuleData_R07 // OTP Retry Limit Exceeded
            && OTP_RESPONSE.message[USER_STATE_TEXT] === 'blocked'
            ) {
            // Open User blocked dialog
            this.openBlockUserDialog();

          } else if ( data.status === HTTP_STATUS_CODE.OK
            && OTP_RESPONSE.message[MECHANISM_TEXT] === CIAM_MECHANISMS.otp_failure
            && OTP_RESPONSE.message[USER_STATE_TEXT] === CAPTCHA_TEXT
            ) {
            // alert message to user after 4th invalid otp
            this.alertMessage  = (OTP_RESPONSE.message['retryCounter'] === OTP_DATA.invalid_otp_retryCounter_4) ?
            OTP_DATA.invalid_otp_retryCounter_4_message : undefined;
            // recaptcha integration
            this.enableNextBtn = false; // disable Next button
            this.enableRecaptcha = true; // enable captcha
            this.showRecaptcha = true;
          } else if (data.status === HTTP_STATUS_CODE.OK && OTP_RESPONSE.message[MECHANISM_TEXT] === CIAM_MECHANISMS.otp_failure ) {
            if (isPostCall) {
              this.location = OTP_RESPONSE.message[LOCATION_TEXT];
              const SNACKBAR_MESSAGE = new OTPResponse();
              SNACKBAR_MESSAGE.success = OTP_RESPONSE.success;
              SNACKBAR_MESSAGE.message = OTP_DATA.INVALID_OTP_TEXT;
              this.sharedService.setSnackBarMessage(SNACKBAR_MESSAGE, SNACKBAR_MESSAGETYPE.ERROR);
            }
            // invalid OTP
            this.enableNextBtn = false; // disable Next button
            this.resetInputValue = true;
          }
          this.resetInputValue = true;
          if (isPostCall && data.body === null && data.status === HTTP_STATUS_CODE.NO_CONTENT) {
            this.getOTPResponse(data);
          } else if (!isPostCall) {
              this.response.emit(OTP_RESPONSE) ;
          }
        },
        err => this.getOTPErrorResponse(err),
      );
    }
    this.otp = '';
  }

  /**
   * @methodName handleRecaptchaResponse
   * @description used to handle recaptcha response
   * @parameters none
   * @return none
   */
  handleRecaptchaResponse(response: string): void {
    if (response) {
      // recatcha success response
      this.headerService.reCaptchaValue = response;
      this.handleNextButtonStatus();
    } else {
      // recatcha time out response
      this.headerService.reCaptchaValue = undefined;
    }
  }

  /**
   * @methodName handleNextButtonStatus
   * @description used to handle handle next buttons status true | false
   * @parameters none
   * @return none
   */
  handleNextButtonStatus(): void {
    if ((this.showRecaptcha && this.otp && this.headerService.reCaptchaValue) || (!this.showRecaptcha && this.otp)) {
      this.enableNextBtn = true;
    }
  }
  /**
   * @methodName openBlockUserDialog
   * @description used to open dialog for blocked user warning
   * @parameters none
   * @return none
   */
  openBlockUserDialog(): void {
    const OPTIONS = {} as Dialog;
    OPTIONS.title = BLOCKED_USER_DIALOG_DATA.title;
    OPTIONS.message = undefined;
    OPTIONS.cancelText = BLOCKED_USER_DIALOG_DATA.cancelText;
    OPTIONS.confirmText = BLOCKED_USER_DIALOG_DATA.confirmText;
    OPTIONS.dialogClassName = SESSION_TIMEOUT_CLASS;
    OPTIONS.textTemplate = BLOCKED_USER_DIALOG_DATA.textTemplate;   // dialog message template when a user blocked - invalid-otp
    OPTIONS.isBlockUser = true; // The maximum number of retries (5) has been exceeded
    this.dialogService.open(OPTIONS);
    this.dialogService.confirmed().subscribe((response) => {
      if (response) {
        this.logoutService.logoutUser(true);
        this.authService.showComponent$.next(COMPONENT_LIST.LOGIN);
      }
    });
  }

  ngOnDestroy() {
    this.showRecaptcha = false;
    this.alertMessage = undefined;
  }
}
