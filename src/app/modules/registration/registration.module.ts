import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { AngularResizedEventModule } from 'angular-resize-event';
// Routing Module
import { RegistrationRoutingModule } from './registration-routing.module';
// Custom Modules
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { LayoutModule } from 'src/app/common/modules/layout.module';

// Components
import { RegistrationComponent } from './components/registration.component';
import { CardDetailsStepComponent } from './components/card-details-step/card-details-step.component';
import { UsernameStepComponent } from './components/username-step/username-step.component';
import { PasswordStepComponent } from './components/password-step/password-step.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OtpStepComponent } from './components/otp-step/otp-step.component';

@NgModule({
  declarations: [
    RegistrationComponent,
    CardDetailsStepComponent,
    UsernameStepComponent,
    PasswordStepComponent,
    OtpStepComponent
  ],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    CommonAppModule,
    SharedDirectiveModule,
    LayoutModule,
    MaterialModule,
    TranslateModule,
    ReactiveFormsModule,
    AngularResizedEventModule
  ],
})
export class RegistrationModule { }
