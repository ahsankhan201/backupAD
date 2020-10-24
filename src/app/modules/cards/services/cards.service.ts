import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { APISyncService } from 'src/app/common/services/sync.service';
import { ChangeCoverCardLimitPayload } from 'src/app/common/models/cards-module.model';
import { CARDS_ENDPOINTS } from 'src/app/common/api-endpoints';
import { DialogService } from 'src/app/common/services/dialog.service';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
import { SharedService } from 'src/app/common/services/shared.service';

import { CARDS_MASTER_DATA, ACTION_ITEMS, CARDS_DIALOG_TEXT } from '../cards-module.constants';
import { DebitCardData, CoverCardData, CardStatusPayload, CoverCardStatementPayload } from 'src/app/common/models/cards-module.model';
import { PromotionCardModel } from 'src/app/common/models/global.model';
import { COVER_CARD_STATUS_API_URL, DEBIT_CARD_STATUS_API_URL } from 'src/app/common/api-endpoints';
import { DOMAINS, SNACK_BAR_STATUS } from 'src/app/common/global-constants';
import { MenuOption } from 'src/app/common/models/menu-option.model';
import { OTPLocation } from 'src/app/common/models/otp.model';


@Injectable({
  providedIn: 'root'
})
export class CardsService {
  selectedDebitCard = {} as DebitCardData;
  selectedCoverCard = {} as CoverCardData;
  selectedNewCard = {} as DebitCardData;
  updateCardList = new Subject<boolean>();
  cardEndPoint: string;
  snackBarMessage: string;

  constructor(
    private syncService: APISyncService,
    private sharedService: SharedService,
    private dialogService: DialogService,
    private httpService: APISyncService,
    private snackBarService: SnackBarService) { }



  /**
   * @methodName getCardAds
   * @description used to fetch the card ads from the server
   * @parameters none
   * @return Observable<PromotionCardModel>
   */
  getCardAds(): Observable<PromotionCardModel> {
    const URL = CARDS_MASTER_DATA.COVER_CARD_JSON;
    return this.syncService.get(URL, 'json');
  }

  /**
   * @methodName setSelectedDebitCard
   * @description used to set the selected debit card
   * @parameters none
   * @return Observable
   */
  setSelectedDebitCard(debitCardData: DebitCardData): void {
    this.selectedDebitCard = debitCardData;
  }

  /**
   * @methodName getSelectedDebitCard
   * @description used to get the selected debit card details
   * @parameters none
   * @return Observable
   */
  getSelectedDebitCard(): DebitCardData {
    return this.selectedDebitCard;
  }

  /**
   * @methodName updateCoverCardLimit
   * @description used to update cover limit API call
   * @parameters coverCardLimitPayload<ChangeCoverCardLimitPayload>
   * @return Observable<any>
   */
  updateCoverCardLimit(coverCardLimitPayload: ChangeCoverCardLimitPayload): Observable<any> {
    const CARD_LIMIT_API = `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, true)}${CARDS_ENDPOINTS.COVER_CARD_LIMIT}`;
    return this.httpService.put(CARD_LIMIT_API, coverCardLimitPayload)
    .pipe(map(res => res.body ? JSON.parse(res.body) : res));
  }
  /**
   * @methodName postDebitCardLinkAccPayLoad
   * @description used to post linking debit card with account payload
   * @parameters url<string>, payLoad<LinkDebitCardAccountPayLoad>
   * @return Observable
   */
  postDebitCardLinkAccPayLoad(url: string, payLoad: any): Observable<any> {
    return this.syncService.put(url, payLoad);
  }
  /**
   * @methodName setSelectedCoverCard
   * @description used to set the selected cover card
   * @parameters none
   * @return Observable
   */
  setSelectedCoverCard(coverCardData: CoverCardData): void {
    this.selectedCoverCard = coverCardData;
  }

  /**
   * @methodName getSelectedCoverCard
   * @description used to get the selected cover card details
   * @parameters none
   * @return Observable
   */
  getSelectedCoverCard(): CoverCardData {
    return this.selectedCoverCard;
  }

  /** @methodName setCardStatus
   * @description send API call to change the status of card
   * @parameter url<string>, payloadObj<CardStatusPayload>
   * @return none
   */
  // Return type to be changed after API integration
  setCardStatus(url: string, payloadObj: CardStatusPayload): void {
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      this.cardEndPoint + url;
    this.syncService.put(URL, payloadObj).subscribe(response => {
      this.reLoadCardList(true);
    });
  }

  /**
   * @methodName reLoadCardList
   * @description reload cards list with updated data
   * @parameters showSnackBar<boolean>
   * @return void
   */
  reLoadCardList(showSnackBar: boolean): void {
    if (showSnackBar) {
      this.snackBarService.showSnackBar({
        showSnackBar: true,
        message: { msgType: SNACK_BAR_STATUS.success, msgText: this.snackBarMessage }
      });
    }
    this.sharedService.setAccontsCardsList().subscribe((response) => {
      if (response) {
        this.sharedService.accountsCardsList = JSON.parse(response.toString());
        this.sharedService.getAllCardsList();
        this.updateCardList.next(true);
      }
    });
  }

