import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordComponent } from './forgot-password.component';
import { ForgotOtpStepComponent } from '../forgot-otp-step/forgot-otp-step.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule,
        HttpClientTestingModule, FormsModule, TranslateModule.forRoot(), RouterTestingModule, CommonAppModule,
        MaterialModule],
      declarations: [ForgotPasswordComponent, ForgotOtpStepComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
