import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CardsListComponent } from './cards-list.component';
import { By } from '@angular/platform-browser';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { HttpClientModule } from '@angular/common/http';
import { CardsService } from '../../services/cards.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { DEBIT_CARD_DETAILS_DATA, COVER_CARD_DETAILS_DATA } from '../../cards-module-test.data';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('CardsListComponent', () => {
  let component: CardsListComponent;
  let fixture: ComponentFixture<CardsListComponent>;
  let scrollContainer: any;
  let cardsService: CardsService;
  let sharedService: SharedService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsListComponent],
      imports: [CommonAppModule, SharedDirectiveModule, HttpClientModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [CardsService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsListComponent);
    component = fixture.componentInstance;
    cardsService = TestBed.get(CardsService);
    sharedService = TestBed.get(SharedService);
    scrollContainer = fixture.debugElement.query(By.css('.cards-list'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing promotionalCard property
  it('checking promotionalCard property existence', () => {
    cardsService.getCardAds();
    expect(component.promotionalCard).toBeDefined();
    fixture.detectChanges();
  });

  // Testing scroll moveScroll Method
  it('Testing moveScroll Method', () => {
    spyOnProperty(scrollContainer.nativeElement, 'scrollLeft', 'get').and.returnValue(50);
    component.moveScroll('forward');
    expect(component.disablePreviousBtn).toBeTruthy();
  });

  // Testing moveScroll method for false case
  it('Testing moveScroll method for false case', () => {
    spyOnProperty(scrollContainer.nativeElement, 'scrollLeft', 'get').and.returnValue(0);
    component.moveScroll('backward');
    expect(component.disablePreviousBtn).toBeTruthy();
    component.moveScroll('');
  });

  // Testing negative case for showOrHideNavigation controls method
  it('Show or Hide method testing', () => {
    spyOnProperty(scrollContainer.nativeElement, 'offsetWidth', 'get').and.returnValue(10);
    spyOnProperty(scrollContainer.nativeElement, 'scrollWidth', 'get').and.returnValue(10);
    component.showOrHideNavControls();
    expect(component.hideNavigationControls).toBeFalsy();
  });

  // Testing setAllCardsList method
  it('setAllCardsList() should set debitCardData info', () => {
    sharedService.debitCardData[0] = DEBIT_CARD_DETAILS_DATA;
    sharedService.coverCardData[0] = COVER_CARD_DETAILS_DATA;
    component.setAllCardsList();
    expect(component.debitCardData.length).toEqual(1);
    expect(component.coverCardData.length).toEqual(1);
  });

});
