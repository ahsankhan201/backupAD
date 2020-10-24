import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpStepComponent } from './otp-step.component';
import { OTPComponent } from 'src/app/common/components/otp/otp.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { CountdownModule } from 'ngx-countdown';
import { MatStepperModule, MatStepper } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InputGenericComponent } from 'src/app/common/components/input-generic/input-generic.component';
import { CdkStepper } from '@angular/cdk/stepper';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

import { RecaptchaComponent } from 'src/app/common/components/recaptcha/recaptcha.component';
import { AlertMessageComponent } from 'src/app/common/components/alert-message/alert-message.component';
import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';

describe('OtpStepComponent', () => {
  let component: OtpStepComponent;
  let fixture: ComponentFixture<OtpStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        CountdownModule,
        HttpClientTestingModule,
        MatStepperModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [OtpStepComponent, OTPComponent, InputGenericComponent, RecaptchaComponent, ShowErrorComponent, AlertMessageComponent],
      providers: [
        { provide: MatStepper, useValue: {} },
        { provide: CdkStepper, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
