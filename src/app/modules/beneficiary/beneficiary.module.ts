import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { BeneficiaryRoutingModule } from './beneficiary-routing.module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { MaterialModule } from '../../common/modules/material.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';

import { BeneficiaryComponent } from './components/beneficiary.component';
import { RegionSelectionComponent } from './components/region-selection/region-selection-component';
import { BankSelectionComponent } from './components/bank-selection/bank-selection-component';
import { InternationalAccountComponent } from './components/other-international-account/other-international-account.component';
import { AccountSelectionComponent } from './components/account-selection/account-selection.component';
import { AccountSelectionFormComponent } from './components/account-selection-form/account-selection-form.component';
import { UaeAdibBeneficiaryComponent } from './components/uae-adib-beneficiary/uae-adib-beneficiary.component';
import { UaeOtherAccountComponent } from './components/uae-other-account/uae-other-account.component';
import { AdibInternationalAccountComponent } from './components/adib-international-account/adib-international-account.component';
import { ConfirmAccountComponent } from './components/confirm-account/confirm-account-component';

@NgModule({
  declarations: [
    BeneficiaryComponent,
    RegionSelectionComponent,
    BankSelectionComponent,
    InternationalAccountComponent,
    AccountSelectionComponent,
    AccountSelectionFormComponent,
    UaeAdibBeneficiaryComponent,
    UaeOtherAccountComponent,
    AdibInternationalAccountComponent,
    ConfirmAccountComponent
  ],
  imports: [
    CommonModule,
    BeneficiaryRoutingModule,
    CommonAppModule,
    SharedDirectiveModule,
    MaterialModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
  ]
})
export class BeneficiaryModule { }
