import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankingServicesComponent } from './components/banking-services.component';

const routes: Routes = [
  { path: '', component: BankingServicesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankingServicesRoutingModule {

}
