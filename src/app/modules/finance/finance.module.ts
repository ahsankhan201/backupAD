import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// Routing Module
import { FinanceRoutingModule } from './finance-routing.module';
// Custom Modules
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
// Components
import { FinanceListComponent } from './components/finance-list/finance-list.component';
import { FinanceComponent } from './components/finance.component';
import { FinanceDetailsComponent } from './components/finance-details/finance-details.component';



@NgModule({
  declarations: [FinanceListComponent, FinanceComponent, FinanceDetailsComponent],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    CommonAppModule,
    SharedDirectiveModule,
    TranslateModule
  ]
})
export class FinanceModule { }
