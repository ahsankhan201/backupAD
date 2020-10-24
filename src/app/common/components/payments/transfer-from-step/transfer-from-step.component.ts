import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/common/services/shared.service';
import { PaymentService } from 'src/app/common/services/payment/payment.service';
import { AccountCheckBoxModel, TransferFromSelectionModel } from '../../../models/global.model';
import {
  ACCOUNT_ALLOWED_FOR_PAYMENTS, TRANSFER_FROM_PAYEE_SELECTION, ACCOUNT_TYPES,
  PAYMENT_SCREEN_TEXT, ACCOUNT_TEXT, ARABIC_LANG_TEXT, ACCOUNT_ALLOWED_STATUS_LIST
} from 'src/app/common/global-constants';
import { AccountListModel } from 'src/app/common/models/accounts-module.model';
import { PaymentTransferDetails } from 'src/app/common/models/payment.model';
import { CoverCardData } from 'src/app/common/models/cards-module.model';

@Component({
  selector: 'app-transfer-from-step',
  templateUrl: './transfer-from-step.component.html',
  styleUrls: ['./transfer-from-step.component.scss']
})
export class TransferFromStepComponent implements OnInit, OnDestroy {
  @Input() selectedAccountNumber: string;
  @Input() isPaymentToCoverCard: boolean;
  @Input() showCardsPayBillsView: boolean;

  subscription$ = new Subscription();
  updatedAccountsList: AccountCheckBoxModel[] = [];
  coverCardsList: CoverCardData[] = [];
  selectFromOptionList: TransferFromSelectionModel[] = TRANSFER_FROM_PAYEE_SELECTION;
  enableNextBtn = false;
  showAccountsCheckbox: boolean;
  showAlertMessage: boolean;
  accountAlertText: string = PAYMENT_SCREEN_TEXT.noAccountText;
  showCardsCheckbox = true;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(
    private sharedService: SharedService,
    private paymentService: PaymentService,
    private detectRef: ChangeDetectorRef) {
  }
  ngOnInit() {
    this.getSelectedLanguage();
    this.getAccountListForPayments();
    this.getCardsListForPayments();
    this.handleDonationCheck();
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
   * @methodName cancelTransaction
   * @parameter showCancelPopUp<boolean>
   * @description used to set the cancel transaction router link value
   * @return none
   */
  cancelTransaction(showCancelPopUp: boolean): void {
    this.sharedService.setCancelTransactionInfo(showCancelPopUp);
  }
  /**
   * @methodName selectedAccount
   * @parameter selectedAccountObj<AccountListModel>
   * @description used to set the selected account object
   * @return none
   */
  selectedAccount(selectedAccountObj: AccountListModel): void {
    this.paymentService.selectedAccountForPayment = selectedAccountObj;
    this.paymentService.selectedCardObjectForPayment = {};
    const transferDetails = {} as PaymentTransferDetails;
    transferDetails.availableAmount = selectedAccountObj.balanceAvailable.toString();
    transferDetails.avaialableText = PAYMENT_SCREEN_TEXT.availableBalance;
    transferDetails.currencyCode = selectedAccountObj.currencyCode;
    if (transferDetails.availableAmount && transferDetails.availableAmount !== '0') {
      this.paymentService.setPaymentTransferDetails(transferDetails);
      this.enableNextBtn = true;
      this.showAlertMessage = false;
    } else {
      this.accountAlertText = PAYMENT_SCREEN_TEXT.accountInsufficientBalanceText;
      this.enableNextBtn = false;
      this.showAlertMessage = true;
    }
  }
  /**
   * @methodName getAccountListForPayments
   * @description used to get account list for payments component
   * @parameters none
   * @return none
   */
  getAccountListForPayments(): void {
    if (this.sharedService.accountsCardsList) {
      const accountList = this.sharedService.clone(this.sharedService.accountsCardsList.accountsList);
      if (accountList) {
        accountList.map(account => {
          if (ACCOUNT_ALLOWED_FOR_PAYMENTS[account.accountType]
            && account.currencyCode === PAYMENT_SCREEN_TEXT.aedCurrencyCode
            && ACCOUNT_ALLOWED_STATUS_LIST.includes(account.status)) {
            account.accountTypeDescription = account.classDesc;
            this.updatedAccountsList.push(account);
          }
        });
        this.showAlertMessage = (this.updatedAccountsList.length === 0 ) ? true : false;
      }
    }
  }

  /**
   * @methodName selectedTransferFromOption
   * @parameter event<string>
   * @description Used to set the selected transfer from option
   * @return none
   */
  selectedTransferFromOption(event: string): void {
    this.showAlertMessage = false;
    if (event.toLowerCase() === ACCOUNT_TYPES.ACCOUNT.toLowerCase()) {
      this.showAccountsCheckbox = true;
      this.enableNextBtn = this.selectedAccountNumber ? true : false;
      this.showAlertMessage = (this.updatedAccountsList.length === 0 ) ? true : false;
    } else {
      this.showAccountsCheckbox = this.enableNextBtn = false;
      this.selectedAccountNumber = undefined;
      this.showAlertMessage = (this.coverCardsList.length === 0 ) ? true : false;
    }
    this.detectRef.detectChanges();
  }

  /**
   * @methodName getAccountListForPayments
   * @description used to get account list for payments component
   * @parameters none
   * @return none
   */
  getCardsListForPayments(): void {
    if (this.sharedService.coverCardsListforTransfer) {
      this.coverCardsList = this.sharedService.clone(this.sharedService.coverCardsListforTransfer);
    }
    if (this.isPaymentToCoverCard) {
      this.showAccountsCheckbox = true;
    }
  }

  /**
   * @methodName selectedCard
   * @parameter selectedCardObj<DebitCardData | CoverCardData>
   * @description used to set selected card checkbox from the list
   * @return none
   */
  selectedCard(selectedCardObj: CoverCardData): void {
    this.selectedAccountNumber = undefined;
    this.paymentService.selectedAccountForPayment = {} as AccountListModel;
    this.paymentService.selectedCardObjectForPayment = selectedCardObj;
    const transferDetails = {} as PaymentTransferDetails;
    transferDetails.availableAmount = selectedCardObj.creditAvailable.toString();
    transferDetails.avaialableText = PAYMENT_SCREEN_TEXT.availableLimit;
    transferDetails.currencyCode = selectedCardObj.currencyCode;
    if (transferDetails.availableAmount && Number(transferDetails.availableAmount) > PAYMENT_SCREEN_TEXT.ZERO ) {
      this.paymentService.setPaymentTransferDetails(transferDetails);
      this.enableNextBtn = true;
      this.showAlertMessage = false;
    } else {
      this.accountAlertText = PAYMENT_SCREEN_TEXT.cardInsufficientBalanceText;
      this.enableNextBtn = false;
      this.showAlertMessage = true;
    }
  }
  /**
   * @methodName moveToNextStep
   * @parameter none
   * @description used to set setOutStandingBalanceSubject true to make api request
   * @return none
   */
  moveToNextStep(): void {
    if (this.paymentService.isPayeeSelectedForPayment || this.paymentService.isCoverCardSelectedForPayment) {
      this.paymentService.setOutStandingBalanceSubject(true);
    }
  }
  /**
   * @methodName handleDonationCheck
   * @parameter none
   * @description used to set handle conditional for donation
   * @return none
   */
  handleDonationCheck(): void {
    if (this.paymentService.isPaymentTypeDonation()) {
      this.showCardsCheckbox = false;
      this.selectFromOptionList = TRANSFER_FROM_PAYEE_SELECTION.filter(item => item.id === ACCOUNT_TEXT);
    }
  }
  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
