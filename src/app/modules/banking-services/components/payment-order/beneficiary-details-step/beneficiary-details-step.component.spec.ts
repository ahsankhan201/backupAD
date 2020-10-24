import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BeneficiaryDetailsStepComponent } from './beneficiary-details-step.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { CheckboxGenericComponent } from 'src/app/common/components/checkbox-generic/checkbox-generic.component';
import { AccountCheckBoxComponent } from 'src/app/common/components/account-checkbox/account-checkbox.component';
import { CheckboxCardComponent } from 'src/app/common/components/checkbox-card/checkbox-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';
import { MatStepper } from '@angular/material';
import { CdkStepper } from '@angular/cdk/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BeneficiaryDetailsStepComponent', () => {
  let component: BeneficiaryDetailsStepComponent;
  let fixture: ComponentFixture<BeneficiaryDetailsStepComponent>;

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
        BeneficiaryDetailsStepComponent,
        CheckboxGenericComponent,
        AccountCheckBoxComponent,
        CheckboxCardComponent,
        ShowErrorComponent
      ],
      providers: [{ provide: MatStepper, useValue: {} }, { provide: CdkStepper, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryDetailsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
