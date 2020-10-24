import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Include custom modules
import { MaterialModule } from '../../common/modules/material.module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { TransfersPaymentsRoutingModule } from './transfers-payments-routing.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';

// Include custom components
import { TransfersPaymentsComponent } from './components/transfers-payments.component';
import { BenificiaryListComponent } from './components/beneficiary-list/beneficiary-list.component';
import { PayeeListComponent } from './components/payee-list/payee-list.component';

@NgModule({
  declarations: [
    TransfersPaymentsComponent,
    BenificiaryListComponent,
    PayeeListComponent
  ],
  imports: [
    CommonModule,
    TransfersPaymentsRoutingModule,
    CommonAppModule,
    MaterialModule,
    FormsModule,
    SharedDirectiveModule,
    TranslateModule
  ]
})
export class TransfersPaymentsModule { }
