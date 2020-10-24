import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankingServicesComponent } from './banking-services.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/common/modules/material.module';

import { PaymentOrderComponent } from './payment-order/payment-order.component';
import { BeneficiaryDetailsStepComponent } from './payment-order/beneficiary-details-step/beneficiary-details-step.component';
import { ConfirmationStepComponent } from './payment-order/confirmation-step/confirmation-step.component';
import { TransferFromStepComponent } from './payment-order/transfer-from-step/transfer-from-step.component';
import { TransactionDetailsStepComponent } from './payment-order/transaction-details-step/transaction-details-step.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { BankCertificateComponent } from './bank-certificate/bank-certificate.component';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { BankCertificateSummaryComponent } from './bank-certificate-summary/bank-certificate-summary.component';
import { DemandDraftComponent } from './demand-draft/demand-draft.component';
import {
  DraftBeneficiaryDetailsStepComponent
} from './demand-draft/draft-beneficiary-details-step/draft-beneficiary-details-step.component';
import {
  DraftConfirmationStepComponent
} from './demand-draft/draft-confirmation-step/draft-confirmation-step.component';
import {
  DraftTransactionDetailsStepComponent
} from './demand-draft/draft-transaction-details-step/draft-transaction-details-step.component';
import { DraftTransferFromStepComponent } from './demand-draft/draft-transfer-from-step/draft-transfer-from-step.component';
import { ChequeBookComponent } from './cheque-book/cheque-book.component';
import { ChequeBookSummaryComponent } from './cheque-book-summary/cheque-book-summary.component';
import { BankingServicesDetailsComponent } from './banking-services-details/banking-services-details.component';
import { BankingServicesDashboardComponent } from './banking-services-dashboard/banking-services-dashboard.component';

describe('BankingServicesComponent', () => {
  let component: BankingServicesComponent;
  let fixture: ComponentFixture<BankingServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BankingServicesComponent,
        PaymentOrderComponent,
        BeneficiaryDetailsStepComponent,
        ConfirmationStepComponent,
        TransferFromStepComponent,
        TransactionDetailsStepComponent,
        BankCertificateComponent,
        BankCertificateSummaryComponent,
        DemandDraftComponent,
        DraftBeneficiaryDetailsStepComponent,
        DraftConfirmationStepComponent,
        DraftTransferFromStepComponent,
        DraftTransactionDetailsStepComponent,
        ChequeBookComponent,
        ChequeBookSummaryComponent,
        BankingServicesDetailsComponent,
        BankingServicesDashboardComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        CommonAppModule,
        SharedDirectiveModule
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankingServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
