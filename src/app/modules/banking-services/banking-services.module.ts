import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularResizedEventModule } from 'angular-resize-event';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Custom Modules
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { LayoutModule } from 'src/app/common/modules/layout.module';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { BankingServicesRoutingModule } from './banking-services-routing.module';

// Components
import { BankingServicesComponent } from '../banking-services/components/banking-services.component';
import { PaymentOrderComponent } from './components/payment-order/payment-order.component';
import { ChequeBookComponent } from './components/cheque-book/cheque-book.component';
import { BeneficiaryDetailsStepComponent } from './components/payment-order/beneficiary-details-step/beneficiary-details-step.component';
import { TransferFromStepComponent } from './components/payment-order/transfer-from-step/transfer-from-step.component';
import { TransactionDetailsStepComponent } from './components/payment-order/transaction-details-step/transaction-details-step.component';
import { ConfirmationStepComponent } from './components/payment-order/confirmation-step/confirmation-step.component';
// Demand Draft components
import { DemandDraftComponent } from './components/demand-draft/demand-draft.component';
import {
  DraftBeneficiaryDetailsStepComponent
} from './components/demand-draft/draft-beneficiary-details-step/draft-beneficiary-details-step.component';
import { DraftConfirmationStepComponent } from './components/demand-draft/draft-confirmation-step/draft-confirmation-step.component';
import {
  DraftTransactionDetailsStepComponent
} from './components/demand-draft/draft-transaction-details-step/draft-transaction-details-step.component';
import { DraftTransferFromStepComponent } from './components/demand-draft/draft-transfer-from-step/draft-transfer-from-step.component';
import { BankCertificateComponent } from './components/bank-certificate/bank-certificate.component';
import { BankCertificateSummaryComponent } from './components/bank-certificate-summary/bank-certificate-summary.component';
import { ChequeBookSummaryComponent } from './components/cheque-book-summary/cheque-book-summary.component';
import { BankingServicesDashboardComponent } from './components/banking-services-dashboard/banking-services-dashboard.component';
import { BankingServicesDetailsComponent } from './components/banking-services-details/banking-services-details.component';


@NgModule({
  declarations: [
    BankingServicesComponent,
    PaymentOrderComponent,
    ChequeBookComponent,
    BeneficiaryDetailsStepComponent,
    TransferFromStepComponent,
    TransactionDetailsStepComponent,
    ConfirmationStepComponent,
    DemandDraftComponent,
    BeneficiaryDetailsStepComponent,
    DraftBeneficiaryDetailsStepComponent,
    DraftConfirmationStepComponent,
    DraftTransactionDetailsStepComponent,
    DraftTransferFromStepComponent,
    BankCertificateComponent,
    BankCertificateSummaryComponent,
    ChequeBookSummaryComponent,
    BankingServicesDashboardComponent,
    BankingServicesDetailsComponent
  ],
  imports: [
    CommonModule,
    BankingServicesRoutingModule,
    CommonAppModule,
    SharedDirectiveModule,
    LayoutModule,
    MaterialModule,
    TranslateModule,
    ReactiveFormsModule,
    AngularResizedEventModule,
    HttpClientModule,
    RouterModule
  ]
})
export class BankingServicesModule { }
