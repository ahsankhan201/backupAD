import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OpenAccountComponent } from './open-account.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { InvestmentDepositAccountComponent } from './investment-deposit-account/investment-deposit-account.component';
import { SavingsAccountComponent } from './savings-account/savings-account.component';
import { GhinaSavingsAccountComponent } from './ghina-savings-account/ghina-savings-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxGenericComponent } from '../checkbox-generic/checkbox-generic.component';
import { MaterialModule } from '../../modules/material.module';
import { ShowErrorComponent } from '../show-form-errors/show-form-errors.component';
import { SharedDirectiveModule } from '../../modules/shared-directives-module';
import { TranslateModule } from '@ngx-translate/core';
import { OpenAccountSummaryComponent } from './investment-deposit-account/open-account-summary/open-account-summary.component';
import { SavingsSummaryAccountComponent } from './savings-account/savings-summary/savings-summary.component';
import { GhinaSummaryComponent } from './ghina-savings-account/ghina-summary/ghina-summary.component';
import { OTPComponent } from '../otp/otp.component';
import { SuccessScreenComponent } from '../success-screen/success-screen.component';
import { CountdownModule } from 'ngx-countdown';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { InputGenericComponent } from '../input-generic/input-generic.component';
import { RecaptchaComponent } from '../recaptcha/recaptcha.component';
import { CUSTOMER_DETAILS } from 'src/app/common/global-test.data';
import { SharedService } from '../../services/shared.service';

describe('OpenAccountComponent', () => {
  let component: OpenAccountComponent;
  let sharedService: SharedService;
  let fixture: ComponentFixture<OpenAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedDirectiveModule,
        TranslateModule.forRoot(),
        CountdownModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [
        OpenAccountComponent,
        ProductCardComponent,
        InvestmentDepositAccountComponent,
        SavingsAccountComponent,
        GhinaSavingsAccountComponent,
        CheckboxGenericComponent,
        ShowErrorComponent,
        OpenAccountSummaryComponent,
        SavingsSummaryAccountComponent,
        GhinaSummaryComponent,
        OTPComponent,
        SuccessScreenComponent,
        AlertMessageComponent,
        InputGenericComponent,
        RecaptchaComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAccountComponent);
    component = fixture.componentInstance;
    sharedService = TestBed.get(SharedService);
    sharedService.customerDetail = CUSTOMER_DETAILS;
    sharedService.customerFilteredPrimaryAddress = CUSTOMER_DETAILS.customerAddress[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
