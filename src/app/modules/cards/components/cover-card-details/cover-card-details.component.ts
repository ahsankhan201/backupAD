import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { saveAs } from 'file-saver';

import { CardsService } from '../../services/cards.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { TransactionGridHeaderModel, TransactionHistoryInterface } from 'src/app/common/models/global.model';
import { QuickLinks } from 'src/app/common/models/quickLinks.model';
import { CoverCardData, CoverCardStatementPayload } from 'src/app/common/models/cards-module.model';
import {
  CARDS_MASTER_DATA, PRIMARY_COVER_CARD_QUICK_LINKS, SUPP_COVER_CARD_QUICK_LINKS,
  COVER_CARD_TRANSACTION_GRID, CARD_TRANSACTIONS_HEADERS,
  CARDS_TRANSLATION_TEXT,
  CHANGE_LIMIT_TEXT
} from '../../cards-module.constants';
import {
  DOMAINS, ACCOUNT_DETAILS_CONST, PAYMENT_SCREEN_TEXT, QUICKLINK_E_STATEMENT,
  HTTP_STATUS_CODE, E_STATEMENT_DIALOG_DATA, ARABIC_LANG_TEXT
} from 'src/app/common/global-constants';
import { TRANSACTION_HISTORY_API_URL, PENDING_TRANSACTION_API_URL, DOWNLOAD_COVER_CARD_STATEMENT } from 'src/app/common/api-endpoints';
import { ExpiryDateFormatPipe } from 'src/app/common/pipes/expiry-date-format/expiry-date-format.pipe';
import { MenuOption } from 'src/app/common/models/menu-option.model';
import { DialogService } from 'src/app/common/services/dialog.service';

