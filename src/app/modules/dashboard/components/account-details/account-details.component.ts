import { Component, OnInit, Output, EventEmitter, OnDestroy, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';

// include service
import { AccountlistService } from '../../services/accountlist.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { DashboardService } from '../../services/dashboard.service';
import { PaymentService } from 'src/app/common/services/payment/payment.service';
import { DialogService } from 'src/app/common/services/dialog.service';

// include constants and model
import {
  ICON, ACCOUNT_DETAILS_CONST, ACCOUNT_ALLOWED_TYPE_LIST, ACCOUNT_TX_HEADERS, NAV_CONTROLS, DOMAINS,
  TRANSACTION_GRID_TEXT, PAYMENT_TYPES, QUICKLINK_E_STATEMENT, HTTP_STATUS_CODE, E_STATEMENT_DIALOG_DATA,
  ARABIC_LANG_TEXT, QUICKLINK_BANK_CERTIFICATE, QUICKLINK_CHEQUE_BOOK
} from 'src/app//common/global-constants';
import { BANKING_SERVICE_LIST, BANKING_SERVICES_ROUTE_URL } from 'src/app/modules/banking-services/banking-services-module.constants';
import { TRANSACTION_HISTORY_API_URL, ACCOUNTS_ENDPOINTS } from 'src/app/common/api-endpoints';
import { AccountDetailModel, Coupon, AccountStatementPayload } from '../../../../common/models/accounts-module.model';
import { QuickLinks } from '../../../../common/models/quickLinks.model';
import { AccountsList } from 'src/app/common/models/global.model';
import { GHINA_ACCOUNT_CLASS_CODE } from '../../dashboard-module.constants';
import { MenuOption } from 'src/app/common/models/menu-option.model';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  navControls = NAV_CONTROLS;
  icons = ICON;
  accountDetailsConst = ACCOUNT_DETAILS_CONST;
  quickLinksData: QuickLinks[];
  accountInfo: AccountDetailModel;
  accountData: AccountsList;
  accountTypeList = ACCOUNT_ALLOWED_TYPE_LIST;
  transactionGridText = TRANSACTION_GRID_TEXT;
  isGhina = false;
  copyData: string;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  transactionHistoryURL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) + TRANSACTION_HISTORY_API_URL;
  @Output() showAccountList = new EventEmitter<boolean>();

  readonly ACCOUNT_TX_HEADERS = ACCOUNT_TX_HEADERS;

  constructor(
    private accountListService: AccountlistService,
    private sharedService: SharedService,
    private paymentService: PaymentService,
    private dashBoardService: DashboardService,
    private dialogService: DialogService,
    private router: Router) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.getAccountDetails();
    this.quickLinksData = ACCOUNT_DETAILS_CONST.accountDetailQuickLinks;
  }

  /**
   * @methodName getAccountDetail
   * @description used to fecth the account list from server
   * @parameters none
   * @return none
   */
  getAccountDetails(): void {
    this.accountData = this.accountListService.accountDetailData;
    if (this.accountListService.accountDetailData) {
      this.getCopyData();
      if (this.accountData.accountType === ACCOUNT_DETAILS_CONST.ghinaAccountType &&
        GHINA_ACCOUNT_CLASS_CODE.includes(this.accountData.classCode)) {
        this.isGhina = true;
        this.getGhinaAccountDetail();
      }
      this.getAccountHistoryPayload();
    }
  }

  /**
   * @methodName getAccountHistoryPayload
   * @description used to set payload for account transaction history
   * @parameters none
   * @return void
   */
  getAccountHistoryPayload(): void {
    this.sharedService.transactionHistoryPayLoad = {
      ghina: this.isGhina ? this.accountDetailsConst.GHI_YES : this.accountDetailsConst.GHI_NO,
      is_more_records: false,
      aliasId: this.accountData.aliasId,
    };
  }

  /**
   * @methodName getGhinaAccountDetail
   * @description used to fecth the coupos and draw date of ghina account from server
   * @parameters none
   * @return void
   */
  getGhinaAccountDetail(): void {
    this.sharedService.couponObj.subscribe(res => {
      const couponData: Coupon[] = res;
      if (couponData && couponData.length > 0) {
        this.accountData.couponsCount = couponData ? couponData.length.toString() : '0';
        this.accountData.nextDrawDaysCount = couponData ? this.getRemainingDays(couponData[0].nextDrawDaysCount) : '';
        this.accountData.nextDraw = couponData ? couponData[0].nextDraw : '';
      }
    });
  }

  /**
   * @methodName getRemainingDays
   * @description compare given date with current date
   * @parameters draw date<string>
   * @return number of remaining days <string>
   */
  getRemainingDays(nextdDrawDate: string): string {
    const drawDate = new Date(nextdDrawDate);
    const timeDifference = drawDate.getTime() - new Date().getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return (dayDifference < 1 ? '' : dayDifference.toString());
  }

  /**
   * @methodName getCopyData
   * @description used to formate the data for copy to clipboard
   * @parameters none
   * @return void
   */
  getCopyData(): void {
    if (this.accountData) {
      this.copyData = `
      ${ACCOUNT_DETAILS_CONST.accountDetail_bankName}: ${ACCOUNT_DETAILS_CONST.adib}
      ${ACCOUNT_DETAILS_CONST.accountDetail_swift}: ${this.accountData.swiftCode}
      ${ACCOUNT_DETAILS_CONST.accountDetail_iban}: ${this.accountData.ibanNumber}
      ${ACCOUNT_DETAILS_CONST.accountDetail_accountNumber}: ${this.accountData.accountNumber}
      ${ACCOUNT_DETAILS_CONST.accountDetail_currency}: ${this.accountData.currencyCode}`;
      this.copyData = (this.accountData.accountHolderName != null) ?
        `${ACCOUNT_DETAILS_CONST.accountDetail_accountHolderName}:
         ${this.accountData.accountHolderName}` + this.copyData : this.copyData;
      this.sharedService.accountCopyData = this.copyData;
    }
  }

  /** @methodName copyToClipBoard
   * @description used to copy the data to clipboard
   * @parameters none
   * @return void
   */
  copyToClipBoard(): void {
    const copyStatus = this.sharedService.copyToClipboard(this.sharedService.accountCopyData);
    this.sharedService.notifyCopyData(copyStatus);
  }


  /**
   * @methodName onBackButtonClicked
   * @description emit the event to parent component to show dashboard
   * @parameters none
   * @return void
   */
  onBackButtonClicked(): void {
    this.showAccountList.emit();
  }

  /**
   * @methodName handleQuickLinkEvent
   * @description used to toggle payments view on quicklink selection
   * @parameters selectedQuickLink<MenuOption>
   * @return none
   */
  handleQuickLinkEvent(selectedQuickLink: MenuOption): void {
    this.paymentService.selectedPaymentType = '';
    if (selectedQuickLink.actionType === PAYMENT_TYPES.payBills) {
      this.dashBoardService.toggleDashBoardPaymentsView(this.accountData);
    } else if (selectedQuickLink.actionType === PAYMENT_TYPES.moneyTransfer) {
      this.dashBoardService.toggleDashBoardPaymentsView(this.accountData, PAYMENT_TYPES.moneyTransfer);
    } else if (selectedQuickLink.actionType === QUICKLINK_E_STATEMENT) {
      this.dialogService.openEstatementDialog().subscribe((dialogResponse: boolean) => {
        if (dialogResponse && this.sharedService.selectedStatementMonth !== undefined &&
          this.sharedService.selectedStatementYear !== undefined) {
          this.downloadAccountStatement();
        }
      });
    } else if (selectedQuickLink.actionType === QUICKLINK_BANK_CERTIFICATE) {
      this.sharedService.selectedBankingServicesOnQuickLink = BANKING_SERVICE_LIST.bankCertificate;
      this.router.navigateByUrl(BANKING_SERVICES_ROUTE_URL);
    } else if (selectedQuickLink.actionType === QUICKLINK_CHEQUE_BOOK) {
      this.sharedService.selectedBankingServicesOnQuickLink = BANKING_SERVICE_LIST.chequeBook;
      this.router.navigateByUrl(BANKING_SERVICES_ROUTE_URL);
    }
  }


  /**
   * @methodName downloadAccountStatement
   * @description download account e-statement
   * @parameters none
   * @return none
   */
  downloadAccountStatement(): void {
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + ACCOUNTS_ENDPOINTS.DOWNLOAD_STATEMENT;
    const downloadAccountStatement = {} as AccountStatementPayload;
    downloadAccountStatement.accountNumber = this.accountData.accountNumber;
    downloadAccountStatement.month = this.sharedService.selectedStatementMonth.toString();
    downloadAccountStatement.year = this.sharedService.selectedStatementYear;
    this.subscription$.add(this.dashBoardService.generateAccountStatement(URL, downloadAccountStatement).subscribe(response => {
      if (response && response['status'] === HTTP_STATUS_CODE.OK) {
        const fileName = this.sharedService.getFileName(response.headers.get(E_STATEMENT_DIALOG_DATA.CONTENT_DISPOSITION));
        saveAs(response.body, fileName);
      }
    }));
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

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
