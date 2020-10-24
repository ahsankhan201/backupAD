import {
  Component, ViewChild, Input, Output, EventEmitter, ElementRef,
  ChangeDetectorRef, Optional, OnDestroy, OnChanges, SimpleChanges, AfterViewChecked, OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

// include services
import { TransfersPaymentsService } from '../../services/transfers-payments.service';
import { DialogService } from './../../../../common/services/dialog.service';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
import { SharedService } from 'src/app/common/services/shared.service';

// include components, directives and pipes
import { FilterTextPipe } from 'src/app/common/pipes/filter-text/filter-text.pipe';

// include constants and models
import {
  ICON, HEADER_INFO, SLASH, TRANSFER_PAYMENT_CONST, DOMAINS,
  PATTERN_ALPHA_NUMERIC,
  ARABIC_LANG_TEXT, PAYEE_MENU_OPTIONS
} from '../../../../common/global-constants';
import { ROUTING_URLS, PAYEE_ENDPOINTS } from '../../../../common/api-endpoints';

import {
  DELETE_PAYEE_DIALOG_DATA, DELETE_PAYEE_SUCCESS_MESSAGE,
  EDIT_PAYEE_SUCCESS_SNACKBAR, PAYEE_FAVORITE_MESSAGE
} from '../../transfers-payments-module.constants';
import { EDIT_PAYEE_DIALOG } from '../../transfers-payments-module.constants';
import { PayeeListResponse, EditPayeePayload } from '../../../../common/models/payee.model';
import { MenuOption } from '../../../../common/models/menu-option.model';

@Component({
  selector: 'app-payee-list',
  templateUrl: './payee-list.component.html',
  styleUrls: ['./payee-list.component.scss']
})
export class PayeeListComponent implements OnInit, OnDestroy, AfterViewChecked, OnChanges {

  subscription = new Subscription();
  @ViewChild(TRANSFER_PAYMENT_CONST.payeeScrollContainer, { static: true }) payeeScrollContainer: ElementRef;
  @Input() formatedPayeeList: PayeeListResponse[];
  @Input() showAll: boolean;
  @Output() allPayee = new EventEmitter<boolean>();
  @Input() showViewAllLink: boolean;
  @Output() refreshPayee: EventEmitter<boolean> = new EventEmitter(false);
  @Output() showPaymentView = new EventEmitter();
  pattenAlfaNumeric = PATTERN_ALPHA_NUMERIC;

  menuSelectedBeneID: string;
  disableNextBtn: boolean;
  disablePreviousBtn: boolean;
  hideNavigationControlls: boolean;
  payeeListResponse: PayeeListResponse[];
  searchText: string;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  readonly payeeRoutingURL = ROUTING_URLS.PAYEE;
  readonly scrollMoveWidth = HEADER_INFO.scrollMove;
  readonly payeeTranslateText = TRANSFER_PAYMENT_CONST;
  readonly editPayeeDialogText = EDIT_PAYEE_DIALOG;
  readonly menuOptions = PAYEE_MENU_OPTIONS;
  readonly labelConst = TRANSFER_PAYMENT_CONST;
  readonly iconsConst = ICON;

  constructor(
    @Optional() private changeDetector: ChangeDetectorRef,
    private transfersPaymentsService: TransfersPaymentsService,
    private sharedService: SharedService,
    public dialogService: DialogService,
    public snackBarService: SnackBarService,
    private filterTextPipe: FilterTextPipe,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.getSelectedLanguage();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.formatedPayeeList && changes.formatedPayeeList.currentValue) {
      this.payeeListResponse = changes.formatedPayeeList.currentValue;
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
      this.deletePayee(item.actionItem);
    } else if (item.actionType === TRANSFER_PAYMENT_CONST.edit) {
      this.editPayee(item.actionItem);
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
    if (this.payeeScrollContainer.nativeElement.offsetWidth !== this.payeeScrollContainer.nativeElement.scrollWidth) {
      this.hideNavigationControlls = true;
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
      const scrollElement = this.payeeScrollContainer.nativeElement;
      this.disableNextBtn = false;
      this.disablePreviousBtn = false;
      direction ? direction === 'forward' ? scrollElement.scrollLeft += this.scrollMoveWidth :
        scrollElement.scrollLeft -= this.scrollMoveWidth : direction = undefined;
      if (this.payeeScrollContainer.nativeElement.scrollLeft === 0) {
        this.disablePreviousBtn = true;
      }
      if (Number(scrollElement.scrollWidth - this.payeeScrollContainer.nativeElement.offsetWidth) === Number(scrollElement.scrollLeft)) {
        this.disableNextBtn = true;
      }
      this.payeeScrollContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * @methodName markFavoriteSyncCall
   * @description update favorite by calling API
   * @parameters status, id
   * @return void
   */
  markFavorite(status: string, beneId: string): void {
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + PAYEE_ENDPOINTS.UTILITY_BENEFICIARY + SLASH + beneId + PAYEE_ENDPOINTS.MARK_AS_FAV;
    this.transfersPaymentsService.updateBeneficiaryAsFav(URL, { isFavourite: this.transfersPaymentsService.changeFavorite(status) })
      .subscribe(response => {
        this.updateFavorite();
      });
  }

  /**
   * @methodName updateFavorite
   * @description update favorite value in existing object and update the view
   * @parameters none
   * @return void
   */
  updateFavorite(): void {
    this.refreshPayee.emit(true);
    const SUCCESS_MESSAGE = `${PAYEE_FAVORITE_MESSAGE.favorite}`;
    this.snackBarService.showSnackBar({ showSnackBar: true, message: { msgText: SUCCESS_MESSAGE } });
  }

  /**
   * @methodName showAllPayee
   * @description emit the event for parent component
   * @parameters void
   * @return void
   */
  showAllPayee(): void {
    this.showAll = true;
    this.allPayee.emit(this.showAll);
  }


  /**
   * @methodName onContextMenu
   * @description open context menu on click of setting icon
   * @parameters event: MouseEvent, beneID: string
   * @return void
   */
  onContextMenu(event: MouseEvent, beneID: string): void {
    event.preventDefault();
    this.menuSelectedBeneID = beneID;
  }

  /**
   * @methodName deletePayee
   * @description to show delete payee confirmation box and delete payee
   * @param payee<PayeeListResponse>
   * @return none
   */
  deletePayee(payee: PayeeListResponse): void {

    const OPTIONS = DELETE_PAYEE_DIALOG_DATA;
    this.dialogService.open(OPTIONS);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
          + PAYEE_ENDPOINTS.UTILITY_BENEFICIARY + SLASH + payee.customerPayeeID;
        this.subscription.add(this.transfersPaymentsService.deleteUtility(URL).subscribe(res => {
          this.refreshPayee.emit(true);
          this.searchText = '';
          const SUCCESS_MESSAGE = `${DELETE_PAYEE_SUCCESS_MESSAGE.prefix} “${payee.nickName}” ${DELETE_PAYEE_SUCCESS_MESSAGE.suffix}`;
          this.snackBarService.showSnackBar({ showSnackBar: true, message: { msgText: SUCCESS_MESSAGE } });
        }));
      }
    });
  }

  /* @methodName editPayee
  * @description open dialog box on click of edit to edit payee nickname
  * @parameters payeeObject<PayeeListResponse>
  * @return none
  */
  editPayee(payeeObject: PayeeListResponse): void {
    const OPTIONS = {
      title: this.editPayeeDialogText.title,
      message: this.editPayeeDialogText.message,
      cancelText: this.editPayeeDialogText.cancelText,
      confirmText: this.editPayeeDialogText.confirmText,
      showForm: true,
      formData: { nickname: payeeObject.nickName },
    };
    this.dialogService.open(OPTIONS);
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      PAYEE_ENDPOINTS.UTILITY_BENEFICIARY + SLASH + payeeObject.customerPayeeID;
    this.dialogService.confirmed().subscribe((editPayeePayload: EditPayeePayload) => {
      if (editPayeePayload) {
        this.transfersPaymentsService.editPayeeNickName(URL, editPayeePayload).subscribe(response => {
          const SUCCESS_MESSAGE = `${EDIT_PAYEE_SUCCESS_SNACKBAR.message}`;
          this.snackBarService.showSnackBar({ showSnackBar: true, message: { msgText: SUCCESS_MESSAGE } });
          payeeObject.nickName = editPayeePayload.nickName;
          this.refreshPayee.emit(true);
          this.searchText = '';
        });
      }
    });
  }

  /**
   * @methodName onSearchChange
   * @description used to filter the beneficiary from the beneficiary list
   * @parameters searchText<string>
   * @return none
   */
  onSearchChange(searchText: string): void {
    this.formatedPayeeList = this.filterTextPipe.transform(this.payeeListResponse, searchText, this.labelConst.nickName);
  }
  /**
   * @methodName moveToPaymentView
   * @description used to toggle the payment view on selection of payee
   * @parameters payeeObj<PayeeListResponse>
   * @return void
   */
  moveToPaymentView(payeeObj: PayeeListResponse): void {
    this.showPaymentView.emit(payeeObj);
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
