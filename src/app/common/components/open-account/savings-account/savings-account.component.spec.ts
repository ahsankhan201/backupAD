import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SavingsAccountComponent } from './savings-account.component';
import { CheckboxGenericComponent } from '../../checkbox-generic/checkbox-generic.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { ShowErrorComponent } from '../../show-form-errors/show-form-errors.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { SavingsSummaryAccountComponent } from './savings-summary/savings-summary.component';
import { OTPComponent } from '../../otp/otp.component';
import { SuccessScreenComponent } from '../../success-screen/success-screen.component';
import { CountdownModule } from 'ngx-countdown';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputGenericComponent } from '../../input-generic/input-generic.component';
import { RecaptchaComponent } from '../../recaptcha/recaptcha.component';
import { AlertMessageComponent } from '../../alert-message/alert-message.component';
import { CUSTOMER_DETAILS } from 'src/app/common/global-test.data';
import { SharedService } from '../../../services/shared.service';

describe('SavingsAccountComponent', () => {
  let component: SavingsAccountComponent;
  let sharedService: SharedService;
  let fixture: ComponentFixture<SavingsAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SavingsAccountComponent,
        CheckboxGenericComponent,
        ShowErrorComponent,
        SavingsSummaryAccountComponent,
        OTPComponent,
        SuccessScreenComponent,
        InputGenericComponent,
        RecaptchaComponent,
        AlertMessageComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        SharedDirectiveModule,
        CountdownModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule
        ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingsAccountComponent);
    sharedService = TestBed.get(SharedService);
    sharedService.customerDetail = CUSTOMER_DETAILS;
    sharedService.customerFilteredPrimaryAddress = CUSTOMER_DETAILS.customerAddress[0];
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checking component creation method
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
