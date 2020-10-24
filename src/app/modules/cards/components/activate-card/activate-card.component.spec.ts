import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { CountdownModule } from 'ngx-countdown';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';
import { OTPComponent } from 'src/app/common/components/otp/otp.component';
import { SuccessScreenComponent } from 'src/app/common/components/success-screen/success-screen.component';
import { InputGenericComponent } from 'src/app/common/components/input-generic/input-generic.component';
import { RecaptchaComponent } from 'src/app/common/components/recaptcha/recaptcha.component';
import { ActivateCardComponent } from './activate-card.component';
import { CardNumberFormatPipe } from 'src/app/common/pipes/card-number-format/card-number-format.pipe';
import { AlertMessageComponent } from 'src/app/common/components/alert-message/alert-message.component';

describe('ActivateCardComponent', () => {
  let component: ActivateCardComponent;
  let fixture: ComponentFixture<ActivateCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CountdownModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [
        ShowErrorComponent,
        OTPComponent,
        SuccessScreenComponent,
        InputGenericComponent,
        RecaptchaComponent,
        ActivateCardComponent,
        CardNumberFormatPipe,
        AlertMessageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
