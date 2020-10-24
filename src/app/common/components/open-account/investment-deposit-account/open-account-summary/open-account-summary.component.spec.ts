import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CountdownModule } from 'ngx-countdown';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { OpenAccountSummaryComponent } from './open-account-summary.component';
import { SuccessScreenComponent } from '../../../success-screen/success-screen.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { OTPComponent } from '../../../otp/otp.component';
import { InputGenericComponent } from '../../../input-generic/input-generic.component';
import { RecaptchaComponent } from '../../../recaptcha/recaptcha.component';
import { AlertMessageComponent } from '../../../alert-message/alert-message.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { ShowErrorComponent } from '../../../show-form-errors/show-form-errors.component';

describe('InvestmentAccountsSummaryComponent', () => {
  let component: OpenAccountSummaryComponent;
  let fixture: ComponentFixture<OpenAccountSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedDirectiveModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        CountdownModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        MaterialModule
      ],
      declarations: [
        OpenAccountSummaryComponent,
        OTPComponent,
        SuccessScreenComponent,
        InputGenericComponent,
        RecaptchaComponent,
        AlertMessageComponent,
        ShowErrorComponent
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
    ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAccountSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
