import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CountdownModule } from 'ngx-countdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LottieAnimationViewModule } from 'ng-lottie';
import { CarouselModule } from 'ngx-bootstrap/carousel';

// declaring modules
import { SharedDirectiveModule } from './shared-directives-module';
import { MaterialModule } from './material.module';

// declaring services
import { HttpInterceptorService } from '../services/interceptors/http-interceptor.service';
import { AuthGuardService } from '../services/auth/auth-gurd.service';
import { LogoutService } from 'src/app/modules/logout/services/logout.service';

// declaring components
import { QuickLinksComponent } from '../components/quick-links/quick-links.component';
import { MarketingBannerComponent } from '../components/marketing-banner/marketing-banner.component';
import { CheckboxWithImageComponent } from '../components/checkbox-with-image/checkbox-with-image.component';
import { CheckboxGenericComponent } from '../components/checkbox-generic/checkbox-generic.component';
import { ShowErrorComponent } from '../components/show-form-errors/show-form-errors.component';
import { OTPComponent } from '../components/otp/otp.component';
import { SuccessScreenComponent } from '../components/success-screen/success-screen.component';
import { DialogComponent } from '../components/dialog/dialog.component';
import { MenuOptionComponent } from '../components/menu-option/menu-option.component';
import { TransactionGridComponent } from '../components/transaction-grid/transaction-grid.component';
import { InfiniteScrollComponent } from '../components/inifnite-scroll/infinite-scroll.component';
import { ConfirmPayeeComponent } from 'src/app/modules/payee/components/confirm-payee/confirm-payee.component';
import { PaymentsComponent } from '../components/payments/payments.component';
import { TransferFromStepComponent } from '../components/payments/transfer-from-step/transfer-from-step.component';
import { AccountCheckBoxComponent } from '../components/account-checkbox/account-checkbox.component';
import { CheckboxPayeeComponent } from '../components/checkbox-payee/checkbox-payee.component';
import { TransferDetailsComponent } from '../components/payments/transfer-details/transfer-details.component';
import { TransferToStepComponent } from '../components/payments/transfer-to-step/transfer-to-step.component';
import { ConfirmPaymentComponent } from '../components/payments/confirm-payment/confirm-payment.component';
import { CheckboxCardComponent } from '../components/checkbox-card/checkbox-card.component';
import { CheckboxGenericCharityComponent } from '../components/checkbox-generic-charity/checkbox-generic-charity.component';
import {
  InternationalTransferFormComponent
} from '../components/money-transfer/money-transfer-details-step/international-transfer-form/international-transfer-form.component';
import { MoneyTransferComponent } from '../components/money-transfer/money-transfer.component';
import {
  MoneyTransferConfirmStepComponent
} from '../components/money-transfer/money-transfer-confirm-step/money-transfer-confirm-step.component';
import { MoneyTransferToStepComponent } from '../components/money-transfer/money-transfer-to-step/money-transfer-to-step.component';
import { MoneyTransferFromStepComponent } from '../components/money-transfer/money-transfer-from-step/money-transfer-from-step.component';
import {
  MoneyTransferDetailsStepComponent
} from '../components/money-transfer/money-transfer-details-step/money-transfer-details-step.component';
import { CheckboxBeneficiaryComponent } from '../components/checkbox-beneficiary/checkbox-beneficiary.component';
import {
  InternationalTransferSummaryComponent
} from '../components/money-transfer/money-transfer-confirm-step/international-summary/international-summary.component';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { CardCategoriesComponent } from '../components/card-categories/card-categories.component';
import { CardSubCategoriesComponent } from '../components/card-sub-categories/card-sub-categories.component';
import { SavingsAccountComponent } from '../components/open-account/savings-account/savings-account.component';
import { SavingsSummaryAccountComponent } from '../components/open-account/savings-account/savings-summary/savings-summary.component';
import { OpenAccountComponent } from '../components/open-account/open-account.component';
import {
  InvestmentDepositAccountComponent
} from '../components/open-account/investment-deposit-account/investment-deposit-account.component';
import { GhinaSavingsAccountComponent } from '../components/open-account/ghina-savings-account/ghina-savings-account.component';
import { GhinaSummaryComponent } from '../components/open-account/ghina-savings-account/ghina-summary/ghina-summary.component';

