import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { CardsService } from '../../services/cards.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { TRANSACTION_HISTORY_API_URL } from 'src/app/common/api-endpoints';
import { DebitCardData } from 'src/app/common/models/cards-module.model';
import { QuickLinks } from 'src/app/common/models/quickLinks.model';
import { TransactionGridHeaderModel, TransactionHistoryInterface } from 'src/app/common/models/global.model';
import {
  CARDS_MASTER_DATA, DEBIT_CARD_QUICKLINKS_DATA,
  DEBIT_CARD_TRANSACTION_GRID,
  CARD_TRANSACTIONS_HEADERS,
  CARDS_TRANSLATION_TEXT,
  ACTION_ITEMS
} from '../../cards-module.constants';
import { DOMAINS, ACCOUNT_DETAILS_CONST, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { ExpiryDateFormatPipe } from 'src/app/common/pipes/expiry-date-format/expiry-date-format.pipe';
import { MenuOption } from 'src/app/common/models/menu-option.model';

@Component({
  selector: 'app-debit-card-details',
  templateUrl: './debit-card-details.component.html',
  styleUrls: ['./debit-card-details.component.scss'],
  providers: [ExpiryDateFormatPipe]
})
export class DebitCardDetailsComponent implements OnInit {
  subscription$ = new Subscription();
  readonly CARDS_MASTER_DATA = CARDS_MASTER_DATA;
  quickLinksData: QuickLinks[] = DEBIT_CARD_QUICKLINKS_DATA;
  @Output() backButtonClicked = new EventEmitter<boolean>(false);
  debitCardDetails: DebitCardData;
  transactionHeaderList = {} as TransactionGridHeaderModel;
  transactionHistoryAPIURL: string;
  showDebitCardLinkAccountComp = false;
  transactionGridComponentName = DEBIT_CARD_TRANSACTION_GRID;
  selectedLanguage: string;
  copyData: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private cardsService: CardsService,
    private sharedService: SharedService,
    private expiryDateFormat: ExpiryDateFormatPipe) { }

  ngOnInit() {
    this.setComponentInitialData();
  }

  /**
   * @methodName setComponentInitialData
   * @description used to set component initial data
   * @parameters none
   * @return none
   */
  setComponentInitialData(): void {
    this.getSelectedLanguage();
    this.debitCardDetails = this.cardsService.getSelectedDebitCard();
    this.setCopyData();
    this.loadTransactionHistoryData();
  }

  /**
   * @methodName onBackButtonClicked
   * @description used to emit backButtonClicked
   * @parameters none
   * @return none
   */
  onBackButtonClicked(): void {
    this.backButtonClicked.emit(true);
  }
  /**
   * @methodName showDebitCardDetals
   * @description used to change the view on the card details page
   * @parameters none
   * @return none
   */
  showDebitCardDetals(): void {
    this.showDebitCardLinkAccountComp = false;
    this.setComponentInitialData();
  }

  /**
   * @methodName quickItemClickHandler
   * @description get the clicked object with action type
   * @parameters item
   * @return void
   */
  quickItemClickHandler(item: MenuOption): void {
    if (item && item.actionType === ACTION_ITEMS.linkedAccount) {
      this.showDebitCardLinkAccountComp = true;
    } else {
      this.cardsService.handleCardStatus(item);
      this.subscription$.add(this.cardsService.updateCardList.subscribe(status => {
        if (status) {
          this.onBackButtonClicked();
        }
      }));
    }
  }

  /**
   * @methodName setCopyData
   * @description use to save it in shared service for transaction history copy
   * @parameters none
   * @return void
   */
  setCopyData(): void {
    if (this.debitCardDetails) {
      this.copyData = `
    ${ACCOUNT_DETAILS_CONST.accountDetail_bankName}: ${ACCOUNT_DETAILS_CONST.adib}
    ${CARDS_TRANSLATION_TEXT.cards_cardNumberText}: ${this.debitCardDetails.cardNumber}
    ${CARDS_TRANSLATION_TEXT.cards_expiryDateText}: ${this.expiryDateFormat.transform(this.debitCardDetails.cardExpiryDate)}
    ${CARDS_TRANSLATION_TEXT.cards_currencyText}: ${this.debitCardDetails.currencyCode}`;
      this.sharedService.cardCopyData = this.copyData;
    }
  }


  /**
   * @methodName loadTransactionHistoryData
   * @description used to load transaction history data
   * @parameters none
   * @return none
   */
  loadTransactionHistoryData(): void {
    this.sharedService.transactionHistoryPayLoad = {} as TransactionHistoryInterface;
    this.transactionHeaderList = CARD_TRANSACTIONS_HEADERS;
    this.transactionHistoryAPIURL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      TRANSACTION_HISTORY_API_URL;
    this.sharedService.transactionHistoryPayLoad.card_type = DEBIT_CARD_TRANSACTION_GRID;
    this.sharedService.transactionHistoryPayLoad.is_more_records = false;
    this.sharedService.transactionHistoryPayLoad.aliasId = this.debitCardDetails.aliasId;
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
}
