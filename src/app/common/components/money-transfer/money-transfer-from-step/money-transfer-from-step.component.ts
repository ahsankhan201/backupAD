import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TransferFromSelectionModel } from 'src/app/common/models/global.model';
import {
  TRANSFER_FROM_PAYEE_SELECTION, ACCOUNT_TYPES,
  ACCOUNT_ALLOWED_FOR_PAYMENTS, ARABIC_LANG_TEXT
} from 'src/app/common/global-constants';
import { MONEY_TRANSFER_SCREEN_TEXT, ACCOUNT_ALLOWED_STATUS_LIST, PAYMENT_SCREEN_TEXT } from 'src/app/common/global-constants';
import { INSIDE_UAE_TRANSFER_TEXT, LOCAL_CURRENCY } from 'src/app/common/global-constants';
import { SharedService } from 'src/app/common/services/shared.service';
import { DebitCardData, CoverCardData } from 'src/app/common/models/cards-module.model';
import { AccountListModel } from 'src/app/common/models/accounts-module.model';
import { MoneyTransferService } from 'src/app/common/services/money-transfer/money-transfer.service';
import { MoneyTransferDetails } from 'src/app/common/models/money-transfer.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-money-transfer-from-step',
  templateUrl: './money-transfer-from-step.component.html',
  styleUrls: ['./money-transfer-from-step.component.scss']
})
export class MoneyTransferFromStepComponent implements OnInit, OnDestroy {
  @Input() showFromCardsTransferView: boolean;
  @Input() selectedAccountNumber: string;
  @Input() showCardsTabInStepFrom?: boolean;

  subscription$ = new Subscription();
  selectFromOptionList: TransferFromSelectionModel[] = TRANSFER_FROM_PAYEE_SELECTION;
  showAccountsCheckbox = true;
  enableNextBtn = false;
  showCardsCheckbox: boolean;
  transferFromAccountList: AccountListModel[] = [];
  transferFromCoverCardList: CoverCardData[] = [];
  showAlertMessage: boolean;
  accountCardAlertText: string;
  selectedFromAccountNumber: string;
  selectedObjType: string;
  showTransferToCards: boolean;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(
    private detectRef: ChangeDetectorRef,
    private sharedService: SharedService,
    private moneyTransferService: MoneyTransferService
  ) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.getAccountListForTransfer();
    this.getCardsListForTransfer();
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
   * @methodName selectedTransferFromOption
   * @parameter event<string>
   * @description Used to set the selected transfer from option
   * @return none
   */
  selectedTransferFromOption(event: string): void {
    this.selectedObjType = event;
    this.showAlertMessage = false;
    this.accountCardAlertText = undefined;
    if (this.selectedObjType.toLowerCase() === ACCOUNT_TYPES.ACCOUNT.toLowerCase()) {
      this.showAccountsCheckbox = true;
      this.enableNextBtn = this.selectedAccountNumber ? true : false;
      if (this.transferFromAccountList && this.transferFromAccountList.length === PAYMENT_SCREEN_TEXT.ZERO) {
        this.showAlertMessage = true;
        this.accountCardAlertText = MONEY_TRANSFER_SCREEN_TEXT.noAccountText;
      }
    } else {
      this.showAccountsCheckbox = false;
      this.showCardsCheckbox = true;
      this.enableNextBtn = false;
      this.selectedAccountNumber = undefined;
      if (this.transferFromCoverCardList && this.transferFromCoverCardList.length === PAYMENT_SCREEN_TEXT.ZERO) {
        this.showAlertMessage = true;
        this.accountCardAlertText = MONEY_TRANSFER_SCREEN_TEXT.noCardText;
      }
    }
    this.detectRef.detectChanges();
  }

  /**
   * @methodName getAccountListForTransfer
   * @description used to get account list for money transfer component
   * @parameters none
   * @return none
   */
  getAccountListForTransfer(): void {
    if (this.sharedService.accountsCardsList) {
      const accountList = this.sharedService.clone(this.sharedService.accountsCardsList.accountsList);
      accountList.map(account => {
        if (ACCOUNT_ALLOWED_FOR_PAYMENTS[account.accountType] && ACCOUNT_ALLOWED_STATUS_LIST.includes(account.status)) {
          account.accountTypeDescription = account.classDesc;
          this.transferFromAccountList.push(account);
        }
      });
      if (this.moneyTransferService.selectedBeneficiaryForTransfer) {
        this.transferFromAccountList = this.filterAcountForSelectedBeneficiary();
      }
    }
  }

  /**
   * @methodName getCardsListForTransfer
   * @description used to get cards list for money transfer component
   * @parameters none
   * @return none
   */
  getCardsListForTransfer(): void {
    if (this.sharedService.coverCardsListforTransfer) {
      this.transferFromCoverCardList = this.sharedService.clone(this.sharedService.coverCardsListforTransfer);
    }
  }