@Component({
  selector: 'app-cover-card-details',
  templateUrl: './cover-card-details.component.html',
  styleUrls: ['./cover-card-details.component.scss'],
  providers: [ExpiryDateFormatPipe]
})
export class CoverCardDetailsComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  @Output() backButtonClicked = new EventEmitter<boolean>(false);
  @Output() selectedQuickLink = new EventEmitter();
  @Output() showPaymentView = new EventEmitter();
  coverCardDetails: CoverCardData;
  readonly CARDS_MASTER_DATA = CARDS_MASTER_DATA;
  quickLinksData: QuickLinks[];
  transactionGridComponentName = COVER_CARD_TRANSACTION_GRID;
  transactionHeaderList = {} as TransactionGridHeaderModel;
  transactionHistoryAPIURL: string;
  pendingTransactionsAPIURL: string;
  copyData: string;
  showPaymentBtn: boolean;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private cardsService: CardsService,
    private sharedService: SharedService,
    private expiryDateFormat: ExpiryDateFormatPipe,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.coverCardDetails = this.cardsService.getSelectedCoverCard();
    this.setCopyData();
    this.setQuickLinksData(this.coverCardDetails.primaryCardFlag);
    this.loadTransactionHistoryData();
    this.showMakePaymentBtn();
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
   * @methodName quickItemClickHandler
   * @description get the clicked object with action type
   * @parameters item
   * @return void
   */
  quickItemClickHandler(item: MenuOption): void {
    this.cardsService.handleCardStatus(item);
    this.subscription$.add(this.cardsService.updateCardList.subscribe(status => {
      if (status) {
        this.onBackButtonClicked();
      }
    }));
    if (item.actionType === QUICKLINK_E_STATEMENT) {
      this.dialogService.openEstatementDialog().subscribe((dialogResponse: boolean) => {
        if (dialogResponse && this.sharedService.selectedStatementMonth !== undefined &&
          this.sharedService.selectedStatementYear !== undefined) {
          this.downloadCardStatement();
        }
      });
    } else if (item.actionType === CHANGE_LIMIT_TEXT) {
      this.selectedQuickLink.emit(item);
    }
  }

  /**
   * @methodName downloadCardStatement
   * @description download cover card e-statement
   * @parameters none
   * @return none
   */
  downloadCardStatement(): void {
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + DOWNLOAD_COVER_CARD_STATEMENT;
    const downloadCardStatement = {} as CoverCardStatementPayload;
    downloadCardStatement.cardNumber = this.coverCardDetails.cardNumber;
    downloadCardStatement.month = this.sharedService.selectedStatementMonth.toString();
    downloadCardStatement.year = this.sharedService.selectedStatementYear;
    this.subscription$.add(this.cardsService.generateCardStatement(URL, downloadCardStatement).subscribe(response => {
      if (response && response['status'] === HTTP_STATUS_CODE.OK) {
        const fileName = this.sharedService.getFileName(response.headers.get(E_STATEMENT_DIALOG_DATA.CONTENT_DISPOSITION));
        saveAs(response.body, fileName);
      }
    }));
  }

  /**
   * @methodName setQuickLinksData
   * @description used to set quick links data based on card flag
   * @parameters primaryCardFlag
   * @return none
   */
  setQuickLinksData(primaryCardFlag: string): void {
    this.quickLinksData = primaryCardFlag === CARDS_MASTER_DATA.PRIMARY_CARD_FLAG ?
      PRIMARY_COVER_CARD_QUICK_LINKS : SUPP_COVER_CARD_QUICK_LINKS;
  }

  /**
   * @methodName loadTransactionHistoryData
   * @description used to load transaction history data
   * @parameters none
   * @return none
   */
  loadTransactionHistoryData(): void {
    this.transactionHeaderList = CARD_TRANSACTIONS_HEADERS;
    this.transactionHistoryAPIURL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      TRANSACTION_HISTORY_API_URL;
    this.pendingTransactionsAPIURL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      PENDING_TRANSACTION_API_URL;
    this.sharedService.transactionHistoryPayLoad = {} as TransactionHistoryInterface;
    this.sharedService.transactionHistoryPayLoad.card_type = COVER_CARD_TRANSACTION_GRID;
    this.sharedService.transactionHistoryPayLoad.is_more_records = false;
    this.sharedService.transactionHistoryPayLoad.aliasId = this.coverCardDetails.aliasId;
    this.sharedService.pendingTransactionsPayload.aliasId = this.coverCardDetails.aliasId;

  }

  /**
   * @methodName setCopyData
   * @description use to save it in shared service for transaction history copy
   * @parameters none
   * @return void
   */
  setCopyData(): void {
    if (this.coverCardDetails) {
      this.copyData = `
    ${ACCOUNT_DETAILS_CONST.accountDetail_bankName}: ${ACCOUNT_DETAILS_CONST.adib}
    ${CARDS_TRANSLATION_TEXT.cards_cardNumberText}: ${this.coverCardDetails.cardNumber}
    ${CARDS_TRANSLATION_TEXT.cards_expiryDateText}: ${this.expiryDateFormat.transform(this.coverCardDetails.expiryDate)}
    ${CARDS_TRANSLATION_TEXT.cards_currencyText}: ${this.coverCardDetails.currencyCode}`;
      this.sharedService.cardCopyData = this.copyData;
    }
  }

  /**
   * @methodName showMakePaymentBtn
   * @description use to show or hide make payment btn based on outstanding amt
   * @parameters none
   * @return void
   */
  showMakePaymentBtn(): void {
    if (this.coverCardDetails.dueBalance) {
      const outstandingDueAmt = Number(this.coverCardDetails.dueBalance);
      this.showPaymentBtn = outstandingDueAmt > PAYMENT_SCREEN_TEXT.ZERO ? true : false;
    }
  }

  /**
   * @methodName makePaymentToCard
   * @description use to set the cover data for which payment is to be done
   * @parameters coverCardObj<CoverCardData>
   * @return void
   */
  makePaymentToCard(coverCardObj: CoverCardData): void {
    this.showPaymentView.emit(coverCardObj);
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
   * @methodName handleselectedQuickLink
   * @description used to handle selected quick links
   * @parameters quickLink<QuickLinks>
   * @return none
   */
  handleselectedQuickLink(quickLink: QuickLinks): void {
    if (quickLink) { this.selectedQuickLink.emit(quickLink); }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
