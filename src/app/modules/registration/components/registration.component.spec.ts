import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { OtpStepComponent } from './otp-step/otp-step.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { RegistrationComponent } from './registration.component';
import {
  HeaderLoginAndRegistrationComponent
} from 'src/app/common/components/layout/header-login-and-registration/header-login-and-registration.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { CardDetailsStepComponent } from './card-details-step/card-details-step.component';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { UsernameStepComponent } from './username-step/username-step.component';
import { PasswordStepComponent } from './password-step/password-step.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

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
        RegistrationComponent,
        UsernameStepComponent,
        OtpStepComponent,
        CardDetailsStepComponent,
        HeaderLoginAndRegistrationComponent,
        PasswordStepComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