  /* @methodName handleCardStatus
   * @description identify which action is clicked from menu or quicklink
   * @parameter statusObject<MenuOption>
   * @return none
   */
  handleCardStatus(statusObject: MenuOption): void {
    this.cardEndPoint = statusObject.actionItem.hasOwnProperty(CARDS_MASTER_DATA.PRIMARY_ACCOUNT_KEY) ? DEBIT_CARD_STATUS_API_URL
      : COVER_CARD_STATUS_API_URL;
    this.updateCardList.next(false);
    if (statusObject.actionType === ACTION_ITEMS.freeze || statusObject.actionType === ACTION_ITEMS.unFreeze) {
      this.handleFreezeStatus(statusObject);
    }
    if (statusObject.actionType === ACTION_ITEMS.block) {
      this.handleBlockStatus(statusObject);
    }
  }

  /* @methodName handleFreezeStatus
   * @description perform freeze/unfreeze status change
   * @parameter freezeObject<MenuOption>
   * @return none
   */
  handleFreezeStatus(freezeObject: MenuOption): void {
    const OPTIONS = {
      title: freezeObject.actionType === ACTION_ITEMS.freeze ? CARDS_DIALOG_TEXT.freezeTitle : CARDS_DIALOG_TEXT.unFreezeTitle,
      message: freezeObject.actionType === ACTION_ITEMS.freeze ? CARDS_DIALOG_TEXT.freezeMessage : CARDS_DIALOG_TEXT.unFreezeMessage,
      cancelText: CARDS_DIALOG_TEXT.freezeCancelText,
      confirmText: CARDS_DIALOG_TEXT.freezeConfirmText,
      freezeCard: true,
      cardName: freezeObject.actionItem.hasOwnProperty(CARDS_MASTER_DATA.CARD_HOLDER_NAME_KEY) ? freezeObject.actionItem.cardHolderName
        : freezeObject.actionItem.productDescription,
      cardNumber: freezeObject.actionItem.cardNumber
    };
    this.dialogService.open(OPTIONS);
    this.dialogService.confirmed().subscribe((res) => {
      if (res) {
        const payload = { cardNumber: freezeObject.actionItem.cardNumber };
        this.snackBarMessage = freezeObject.actionType === ACTION_ITEMS.freeze ? CARDS_DIALOG_TEXT.freezeSuccessMessage :
          CARDS_DIALOG_TEXT.unFreezeSuccessMessage;
        this.setCardStatus(this.getStatus(freezeObject), payload);
      }
    });
  }

  /* @methodName handleBlockStatus
   * @description perform block/unBlock status change
   * @parameter handleBlockStatus<MenuOption>
   * @return none
   */
  handleBlockStatus(blockObject: MenuOption): void {
    const OPTIONS = {
      title: CARDS_DIALOG_TEXT.blockTitle,
      message: CARDS_DIALOG_TEXT.blockMessage,
      cancelText: CARDS_DIALOG_TEXT.blockCancelText,
      confirmText: CARDS_DIALOG_TEXT.blockConfirmText,
      freezeCard: true,
      cardName: blockObject.actionItem.hasOwnProperty(CARDS_MASTER_DATA.CARD_HOLDER_NAME_KEY) ? blockObject.actionItem.cardHolderName
        : blockObject.actionItem.productDescription,
      cardNumber: blockObject.actionItem.cardNumber
    };
    this.dialogService.open(OPTIONS);
    this.dialogService.confirmed().subscribe((res) => {
      if (res) {
        const payload = { cardNumber: blockObject.actionItem.cardNumber };
        this.snackBarMessage = CARDS_DIALOG_TEXT.blockSuccessMessage;
        this.setCardStatus(CARDS_MASTER_DATA.BLOCK_CARD_STATUS, payload);
      }
    });
  }

  /* @methodName getStatus
   * @description return the alternate status
   * @parameter card<MenuOption>
   * @return string
   */
  getStatus(card: MenuOption): string {
    let cardStatus;
    if (card.actionType === ACTION_ITEMS.freeze || card.actionType === ACTION_ITEMS.unFreeze) {
      cardStatus = card.actionItem.cardStatus === CARDS_MASTER_DATA.FREEZE_CARD_STATUS ||
        card.actionItem.cardStatus === CARDS_MASTER_DATA.FREZ_CARD_STATUS ?
        CARDS_MASTER_DATA.UN_FREEZE_CARD_STATUS : CARDS_MASTER_DATA.FREEZE_CARD_STATUS;
    }
    return cardStatus;
  }

  /**
   * @methodName generateCardStatement
   * @description used to generate card statement
   * @parameter url<string> payload<CoverCardStatementPayload>
   * @return Observable<CoverCardStatementPayload>
   */
  generateCardStatement(url: string, payloadObj: CoverCardStatementPayload): Observable<any> {
    return this.syncService.post(url, payloadObj, 'blob');
  }

  /**
   * @methodName fetchOTPLocation
   * @description used to fetch the otp loacation details
   * @parameter url payload
   * @return Observable
   */
  fetchOTPLocation(url: string, payloadObj): Observable<OTPLocation> {
    return this.syncService.put(url, payloadObj);
  }

}
