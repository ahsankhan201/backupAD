import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotOtpStepComponent } from './forgot-otp-step.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatStepperModule, MatStepper } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { CdkStepper } from '@angular/cdk/stepper';
import { CountdownModule } from 'ngx-countdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ForgotOtpStepComponent', () => {
  let component: ForgotOtpStepComponent;
  let fixture: ComponentFixture<ForgotOtpStepComponent>;

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
        RouterTestingModule,
        CommonAppModule,
      ],
      declarations: [
        ForgotOtpStepComponent
      ],
      providers: [
        { provide: MatStepper, useValue: {} },
        { provide: CdkStepper, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotOtpStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
