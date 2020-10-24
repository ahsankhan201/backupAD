import { CdkStepper } from '@angular/cdk/stepper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AccountCheckBoxComponent } from 'src/app/common/components/account-checkbox/account-checkbox.component';
import { CheckboxCardComponent } from 'src/app/common/components/checkbox-card/checkbox-card.component';
import { CheckboxGenericComponent } from 'src/app/common/components/checkbox-generic/checkbox-generic.component';
import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';

import { DraftBeneficiaryDetailsStepComponent } from './draft-beneficiary-details-step.component';

describe('DraftBeneficiaryDetailsStepComponent', () => {
  let component: DraftBeneficiaryDetailsStepComponent;
  let fixture: ComponentFixture<DraftBeneficiaryDetailsStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        SharedDirectiveModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        FormsModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        DraftBeneficiaryDetailsStepComponent,
        AccountCheckBoxComponent,
        CheckboxGenericComponent,
        CheckboxCardComponent,
        ShowErrorComponent
      ],
      providers: [{ provide: MatStepper, useValue: {} }, { provide: CdkStepper, useValue: {} }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftBeneficiaryDetailsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
