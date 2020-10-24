import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CdkStepper } from '@angular/cdk/stepper';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from 'src/app/common/modules/material.module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';

import { AccountSelectionComponent } from './account-selection.component';
import { InternationalAccountComponent } from '../other-international-account/other-international-account.component';
import { AdibInternationalAccountComponent } from '../adib-international-account/adib-international-account.component';
import { UaeAdibBeneficiaryComponent } from '../uae-adib-beneficiary/uae-adib-beneficiary.component';
import { UaeOtherAccountComponent } from '../uae-other-account/uae-other-account.component';
import { AccountSelectionFormComponent } from '../account-selection-form/account-selection-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('AccountSelectionComponent', () => {
  let component: AccountSelectionComponent;
  let fixture: ComponentFixture<AccountSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CommonAppModule,
        SharedDirectiveModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [ AccountSelectionComponent,
        InternationalAccountComponent,
        AdibInternationalAccountComponent,
        UaeAdibBeneficiaryComponent,
        UaeOtherAccountComponent,
        AccountSelectionFormComponent,
     ] ,
     providers: [{
      provide: CdkStepper,
      useValue: {}
    }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
