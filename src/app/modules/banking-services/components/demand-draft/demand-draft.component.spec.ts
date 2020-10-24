import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AccountCheckBoxComponent } from 'src/app/common/components/account-checkbox/account-checkbox.component';
import { CheckboxGenericComponent } from 'src/app/common/components/checkbox-generic/checkbox-generic.component';
import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';
import { SuccessScreenComponent } from 'src/app/common/components/success-screen/success-screen.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { DemandDraftComponent } from './demand-draft.component';
import { DraftBeneficiaryDetailsStepComponent } from './draft-beneficiary-details-step/draft-beneficiary-details-step.component';
import { DraftConfirmationStepComponent } from './draft-confirmation-step/draft-confirmation-step.component';
import { DraftTransactionDetailsStepComponent } from './draft-transaction-details-step/draft-transaction-details-step.component';
import { DraftTransferFromStepComponent } from './draft-transfer-from-step/draft-transfer-from-step.component';

describe('DemandDraftComponent', () => {
  let component: DemandDraftComponent;
  let fixture: ComponentFixture<DemandDraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        TranslateModule.forRoot(),
        FormsModule,
        SharedDirectiveModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [
        DemandDraftComponent,
        DraftBeneficiaryDetailsStepComponent,
        DraftConfirmationStepComponent,
        DraftTransferFromStepComponent,
        DraftTransactionDetailsStepComponent,
        ShowErrorComponent,
        SuccessScreenComponent,
        AccountCheckBoxComponent,
        CheckboxGenericComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
