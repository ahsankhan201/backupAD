import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PaymentsComponent } from './payments.component';
import { TransferDetailsComponent } from './transfer-details/transfer-details.component';
import { TransferFromStepComponent } from './transfer-from-step/transfer-from-step.component';
import { TransferToStepComponent } from './transfer-to-step/transfer-to-step.component';
import { ConfirmPaymentComponent } from './confirm-payment/confirm-payment.component';
import { MatStepperModule, MatDialogModule } from '@angular/material';
import { CheckboxGenericComponent } from '../checkbox-generic/checkbox-generic.component';
import { AccountCheckBoxComponent } from '../account-checkbox/account-checkbox.component';
import { NumberFormatPipe } from '../../pipes/number-format/number-format.pipe';
import { DecimalValuePipe } from '../../pipes/decimal-value/decimal-value.pipe';
import { CheckboxCardComponent } from '../checkbox-card/checkbox-card.component';
import { CardNumberFormatPipe } from '../../pipes/card-number-format/card-number-format.pipe';
import { MaterialModule } from '../../modules/material.module';
import { ShowErrorComponent } from '../show-form-errors/show-form-errors.component';
import { CheckboxGenericCharityComponent } from '../checkbox-generic-charity/checkbox-generic-charity.component';
import { CheckboxPayeeComponent } from '../checkbox-payee/checkbox-payee.component';
import { SuccessScreenComponent } from '../success-screen/success-screen.component';
import { RouterTestingModule } from '@angular/router/testing';


describe('PaymentsComponent', () => {
  let component: PaymentsComponent;
  let fixture: ComponentFixture<PaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MatStepperModule,
        MaterialModule,
        HttpClientTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [
        PaymentsComponent,
        TransferDetailsComponent,
        TransferFromStepComponent,
        TransferToStepComponent,
        ConfirmPaymentComponent,
        CheckboxGenericComponent,
        AccountCheckBoxComponent,
        CheckboxCardComponent,
        CardNumberFormatPipe,
        NumberFormatPipe,
        DecimalValuePipe,
        ShowErrorComponent,
        CheckboxGenericCharityComponent,
        CheckboxPayeeComponent,
        SuccessScreenComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
