import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BeneficiaryComponent } from './beneficiary.component';
import { BankSelectionComponent } from './bank-selection/bank-selection-component';
import { RegionSelectionComponent } from './region-selection/region-selection-component';
import { AccountSelectionComponent } from './account-selection/account-selection.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account-component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { InternationalAccountComponent } from './other-international-account/other-international-account.component';
import { AdibInternationalAccountComponent } from './adib-international-account/adib-international-account.component';
import { UaeOtherAccountComponent } from './uae-other-account/uae-other-account.component';
import { UaeAdibBeneficiaryComponent } from './uae-adib-beneficiary/uae-adib-beneficiary.component';
import { AccountSelectionFormComponent } from './account-selection-form/account-selection-form.component';

xdescribe('BeneficiaryComponent', () => {
  let component: BeneficiaryComponent;
  let fixture: ComponentFixture<BeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CommonAppModule,
        SharedDirectiveModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        RouterTestingModule ],
      declarations: [
        BeneficiaryComponent,
        BankSelectionComponent,
        RegionSelectionComponent,
        AccountSelectionComponent,
        ConfirmAccountComponent,
        InternationalAccountComponent,
        AdibInternationalAccountComponent,
        UaeOtherAccountComponent,
        UaeAdibBeneficiaryComponent,
        AccountSelectionFormComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
