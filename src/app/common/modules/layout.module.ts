import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarComponent } from '../components/layout/sidebar/sidebar.component';
import { HeaderDashboardComponent } from '../components/layout/header-dashboard/header-dashboard.component';
import { RouterModule } from '@angular/router';
import { SharedDirectiveModule } from './shared-directives-module';
import {
    HeaderLoginAndRegistrationComponent
} from '../components/layout/header-login-and-registration/header-login-and-registration.component';
import { CommonAppModule } from './common-app.module';
import { LogoutService } from 'src/app/modules/logout/services/logout.service';
import { FooterDashboardComponent } from '../components/layout/footer-dashboard/footer-dashboard.component';
import { LoaderComponent } from '../components/layout/loader/loader.component';

@NgModule({
    declarations: [
        SidebarComponent,
        HeaderDashboardComponent,
        HeaderLoginAndRegistrationComponent,
        FooterDashboardComponent,
        LoaderComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        SharedDirectiveModule,
        TranslateModule,
        CommonAppModule
    ],
    exports: [
        SidebarComponent,
        HeaderDashboardComponent,
        HeaderLoginAndRegistrationComponent,
        FooterDashboardComponent,
        LoaderComponent
    ],
    providers: [LogoutService]

})
export class LayoutModule { }
