import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

// import services
import { TransfersPaymentsService } from '../services/transfers-payments.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { PaymentService } from 'src/app/common/services/payment/payment.service';
import { MoneyTransferService } from 'src/app/common/services/money-transfer/money-transfer.service';

// include constants and model
import {
  TRANSFER_PAYMENT_CONST, DOMAINS, NAV_CONTROLS,
  TRANSFER_TYPES, TRANSFER_VIEW_MAPPING_OBJ, INTERNATIONAL_TRANSFER_TEXT, ARABIC_LANG_TEXT, DASHBOARD_NAMES
} from '../../../common/global-constants';
import { PAYMENT_TYPES, PAYMENT_ROUTING_BUTTONS, PAYMENT_VIEW_MAPPING_OBJ } from '../../../common/global-constants';
import { PAYEE_ENDPOINTS, ACCOUNTS_ENDPOINTS } from 'src/app/common/api-endpoints';
import { BeneficiaryListResponse } from '../../../common/models/beneficiary.model';
import { PayeeListResponse } from '../../../common/models/payee.model';
import { QuickLinks } from '../../../common/models/quickLinks.model';
import { SnackBar } from 'src/app/common/models/snackBar.model';
import { QUICK_LINKS_INFO } from '../transfers-payments-module.constants';
import { MenuOption } from 'src/app/common/models/menu-option.model';
import { REGEX } from 'src/app/modules/beneficiary/beneficiary-module.constants';

