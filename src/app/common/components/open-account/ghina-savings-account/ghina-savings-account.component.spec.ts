import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CountdownModule } from 'ngx-countdown';
import { GhinaSavingsAccountComponent } from './ghina-savings-account.component';
import { CheckboxGenericComponent } from '../../checkbox-generic/checkbox-generic.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { ShowErrorComponent } from '../../show-form-errors/show-form-errors.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { GhinaSummaryComponent } from './ghina-summary/ghina-summary.component';
import { OTPComponent } from '../../otp/otp.component';
import { SuccessScreenComponent } from '../../success-screen/success-screen.component';
import { InputGenericComponent } from '../../input-generic/input-generic.component';
import { RecaptchaComponent } from '../../recaptcha/recaptcha.component';
import { AlertMessageComponent } from '../../alert-message/alert-message.component';

import { CUSTOMER_DETAILS } from 'src/app/common/global-test.data';
import { SharedService } from '../../../services/shared.service';

describe('GhinaSavingsAccountComponent', () => {

  let sharedService: SharedService;
  let component: GhinaSavingsAccountComponent;
  let fixture: ComponentFixture<GhinaSavingsAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
      declarations: [
        GhinaSavingsAccountComponent,
        CheckboxGenericComponent,
        ShowErrorComponent,
        GhinaSummaryComponent,
        OTPComponent,
        SuccessScreenComponent,
        InputGenericComponent,
        RecaptchaComponent,
        AlertMessageComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhinaSavingsAccountComponent);
    sharedService = TestBed.get(SharedService);
    sharedService.customerDetail = CUSTOMER_DETAILS;
    sharedService.customerFilteredPrimaryAddress = CUSTOMER_DETAILS.customerAddress[0];
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
