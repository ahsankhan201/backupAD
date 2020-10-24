import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ACCOUNTS_SUMMARY_DATA, PAYMENTS_SUMMARY_DATA } from 'src/app/common/global-test.data';
import { DecimalValuePipe } from 'src/app/common/pipes/decimal-value/decimal-value.pipe';
import { NumberFormatPipe } from 'src/app/common/pipes/number-format/number-format.pipe';
import { BankingServicesDashboardComponent } from './banking-services-dashboard.component';

describe('BankingServicesDashboardComponent', () => {
  let component: BankingServicesDashboardComponent;
  let fixture: ComponentFixture<BankingServicesDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BankingServicesDashboardComponent, NumberFormatPipe, DecimalValuePipe],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankingServicesDashboardComponent);
    component = fixture.componentInstance;
    component.accountsServiceSummaryData = ACCOUNTS_SUMMARY_DATA;
    component.paymentsServiceSummaryData = PAYMENTS_SUMMARY_DATA;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
