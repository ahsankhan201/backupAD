import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardsComponent } from './cards.component';
import { CardsListComponent } from './cards-list/cards-list.component';
import { DebitCardDetailsComponent } from './debit-card-details/debit-card-details.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { CARDS_MASTER_DATA, COVER_LIMIT_COMPONENT_TEXT } from '../cards-module.constants';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { CoverCardDetailsComponent } from './cover-card-details/cover-card-details.component';
import { LinkAccountComponent } from './link-account/link-account.component';
import { ActivateCardComponent } from './activate-card/activate-card.component';
import { QUICK_LINK_COVER_LIMIT, QUICK_LINK_COVER_LIMIT_WITHOUT_ID } from '../cards-module-test.data';
import { CoverLimitComponent } from './cover-limit/cover-limit.component';

describe('CardsComponent', () => {
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedDirectiveModule,
        HttpClientTestingModule,
        RouterTestingModule,
        CommonAppModule,
        TranslateModule.forRoot(),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [CardsComponent,
        CardsListComponent,
        DebitCardDetailsComponent,
        CoverCardDetailsComponent,
        LinkAccountComponent,
        ActivateCardComponent,
        CoverLimitComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test app-cards-list component loading
  it('should create app-cards-list component ', () => {
    component.selectedComponent = CARDS_MASTER_DATA.CARDS_LIST;
    const APP_LIST_COMPONENT = fixture.debugElement.nativeElement.querySelector('app-cards-list');
    expect(APP_LIST_COMPONENT.innerHTML).not.toBeNull();
  });

  // Testing cardSelectionStatus method
  it('should test cardSelectionStatus method ', () => {
    component.cardSelectionStatus(CARDS_MASTER_DATA.DEBIT_CARD_DETAILS);
    expect(component.selectedComponent).toEqual(CARDS_MASTER_DATA.DEBIT_CARD_DETAILS);
  });

  // Testing onBackButtonClicked method
  it('should test onBackButtonClicked method ', () => {
    component.onBackButtonClicked();
    expect(component.selectedComponent).toEqual(CARDS_MASTER_DATA.CARDS_LIST);
  });

  // Testing handleCoverLimitBackButtonClick method
  it('should test handleCoverLimitBackButtonClick method ', () => {
    component.handleCoverLimitBackButtonClick(CARDS_MASTER_DATA.CARDS_LIST);
    expect(component.selectedComponent).toEqual(CARDS_MASTER_DATA.CARDS_LIST);

    component.handleCoverLimitBackButtonClick();
    expect(component.selectedComponent).toEqual(CARDS_MASTER_DATA.CARDS_LIST);
  });

  // Testing selectedQuickLink method
  xit('should test selectedQuickLink method ', () => {
    component.selectedQuickLink(QUICK_LINK_COVER_LIMIT);
    expect(component.selectedComponent).toEqual(COVER_LIMIT_COMPONENT_TEXT);

    component.selectedQuickLink(QUICK_LINK_COVER_LIMIT_WITHOUT_ID);
    expect(component.selectedComponent).toEqual(COVER_LIMIT_COMPONENT_TEXT);
  });
});
