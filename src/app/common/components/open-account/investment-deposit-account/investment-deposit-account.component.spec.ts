import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CountdownModule } from 'ngx-countdown';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { InvestmentDepositAccountComponent } from './investment-deposit-account.component';
import { CheckboxGenericComponent } from '../../checkbox-generic/checkbox-generic.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { ShowErrorComponent } from '../../show-form-errors/show-form-errors.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { OpenAccountSummaryComponent } from './open-account-summary/open-account-summary.component';
import { OTPComponent } from '../../otp/otp.component';
import { SuccessScreenComponent } from '../../success-screen/success-screen.component';
import { InputGenericComponent } from '../../input-generic/input-generic.component';
import { RecaptchaComponent } from '../../recaptcha/recaptcha.component';
import { AlertMessageComponent } from '../../alert-message/alert-message.component';

describe('InvestmentDepositAccountComponent', () => {
  let component: InvestmentDepositAccountComponent;
  let fixture: ComponentFixture<InvestmentDepositAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InvestmentDepositAccountComponent,
        CheckboxGenericComponent,
        ShowErrorComponent,
        OpenAccountSummaryComponent,
        OTPComponent,
        SuccessScreenComponent,
        InputGenericComponent,
        RecaptchaComponent,
        AlertMessageComponent
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        SharedDirectiveModule,
        TranslateModule.forRoot(),
        CountdownModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentDepositAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