@Component({
  selector: 'app-transfers-payments',
  templateUrl: './transfers-payments.component.html',
  styleUrls: ['./transfers-payments.component.scss']
})
export class TransfersPaymentsComponent implements OnInit, OnDestroy {
  quickLinksData: QuickLinks[] = QUICK_LINKS_INFO;
  showAllBene = false;
  showAllPayee = false;
  showFullList = false;
  allBeneficiaryList: BeneficiaryListResponse[];
  formatedBeneList: BeneficiaryListResponse[];
  formatedPayeeList: PayeeListResponse[];
  allPayeeList: PayeeListResponse[];
  showViewAllBeneLink: boolean;
  showViewAllPayeeLink: boolean;
  showViewAllLink: boolean;
  showPaymentView = false;
  showSnackBar = false;
  snackBarMessageObj: SnackBar;
  navControls = NAV_CONTROLS;
  subscription = new Subscription();
  parentComponentTitle: string;
  selectedComponentTitle: string;
  showTransferFromStep: boolean;
  showTransferToStep: boolean;
  showTransferView: boolean;
  showMoneyTransferToStep: boolean;
  showCardsTabInStepFrom: boolean;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private transfersPaymentsService: TransfersPaymentsService,
    private sharedService: SharedService,
    private paymentService: PaymentService,
    private moneyTransferService: MoneyTransferService,
    private translateService: TranslateService) {
    this.getTemplateData();
  }
  ngOnInit() {
    this.setRestrictWords();
    this.getSelectedLanguage();
    this.sharedService.selectedDashboardText = DASHBOARD_NAMES.transferAndPayments;
  }

  /**
   * @methodName showDashboard
   * @description show dashboard from view all page
   * @parameters void
   * @return void
   */
  showDashboard(): void {
    this.showFullList = false;
    this.showAllBene = false;
    this.showAllPayee = false;
    this.getTemplateData();
  }

  /**
   * @methodName getTemplateData
   * @description call the function for view
   * @parameters void
   * @return void
   */
  getTemplateData(): void {
    (this.showAllBene) ? this.showAllBeneficiaryList() : this.getBeneficiaryListInfo();
    (this.showAllPayee) ? this.showAllPayeeList() : this.getPayeeListInfo();
  }

  /**
   * @methodName showAllBeneficiaryList
   * @description show list of all beneficiary
   * @parameters void
   * @return void
   */
  showAllBeneficiaryList(): void {
    this.showAllBene = true;
    this.showFullList = true;
    this.formatedBeneList = this.allBeneficiaryList;
  }

  /**
   * @methodName showAllPayeeList
   * @description show list of all payee
   * @parameters void
   * @return void
   */
  showAllPayeeList(): void {
    this.showAllPayee = true;
    this.showFullList = true;
    this.formatedPayeeList = this.allPayeeList;
  }

  /**
   * @methodName getBeneficiaryListInfo
   * @description get list of all beneficiary
   * @parameters void
   * @return void
   */
  getBeneficiaryListInfo(): void {
    const URL = this.sharedService.generateApiUrl(DOMAINS.API_SIT_CONNECT, true, false) + ACCOUNTS_ENDPOINTS.GET_ALL_BENIFICIARY;
    this.transfersPaymentsService.getAccountList(URL).subscribe(response => {
      response = JSON.parse(response);
      this.allBeneficiaryList = (response && response.retailBeneficiary && response.retailBeneficiary.length) ?
        response.retailBeneficiary : undefined;
      if (this.allBeneficiaryList) {
        this.sharedService.allBeneficiaryList = this.allBeneficiaryList;
        this.showViewAllBeneLink = (this.allBeneficiaryList.length > TRANSFER_PAYMENT_CONST.itemLimit) ? true : false;
        this.formatedBeneList = this.showAllBene ? this.allBeneficiaryList :
          this.transfersPaymentsService.getFavoriteList(this.allBeneficiaryList);
      }
    });
  }

  /**
   * @methodName getPayeeListInfo
   * @description get list of all payee
   * @parameters void
   * @return void
   */
  getPayeeListInfo(): void {
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) + PAYEE_ENDPOINTS.UTILITY_BENEFICIARY;
    this.transfersPaymentsService.getAccountList(URL).subscribe(response => {
      response = JSON.parse(response);
      this.sharedService.allUtilityPayeeList = response;
      this.allPayeeList = response.utilityPayeeList.filter(item => item.isInquiryRequired === TRANSFER_PAYMENT_CONST.payeeFilterAttribute);
      this.sharedService.allPayeeList = this.allPayeeList;
      this.showViewAllPayeeLink = (this.allPayeeList.length > TRANSFER_PAYMENT_CONST.itemLimit) ? true : false;
      this.formatedPayeeList = this.showAllPayee ? (this.allPayeeList)
        : (this.transfersPaymentsService.getFavoriteList(this.allPayeeList));
    });
  }

  /**
   * @methodName refreshPayeeList
   * @description to update payee list after successfull deletion
   * @parameters void
   * @return void
   */
  refreshPayeeList(payeeUpdatedStatus: boolean): void {
    if (payeeUpdatedStatus) {
      this.getPayeeListInfo();
    }
  }

  /**
   * @methodName refreshBeneficiaryList
   * @description to update beneficiary list after successfull deletion
   * @parameters void
   * @return void
   */
  refreshBeneficiaryList(beneficiaryUpdatedStatus: boolean): void {
    if (beneficiaryUpdatedStatus) {
      this.getBeneficiaryListInfo();
    }
  }

  /**
   * @methodName changePaymentsView
   * @description used to toggle the payments view
   * @parameters showPaymentsView<boolean>,selectedPayeeObject<PayeeListResponse>,isPayeeSelected<boolean>
   * @return none
   */
  changePaymentsView(showPaymentsView: boolean, selectedPayeeObject?: PayeeListResponse, isPayeeSelected?: boolean): void {
    this.setPaymentsViewInfo(showPaymentsView);
    if (showPaymentsView && isPayeeSelected) {
      this.paymentService.selectedPayeeObj = selectedPayeeObject;
      this.selectedComponentTitle = selectedPayeeObject.nickName;
      this.paymentService.isPayeeSelectedForPayment = true;
      this.paymentService.selectedPaymentType = PAYMENT_TYPES.utilityPayment;
    } else if (showPaymentsView && !isPayeeSelected) {
      this.selectedComponentTitle = PAYMENT_VIEW_MAPPING_OBJ.payBillsText;
      this.showTransferToStep = true;
      this.paymentService.isPayeeSelectedForPayment = false;
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
    this.parentComponentTitle = PAYMENT_VIEW_MAPPING_OBJ.transferAndPayments;
    this.paymentService.selectedPayeeObj = {} as PayeeListResponse;
    this.paymentService.confirmScreenRoutingButtonText = PAYMENT_ROUTING_BUTTONS.transferAndPayments;
  }

  /**
   * @methodName handleQuickLinkEvent
   * @description used to toggle payments view on quicklink selection
   * @parameters selectedQuickLink<MenuOption>
   * @return none
   */
  handleQuickLinkEvent(selectedQuickLink: MenuOption): void {
    this.paymentService.selectedPaymentType = '';
    this.moneyTransferService.selectedBeneficiaryForTransfer = undefined;
    if (selectedQuickLink.actionType === PAYMENT_TYPES.payments) {
      this.changePaymentsView(true, undefined, undefined);
    } else if (selectedQuickLink.actionType === PAYMENT_TYPES.donate) {
      this.handleDonationQuickLink(selectedQuickLink);
    } else if (selectedQuickLink.actionType === TRANSFER_TYPES.moneyTransfer) {
      this.changeMoneyTransferView(true);
    }
  }

  /**
   * @methodName changeMoneyTransferView
   * @description used to toggle money transfer view
   * @parameters showTransferView<boolean>,selectedBeneficiaryObj<>BeneficiaryListResponse>,isBeneficiarySelected<boolean>
   * @return none
   */
  changeMoneyTransferView(showTransferView: boolean, selectedBeneficiaryObj?: BeneficiaryListResponse, isBeneficiarySelected?: boolean)
    : void {
    this.moneyTransferService.confirmScreenRoutingButtonText = PAYMENT_VIEW_MAPPING_OBJ.transferAndPayments;
    this.moneyTransferService.selectedAccForMoneyTransfer = undefined;
    this.showTransferView = showTransferView;
    this.parentComponentTitle = PAYMENT_VIEW_MAPPING_OBJ.transferAndPayments;
    if (showTransferView && isBeneficiarySelected && selectedBeneficiaryObj && selectedBeneficiaryObj.nickName) {
      this.showMoneyTransferToStep = false;
      this.showOrHideCardTabSelection(selectedBeneficiaryObj);
      this.selectedComponentTitle = selectedBeneficiaryObj.nickName;
      this.moneyTransferService.isBeneSelectedForTransfer = true;
    } else if (showTransferView && !isBeneficiarySelected) {
      this.showMoneyTransferToStep = true;
      this.showCardsTabInStepFrom = true;
      this.selectedComponentTitle = TRANSFER_VIEW_MAPPING_OBJ.moneyTransferText;
      this.moneyTransferService.isBeneSelectedForTransfer = false;
    }
  }

  /**
   * @methodName handleDonateQuickLink
   * @description used to set handle if selected quick link is donate
   * @parameters quickLink<QuickLinks>
   * @return none
   */
  handleDonationQuickLink(quickLink: MenuOption): void {
    this.paymentService.selectedPaymentType = quickLink.actionType;
    this.parentComponentTitle = PAYMENT_VIEW_MAPPING_OBJ.transferAndPayments;
    this.selectedComponentTitle = PAYMENT_VIEW_MAPPING_OBJ.donateText;
    this.paymentService.confirmScreenRoutingButtonText = PAYMENT_ROUTING_BUTTONS.transferAndPayments;
    this.showTransferToStep = true;
    this.showPaymentView = true;
  }

  /**
   * @methodName setRestrictWords
   * @parameter none
   * @description Used to set restric words Regx in shared service
   * @return none
   */
  setRestrictWords(): void {
    this.subscription.add(this.transfersPaymentsService.getRestricWordsList().subscribe(response => {
      if (response) {
        response = JSON.parse(response.toString());
        this.sharedService.restrictArray = response.restrictedWordsList;
        this.sharedService.restrictRegex = new RegExp(response.restrictedWordsList.join(REGEX.seprator), REGEX.param);
      }
    }));
  }
  /**
   * @methodName showOrHideCardTabSelection
   * @parameter selectedBeneficiary<BeneficiaryListResponse>
   * @description used to show/hide the card tab selection in transfer from step
   * @return none
   */
  showOrHideCardTabSelection(selectedBeneficiary: BeneficiaryListResponse): void {
    selectedBeneficiary.beneType === INTERNATIONAL_TRANSFER_TEXT.external &&
      selectedBeneficiary.beneBankCountry !== INTERNATIONAL_TRANSFER_TEXT.UAE_COUNTRY ?
      this.showCardsTabInStepFrom = false : this.showCardsTabInStepFrom = true;
  }


  /**
   * @methodName getSelectedLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getSelectedLanguage(): void {
    this.subscription.add(this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLanguage = selectedLanguage;
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
