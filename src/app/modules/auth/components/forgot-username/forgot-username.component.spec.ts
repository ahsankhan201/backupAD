import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotUsernameComponent } from './forgot-username.component';
import { ForgotOtpStepComponent } from '../forgot-otp-step/forgot-otp-step.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ForgotUsernameComponent', () => {
  let component: ForgotUsernameComponent;
  let fixture: ComponentFixture<ForgotUsernameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule,
        HttpClientTestingModule, FormsModule, TranslateModule.forRoot(), RouterTestingModule, CommonAppModule,
        MaterialModule],
      declarations: [ForgotUsernameComponent, ForgotOtpStepComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
