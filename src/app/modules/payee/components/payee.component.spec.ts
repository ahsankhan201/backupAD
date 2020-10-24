import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PayeeComponent } from './payee.component';
import { PayeeSelectionComponent } from './payee-selection/payee-selection.component';
import { ServiceProviderComponent } from './service-provider/service-provider.component';
import { PayeeAccountFormComponent } from './payee-account-form/payee-account-form.component';
import { RtaSelectionComponent } from './rta-selection/rta-selection.component';
import { TelecomSelectionComponent } from './telecom-selection/telecom-selection.component';
import { WaterElectricitySelectionComponent } from './water-electricity-selection/water-electricity-selection.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { RouterTestingModule } from '@angular/router/testing';

describe('PayeeComponent', () => {
  let component: PayeeComponent;
  let fixture: ComponentFixture<PayeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        CommonAppModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        SharedDirectiveModule,
        RouterTestingModule
      ],
      declarations: [
        PayeeComponent,
        PayeeSelectionComponent,
        ServiceProviderComponent,
        PayeeAccountFormComponent,
        RtaSelectionComponent,
        TelecomSelectionComponent,
        WaterElectricitySelectionComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
