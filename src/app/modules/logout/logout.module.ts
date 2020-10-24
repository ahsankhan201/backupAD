import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

// Routing Module
import { LogoutRoutingModule } from './logout-routing.module';

// Custom Modules
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { LayoutModule } from 'src/app/common/modules/layout.module';

// Components
import { LogoutComponent } from './components/logout.component';


@NgModule({
  declarations: [
    LogoutComponent
  ],
  imports: [
    CommonModule,
    LogoutRoutingModule,
    CommonAppModule,
    TranslateModule,
    HttpClientModule,
    LayoutModule
  ],
})
export class LogoutModule { }
