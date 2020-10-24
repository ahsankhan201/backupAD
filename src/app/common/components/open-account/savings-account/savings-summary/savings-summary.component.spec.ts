import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SavingsSummaryAccountComponent } from './savings-summary.component';
import { OTPComponent } from '../../../otp/otp.component';
import { SuccessScreenComponent } from '../../../success-screen/success-screen.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CountdownModule } from 'ngx-countdown';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material';
import { InputGenericComponent } from '../../../input-generic/input-generic.component';
import { RecaptchaComponent } from '../../../recaptcha/recaptcha.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { AlertMessageComponent } from '../../../alert-message/alert-message.component';
import { ShowErrorComponent } from '../../../show-form-errors/show-form-errors.component';

describe('SavingsSummaryAccountComponent', () => {
  let component: SavingsSummaryAccountComponent;
  let fixture: ComponentFixture<SavingsSummaryAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SavingsSummaryAccountComponent,
        OTPComponent,
        SuccessScreenComponent,
        InputGenericComponent,
        RecaptchaComponent, AlertMessageComponent, ShowErrorComponent
      ],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, FormsModule, CountdownModule,
        HttpClientTestingModule, MatDialogModule, RouterTestingModule, MaterialModule, SharedDirectiveModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingsSummaryAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checking component creation method
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
