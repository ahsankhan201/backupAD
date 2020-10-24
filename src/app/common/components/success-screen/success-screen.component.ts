import { Component, OnInit, Input } from '@angular/core';
import {
  SUCCESS_SCREEN_TEXT, PAYEE_SUCCESS_SCREEN_TEXT,
  PAYMENT_SUCCESS_SCREEN_TEXT, TRANSFER_SUCCESS_SCREEN_TEXT, ARABIC_LANG_TEXT, BANKING_SERVICE_SUCCESS_SCREEN_TEXT
} from '../../global-constants';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-success-screen',
  templateUrl: './success-screen.component.html',
  styleUrls: ['./success-screen.component.scss']
})
export class SuccessScreenComponent implements OnInit {
  successScreenTextBeneficiary = SUCCESS_SCREEN_TEXT;
  successScreenTextPayee = PAYEE_SUCCESS_SCREEN_TEXT;
  successScreenTextBankingService = BANKING_SERVICE_SUCCESS_SCREEN_TEXT;
  paymentSuccessScreenText = PAYMENT_SUCCESS_SCREEN_TEXT;
  internationalTransferSuccessText = TRANSFER_SUCCESS_SCREEN_TEXT;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  @Input() beneficiaryName: string;
  @Input() successHeader: string = this.successScreenTextBeneficiary.benAdded;
  @Input() showPayeeSuccessScreen = false;
  @Input() componentName: string;
  @Input() paymentReferenceNumber?: string;
  @Input() productEnquired?: string;
  @Input() activatedCardNumber?: string;
  @Input() newAccountNumber?: string;
  @Input() openedAccountCurrencyCode?: string;
  @Input() showAlertIcon = true;
  @Input() coolingTime?: string;
  url: string;
  @Input() linkAccountDetails: any;
  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.setSuccessHeader();
    this.getSelectedLanguage();
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
   * @methodName setSuccessHeader
   * @description used to set the success screen header
   * @parameters none
   * @return none
   */
  setSuccessHeader(): void {
    switch (this.componentName) {
      case this.successScreenTextPayee.PAYEE:
        this.successHeader = PAYEE_SUCCESS_SCREEN_TEXT.payeeAdded;
        break;
      case this.successScreenTextBankingService.PAYMENT_ORDER:
        this.successHeader = BANKING_SERVICE_SUCCESS_SCREEN_TEXT.requestAddedText;
        break;
      case this.successScreenTextBeneficiary.BENEFICIARY:
        this.successHeader = this.successScreenTextBeneficiary.benAdded;
        break;
      case this.paymentSuccessScreenText.PAYMENT:
      case this.paymentSuccessScreenText.COVER_CARD_PAYMENT:
      case this.paymentSuccessScreenText.DONATION_PAYMENT:
      case this.paymentSuccessScreenText.PRODUCT_ENQUIRY:
      case this.paymentSuccessScreenText.OPEN_ACCOUNT:
      case this.paymentSuccessScreenText.TIME_DEPOSIT_ACCOUNT:
      case this.paymentSuccessScreenText.GHINA_SAVINGS_ACCOUNT:
      case this.paymentSuccessScreenText.CHANGE_PASSWORD:
      case this.paymentSuccessScreenText.ACTIVATE_CARD:
      case this.paymentSuccessScreenText.CHANGE_COVER_LIMIT:
      case this.paymentSuccessScreenText.BANK_CERTIFICATE:
      case this.paymentSuccessScreenText.CHANGE_CARD_PRIMARY_ACC:
      case this.internationalTransferSuccessText.internatinalTransferText:
        this.successHeader = this.paymentSuccessScreenText.successHeaderText;
        break;
      case this.internationalTransferSuccessText.accountTransferText:
        this.successHeader = this.paymentSuccessScreenText.successHeaderText;
        break;
    }
  }

  /** @methodName showPayBill
   * @description used to show paybill screen
   * @parameters url
   * @return none
   */
  showPayBill(url: string): void {
    this.sharedService.setShowPaybill.next(url);

  }

}
