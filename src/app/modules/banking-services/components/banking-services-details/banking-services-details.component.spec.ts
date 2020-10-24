import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ACCOUNTS_DETAILS_DATA, PAYMENTS_DETAILS_DATA } from 'src/app/common/global-test.data';
import { BankingServicesDetailsComponent } from './banking-services-details.component';
describe('BankingServicesDetailsComponent', () => {
  let component: BankingServicesDetailsComponent;
  let fixture: ComponentFixture<BankingServicesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BankingServicesDetailsComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankingServicesDetailsComponent);
    component = fixture.componentInstance;
    component.accountServiceRequestDetails = ACCOUNTS_DETAILS_DATA;
    component.paymentServiceRequestDetails = PAYMENTS_DETAILS_DATA;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
