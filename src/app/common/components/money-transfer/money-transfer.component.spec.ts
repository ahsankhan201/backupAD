import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MoneyTransferComponent } from './money-transfer.component';
import { MaterialModule } from '../../modules/material.module';
import { CheckboxGenericComponent } from '../checkbox-generic/checkbox-generic.component';
import { MoneyTransferFromStepComponent } from './money-transfer-from-step/money-transfer-from-step.component';
import { MoneyTransferToStepComponent } from './money-transfer-to-step/money-transfer-to-step.component';
import { MoneyTransferDetailsStepComponent } from './money-transfer-details-step/money-transfer-details-step.component';
import { MoneyTransferConfirmStepComponent } from './money-transfer-confirm-step/money-transfer-confirm-step.component';
import { AccountCheckBoxComponent } from '../account-checkbox/account-checkbox.component';
import { CheckboxCardComponent } from '../checkbox-card/checkbox-card.component';
import { CheckboxBeneficiaryComponent } from '../checkbox-beneficiary/checkbox-beneficiary.component';
import { SharedDirectiveModule } from '../../modules/shared-directives-module';
import { ShowErrorComponent } from '../show-form-errors/show-form-errors.component';
import { InternationalTransferFormComponent
} from './money-transfer-details-step/international-transfer-form/international-transfer-form.component';
import { SuccessScreenComponent } from '../success-screen/success-screen.component';
import { InternationalTransferSummaryComponent } from './money-transfer-confirm-step/international-summary/international-summary.component';

describe('MoneyTransferComponent', () => {
  let component: MoneyTransferComponent;
  let fixture: ComponentFixture<MoneyTransferComponent>;

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
        MoneyTransferComponent,
        CheckboxGenericComponent,
        MoneyTransferFromStepComponent,
        MoneyTransferToStepComponent,
        MoneyTransferDetailsStepComponent,
        MoneyTransferConfirmStepComponent,
        AccountCheckBoxComponent,
        CheckboxCardComponent,
        CheckboxBeneficiaryComponent,
        ShowErrorComponent,
        InternationalTransferFormComponent,
        SuccessScreenComponent,
        InternationalTransferSummaryComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
