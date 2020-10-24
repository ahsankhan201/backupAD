import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CountdownModule } from 'ngx-countdown';
import { MatStepperModule, MatDialogModule } from '@angular/material';
import { MaterialModule } from '../../modules/material.module';

import { OTPComponent } from './otp.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InputGenericComponent } from '../input-generic/input-generic.component';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaComponent } from '../recaptcha/recaptcha.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { LogoutService } from 'src/app/modules/logout/services/logout.service';
import { ShowErrorComponent } from '../show-form-errors/show-form-errors.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('OTPComponent', () => {
  let component: OTPComponent;
  let fixture: ComponentFixture<OTPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        CountdownModule,
        MatStepperModule,
        MatDialogModule,
        MaterialModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [
        OTPComponent,
        InputGenericComponent,
        RecaptchaComponent,
        AlertMessageComponent,
        ShowErrorComponent
      ],
      providers: [LogoutService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checking component creation method

  it('should create OTP Component', () => {
    expect(component).toBeTruthy();
  });
});
