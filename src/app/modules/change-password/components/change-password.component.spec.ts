import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { CountdownModule } from 'ngx-countdown';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangePasswordComponent } from './change-password.component';
import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';
import { OTPComponent } from 'src/app/common/components/otp/otp.component';
import { SuccessScreenComponent } from 'src/app/common/components/success-screen/success-screen.component';
import { InputGenericComponent } from 'src/app/common/components/input-generic/input-generic.component';
import { RecaptchaComponent } from 'src/app/common/components/recaptcha/recaptcha.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { AlertMessageComponent } from 'src/app/common/components/alert-message/alert-message.component';


describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        CountdownModule,
        RouterTestingModule,
        SharedDirectiveModule
      ],
      declarations: [
        ChangePasswordComponent,
        ShowErrorComponent,
        OTPComponent,
        SuccessScreenComponent,
        InputGenericComponent,
        RecaptchaComponent,
        AlertMessageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
