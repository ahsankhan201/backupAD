import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/common/modules/material.module';

import { CardsService } from './cards.service';
import { DebitCardData, CoverCardData } from 'src/app/common/models/cards-module.model';
import { DEBIT_CARD_DETAILS_DATA, CARDS_ADS_DATA, COVER_CARD_DETAILS_DATA } from '../cards-module-test.data';
import { PromotionCardModel } from 'src/app/common/models/global.model';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('CardsService', () => {
  let cardsService: CardsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MaterialModule, RouterTestingModule],
    });
    cardsService = TestBed.get(CardsService);
  });

  it('should be created', () => {
    const service: CardsService = TestBed.get(CardsService);
    expect(service).toBeTruthy();
  });

  // Testing setSelectedDebitCard Method
  it('should call setSelectedDebitCard', fakeAsync(() => {
    const DEBIT_CARD_DATA: DebitCardData = DEBIT_CARD_DETAILS_DATA;
    spyOn(cardsService, 'setSelectedDebitCard').and.callThrough();
    cardsService.setSelectedDebitCard(DEBIT_CARD_DATA);
    expect(cardsService.selectedDebitCard).toEqual(DEBIT_CARD_DATA);
  }));

 // Testing setSelectedCoverCard Method
  it('should call setSelectedCoverCard', () => {
    const COVER_CARD_DATA: CoverCardData = COVER_CARD_DETAILS_DATA;
    cardsService.setSelectedCoverCard(COVER_CARD_DATA);
    expect(cardsService.selectedCoverCard).toEqual(COVER_CARD_DATA);
  });

  // Testing getCardAds method
  it('Should return Observable<PromotionCardModel> getCardAds ', async () => {
    const CARDS_AD_RESPONCE_DATA = CARDS_ADS_DATA;
    let responseData: PromotionCardModel;
    cardsService.getCardAds().subscribe((response: PromotionCardModel) => {
      responseData = response;
      expect(responseData).toEqual(CARDS_AD_RESPONCE_DATA);
    });
    expect(responseData).not.toBeNull();
  });

});
