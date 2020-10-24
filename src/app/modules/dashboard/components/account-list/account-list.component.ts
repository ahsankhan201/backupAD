import {
  Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef,
  Optional, Output, EventEmitter, OnDestroy
} from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';

// Include Services here
import { AccountlistService } from '../../services/accountlist.service';
import { SharedService } from 'src/app/common/services/shared.service';

// Include constants and models here
import { ICON, ACCOUNT_ALLOWED_TYPE_LIST, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { ACCOUNTS_MASTER_DATA } from '../../dashboard-module.constants';
import { AccountsList, PromotionCardModel } from 'src/app/common/models/global.model';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit, OnDestroy {

  @ViewChild('scrollContainer', { static: true }) scrollContainer: ElementRef;
  @Output() showDetail = new EventEmitter<string>();
  @Output() openAccount = new EventEmitter<boolean>(false);
  disableNextBtn: boolean;
  disablePreviousBtn: boolean;
  hideNavigationControlls: boolean;
  accountList: AccountsList[];
  coverCardInfo = {} as PromotionCardModel;
  completeCardsList: any;
  iconsConst = ICON;
  readonly ACCOUNTS_MASTER_DATA = ACCOUNTS_MASTER_DATA;
  accountTypeList = ACCOUNT_ALLOWED_TYPE_LIST;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  subscription$ = new Subscription();
  balanceAvailableMaxLength: string;
  constructor(
    @Optional() private changeDetector: ChangeDetectorRef,
    private accountListService: AccountlistService,
    private sharedService: SharedService) {
  }

  ngOnInit() {
    this.getAccountListInfo();
    this.getSelectedLanguage();
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
      this.disableNextBtn = this.selectedLanguage === ARABIC_LANG_TEXT ? true : false;
      this.disablePreviousBtn = this.selectedLanguage === ARABIC_LANG_TEXT ? false : true;
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
    direction ? direction === this.ACCOUNTS_MASTER_DATA.FORWARD ? scrollElement.scrollLeft += this.ACCOUNTS_MASTER_DATA.SCROLL_MOVE_WIDTH :
      scrollElement.scrollLeft -= this.ACCOUNTS_MASTER_DATA.SCROLL_MOVE_WIDTH : direction = undefined;
    if (this.scrollContainer.nativeElement.scrollLeft === 0) {
      this.disablePreviousBtn = this.selectedLanguage === ARABIC_LANG_TEXT ? false : true;
    }
    if (Number(scrollElement.scrollWidth - this.scrollContainer.nativeElement.offsetWidth) === Number(scrollElement.scrollLeft)) {
      this.disableNextBtn = this.selectedLanguage === ARABIC_LANG_TEXT ? false : true;
    }
    this.scrollContainer.nativeElement.scrollIntoView({ behavior: this.ACCOUNTS_MASTER_DATA.SMOOTH });
  }

  /**
   * @methodName getAccountListInfo
   * @description used to fecth the account list from server
   * @parameters none
   * @return none
   */
  getAccountListInfo(): void {
    const ACCOUNTS_LIST_API = this.sharedService.setAccontsCardsList();
    const COVERCARD_API = this.accountListService.getJsonList(this.ACCOUNTS_MASTER_DATA.COVER_CARD_JSON);
    // Combining Two API Calls
    forkJoin(ACCOUNTS_LIST_API, COVERCARD_API).subscribe((response) => {
      if (response) {
        this.sharedService.accountsCardsList = JSON.parse(response[0].toString());
        this.sharedService.getAllCardsList();
        this.accountList = this.sharedService.clone(this.sharedService.accountsCardsList.accountsList);
        this.accountList = this.sharedService.getSelectedAccountTypeList(this.accountList);
        const accountMaxValue = Math.max.apply(Math, this.accountList.map(account => account['balanceAvailable']));
        this.balanceAvailableMaxLength = accountMaxValue.toString(); // used to get the length of max acc value and to change font size
        this.hideNavigationControlls = (this.accountList) ? false : true;
        this.coverCardInfo = response[1];
        this.completeCardsList = this.accountListService.addCoverCardToAccountList(this.accountList, this.coverCardInfo);
        setTimeout(() => {
          this.showOrHideNavControlls();
          this.changeDetector.detectChanges();
        }, 0);
      }
    });
  }

  /**
   * @methodName getAccountTypeDesc
   * @description used to substract the account type from accountDesc property
   * @parameters none
   * @return none
   */
  getAccountTypeDesc(typeOfAccount: string): string {
    return typeOfAccount && typeOfAccount.indexOf('-') > -1 ? typeOfAccount.split('-')[1] ? typeOfAccount.split('-')[1].trim() : '' : '';
  }

  /**
   * @methodName getDetails
   * @description used to substract the account type from accountDesc property
   * @parameters account number<string>
   * @return none
   */
  getDetails(accountItem: AccountsList): void {
    accountItem.swiftCode = this.sharedService.accountsCardsList.swiftCode;
    this.accountListService.accountDetailData = accountItem;
    this.showDetail.emit();
  }

  /**
   * @methodName handleOpenAccountButton
   * @description used to emit event true when user click open account button
   * @parameters none
   * @return none
   */
  handleOpenAccountButton(): void {
    this.openAccount.emit(true);
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
