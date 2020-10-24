import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, Optional, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CardsService } from '../../services/cards.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { CARDS_MASTER_DATA, DEBIT_CARD_MENU_OPTIONS, COVER_CARD_MENU_OPTIONS, ACTION_ITEMS } from '../../cards-module.constants';
import { ICON, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { DebitCardData, CoverCardData } from 'src/app/common/models/cards-module.model';
import { PromotionCardModel, DebitCardsListResponse, CoverCardsListResponse } from 'src/app/common/models/global.model';
import { MenuOptionItem, MenuOption } from 'src/app/common/models/menu-option.model';

@Component({
  selector: 'app-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss']
})
export class CardsListComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  readonly CARDS_MASTER_DATA = CARDS_MASTER_DATA;
  readonly debitCardMenuOptions: MenuOptionItem[] = DEBIT_CARD_MENU_OPTIONS;
  readonly coverCardMenuOptions: MenuOptionItem[] = COVER_CARD_MENU_OPTIONS;
  @Output() cardSelectionStatus = new EventEmitter();
  @ViewChild('scrollContainer', { static: true }) scrollContainer: ElementRef;
  disableNextBtn: boolean;
  disablePreviousBtn: boolean;
  hideNavigationControls: boolean;
  iconsConst = ICON;
  showNoCardsMessage = false;
  promotionalCard = {} as PromotionCardModel;
  cardAccountType: string;
  debitCardData: DebitCardData[] = [];
  coverCardData: CoverCardData[] = [];
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    @Optional() private changeDetector: ChangeDetectorRef,
    private cardsService: CardsService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.showNoCardsMessage = false;
    this.getCardAds();
    this.setAllCardsList();
    this.getSelectedLanguage();
  }

  /**
   * @methodName getCardAds
   * @description used to fetch card ads from server
   * @parameters none
   * @return none
   */
  getCardAds(): void {
    this.subscription$.add(this.cardsService.getCardAds().subscribe(response => {
      this.promotionalCard = response;
    }));
  }

  /**
   * @methodName setAllCardsList
   * @description used to set all types of cards list
   * @parameters none
   * @return none
   */
  setAllCardsList(): void {
    if (this.sharedService.debitCardData || this.sharedService.coverCardData) {
      this.debitCardData = this.sharedService.debitCardData;
      this.coverCardData = this.sharedService.coverCardData;
      this.changeDetector.detectChanges();
      this.showOrHideNavControls();
    } else {
      this.showNoCardsMessage = true;
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
    direction ? direction === CARDS_MASTER_DATA.FORWARD ? scrollElement.scrollLeft += CARDS_MASTER_DATA.SCROLL_MOVE_WIDTH :
      scrollElement.scrollLeft -= CARDS_MASTER_DATA.SCROLL_MOVE_WIDTH : direction = undefined;
    if (this.scrollContainer.nativeElement.scrollLeft === 0) {
      this.disablePreviousBtn = this.selectedLanguage === ARABIC_LANG_TEXT ? false : true;
    }
    if (Number(scrollElement.scrollWidth - this.scrollContainer.nativeElement.offsetWidth) === Number(scrollElement.scrollLeft)) {
      this.disableNextBtn = this.selectedLanguage === ARABIC_LANG_TEXT ? false : true;
    }
    this.scrollContainer.nativeElement.scrollIntoView({ behavior: CARDS_MASTER_DATA.SMOOTH });
  }

  /**
   * @methodName showOrHideNavControls
   * @description used to show or hide the navigation controls on load
   * @parameters none
   * @return none
   */
  showOrHideNavControls(): void {
    if (this.scrollContainer.nativeElement.offsetWidth !== this.scrollContainer.nativeElement.scrollWidth) {
      this.hideNavigationControls = true;
      this.disableNextBtn = this.selectedLanguage === ARABIC_LANG_TEXT ? true : false;
      this.disablePreviousBtn = this.selectedLanguage === ARABIC_LANG_TEXT ? false : true;
    }
  }

  /**
   * @methodName viewDebitCardDetails
   * @description used to load debit card details
   * @parameters debitCardData
   * @return none
   */
  viewDebitCardDetails(debitCardData: DebitCardData): void {
    this.cardsService.setSelectedDebitCard(debitCardData);
    this.cardSelectionStatus.emit(CARDS_MASTER_DATA.DEBIT_CARD_DETAILS);
  }

  /**
   * @methodName viewCoverCardDetails
   * @description used to load cover card details
   * @parameters coverCardData
   * @return none
   */
  viewCoverCardDetails(coverCardData: CoverCardData): void {
    this.cardsService.setSelectedCoverCard(coverCardData);
    this.cardSelectionStatus.emit(CARDS_MASTER_DATA.COVER_CARD_DETAILS);
  }

  /**
   * @methodName activateCard
   * @description handle activate card
   * @parameters card
   * @return void
   */
  activateCard(card: DebitCardData): void {
    this.cardsService.selectedNewCard = card;
    this.cardSelectionStatus.emit(CARDS_MASTER_DATA.ACTIVATE_CARD);
  }

  /**
   * @methodName itemClickHandler
   * @description get the clicked object with action type
   * @parameters item
   * @return void
   */
  itemClickHandler(item: MenuOption): void {
    this.cardsService.handleCardStatus(item);
    this.subscription$.add(this.cardsService.updateCardList.subscribe(status => {
      if (status) {
        this.setAllCardsList();
      }
    }));
  }

  /**
   * @methodName handleUnFreeze
   * @description get the card object
   * @parameters card
   * @return void
   */
  handleUnFreeze(card: CoverCardsListResponse | DebitCardsListResponse): void {
    this.itemClickHandler({ actionType: ACTION_ITEMS.unFreeze, actionItem: card });
  }

  /**
   * @methodName reLoadCardList
   * @description reload cards list with updated data
   * @parameters none
   * @return void
   */
  reLoadCardList(): void {
    this.sharedService.setAccontsCardsList().subscribe((response) => {
      if (response) {
        this.sharedService.accountsCardsList = JSON.parse(response.toString());
        this.sharedService.getAllCardsList();
        this.setAllCardsList();
      }
    });
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
    this.subscription$.unsubscribe();
  }
}