  /**
   * @methodName selectedAccount
   * @parameter selectedAccountObj<AccountListModel>
   * @description used to set the selected account object
   * @return none
   */
  selectedAccount(selectedAccountObj: AccountListModel): void {
    this.showAlertMessage = false;
    if (selectedAccountObj) {
      this.showTransferToCards = selectedAccountObj.currencyCode === PAYMENT_SCREEN_TEXT.aedCurrencyCode ? true : false;
      this.selectedFromAccountNumber = selectedAccountObj.accountNumber;
      this.moneyTransferService.selectedTransferFromCard = undefined;
      this.moneyTransferService.selectedTransferFromAccount = selectedAccountObj;
      const transferDetails = {} as MoneyTransferDetails;
      transferDetails.availableAmount = selectedAccountObj.balanceAvailable.toString();
      transferDetails.avaialableText = PAYMENT_SCREEN_TEXT.availableBalance;
      transferDetails.currencyCode = selectedAccountObj.currencyCode;
      if (transferDetails.availableAmount && Number(transferDetails.availableAmount) > PAYMENT_SCREEN_TEXT.ZERO) {
        this.moneyTransferService.setMoneyTransferDetails(transferDetails);
        this.enableNextBtn = true;
        this.showAlertMessage = false;
      } else {
        this.accountCardAlertText = PAYMENT_SCREEN_TEXT.accountInsufficientBalanceText;
        this.enableNextBtn = false;
        this.showAlertMessage = true;
      }
    }
  }

  /**
   * @methodName setToFilterList
   * @parameter none
   * @description used to set filterd card, account checkbox list
   * @return none
   */
  setToFilterList() {
    if (this.selectedObjType === ACCOUNT_TYPES.ACCOUNT.toUpperCase()) {
      const filterdToAccountList = this.transferFromAccountList.filter(account => account.accountNumber !==
        this.moneyTransferService.selectedTransferFromAccount.accountNumber);
      this.moneyTransferService.transferToAccountList.next(filterdToAccountList);
      const filterdToCardList = this.transferFromCoverCardList.filter(card => (Number(card.dueBalance) > PAYMENT_SCREEN_TEXT.ZERO));
      this.moneyTransferService.transferToCardList.next(filterdToCardList);
    }
    if (this.selectedObjType === ACCOUNT_TYPES.SELECT_CARD.toUpperCase()) {
      const filterdToAccountList = this.transferFromAccountList.filter(
        account => account.currencyCode === PAYMENT_SCREEN_TEXT.aedCurrencyCode);
      this.moneyTransferService.transferToAccountList.next(filterdToAccountList);
    }
  }

  /**
   * @methodName selectedCard
   * @parameter selectedCardObj<CoverCardData>
   * @description used to set selected card checkbox from the list
   * @return none
   */
  selectedCard(selectedCardObj: CoverCardData): void {
    this.showAlertMessage = false;
    this.showTransferToCards = false;
    if (selectedCardObj) {
      this.moneyTransferService.selectedTransferFromAccount = undefined;
      this.moneyTransferService.selectedTransferFromCard = selectedCardObj;
      const transferDetails = {} as MoneyTransferDetails;
      transferDetails.availableAmount = selectedCardObj.creditAvailable.toString();
      transferDetails.avaialableText = PAYMENT_SCREEN_TEXT.availableLimit;
      transferDetails.currencyCode = selectedCardObj.currencyCode;
      if (transferDetails.availableAmount && Number(transferDetails.availableAmount) > PAYMENT_SCREEN_TEXT.ZERO) {
        this.moneyTransferService.setMoneyTransferDetails(transferDetails);
        this.enableNextBtn = true;
        this.showAlertMessage = false;
      } else {
        this.accountCardAlertText = PAYMENT_SCREEN_TEXT.cardInsufficientBalanceText;
        this.enableNextBtn = false;
        this.showAlertMessage = true;
      }
    }
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
   * @methodName moveToNextStep
   * @parameter none
   * @description used to set the loading information of transfer details component
   * @return none
   */
  moveToNextStep(): void {
    this.setToFilterList();
    this.moneyTransferService.showTransferToCardCheckbox.next(this.showTransferToCards);
    this.moneyTransferService.updateBeneficiaryListInToStep(true);
    if (this.moneyTransferService.selectedBeneficiaryForTransfer) {
      this.moneyTransferService.setInternationalMoneyTransferDetailsSubject(true);
    }
  }

  /**
   * @methodName filterAcountForSelectedBeneficiary
   * @parameter none
   * @description used to set acount filter for if beneficiary selected
   * @return AccountListModel
   */
  filterAcountForSelectedBeneficiary(): AccountListModel[] {
    let UPDATED_ACCOUNT_LIST: AccountListModel[] = [];
    const selectedBeneficiary = this.moneyTransferService.selectedBeneficiaryForTransfer;
    const BENEFICIARY_CURRENCY = (selectedBeneficiary) ? selectedBeneficiary.beneAccCurr : undefined;
    if (this.transferFromAccountList && BENEFICIARY_CURRENCY) {
      if (selectedBeneficiary.beneType === INSIDE_UAE_TRANSFER_TEXT.INTRABANK &&
        selectedBeneficiary.beneExtAccType === INSIDE_UAE_TRANSFER_TEXT.creditCardText) {
        UPDATED_ACCOUNT_LIST = this.transferFromAccountList.filter(account => LOCAL_CURRENCY.includes(account.currencyCode));
      }
    }
    return (UPDATED_ACCOUNT_LIST.length > 0) ? UPDATED_ACCOUNT_LIST : this.transferFromAccountList;
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
