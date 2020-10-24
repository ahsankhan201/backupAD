import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './modules/auth/components/auth.component';
import { AuthGuardService } from './common/services/auth/auth-gurd.service';

const routes: Routes = [
  { path: '', component: AuthComponent },
  {
    path: 'dashboard', canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'finance', canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/finance/finance.module').then(m => m.FinanceModule)
  },
  {
    path: 'transfers-payments', canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/transfers-payments/transfers-payments.module')
      .then(m => m.TransfersPaymentsModule)
  },
  {
    path: 'beneficiary', canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/beneficiary/beneficiary.module').then(m => m.BeneficiaryModule)
  },
  {
    path: 'products', canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/products/products.module').then(m => m.ProductsModule)
  },
  { path: 'payee', canActivate: [AuthGuardService], loadChildren: () => import('./modules/payee/payee.module').then(m => m.PayeeModule) },
  { path: 'cards', canActivate: [AuthGuardService], loadChildren: () => import('./modules/cards/cards.module').then(m => m.CardsModule) },
  { path: 'registration', loadChildren: () => import('./modules/registration/registration.module').then(m => m.RegistrationModule) },
  { path: 'logout', loadChildren: () => import('./modules/logout/logout.module').then(m => m.LogoutModule) },
  {
    path: 'profile', canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'change-password', canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/change-password/change-password.module').then(m => m.ChangePasswordModule)
  },
  {
    path: 'services', canActivate: [AuthGuardService],
    loadChildren: () => import('./modules/banking-services/banking-services.module').then(m => m.BankingServicesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
