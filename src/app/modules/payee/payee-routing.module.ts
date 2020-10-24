import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayeeComponent } from './components/payee.component';

const routes: Routes = [
  { path: '', component: PayeeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayeeRoutingModule { }
