import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { SharedService } from 'src/app/common/services/shared.service';
import { FinanceService } from '../../services/finance.service';
import { ICON, UNDERSCORE_TEXT, ACCOUNT_ALLOWED_STATUS_LIST, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import {
  FINANCE_LABELS_TEXT, FINANCE_PROMOTION_IMAGE, HORIZONTAL_LINE_CSS_CLASS,
  HORIZONTAL_LINE_FINANCE_DETAILS_CSS_CLASS,
  HORIZONTAL_LINE_FINANCE_LIST_CSS_CLASS
} from '../../finance-module.constants';
import { FINANCE_COMPONENT_TRANSLATION_TEXT } from '../../finance-module.language.translation';
import { FinancePromotionAd, FinanceData, FinanceDetailsPayload, CustomerDetailsPayload } from 'src/app/common/models/finance-module.model';

@Component({
  selector: 'app-finance-list',
  templateUrl: './finance-list.component.html',
  styleUrls: ['./finance-list.component.scss']
})
export class FinanceListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer', { static: true }) scrollContainer: ElementRef;
  @Output() financeSelectionStatus = new EventEmitter<boolean>(false);
  subscription$ = new Subscription();
  disableNextBtn: boolean;
  disablePreviousBtn: boolean;
  hideNavigationControlls: boolean;
  showNoFinanceMessage = false;
  financeList: FinanceData[];
  financePromotion = {} as FinancePromotionAd;
  iconsConst = ICON;
  accountHolderName: string;
  financePromotionImage = FINANCE_PROMOTION_IMAGE;
  selectedAccount: string;
  selectedComponent = FINANCE_LABELS_TEXT.financeLists;
  translationText = FINANCE_COMPONENT_TRANSLATION_TEXT;
  consumerNumber: number;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private sharedService: SharedService,
    private changeDetector: ChangeDetectorRef,
    private financeService: FinanceService) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.showNoFinanceMessage = false;
    this.getFinanceList();
    this.getFinancePromotion();
  }

  ngAfterViewInit() {
    this.updateHorizontalLineStyle();
  }
  /**
   * @methodName updateHorizontalLineStyle
   * @description used to update horizontal line CSS
   * @parameters none
   * @return none
   */
  updateHorizontalLineStyle(): void {
    this.sharedService.setHorizontalLineClass(HORIZONTAL_LINE_FINANCE_LIST_CSS_CLASS);
  }
  /**
   * @methodName getFinancePromotion
   * @description used to fetch finance ads from server
   * @parameters none
   * @return none
   */
  getFinancePromotion(): void {
    this.subscription$.add(this.financeService.getFinancePromotion().subscribe(response => {
      this.financePromotion = response;
    }));
  }
  /**
   * @methodName getFinanceList
   * @description used to subscribing finance list
   * getAccountList will fetch all accounts from server
   * getCustomerDetails will fetch customer details from server
   * @parameters none
   * @return none
   */
  getFinanceList(): void {
    if (this.sharedService.accountsCardsList) {
      const ACCOUNT_CARD_LIST = this.sharedService.accountsCardsList.accountsList;
      const FINANCE_ACCOUNT: FinanceData[] = ACCOUNT_CARD_LIST.filter(account => (account.accountType === FINANCE_LABELS_TEXT.RFF
        && ACCOUNT_ALLOWED_STATUS_LIST.includes(account.status)));
      if (FINANCE_ACCOUNT.length > 0) {
        this.setCustomerDetails();
        this.setFinanceData(FINANCE_ACCOUNT);
      } else {
        this.showNoFinanceMessage = true;
      }
    }
  }

  /**
   * @methodName setFinanceData
   * @description used to set finance data from server api calls
   * account service used to fetch all finance acount
   * party finance list
   * @parameters responseData result from getFinanceList includes account list
   * @return none
   */
  setFinanceData(responseData: FinanceData[]): void {
    if (responseData) {
      this.financeList = [];
      const ACCOUNTS_RESPONSE = responseData;

      ACCOUNTS_RESPONSE.forEach((finance) => {
        const FINANCE_DATA = {} as FinanceData;
        this.setFinanceDetails(finance, FINANCE_DATA);
        this.financeList.push(FINANCE_DATA);
      });

    }
    this.changeDetector.detectChanges();
    this.showOrHideNavControlls();
  }
  /**
   * @methodName setCustomerDetails
   * @description used to set finance details from server
   * @parameters accountListResponse<FinanceData>
   * @return none
   */

  setCustomerDetails(): void {
        this.accountHolderName = this.sharedService.customerDetail.nameLatin.firstName +
        ' ' + this.sharedService.customerDetail.nameLatin.lastName;
  }
  /**
   * @methodName setFinanceDetails
   * @description used to set finance details from server
   * @parameters financeObj<FinanceData>, FINANCE_DATA<FinanceData>
   * @return none
   */
  setFinanceDetails(financeObj: FinanceData, financeDetailsData: FinanceData): void {
    if (financeObj && financeDetailsData) {
      // handling response of getAccountList
      financeDetailsData.accountNumber = financeObj.accountNumber;
      financeDetailsData.accountType = financeObj.accountType;
      financeDetailsData.classCode = financeObj.classCode;
      financeDetailsData.classDesc = financeObj.classDesc;
      financeDetailsData.currencyCode = financeObj.currencyCode;
      financeDetailsData.aliasId = financeObj.aliasId;
      const FINANCE_DETAILS_PAYLOAD: FinanceDetailsPayload = { aliasId: financeObj.aliasId };
      // handling response of getFinanceDetails
      this.subscription$.add(this.financeService.getFinanceDetails(FINANCE_DETAILS_PAYLOAD).subscribe(financeDetailsResponse => {
        if (financeDetailsResponse) {
          financeDetailsData.outstandingBalance = financeDetailsResponse.outstandingBalance;
          financeDetailsData.agreementNumber = financeDetailsResponse.agreementNumber;
          financeDetailsData.dateMaturity = financeDetailsResponse.dateMaturity;
          financeDetailsData.murabhaAmount = financeDetailsResponse.murabhaAmount;
          financeDetailsData.installmentAmount = (financeDetailsResponse.installmentAmount) ?
            financeDetailsResponse.installmentAmount.nextPaymentAmount : undefined;
          financeDetailsData.referenceNum = financeDetailsResponse.referenceNum;
        }
      }));
    }
  }
  /**
   * @methodName moveScroll
   * @description used to for disable or enable the navigation controlls on user scroll
   * @parameters directon<string>
   * @return none
   */
  moveScroll(direction: string): void {
    const scrollElement = this.scrollContainer.nativeElement;
    this.disableNextBtn = false;
    this.disablePreviousBtn = false;
    direction ? direction === 'forward' ? scrollElement.scrollLeft += 140 :
      scrollElement.scrollLeft -= 140 : direction = undefined;
    if (this.scrollContainer.nativeElement.scrollLeft === 0) {
      this.disablePreviousBtn = true;
    }
    if (Number(scrollElement.scrollWidth - this.scrollContainer.nativeElement.offsetWidth) === Number(scrollElement.scrollLeft)) {
      this.disableNextBtn = true;
    }
    this.scrollContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * @methodName showOrHideNavControlls
   * @description used to show or hide the navigation controls on load
   * @parameters none
   * @return none
   */
  showOrHideNavControlls(): void {
    if (this.scrollContainer.nativeElement.offsetWidth !== this.scrollContainer.nativeElement.scrollWidth) {
      this.hideNavigationControlls = true;
      this.disableNextBtn = false;
      this.disablePreviousBtn = true;
    }
  }

  /**
   * @methodName viewFinanceDetails
   * @description used to load finance details
   * @parameters finance
   * @return none
   */
  viewFinanceDetails(finance: FinanceData): void {
    this.financeService.setSelectedFinanceAccount(finance);
    this.financeSelectionStatus.emit(true);
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
    this.subscription$.unsubscribe();
  }
}
