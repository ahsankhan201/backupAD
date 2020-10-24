import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { DebitCardDetailsComponent } from './debit-card-details.component';
import { LinkAccountComponent } from '../link-account/link-account.component';
import { DEBIT_CARD_QUICKLINKS_TEST_DATA } from '../../cards-module-test.data';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('DebitCardDetailsComponent', () => {
  let component: DebitCardDetailsComponent;
  let fixture: ComponentFixture<DebitCardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedDirectiveModule,
        HttpClientTestingModule,
        CommonAppModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [DebitCardDetailsComponent, LinkAccountComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitCardDetailsComponent);
    component = fixture.componentInstance;
    component.debitCardDetails = {
      cardExpiryDate: '1234',
      cardHolderName: 'string',
      cardNumber: 'string',
      cardStatus: 'string',
      primaryAccountNumber: '1234',
      availableBalance: 'string',
      currencyCode: 'string',
      accountType: 'string',
      accountDesc: 'string',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should emit backButtonClickedStatus', () => {
    spyOn(component.backButtonClicked, 'emit');
    component.onBackButtonClicked();
    expect(component.backButtonClicked.emit).toHaveBeenCalled();
  });

  // Testing loadTransactionHistoryData method
  it('should test loadTransactionHistoryData method ', () => {
    component.loadTransactionHistoryData();
    expect(component.transactionHeaderList).toBeDefined();
    expect(component.transactionHistoryAPIURL).toBeDefined();
  });
});
