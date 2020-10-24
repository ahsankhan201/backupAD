import {
  Component, ViewChild, ElementRef, ChangeDetectorRef, Optional,
  EventEmitter, Output, Input, OnDestroy, AfterViewChecked, SimpleChanges, OnChanges, OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

// include services
import { TransfersPaymentsService } from '../../services/transfers-payments.service';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
import { DialogService } from 'src/app/common/services/dialog.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { MoneyTransferService } from 'src/app/common/services/money-transfer/money-transfer.service';

// Include components, directives and pipes
import { FilterTextPipe } from 'src/app/common/pipes/filter-text/filter-text.pipe';

// include constants and models
import {
  TRANSFER_PAYMENT_CONST, ICON, HEADER_INFO, SLASH, DOMAINS, TRANSFER_PAYMENT_MENU_OPTIONS,
  PATTERN_ALPHA_NUMERIC, TRANSFER_TYPES, ACCOUNT_TYPES, ARABIC_LANG_TEXT,
} from '../../../../common/global-constants';
import { ROUTING_URLS, ACCOUNTS_ENDPOINTS, PAYEE_ENDPOINTS, BENEFICIARY_ENDPOINTS } from 'src/app/common/api-endpoints';
import {
  DELETE_BENEFICIARY_DIALOG_DATA, DELETE_BENEFICIARY_SUCCESS_MESSAGE,
  BENEFICIARY_FAVORITE_MESSAGE
} from '../../transfers-payments-module.constants';
import { BeneficiaryListResponse } from '../../../../common/models/beneficiary.model';
import { MenuOption } from '../../../../common/models/menu-option.model';

@Component({
  selector: 'app-beneficiary-list',
  templateUrl: './beneficiary-list.component.html',
  styleUrls: ['./beneficiary-list.component.scss']
})
export class BenificiaryListComponent implements OnInit, AfterViewChecked, OnDestroy, OnChanges {
  subscription = new Subscription();
  @ViewChild(TRANSFER_PAYMENT_CONST.beneScrollContainer, { static: true }) beneScrollContainer: ElementRef;
  @Output() allBeneficiary = new EventEmitter<boolean>();
  @Input() formatedBeneList: BeneficiaryListResponse[];
  @Input() showAll: boolean;
  @Input() showViewAllLink: boolean;
  @Output() refreshBeneficiary: EventEmitter<boolean> = new EventEmitter();
  @Output() showMoneyTransferView: EventEmitter<BeneficiaryListResponse> = new EventEmitter();

  pattenAlfaNumeric = PATTERN_ALPHA_NUMERIC;
  menuSelectedBeneID: string;
  menuOptions = TRANSFER_PAYMENT_MENU_OPTIONS;
  selectedBeneficiary: BeneficiaryListResponse;
  disableNextBtn: boolean;
  disablePreviousBtn: boolean;
  hideBeneNavigationControlls: boolean;
  searchText: string;
  benefeciaryListObj: BeneficiaryListResponse[];
  benefiaciaryRoutingURL = ROUTING_URLS.BENEFICIARY;
  readonly scrollMoveWidth = HEADER_INFO.scrollMove;
  labelConst = TRANSFER_PAYMENT_CONST;
  iconsConst = ICON;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  accountTypes = ACCOUNT_TYPES;
  constructor(
    @Optional() private changeDetector: ChangeDetectorRef,
    private transfersPaymentsService: TransfersPaymentsService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private sharedService: SharedService,
    private filterTextPipe: FilterTextPipe,
    private moneyTransferservice: MoneyTransferService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.getSelectedLanguage();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.formatedBeneList && changes.formatedBeneList.currentValue) {
      this.benefeciaryListObj = changes.formatedBeneList.currentValue;
    }
  }


  ngAfterViewChecked() {
    this.handleNavControll();
  }

  /**
   * @methodName menuClickHandler
   * @description get the clicked object with action type
   * @parameters item
   * @return void
   */
  menuClickHandler(item: MenuOption): void {
    if (item.actionType === TRANSFER_PAYMENT_CONST.delete) {
      this.deleteBeneficiary(item.actionItem);
    }
  }

  /**
   * @methodName handleNavControll
   * @description used to show or hide the navigation controls on change
   * @parameters changes
   * @return void
   */
  handleNavControll(): void {
    this.showOrHideNavControlls();
    this.changeDetector.detectChanges();

  }

  /**
   * @methodName showOrHideNavControlls
   * @description used to show or hide the navigation controls on load
   * @parameters none
   * @return void
   */
  showOrHideNavControlls(): void {
    if (this.formatedBeneList &&
      this.beneScrollContainer.nativeElement.offsetWidth !== this.beneScrollContainer.nativeElement.scrollWidth) {
      this.hideBeneNavigationControlls = true;
    }
  }
  /**
   * @methodName moveScroll
   * @description used to for disable or enable the navigation controlls on user scroll
   * @parameters directon<string>
   * @return void
   */
  moveScroll(direction: string): void {
    if (direction) {
      const scrollElement = this.beneScrollContainer.nativeElement;
      this.disableNextBtn = false;
      this.disablePreviousBtn = false;
      direction ? direction === TRANSFER_PAYMENT_CONST.scrollDirectionForward ? scrollElement.scrollLeft += this.scrollMoveWidth :
        scrollElement.scrollLeft -= this.scrollMoveWidth : direction = undefined;
      if (this.beneScrollContainer.nativeElement.scrollLeft === 0) {
        this.disablePreviousBtn = true;
      }
      if (Number(scrollElement.scrollWidth - this.beneScrollContainer.nativeElement.offsetWidth) === Number(scrollElement.scrollLeft)) {
        this.disableNextBtn = true;
      }
      this.beneScrollContainer.nativeElement.scrollIntoView({ behavior: TRANSFER_PAYMENT_CONST.srollDirectionSmooth });
    }
  }

  /**
   * @methodName markFavorite
   * @description update favorite by calling API
   * @parameters status, id
   * @return void
   */
  markFavorite(status: string, beneId: string): void {
    const URL = this.sharedService.generateApiUrl(DOMAINS.API_SIT_CONNECT, true, false) + ACCOUNTS_ENDPOINTS.GET_ALL_BENIFICIARY +
      SLASH + beneId + ACCOUNTS_ENDPOINTS.MARK_AS_FAV;
    const data = { isFavourite: this.transfersPaymentsService.changeFavorite(status) };
    this.transfersPaymentsService
      .updateBeneficiaryAsFav(URL, data)
      .subscribe(response => {
        this.updateFavorite();
      });
  }

  /**
   * @methodName updateFavorite
   * @description update favorite value in existing object and update the view
   * @parameters none
   * @return none
   */
  updateFavorite(): void {
    this.refreshBeneficiary.emit(true);
    const SUCCESS_MESSAGE = `${BENEFICIARY_FAVORITE_MESSAGE.favorite}`;
    this.snackBarService.showSnackBar({ showSnackBar: true, message: { msgText: SUCCESS_MESSAGE } });
  }

  /**
   * @methodName showAllBeneficiary
   * @description emit the event for parent component
   * @parameters none
   * @return void
   */
  showAllBeneficiary(): void {
    this.showAll = true;
    this.allBeneficiary.emit(this.showAll);
  }

  /**
   * @methodName onContextMenu
   * @description open context menu on click of setting icon
   * @parameters event: MouseEvent, beneficiary: string
   * @return void
   */
  onContextMenu(event: MouseEvent, beneficiary: BeneficiaryListResponse): void {
    event.preventDefault();
    this.selectedBeneficiary = beneficiary;
  }

  /**
   * @methodName onContextMenuAction
   * @description perform edit/delete action
   * @parameters type: string
   * @return type: string
   */
  onContextMenuAction(type: string): string {
    return type;
  }

  /**
   * @methodName deleteBeneficiary
   * @description to show delete confirmation box and delete beneficiary
   * @parameters none
   * @return none
   */
  deleteBeneficiary(benefeciary: BeneficiaryListResponse): void {
    if (benefeciary) {
      const url = this.sharedService.generateApiUrl(DOMAINS.API_SIT_CONNECT, true, false)
      + BENEFICIARY_ENDPOINTS.ACCOUNTS_BENEFICIARY + SLASH + benefeciary.beneID;
      const OPTIONS = DELETE_BENEFICIARY_DIALOG_DATA;
      this.dialogService.open(OPTIONS);
      this.dialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {
          this.subscription.add( this.transfersPaymentsService.deleteUtility(url).subscribe(res => {
                this.refreshBeneficiary.emit(true);
                this.searchText = '';
                const successMessage = `${DELETE_BENEFICIARY_SUCCESS_MESSAGE.prefix} “${benefeciary.nickName}”
                  ${DELETE_BENEFICIARY_SUCCESS_MESSAGE.suffix}`;
                this.snackBarService.showSnackBar({ showSnackBar: true, message: { msgText: successMessage }
                });
              })
          );
        }
      });
    }
  }

  /**
   * @methodName onSearchChange
   * @description used to filter the beneficiary from the beneficiary list
   * @parameters searchText<string>
   * @return none
   */
  onSearchChange(searchText: string): void {
    this.formatedBeneList = this.filterTextPipe.transform(this.benefeciaryListObj, searchText, this.labelConst.nickName);
  }

  /**
   * @methodName moveToMoneyTransferView
   * @description used to toggle the money transfer view on selection of beneficiary
   * @parameters beneficiaryObj<BeneficiaryListResponse>
   * @return void
   */
  moveToMoneyTransferView(beneficiaryObj: BeneficiaryListResponse): void {
    this.moneyTransferservice.selectedBeneficiaryForTransfer = beneficiaryObj;
    this.moneyTransferservice.selectedTransferType = TRANSFER_TYPES.transferToBeneficiary;
    this.showMoneyTransferView.emit(beneficiaryObj);
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
    this.subscription.unsubscribe();
  }
}