import {
  OpenAccountSummaryComponent
} from '../components/open-account/investment-deposit-account/open-account-summary/open-account-summary.component';
import { TermsAndConditionComponent } from '../components/terms-and-condition/terms-and-condition.component';
import { InputGenericComponent } from '../components/input-generic/input-generic.component';
import { AlertMessageComponent } from '../components/alert-message/alert-message.component';
import { SecurityTipsComponent } from '../components/security-tips/security-tips.component';
import { RecaptchaComponent } from '../components/recaptcha/recaptcha.component';
import { RegistrationSuccessScreenComponent } from '../components/auth/registration-success-screen/registration-success-screen.component';
import { CardnumberAtmStepComponent } from '../components/auth/cardnumber-atm-step/cardnumber-atm-step.component';
import { SetPasswordStepComponent } from '../components/auth/set-password-step/set-password-step.component';
import { CheckboxWithAccountComponent } from '../components/checkbox-with-account/checkbox-with-account.component';

@NgModule({
  declarations: [
    QuickLinksComponent,
    MarketingBannerComponent,
    OTPComponent,
    SuccessScreenComponent,
    CheckboxWithImageComponent,
    CheckboxGenericComponent,
    ShowErrorComponent,
    OTPComponent,
    DialogComponent,
    MenuOptionComponent,
    TransactionGridComponent,
    InfiniteScrollComponent,
    AccountCheckBoxComponent,
    CheckboxPayeeComponent,
    ConfirmPayeeComponent,
    PaymentsComponent,
    AccountCheckBoxComponent,
    TransferDetailsComponent,
    TransferToStepComponent,
    TransferFromStepComponent,
    ConfirmPaymentComponent,
    CheckboxCardComponent,
    CheckboxGenericCharityComponent,
    InternationalTransferFormComponent,
    CheckboxBeneficiaryComponent,
    MoneyTransferComponent,
    MoneyTransferConfirmStepComponent,
    MoneyTransferToStepComponent,
    MoneyTransferFromStepComponent,
    MoneyTransferDetailsStepComponent,
    CheckboxBeneficiaryComponent,
    InternationalTransferSummaryComponent,
    InternationalTransferSummaryComponent,
    ProductCardComponent,
    CardCategoriesComponent,
    CardSubCategoriesComponent,
    SavingsAccountComponent,
    SavingsSummaryAccountComponent,
    OpenAccountComponent,
    InvestmentDepositAccountComponent,
    OpenAccountSummaryComponent,
    TermsAndConditionComponent,
    GhinaSavingsAccountComponent,
    GhinaSummaryComponent,
    InputGenericComponent,
    SecurityTipsComponent,
    RecaptchaComponent,
    AlertMessageComponent,
    SecurityTipsComponent,
    RegistrationSuccessScreenComponent,
    CardnumberAtmStepComponent,
    SetPasswordStepComponent,
    CheckboxWithAccountComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    CountdownModule,
    ReactiveFormsModule,
    SharedDirectiveModule,
    TranslateModule,
    LottieAnimationViewModule,
    CarouselModule
  ],

  exports: [
    QuickLinksComponent,
    MarketingBannerComponent,
    OTPComponent,
    SuccessScreenComponent,
    CheckboxWithImageComponent,
    CheckboxGenericComponent,
    ShowErrorComponent,
    OTPComponent,
    DialogComponent,
    MenuOptionComponent,
    TransactionGridComponent,
    InfiniteScrollComponent,
    AccountCheckBoxComponent,
    CheckboxPayeeComponent,
    ConfirmPayeeComponent,
    PaymentsComponent,
    AccountCheckBoxComponent,
    TransferFromStepComponent,
    TransferToStepComponent,
    TransferDetailsComponent,
    ConfirmPaymentComponent,
    CheckboxCardComponent,
    CheckboxGenericCharityComponent,
    InternationalTransferFormComponent,
    MoneyTransferComponent,
    MoneyTransferConfirmStepComponent,
    MoneyTransferToStepComponent,
    MoneyTransferFromStepComponent,
    MoneyTransferDetailsStepComponent,
    CheckboxBeneficiaryComponent,
    InternationalTransferSummaryComponent,
    InternationalTransferSummaryComponent,
    ProductCardComponent,
    CardCategoriesComponent,
    CardSubCategoriesComponent,
    SavingsAccountComponent,
    SavingsSummaryAccountComponent,
    OpenAccountComponent,
    InvestmentDepositAccountComponent,
    OpenAccountSummaryComponent,
    TermsAndConditionComponent,
    InputGenericComponent,
    SecurityTipsComponent,
    RecaptchaComponent,
    AlertMessageComponent,
    SecurityTipsComponent,
    RegistrationSuccessScreenComponent,
    CardnumberAtmStepComponent,
    SetPasswordStepComponent,
    CheckboxWithAccountComponent,
    LottieAnimationViewModule
  ],
  entryComponents: [
    DialogComponent
  ],

  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    AuthGuardService, DatePipe, LogoutService
  ]
})
export class CommonAppModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CommonAppModule,
      providers: []
    };
  }
}
