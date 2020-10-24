import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransfersPaymentsComponent } from './components/transfers-payments.component';

const routes: Routes = [
  { path: '', component: TransfersPaymentsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransfersPaymentsRoutingModule { }
