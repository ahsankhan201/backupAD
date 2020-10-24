import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Include Custom Modules
import { PayeeRoutingModule } from './payee-routing.module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { MaterialModule } from '../../common/modules/material.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';

// Include Custom components
import { PayeeComponent } from './components/payee.component';
import { PayeeSelectionComponent } from './components/payee-selection/payee-selection.component';
import { ServiceProviderComponent } from './components/service-provider/service-provider.component';
import { RtaSelectionComponent } from './components/rta-selection/rta-selection.component';
import { PayeeAccountFormComponent } from './components/payee-account-form/payee-account-form.component';
import { TelecomSelectionComponent } from './components/telecom-selection/telecom-selection.component';
import { WaterElectricitySelectionComponent } from './components/water-electricity-selection/water-electricity-selection.component';

@NgModule({
  declarations: [
    PayeeComponent,
    PayeeSelectionComponent,
    ServiceProviderComponent,
    RtaSelectionComponent,
    PayeeAccountFormComponent,
    TelecomSelectionComponent,
    WaterElectricitySelectionComponent
  ],
  imports: [
    CommonModule,
    PayeeRoutingModule,
    CommonAppModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedDirectiveModule,
    TranslateModule
  ]
})
export class PayeeModule { }
