import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthComponent } from './auth.component';
import {
  HeaderLoginAndRegistrationComponent
} from 'src/app/common/components/layout/header-login-and-registration/header-login-and-registration.component';

import { MaterialModule } from 'src/app/common/modules/material.module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotOtpStepComponent } from './forgot-otp-step/forgot-otp-step.component';
import { ForgotUsernameComponent } from './forgot-username/forgot-username.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        CommonAppModule,
        MaterialModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      declarations: [
        AuthComponent,
        HeaderLoginAndRegistrationComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ForgotOtpStepComponent,
        ForgotUsernameComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
