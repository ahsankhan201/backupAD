import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { SharedService } from 'src/app/common/services/shared.service';
import {
  NAV_CONTROLS, OPEN_ACCOUNT_COMPONENT, INVESMENT_DEPOSIT_ACCOUNT_COMPONENT, OPEN_SAVINGS_ACCOUNT_TEXT, TIME_DEPOSIT_ACCOUNT_TEXT,
  OPEN_ACCOUNT_TITILE, OPEN_ACCOUNT_TYPES, OPEN_GHINA_ACCOUNT_TEXT, INVESTMENT_SUMMARY_COMPONENT, ARABIC_LANG_TEXT
} from 'src/app/common/global-constants';
import { OpenAccountService } from '../../services/open-account/open-account.service';
import { OpenAccountCard } from '../../models/open-account.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-open-account',
  templateUrl: './open-account.component.html',
  styleUrls: ['./open-account.component.scss']
})
export class OpenAccountComponent implements OnInit, OnDestroy {
  openAccountCardsList = [];
  showComponent = OPEN_ACCOUNT_COMPONENT;
  openAccountTitle = OPEN_ACCOUNT_TITILE;
  summaryComponentData = [];
  selectedLang: string;
  subscription$ = new Subscription();
  arabicLanguageText = ARABIC_LANG_TEXT;
  @Output() selectedCardOption = new EventEmitter();
  @Output() backButtonClick = new EventEmitter(false);
  @Input() selectedAccountType: string;

  constructor(private sharedService: SharedService, private openAccountService: OpenAccountService) {
    this.sharedService.setHorizontalLineClass(NAV_CONTROLS.OPEN_ACCOUNT_DIVIDER_CLASS);
  }

  ngOnInit() {
    this.getLanguage();
    if (this.selectedAccountType) {
      this.handleAccountSelection(this.selectedAccountType);
    }
    this.openAccountCardsList = OPEN_ACCOUNT_TYPES;
  }

  /**
   * @methodName handleSelectedCardOption
   * @parameter selectedCard
   * @description Used to fetch the current step and set other steps interacted accordingly
   * @return none
   */
  handleSelectedCardOption(selectedCard: OpenAccountCard): void {
    this.openAccountService.openAccountSelectedCard = selectedCard.id;
    this.selectedCardOption.emit(selectedCard.id);
    this.handleAccountSelection(selectedCard.id);
  }

  /**
   * @methodName handleBackButtonClick
   * @parameter status<boolean>
   * @description Used to handle back button click
   * @return none
   */
  handleBackButtonClick(status: boolean): void {
    this.showComponent = (status) ? OPEN_ACCOUNT_COMPONENT : undefined;
  }

  /**
   * @methodName handleAccountSelection
   * @param accountTitle<string>
   * @description Used to handle account selection for showing compoenent Saving | Gina | Time Deposit
   * @return none
   */
  handleAccountSelection(accountTitle: string): void {
    this.openAccountTitle = this.openAccountService.openAccountSelectedCard;
    switch (accountTitle) {
      case TIME_DEPOSIT_ACCOUNT_TEXT.timeDeposit:
      case TIME_DEPOSIT_ACCOUNT_TEXT.investmentDepositAccount:
        this.showComponent = INVESMENT_DEPOSIT_ACCOUNT_COMPONENT;
        this.openAccountTitle = TIME_DEPOSIT_ACCOUNT_TEXT.TIME_DEPOSIT_TITLE;
        break;
      case OPEN_SAVINGS_ACCOUNT_TEXT.SAVINGS_ACCOUNT:
        this.showComponent = OPEN_SAVINGS_ACCOUNT_TEXT.SAVINGS_ACCOUNT_COMPONENT;
        this.openAccountTitle = OPEN_SAVINGS_ACCOUNT_TEXT.SAVINGS_ACCOUNT_TITLE;
        break;
      case OPEN_GHINA_ACCOUNT_TEXT.GHINA_ACCOUNT:
        this.showComponent = OPEN_GHINA_ACCOUNT_TEXT.GHINA_ACCOUNT_COMPONENT;
        this.openAccountTitle = OPEN_GHINA_ACCOUNT_TEXT.SAVINGS_ACCOUNT_TITLE;
        break;
    }
  }

  /**
   * @methodName showAccountsTab
   * @parameter none
   * @description Used to show accounts tab
   * @return none
   */
  showAccountsTab(): void {
    this.backButtonClick.emit(true);
  }

  /**
   * @methodName handleShowSummary
   * @parameter none
   * @description Used to show summary view
   * @return none
   */
  handleShowSummary(summaryDetails): void {
    if (summaryDetails) {
      this.showComponent = INVESTMENT_SUMMARY_COMPONENT;
      this.summaryComponentData = summaryDetails;
    }
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

  ngOnDestroy() {
    this.sharedService.setHorizontalLineClass(undefined);
  }
}

