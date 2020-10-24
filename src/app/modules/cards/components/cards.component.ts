import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { PaymentService } from 'src/app/common/services/payment/payment.service';
import { MoneyTransferService } from 'src/app/common/services/money-transfer/money-transfer.service';

import { QuickLinks } from '../../../common/models/quickLinks.model';
import { CARDS_QUICKLINKS_DATA, CARDS_MASTER_DATA, COVER_LIMIT_COMPONENT_TEXT,  } from '../cards-module.constants';
import { QUICK_LINK_ID_CHANGE_COVER_LIMIT  } from '../cards-module.constants';
import { CoverCardData } from 'src/app/common/models/cards-module.model';
import {
  PAYMENT_TYPES, PAYMENT_ROUTING_BUTTONS, PAYMENT_VIEW_MAPPING_OBJ,
  TRANSFER_TYPES, TRANSFER_VIEW_MAPPING_OBJ, ARABIC_LANG_TEXT, DASHBOARD_NAMES
} from 'src/app/common/global-constants';
import { MenuOption } from 'src/app/common/models/menu-option.model';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  quickLinksData: QuickLinks[] = CARDS_QUICKLINKS_DATA;
  readonly CARDS_MASTER_DATA = CARDS_MASTER_DATA;
  selectedComponent = this.CARDS_MASTER_DATA.CARDS_LIST;
  newCoverLimit: number;
  showPaymentView = false;
  selectedComponentTitle: string;
  showTransferToStep: boolean;
  parentComponentTitle: string;
  showTransferView: boolean;
  showMoneyTransferToStep: boolean;
  showCardsTabInStepFrom: boolean;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private paymentService: PaymentService,
    private moneyTransferService: MoneyTransferService,
    private translateService: TranslateService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.sharedService.selectedDashboardText = DASHBOARD_NAMES.cardsDashBoard;
  }

  /**
   * @methodName cardSelectionStatus
   * @description used to load @output cardSelectionStatus
   * @parameters selectionStatus<string>
   * @return none
   */
  cardSelectionStatus(selectionStatus: string): void {
    if (selectionStatus === this.CARDS_MASTER_DATA.DEBIT_CARD_DETAILS) {
      this.selectedComponent = this.CARDS_MASTER_DATA.DEBIT_CARD_DETAILS;
    } else if (selectionStatus === this.CARDS_MASTER_DATA.COVER_CARD_DETAILS) {
      this.selectedComponent = this.CARDS_MASTER_DATA.COVER_CARD_DETAILS;
    } else if (selectionStatus === this.CARDS_MASTER_DATA.ACTIVATE_CARD) {
      this.selectedComponent = this.CARDS_MASTER_DATA.ACTIVATE_CARD;
    }
  }

  /**
   * @methodName onBackButtonClicked
   * @description used to load  @output onBackButtonClicked
   * @parameters none
   * @return none
   */
  onBackButtonClicked(): void {
    this.selectedComponent = this.CARDS_MASTER_DATA.CARDS_LIST;
  }


  /**
   * @methodName handleCoverLimitBackButtonClick
   * @description used to load  @output handleCoverLimitBackButtonClick
   * @parameters routeComponent?<string>
   * @return none
   */
  handleCoverLimitBackButtonClick(routeComponent?: string): void {
    if (typeof routeComponent === 'string' && routeComponent ) {
      this.selectedComponent = routeComponent;
  } else {
    this.selectedComponent = this.CARDS_MASTER_DATA.CARDS_LIST;
  }
  }

  /**
   * @methodName selectedQuickLink
   * @description used to load selected quick link action
   * @parameters quickLink<QuickLinks>
   * @return none
   */
  selectedQuickLink(quickLink: QuickLinks): void {
    if (quickLink && (quickLink.actionType === QUICK_LINK_ID_CHANGE_COVER_LIMIT)) {
      this.selectedComponent = COVER_LIMIT_COMPONENT_TEXT;
    }
  }

  /**
   * @methodName showPaymentToCardView
   * @description used to show cover card payment view
   * @parameters showPaymentsView<boolean>,selectedCoverCardObject<CoverCardData>
   * @return none
   */
  showPaymentToCardView(showPaymentsView: boolean, selectedCoverCardObject?: CoverCardData): void {
    this.setPaymentsViewInfo(showPaymentsView);
    if (selectedCoverCardObject) {
      this.paymentService.selectedCoverCardObj = selectedCoverCardObject;
      this.selectedComponentTitle = selectedCoverCardObject.productDescription;
      this.paymentService.isCoverCardSelectedForPayment = true;
      this.paymentService.selectedPaymentType = PAYMENT_TYPES.ccPayment;
    }
  }

  /**
   * @methodName setPaymentsViewInfo
   * @description used to set payment view info
   * @parameters showPaymentsView<boolean>
   * @return none
   */
  setPaymentsViewInfo(showPaymentsView: boolean): void {
    this.showPaymentView = showPaymentsView;
    this.showTransferToStep = false;
    this.parentComponentTitle = PAYMENT_VIEW_MAPPING_OBJ.paymentToCoverCard;
    this.paymentService.selectedCoverCardObj = {} as CoverCardData;
    this.paymentService.confirmScreenRoutingButtonText = PAYMENT_ROUTING_BUTTONS.coverCardDetails;
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
      this.showPaymentView = true;
      this.showTransferToStep = true;
      this.parentComponentTitle = PAYMENT_VIEW_MAPPING_OBJ.cardsDashBoard;
      this.paymentService.confirmScreenRoutingButtonText = this.parentComponentTitle;
      this.paymentService.isPayeeSelectedForPayment = false;
      this.selectedComponentTitle = PAYMENT_VIEW_MAPPING_OBJ.payBillsText;
    } else if (selectedQuickLink.actionType === TRANSFER_TYPES.moneyTransfer) {
      this.showMoneyTransferView(true);
    }
  }

  /**
   * @methodName showMoneyTransferView
   * @description used to toggle money transfer view
   * @parameters showTransferView<boolean>
   * @return none
   */
  showMoneyTransferView(showTransferView: boolean): void {
    this.moneyTransferService.confirmScreenRoutingButtonText = PAYMENT_VIEW_MAPPING_OBJ.transferAndPayments;
    this.moneyTransferService.selectedAccForMoneyTransfer = undefined;
    this.showTransferView = showTransferView;
    this.parentComponentTitle = PAYMENT_VIEW_MAPPING_OBJ.cardsDashBoard;
    this.showMoneyTransferToStep = true;
    this.selectedComponentTitle = TRANSFER_VIEW_MAPPING_OBJ.moneyTransferText;
    this.moneyTransferService.isBeneSelectedForTransfer = false;
    this.moneyTransferService.selectedTransferType = '';
    this.moneyTransferService.confirmScreenRoutingButtonText = PAYMENT_VIEW_MAPPING_OBJ.cardsDashBoard;
    this.showCardsTabInStepFrom = true;
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
