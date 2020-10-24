import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { CdkStepper } from '@angular/cdk/stepper';
import { ConfirmAccountComponent } from './confirm-account-component';
import { OTPComponent } from 'src/app/common/components/otp/otp.component';
import { SuccessScreenComponent } from 'src/app/common/components/success-screen/success-screen.component';
import { FormsModule } from '@angular/forms';
import { CountdownComponent } from 'ngx-countdown';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { InputGenericComponent } from 'src/app/common/components/input-generic/input-generic.component';
import { RecaptchaComponent } from 'src/app/common/components/recaptcha/recaptcha.component';
import { AlertMessageComponent } from 'src/app/common/components/alert-message/alert-message.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';

describe('ConfirmAccountComponent', () => {
  let component: ConfirmAccountComponent;
  let fixture: ComponentFixture<ConfirmAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        MaterialModule,
        SharedDirectiveModule
      ],
      declarations: [
        ConfirmAccountComponent,
        OTPComponent,
        SuccessScreenComponent,
        CountdownComponent,
        InputGenericComponent,
        RecaptchaComponent,
        AlertMessageComponent,
        ShowErrorComponent
      ],
      providers: [
        {
          provide: CdkStepper,
          useValue: {},
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
