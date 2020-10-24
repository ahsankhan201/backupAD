import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { CoverCardDetailsComponent } from './cover-card-details.component';
import { CARDS_MASTER_DATA } from '../../cards-module.constants';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('CoverCardDetailsComponent', () => {
  let component: CoverCardDetailsComponent;
  let fixture: ComponentFixture<CoverCardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedDirectiveModule, HttpClientTestingModule, CommonAppModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [CoverCardDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit backButtonClickedStatus', () => {
    spyOn(component.backButtonClicked, 'emit');
    component.onBackButtonClicked();
    expect(component.backButtonClicked.emit).toHaveBeenCalled();
  });

  // Testing setQuickLinksData method
  it('should test setQuickLinksData method ', () => {
    component.setQuickLinksData(CARDS_MASTER_DATA.PRIMARY_CARD_FLAG);
    expect(component.quickLinksData).toBeDefined();
  });

  // Testing loadTransactionHistoryData method
  it('should test loadTransactionHistoryData method ', () => {
    component.loadTransactionHistoryData();
    expect(component.transactionHeaderList).toBeDefined();
    expect(component.transactionHistoryAPIURL).toBeDefined();
    expect(component.pendingTransactionsAPIURL).toBeDefined();
  });
});
