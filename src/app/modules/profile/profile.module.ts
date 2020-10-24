import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './components/profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    HttpClientModule,
    TranslateModule,
    MaterialModule
  ]
})
export class ProfileModule { }
