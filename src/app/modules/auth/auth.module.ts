import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularResizedEventModule } from 'angular-resize-event';
import { HttpClientModule } from '@angular/common/http';

// Custom Modules
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { LayoutModule } from 'src/app/common/modules/layout.module';
import { MaterialModule } from 'src/app/common/modules/material.module';

// Components
import { AuthComponent } from './components/auth.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ForgotOtpStepComponent } from './components/forgot-otp-step/forgot-otp-step.component';
import { ForgotUsernameComponent } from './components/forgot-username/forgot-username.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ForgotOtpStepComponent,
    ForgotUsernameComponent
  ],
  imports: [
    CommonModule,
    CommonAppModule,
    SharedDirectiveModule,
    LayoutModule,
    MaterialModule,
    TranslateModule,
    ReactiveFormsModule,
    AngularResizedEventModule,
    HttpClientModule,
    RouterModule
  ]
})
export class AuthModule { }
