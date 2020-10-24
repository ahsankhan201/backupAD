import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FinanceService } from '../../services/finance.service';
import { NAV_CONTROLS, DOMAINS, ACCOUNT_DETAILS_CONST, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import {
  HORIZONTAL_LINE_FINANCE_LIST_CSS_CLASS, HORIZONTAL_LINE_FINANCE_DETAILS_CSS_CLASS,
  FINANCE_TEXT
} from '../../finance-module.constants';
import { FINANCE_TRANSACTIONS_HEADERS } from '../../finance-module.constants';
import { FINANCE_ENDPOINTS } from 'src/app/common/api-endpoints';
import { FINANCE_COMPONENT_TRANSLATION_TEXT } from '../../finance-module.language.translation';
import { FinanceData } from 'src/app/common/models/finance-module.model';
import { TransactionGridHeaderModel, TransactionHistoryInterface } from 'src/app/common/models/global.model';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-finance-details',
  templateUrl: './finance-details.component.html',
  styleUrls: ['./finance-details.component.scss']
})
export class FinanceDetailsComponent implements OnInit, OnDestroy {
  @Input() financeData: FinanceData;
  @Output() backButtonClicked = new EventEmitter<boolean>(false);
  financeDetails: FinanceData;
  navControls = NAV_CONTROLS;
  translationText = FINANCE_COMPONENT_TRANSLATION_TEXT;
  transactionHeaderList: TransactionGridHeaderModel;
  transactionHistoryAPIURL: string;
  transactionGridComponentName = FINANCE_TEXT;
  copyData: string;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(private financeService: FinanceService, private sharedService: SharedService) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.financeDetails = this.financeService.getSelectedFinanceAccount();
    this.setCopyData();
    this.updateHorizontalLineStyle();
    this.loadTransactionHistoryData();
  }
  /**
   * @methodName updateHorizontalLineStyle
   * @description used to update horizontal line CSS
   * @parameters none
   * @return none
   */
  updateHorizontalLineStyle(): void {
    this.sharedService.setHorizontalLineClass(HORIZONTAL_LINE_FINANCE_DETAILS_CSS_CLASS);
  }
  /**
   * @methodName onBackButtonClicked
   * @description used to emit backButtonClicked
   * @parameters none
   * @return none
   */
  onBackButtonClicked(): void {
    this.sharedService.setHorizontalLineClass(HORIZONTAL_LINE_FINANCE_LIST_CSS_CLASS);
    this.backButtonClicked.emit(true);
  }
  /**
   * @methodName loadTransactionHistoryData
   * @description used to load transaction history data
   * @parameters none
   * @return none
   */
  loadTransactionHistoryData(): void {
    this.sharedService.transactionHistoryPayLoad = {} as TransactionHistoryInterface;
    const FINANCE_TRANSACTIONS_API_URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + FINANCE_ENDPOINTS.FINANCE_HISTORY;
    // setting transaction history payLoad in shared service
    this.sharedService.transactionHistoryPayLoad.is_more_records = false;
    this.sharedService.transactionHistoryPayLoad.ghina = 'No';
    this.sharedService.transactionHistoryPayLoad.aliasId = this.financeDetails.aliasId;
    this.transactionHeaderList = FINANCE_TRANSACTIONS_HEADERS;
    this.transactionHistoryAPIURL = FINANCE_TRANSACTIONS_API_URL;
  }

  /**
   * @methodName setCopyData
   * @description use to save it in shared service for transaction history copy
   * @parameters none
   * @return void
   */
  setCopyData(): void {
    if (this.financeDetails) {
      this.copyData = `
    ${ACCOUNT_DETAILS_CONST.accountDetail_bankName}: ${ACCOUNT_DETAILS_CONST.adib}`;
      this.sharedService.financeCopyData = this.copyData;
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

  ngOnDestroy() {
    this.sharedService.setHorizontalLineClass(undefined);
  }
}
