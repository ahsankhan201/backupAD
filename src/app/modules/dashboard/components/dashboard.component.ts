import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DashboardService } from '../services/dashboard.service';
import { PaymentService } from 'src/app/common/services/payment/payment.service';
import { OpenAccountService } from 'src/app/common/services/open-account/open-account.service';
import { SharedService } from 'src/app/common/services/shared.service';

import { QuickLinks } from '../../../common/models/quickLinks.model';
import {
  ACCOUNT_DETAILS_CONST, PAYMENT_TYPES,
  PAYMENT_VIEW_MAPPING_OBJ, ARABIC_LANG_TEXT, DASHBOARD_NAMES
} from 'src/app/common/global-constants';
import { MenuOption } from 'src/app/common/models/menu-option.model';
import { MoneyTransferService } from 'src/app/common/services/money-transfer/money-transfer.service';
import { ACCOUNT_LIST_COMPONENT, ACCOUNT_DETAILS_COMPONENT, DASHBOARD_COMPONENT } from '../dashboard-module.constants';
import { OPEN_ACCOUNT_COMPONENT } from '../dashboard-module.constants';
import { PAYMENTS_COMPONENT, MONEY_TRANSFER_COMPONENT } from '../dashboard-module.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedLanguage: string;
  quickLinksData: QuickLinks[];
  detailView = false;
  accountNumber: string;
  parentComponentTitle: string = PAYMENT_VIEW_MAPPING_OBJ.accountsDashBoard;
  selectedComponentTitle: string = PAYMENT_VIEW_MAPPING_OBJ.payBillsText;
  showPaymentView: boolean;
  selectedAccountNumber: string;
  showPayBillsComponent: boolean;
  subscription$ = new Subscription();
  showTransferView: boolean;
  showTransferViewInDetailsPage: boolean;
  selectedAccountForMoneyTransfer: string;
  showComponent = ACCOUNT_LIST_COMPONENT;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private sharedService: SharedService,
    private dashBoardService: DashboardService,
    private paymentService: PaymentService,
    private openAccountService: OpenAccountService,
    private moneyTransferService: MoneyTransferService) {
  }

  ngOnInit() {
    this.quickLinksData = ACCOUNT_DETAILS_CONST.dashboardQuickLinks;
    this.getSelectedLanguage();
    this.sharedService.selectedDashboardText = DASHBOARD_NAMES.accountsDashBoard;
    this.sharedService.customerData();
  }

  /**
   * @methodName showAccountDetail
   * @description use to show account detail component
   * @parameters account number <string>
   * @return void
   */
  showAccountDetail(): void {
    this.showComponent = ACCOUNT_DETAILS_COMPONENT;
    this.paymentService.confirmScreenRoutingButtonText = PAYMENT_VIEW_MAPPING_OBJ.accountDetail;
    this.moneyTransferService.confirmScreenRoutingButtonText = PAYMENT_VIEW_MAPPING_OBJ.accountDetail;
    this.handlePayBillsClick();
  }

  /**
   * @methodName showDashboard
   * @description use to show dashboard component
   * @parameters none
   * @return void
   */
  showDashboard(): void {
    this.showComponent = ACCOUNT_LIST_COMPONENT;
  }

  /**
   * @methodName handleQuickLinkEvent
   * @description used to toggle payments view on quicklink selection
   * @parameters selectedQuickLink<MenuOption>
   * @return none
   */
  handleQuickLinkEvent(selectedQuickLink: MenuOption) {
    this.paymentService.selectedPaymentType = '';
    this.paymentService.confirmScreenRoutingButtonText = PAYMENT_VIEW_MAPPING_OBJ.accountsDashBoard;
    if (selectedQuickLink.actionType === PAYMENT_TYPES.payments) {
      this.showComponent = PAYMENTS_COMPONENT;
      this.showPayBillsComponent = false;
      this.selectedAccountNumber = undefined;
    } else if (selectedQuickLink.actionType === PAYMENT_TYPES.moneyTransfer) {
      this.showMoneyTransferView();
    }
  }
  /**
   * @methodName changePaymentsView
   * @description used to toggle the payments view
   * @parameters showPaymentsView<boolean>
   * @return none
   */
  changePaymentsView(showPaymentsView: boolean): void {
    // this.showPaymentView = showPaymentsView;
    this.showComponent = showPaymentsView ? PAYMENTS_COMPONENT : ACCOUNT_LIST_COMPONENT;
    this.showComponent = this.showPayBillsComponent ? ACCOUNT_DETAILS_COMPONENT : ACCOUNT_LIST_COMPONENT;
    this.paymentService.isPayeeSelectedForPayment = false;
  }
  /**
   * @methodName handlePayBillsClick
   * @description used to toggle the payments view
   * @parameters none
   * @return none
   */
  handlePayBillsClick(): void {
    this.subscription$.add(this.dashBoardService.getDashBoardPaymentsViewSubject().subscribe((response) => {
      if (response && response['viewType'] === PAYMENT_TYPES.moneyTransfer) {
        this.showTransferViewInDetailsPage = true;
        this.showComponent = MONEY_TRANSFER_COMPONENT;
        this.selectedAccountForMoneyTransfer = response['account'].accountNumber;
        this.moneyTransferService.selectedAccForMoneyTransfer = response['account'].accountNumber;
        this.moneyTransferService.selectedBeneficiaryForTransfer = undefined;
        this.moneyTransferService.confirmScreenRoutingButtonText =
          this.moneyTransferService.confirmScreenRoutingButtonText ===
            PAYMENT_VIEW_MAPPING_OBJ.accountDetail ? PAYMENT_VIEW_MAPPING_OBJ.accountDetail : PAYMENT_VIEW_MAPPING_OBJ.accountsDashBoard;
        this.dashBoardService.toggleDashBoardPaymentsView(undefined);
      } else if (response) {
        this.selectedAccountNumber = response['account'].accountNumber;
        this.showComponent = PAYMENTS_COMPONENT;
        this.showPayBillsComponent = true;
        this.paymentService.isPayeeSelectedForPayment = false;
        // to reset the selected account details after showing in payments view
        this.dashBoardService.toggleDashBoardPaymentsView(undefined);
      }
    }));
  }

  /**
   * @methodName showMoneyTransferView
   * @description used to show money transfer view and updating moneyTransferService service variables
   * @parameters none
   * @return none
   */
  showMoneyTransferView(): void {
    this.showComponent = MONEY_TRANSFER_COMPONENT;
    this.showTransferViewInDetailsPage = false;
    this.selectedAccountForMoneyTransfer = undefined;
    this.moneyTransferService.selectedBeneficiaryForTransfer = undefined;
    this.moneyTransferService.selectedAccForMoneyTransfer = undefined;
    this.moneyTransferService.confirmScreenRoutingButtonText = PAYMENT_VIEW_MAPPING_OBJ.accountsDashBoard;
  }
  /**
   * @methodName changeMoneyTransferView
   * @description used to change money transfer view
   * @parameters none
   * @return none
   */
  changeMoneyTransferView(showTransferView: boolean): void {
    this.showComponent = showTransferView ? MONEY_TRANSFER_COMPONENT : ACCOUNT_LIST_COMPONENT;
    this.selectedAccountForMoneyTransfer = undefined;
    this.showComponent = this.showTransferViewInDetailsPage ? ACCOUNT_DETAILS_COMPONENT : ACCOUNT_LIST_COMPONENT;
  }
  /**
   * @methodName handleOpenAccount
   * @description used to handle open account
   * @parameters none
   * @return none
   */
  handleOpenAccount(): void {
    this.openAccountService.openAccountSelectedFrom = DASHBOARD_COMPONENT;
    this.showComponent = OPEN_ACCOUNT_COMPONENT;
  }

  /**
   * @methodName handleOpenAccountBackButton
   * @description used to handle open account back button
   * @parameters none
   * @return none
   */
  handleOpenAccountBackButton(backButtonStatus: boolean): void {
    this.openAccountService.isBankSeviceTermsAgreed = false;
    this.openAccountService.ghinaSeviceTermsAgreed = false;
    this.showComponent = backButtonStatus ? ACCOUNT_LIST_COMPONENT : undefined;
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
