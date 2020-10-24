import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SharedService } from 'src/app/common/services/shared.service';
import { MoneyTransferService } from 'src/app/common/services/money-transfer/money-transfer.service';
import { FilterTextPipe } from 'src/app/common/pipes/filter-text/filter-text.pipe';
import {
  PAYMENT_SCREEN_TEXT, MONEY_TRANSFER_TO_SELECTION,
  TRANSFER_TYPES, LOCAL_CURRENCY, ARABIC_LANG_TEXT
} from 'src/app/common/global-constants';
import { INSIDE_UAE_TRANSFER_TEXT, FORGIN_CURRENCY } from 'src/app/common/global-constants';
import { MONEY_TRANSFER_TO_TYPES, MONEY_TRANSFER_SCREEN_TEXT, TRANSFER_PAYMENT_CONST } from 'src/app/common/global-constants';
import { TransferFromSelectionModel } from 'src/app/common/models/global.model';
import { CoverCardData } from 'src/app/common/models/cards-module.model';
import { AccountListModel } from 'src/app/common/models/accounts-module.model';
import { BeneficiaryListResponse } from 'src/app/common/models/beneficiary.model';

@Component({
  selector: 'app-money-transfer-to-step',
  templateUrl: './money-transfer-to-step.component.html',
  styleUrls: ['./money-transfer-to-step.component.scss']
})
export class MoneyTransferToStepComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  @Input() selectedAccountNumber: string;
  selectTransferToOptionList: TransferFromSelectionModel[] = MONEY_TRANSFER_TO_SELECTION;
  showAccountsCheckbox = true;
  showCardsCheckbox = false;
  showBeneficiaryCheckbox = false;
  enableNextBtn = false;
  transferToAccountList: AccountListModel[] = [];
  transferToCoverCardList: CoverCardData[] = [];
  showAlertMessage = false;
  accountCardAlertText: string;
  allBeneficiaryList = [] as BeneficiaryListResponse[];
  beneficiaryListForFilter = [] as BeneficiaryListResponse[];
  searchText: string;
  moneyTransferScreenText = MONEY_TRANSFER_SCREEN_TEXT;
  hideTransferToAdibCard: boolean;
  showOpenAccountButton = false;
  showAddBeneficiaryButton = false;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(
    private detectRef: ChangeDetectorRef,
    private sharedService: SharedService,
    private moneyTransferService: MoneyTransferService,
    private filterTextPipe: FilterTextPipe
  ) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.getAccountListForTransfer();
    this.getCardsListForTransfer();
    this.updateBenefiaciryList();
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
   * @methodName selectedTransferToOption
   * @parameter transferTo<string>
   * @description Used to set the selected transfer to option
   * @return none
   */
  selectedTransferToOption(transferTo: string): void {
    this.showAccountsCheckbox = false;
    this.showCardsCheckbox = false;
    this.showBeneficiaryCheckbox = false;
    this.showAlertMessage = false;
    this.accountCardAlertText = undefined;
    this.showOpenAccountButton = false;
    this.showAddBeneficiaryButton = false;
    const selectedTransferTo = transferTo.toUpperCase();
    switch (selectedTransferTo) {
      case MONEY_TRANSFER_TO_TYPES.ACCOUNT:
        this.showAccountsCheckbox = true;
        this.enableNextBtn = this.selectedAccountNumber ? true : false;
        if (this.transferToAccountList && this.transferToAccountList.length === PAYMENT_SCREEN_TEXT.ZERO) {
          this.showAlertMessage = true;
          this.showOpenAccountButton = true;
          this.accountCardAlertText = MONEY_TRANSFER_SCREEN_TEXT.noAccountText;
        }
        break;
      case MONEY_TRANSFER_TO_TYPES.CARD:
        this.showCardsCheckbox = true;
        this.selectedAccountNumber = undefined;
        this.enableNextBtn = false;
        if (this.transferToCoverCardList && this.transferToCoverCardList.length === PAYMENT_SCREEN_TEXT.ZERO) {
          this.showAlertMessage = true;
          this.accountCardAlertText = MONEY_TRANSFER_SCREEN_TEXT.noCardText;
        }
        break;
      case MONEY_TRANSFER_TO_TYPES.BEFICIARY:
        this.showBeneficiaryCheckbox = true;
        this.showCardsCheckbox = false;
        this.showAccountsCheckbox = false;
        this.enableNextBtn = false;
        if (this.allBeneficiaryList && this.allBeneficiaryList.length === PAYMENT_SCREEN_TEXT.ZERO) {
          this.showAlertMessage = true;
          this.showAddBeneficiaryButton = true;
          this.accountCardAlertText = MONEY_TRANSFER_SCREEN_TEXT.noBeneficiaryText;
        }
        break;
    }
    this.detectRef.detectChanges();
  }

  /**
   * @methodName updateBenefiaciryList
   * @description used to update the beneficiry list based on option selection in transfer from step
   * @parameters none
   * @return none
   */
  updateBenefiaciryList() {
    this.subscription$.add(this.moneyTransferService.getBeneficiaryListInfo().subscribe(populateBeneList => {
      if (populateBeneList) {
        this.populateBeneficiaryList();
        // resetting subject value
        this.moneyTransferService.updateBeneficiaryListInToStep(undefined);
      }
    }));
  }

  /**
   * @methodName getAccountListForTransfer
   * @description used to get account list for money transfer component
   * @parameters none
   * @return none
   */
  getAccountListForTransfer(): void {
    this.subscription$.add(this.moneyTransferService.transferToAccountList.subscribe(accounts => {
      if (accounts && accounts.length > 0) {
        this.showAlertMessage = false;
        this.showOpenAccountButton = false;
        this.transferToAccountList = accounts;
        this.moneyTransferService.transferToAccountList.next(undefined);
      }
    }));
  }

  /**
   * @methodName getCardsListForTransfer
   * @description used to get cards list for money transfer component
   * @parameters none
   * @return none
   */
  getCardsListForTransfer(): void {
    this.subscription$.add(this.moneyTransferService.showTransferToCardCheckbox.subscribe((value: boolean) => {
      if (value) {
        this.hideTransferToAdibCard = false;
        this.subscription$.add(this.moneyTransferService.transferToCardList.subscribe(cards => {
          if (cards && cards.length > 0) {
            this.transferToCoverCardList = cards;
            this.moneyTransferService.transferToCardList.next(undefined);
          }
        }));
      } else {
        this.hideTransferToAdibCard = true;
      }

    }));
    this.moneyTransferService.showTransferToCardCheckbox.next(undefined);
  }

  /**
   * @methodName selectedAccount
   * @parameter selectedAccountObj<AccountListModel>
   * @description used to set the selected account object
   * @return none
   */
  selectedAccount(selectedAccountObj: AccountListModel): void {
    if (selectedAccountObj) {
      this.enableNextBtn = true;
      this.showAlertMessage = false;
      this.moneyTransferService.selectedBeneficiaryForTransfer = undefined;
      this.moneyTransferService.selectedTransferToCard = undefined;
      this.moneyTransferService.selectedTransferToAccount = selectedAccountObj;
      this.moneyTransferService.selectedTransferType = TRANSFER_TYPES.transferToAdibAccount;
    }
  }

  /**
   * @methodName selectedCard
   * @parameter selectedCardObj<CoverCardData>
   * @description used to set selected card checkbox from the list
   * @return none
   */
  selectedCard(selectedCardObj: CoverCardData): void {
    if (selectedCardObj) {
      this.enableNextBtn = true;
      this.showAlertMessage = false;
      this.moneyTransferService.selectedBeneficiaryForTransfer = undefined;
      this.moneyTransferService.selectedTransferToAccount = undefined;
      this.moneyTransferService.selectedTransferToCard = selectedCardObj;
      this.moneyTransferService.selectedTransferType = TRANSFER_TYPES.transferToAdibCard;
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
   * @methodName populateBeneficiaryList
   * @parameter none
   * @description used to populate the beneficiary
   * @return none
   */
  populateBeneficiaryList(): void {
    let localBeneficiaryList = {} as BeneficiaryListResponse[];
    this.subscription$.add(this.sharedService.getAllBeneficiaryList().subscribe((response) => {
      if (response) {
        localBeneficiaryList = this.sharedService.clone(response);
        this.showAlertMessage = false;
        this.allBeneficiaryList = this.filterBeneficiaryList(response);
        this.beneficiaryListForFilter = [...this.allBeneficiaryList];
      }
    }));
  }

  /**
   * @methodName onBeneficiarySearch
   * @description used to filter the beneficiary from the beneficiary list
   * @parameters searchText<string>
   * @return none
   */
  onBeneficiarySearch(searchText: string): void {
    this.allBeneficiaryList = this.filterTextPipe.transform(this.beneficiaryListForFilter, searchText, TRANSFER_PAYMENT_CONST.nickName);
  }

  /**
   * @methodName selectedBeneficiary
   * @parameter selectedBeneficiary<BeneficiaryListResponse>
   * @description used to get the selected beneficiary
   * @return none
   */
  selectedBeneficiary(selectedBeneficiary: BeneficiaryListResponse): void {
    this.moneyTransferService.selectedBeneficiaryForTransfer = selectedBeneficiary;
    this.moneyTransferService.selectedTransferType = TRANSFER_TYPES.transferToBeneficiary;
    this.enableNextBtn = true;
    this.showAlertMessage = false;
    this.moneyTransferService.selectedTransferToCard = undefined;
    this.moneyTransferService.selectedTransferToAccount = undefined;
  }

  /**
   * @methodName moveToNextStep
   * @parameter none
   * @description used to set transfer details based on selected transfer to option
   * @return none
   */
  moveToNextStep(): void {
    if (this.moneyTransferService.selectedTransferType === TRANSFER_TYPES.transferToAdibCard &&
      this.moneyTransferService.selectedTransferToCard) {
      this.moneyTransferService.showTransferToDetailsAndSummary.next(TRANSFER_TYPES.transferToAdibCard);
    } else if (this.moneyTransferService.selectedTransferToAccount) {
      this.moneyTransferService.showTransferToDetailsAndSummary.next(TRANSFER_TYPES.transferToAdibAccount);
    } else {
      this.moneyTransferService.showTransferToDetailsAndSummary.next(undefined);
    }
    // international transfer changes handling
    this.moneyTransferService.setInternationalMoneyTransferDetailsSubject(true);
  }

  /**
   * @methodName filterBeneficiaryList
   * @parameter beneficiaryList<BeneficiaryListResponse[]>
   * @description used to filter benefeciaries when account/card option selected in from step
   * @return BeneficiaryListResponse[]
   */
  filterBeneficiaryList(beneficiaryList: BeneficiaryListResponse[]): BeneficiaryListResponse[] {
    // Filter beneficiary if transfer from card
    if (beneficiaryList && this.moneyTransferService.selectedTransferFromCard) {
      const filteredBeneficiaryList: BeneficiaryListResponse[] = beneficiaryList.filter((beneficiary) =>
        beneficiary.beneType === INSIDE_UAE_TRANSFER_TEXT.INTRABANK &&
        beneficiary.beneAccCurr === INSIDE_UAE_TRANSFER_TEXT.uaeCurrencyCode
        && beneficiary.beneExtAccType === INSIDE_UAE_TRANSFER_TEXT.accountBeneficiary
      );
      return filteredBeneficiaryList;
    }
    // Filter beneficiary if transfer from Account with local currency(LCY)
    if (beneficiaryList && this.moneyTransferService.selectedTransferFromAccount
      && LOCAL_CURRENCY.includes(this.moneyTransferService.selectedTransferFromAccount.currencyCode)) {
      const filteredBeneficiaryList: BeneficiaryListResponse[] = this.filterLocalCurrencyBeneficiary(beneficiaryList);
      return filteredBeneficiaryList;
    }
    // Filter beneficiary if transfer from Account with Foregin currency(FCY)
    if (beneficiaryList && this.moneyTransferService.selectedTransferFromAccount
      && FORGIN_CURRENCY.includes(this.moneyTransferService.selectedTransferFromAccount.currencyCode)) {
      const filteredBeneficiaryList: BeneficiaryListResponse[] = this.filterForeginCurrencyBeneficiary(beneficiaryList);
      return filteredBeneficiaryList;
    }
  }

  /**
   * @methodName filterLocalCurrencyBeneficiary
   * @parameter beneficiaryList<BeneficiaryListResponse[]>
   * @description used to filter benefeciaries when account with LCY option selected in from step
   * @return BeneficiaryListResponse[]
   */
  filterLocalCurrencyBeneficiary(beneficiaryList: BeneficiaryListResponse[]): BeneficiaryListResponse[] {
    return beneficiaryList.filter((beneficiary) => {
      if (beneficiary.beneType === INSIDE_UAE_TRANSFER_TEXT.INTRABANK) {
        if ((beneficiary.beneExtAccType === INSIDE_UAE_TRANSFER_TEXT.creditCardText
          && LOCAL_CURRENCY.includes(beneficiary.beneAccCurr))
          || beneficiary.beneExtAccType === INSIDE_UAE_TRANSFER_TEXT.accountBeneficiary) {
          return true;
        }
      }
      return true;
    });
  }

  /**
   * @methodName filterForeginCurrencyBeneficiary
   * @parameter beneficiaryList<BeneficiaryListResponse[]>
   * @description used to filter benefeciaries when account with FCY option selected in from step
   * @return BeneficiaryListResponse[]
   */
  filterForeginCurrencyBeneficiary(beneficiaryList: BeneficiaryListResponse[]): BeneficiaryListResponse[] {
    return beneficiaryList.filter((beneficiary) => {
      if (beneficiary.beneType === INSIDE_UAE_TRANSFER_TEXT.INTRABANK) {
        if (beneficiary.beneExtAccType === INSIDE_UAE_TRANSFER_TEXT.creditCardText) {
          return false;
        }
      }
      return true;
    });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
