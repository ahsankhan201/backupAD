import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { PaymentOrderComponent } from './payment-order.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { BeneficiaryDetailsStepComponent } from './beneficiary-details-step/beneficiary-details-step.component';
import { ConfirmationStepComponent } from './confirmation-step/confirmation-step.component';
import { TransactionDetailsStepComponent } from './transaction-details-step/transaction-details-step.component';
import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';
import { SuccessScreenComponent } from 'src/app/common/components/success-screen/success-screen.component';
import { AccountCheckBoxComponent } from 'src/app/common/components/account-checkbox/account-checkbox.component';
import { TransferFromStepComponent } from './transfer-from-step/transfer-from-step.component';

describe('PaymentOrderComponent', () => {
  let component: PaymentOrderComponent;
  let fixture: ComponentFixture<PaymentOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        FormsModule,
        SharedDirectiveModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [
        PaymentOrderComponent,
        BeneficiaryDetailsStepComponent,
        ConfirmationStepComponent,
        TransferFromStepComponent,
        TransactionDetailsStepComponent,
        ShowErrorComponent,
        SuccessScreenComponent,
        AccountCheckBoxComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
