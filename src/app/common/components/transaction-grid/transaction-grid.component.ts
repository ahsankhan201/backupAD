import { Component, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { SharedService } from '../../services/shared.service';
import { TransactionGridService } from '../../services/transaction-grid/transaction-grid.service';

import { TransactionGridModel, TransactionGridHeaderModel, PendingTransactionModel, TransactionGridRow } from '../../models/global.model';
import { TRANSACTION_TABLE_MENU_OPTIONS, TRANSACTION_GRID_TEXT, MENU_ACTION, ARABIC_LANG_TEXT } from '../../global-constants';
import { TRANSACTION_GRID_TRANSLATION_TEXT } from '../../global.language.translation';
import { MenuOption, MenuOptionItem } from '../../models/menu-option.model';
import { NumberFormatPipe } from '../../pipes/number-format/number-format.pipe';
import { DecimalValuePipe } from '../../pipes/decimal-value/decimal-value.pipe';

@Component({
  selector: 'app-transaction-grid',
  templateUrl: './transaction-grid.component.html',
  styleUrls: ['./transaction-grid.component.scss'],
  providers: [DatePipe, NumberFormatPipe, DecimalValuePipe]
})
export class TransactionGridComponent implements OnChanges, OnDestroy {
  subscription$ = new Subscription();
  @Input() transactionHeaderList: TransactionGridHeaderModel;
  @Input() transactionHistoryAPIURL: string;
  @Input() transactionGridComponentName: string;
  @Input() pendingTransactionsAPIURL?: string;

  modifiedTransactionHistoryList: TransactionGridModel[] = [];
  listOfFilteredTransactions = {} as PendingTransactionModel;
  isLoadMoreRecords: boolean;
  searchText: string;
  transactionsAPIURL: string;
  showPendingTransactions: boolean;
  isShowingFilteredTransactions = false;
  loadSearchedTransactions = false;
  paginationCount = TRANSACTION_GRID_TEXT.INITIAL_PAGINATION_COUNT;
  transactionTranslationText = TRANSACTION_GRID_TRANSLATION_TEXT;
  readonly menuOptions: MenuOptionItem[] = TRANSACTION_TABLE_MENU_OPTIONS;
  isTransactionsLoaded: boolean;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private transactionGridService: TransactionGridService,
    private sharedService: SharedService,
    private datePipe: DatePipe,
    private numberFormat: NumberFormatPipe,
    private decimalValue: DecimalValuePipe) { }

  ngOnChanges(changes: SimpleChanges) {
    this.handleOnChanges(changes);
  }
  /**
   * @methodName handleOnChanges
   * @description used to assign the api url and call getTansactionHistory to fetch data
   * @parameters changes<component data>
   * @return none
   */
  handleOnChanges(changes: SimpleChanges): void {
    if (changes && changes.transactionHistoryAPIURL && changes.transactionHistoryAPIURL.currentValue) {
      this.transactionsAPIURL = changes.transactionHistoryAPIURL.currentValue;
      this.getTansactionHistory();
    }
    this.getSelectedLanguage();
  }
  /**
   * @methodName getTansactionHistory
   * @description used to handle the pending tansaction and normal transction scenario's
   * @parameters isSearchCall<boolean>
   * @return none
   */
  getTansactionHistory(isSearchCall?: boolean): void {
    this.sharedService.transactionHistoryPayLoad.text_to_search = this.searchText;
    this.loadSearchedTransactions = false;
    if (isSearchCall) {
      // clear the grid data when the user search for transaction
      this.loadSearchedTransactions = true;
      this.isLoadMoreRecords = false;
      this.sharedService.transactionHistoryPayLoad.is_more_records = false;
      this.modifiedTransactionHistoryList = [];
      this.paginationCount = TRANSACTION_GRID_TEXT.INITIAL_PAGINATION_COUNT;
      // It will replace the grid with pending transactions filter data
      if (this.showPendingTransactions) {
        this.listOfFilteredTransactions = this.sharedService.clone(this.sharedService.transactionHistoryResponseObj);
        this.listOfFilteredTransactions.transactionList = this.transactionGridService.filterPendingTransactionHistory(
          this.listOfFilteredTransactions, this.searchText);
        this.updateTransactionHistoryList(this.getPaginationatedTransactionList(this.listOfFilteredTransactions,
          this.paginationCount));
        this.isShowingFilteredTransactions = true;
        return;
      }
    }
    this.fetchTransactionData();
  }
  /**
   * @methodName fetchTransactionData
   * @description used to fecth the transaction history information from server and update the tansaction grid
   * @parameters none
   * @return none
   */
  fetchTransactionData(): void {
    this.isTransactionsLoaded = false;
    const transactionsPayload = this.showPendingTransactions ?
      this.sharedService.pendingTransactionsPayload : this.sharedService.transactionHistoryPayLoad;
    this.subscription$.add(this.transactionGridService.getTransactionHistory(this.transactionsAPIURL,
      transactionsPayload).subscribe(response => {
        if (response) {
          response = this.sharedService.checkResponse(response);
          if (this.transactionGridComponentName === TRANSACTION_GRID_TEXT.ACCOUNT_TEXT) {
            this.sharedService.setCouponData(response.coupons);
          }
          this.sharedService.transactionHistoryResponseObj = this.sharedService.clone(response);
          let modifiedTransactionsList = this.transactionGridService.generateTransactionGridData(
            this.transactionGridService.getTransactionHistoryResponseObject(response, this.transactionGridComponentName),
            this.transactionGridComponentName);
          // It will set the pending transaction data for local search and filter
          if (this.showPendingTransactions) {
            this.transactionGridService.formattedPendingTransactionList = this.sharedService.clone(modifiedTransactionsList);
            modifiedTransactionsList = this.getPaginationatedTransactionList(response, this.paginationCount);
          }
          this.updateTransactionHistoryList(modifiedTransactionsList);
          this.sharedService.transactionHistoryPayLoad.is_more_records = response.moreRecords;
          this.isLoadMoreRecords = response.moreRecords;
        }
        this.isTransactionsLoaded = true;
      }));
  }

  /**
   * @methodName getPaginationatedTransactionList
   * @description used to update the transaction grid with pending transactions with pagination
   * @parameters response<PendingTransactionModel>, paginationCount<number>
   * @return modifiedTransactionHistoryList<TransactionGridModel[]>
   */
  getPaginationatedTransactionList(response: PendingTransactionModel, paginationCount: number) {
    response = this.sharedService.clone(response);
    // It will take the twenty transactions from the list based on current paginationCount
    response.transactionList = response.transactionList.slice(paginationCount, paginationCount +
      TRANSACTION_GRID_TEXT.MAX_PAGINATION_COUNT);
    this.paginationCount = this.paginationCount + TRANSACTION_GRID_TEXT.MAX_PAGINATION_COUNT;
    return this.transactionGridService.generateTransactionGridData(
      this.transactionGridService.getTransactionHistoryResponseObject(response,
        this.transactionGridComponentName), this.transactionGridComponentName);
  }

  /**
   * @methodName updateGridOnScroll
   * @description used to update the transaction grid on scroll if more data present
   * @parameters none
   * @return none
   */
  updateGridOnScroll(): void {
    if (this.isLoadMoreRecords) {
      this.getTansactionHistory();
    } else if (this.showPendingTransactions && !this.isShowingFilteredTransactions && this.sharedService.transactionHistoryResponseObj &&
      this.sharedService.transactionHistoryResponseObj.transactionList &&
      this.paginationCount < this.sharedService.transactionHistoryResponseObj.transactionList.length) {
      // It will load the pending transaction data on scroll
      this.updateTransactionHistoryList(this.getPaginationatedTransactionList(this.sharedService.transactionHistoryResponseObj,
        this.paginationCount));
    } else if (this.showPendingTransactions && this.isShowingFilteredTransactions && this.listOfFilteredTransactions &&
      this.listOfFilteredTransactions.transactionList &&
      this.paginationCount < this.listOfFilteredTransactions.transactionList.length) {
      // It will load the pending transaction data on scroll with search
      this.updateTransactionHistoryList(this.getPaginationatedTransactionList(this.listOfFilteredTransactions,
        this.paginationCount));
    }
  }

  /**
   * @methodName getAccountListInfo
   * @description used to recieve the menu option component event
   * @parameters selectedMenuItem<string>
   * @return none
   */
  menuClickHandler(selectedMenuItem: MenuOption): void {
    if (selectedMenuItem.actionType === MENU_ACTION.copy) {
      this.copyTransactionData(selectedMenuItem.actionItem);
    }
  }

  /**
   * @methodName copyTransactionData
   * @description used to recieve the menu option component event
   * @parameters selectedMenuItem<string>
   * @return void
   */
  copyTransactionData(rowData: TransactionGridRow): void {
    if (rowData) {
      const componentData = this.getComponentCopyData();
      const copyData = componentData + `
      ${TRANSACTION_GRID_TRANSLATION_TEXT.tr_transactionGrid_amount}: ${this.numberFormat.transform(rowData.transactionAmount)}
      .${this.decimalValue.transform(rowData.transactionAmount)} ${rowData.currencyCode}
      ${TRANSACTION_GRID_TRANSLATION_TEXT.tr_transactionGrid_date}: ${this.datePipe
          .transform(rowData.dateEffective, TRANSACTION_GRID_TEXT.DATE_FORMAT)}
      ${TRANSACTION_GRID_TRANSLATION_TEXT.tr_transactionGrid_description}: ${rowData.description} `;
      const copyStatus = this.sharedService.copyToClipboard(copyData);
      this.sharedService.notifyCopyData(copyStatus);
    }
  }

  /**
   * @methodName getComponentCopyData
   * @description used to get component detail from shared service
   * @parameters void
   * @return componentData<string>
   */
  getComponentCopyData(): string {
    let copyComponentText = '';
    if (this.transactionGridComponentName === TRANSACTION_GRID_TEXT.DEBIT_TEXT ||
      this.transactionGridComponentName === TRANSACTION_GRID_TEXT.CREDIT_TEXT) {
      copyComponentText = this.sharedService.cardCopyData;
    } else if (this.transactionGridComponentName === TRANSACTION_GRID_TEXT.FINANCE_TEXT) {
      copyComponentText = this.sharedService.financeCopyData;
    } else if (this.transactionGridComponentName === TRANSACTION_GRID_TEXT.ACCOUNT_TEXT) {
      copyComponentText = this.sharedService.accountCopyData;
    }
    return copyComponentText;
  }



  /**
   * @methodName handleContentToggle
   * @description used to toggle the content on mobile and tablet view
   * @parameters toggleContent, toggleButton
   * @return none
   */
  handleContentToggle(toggleContent: HTMLElement, toggleButton: HTMLElement): void {
    toggleButton && toggleButton.classList && toggleButton.classList.contains(TRANSACTION_GRID_TEXT.HIDE_CONTENT) ?
      (toggleButton.classList.remove(TRANSACTION_GRID_TEXT.HIDE_CONTENT), toggleContent.classList.add(TRANSACTION_GRID_TEXT.DISPLAY_FLEX)) :
      (toggleButton.classList.add(TRANSACTION_GRID_TEXT.HIDE_CONTENT), toggleContent.classList.remove(TRANSACTION_GRID_TEXT.DISPLAY_FLEX));
  }

  /**
   * @methodName updateTransactionHistoryList
   * @description used to update the transaction history object based on scroll
   * @parameters none
   * @return none
   */
  updateTransactionHistoryList(transactionHistory: TransactionGridModel[]): void {
    if (transactionHistory) {
      transactionHistory.forEach(historyRow => {
        let isYearFound = false;
        this.modifiedTransactionHistoryList.forEach(yearList => {
          // If year data already exist append to the same object
          if (yearList.year === historyRow.year) {
            yearList.transactionHistory = [...yearList.transactionHistory, ...historyRow.transactionHistory];
            isYearFound = true;
          }
        });
        // If year data not exist push complete object to array
        if (!isYearFound) {
          this.modifiedTransactionHistoryList.push(historyRow);
        }
      });
    }
  }

  /**
   * @methodName filterPendingTransactions
   * @description used to toggle the pending transactions and normal transactions on grid
   * @parameters isChecked<CheckBox Event>
   * @return none
   */
  filterPendingTransactions(isChecked): void {
    this.showPendingTransactions = isChecked.target.checked;
    if (isChecked.target.checked) {
      // It will update pending transaction details on checkbox selectd
      this.transactionsAPIURL = this.pendingTransactionsAPIURL;
      this.transactionGridComponentName = TRANSACTION_GRID_TEXT.PENDING_TEXT;
    } else {
      // It will update the normal transactions on checkbox deselcted
      this.transactionsAPIURL = this.transactionHistoryAPIURL;
      this.transactionGridComponentName = TRANSACTION_GRID_TEXT.CREDIT_TEXT;
    }
    this.resetComponentData();
  }
  /**
   * @methodName resetTransactionGrid
   * @description used to call the resetComponentData on search box value clearing and on conditionally
   * @parameters none
   * @return none
   */
  resetTransactionGrid(): void {
    if (this.loadSearchedTransactions) {
      this.resetComponentData();
    }
  }
  /**
   * @methodName resetComponentData
   * @description used to reset the component data to it's default state
   * @parameters none
   * @return none
   */
  resetComponentData(): void {
    this.modifiedTransactionHistoryList = [];
    this.searchText = '';
    this.isLoadMoreRecords = false;
    this.sharedService.transactionHistoryPayLoad.is_more_records = false;
    this.sharedService.transactionHistoryPayLoad.text_to_search = '';
    this.paginationCount = TRANSACTION_GRID_TEXT.INITIAL_PAGINATION_COUNT;
    this.isShowingFilteredTransactions = false;
    this.listOfFilteredTransactions = {} as PendingTransactionModel;
    this.getTansactionHistory();
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
   * @methodName ngOnDestroy
   * @description used to destroy the subscriptions on component destoyed from DOM
   * @parameters none
   * @return none
   */
  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
