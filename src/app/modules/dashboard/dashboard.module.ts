import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';

import { DashboardComponent } from './components/dashboard.component';
import { AccountListComponent } from './components/account-list/account-list.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';



@NgModule({
  declarations: [
    DashboardComponent,
    AccountListComponent,
    AccountDetailsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CommonAppModule,
    SharedDirectiveModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule.forChild({ isolate: false }),
  ],
})
export class DashboardModule {}
