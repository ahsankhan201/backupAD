import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CdkStepper } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MoneyTransferToStepComponent } from './money-transfer-to-step.component';
import { CheckboxGenericComponent } from '../../checkbox-generic/checkbox-generic.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { AccountCheckBoxComponent } from '../../account-checkbox/account-checkbox.component';
import { CheckboxCardComponent } from '../../checkbox-card/checkbox-card.component';
import { CheckboxBeneficiaryComponent } from '../../checkbox-beneficiary/checkbox-beneficiary.component';

describe('MoneyTransferToStepComponent', () => {
  let component: MoneyTransferToStepComponent;
  let fixture: ComponentFixture<MoneyTransferToStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedDirectiveModule,
        MaterialModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [MoneyTransferToStepComponent,
        CheckboxGenericComponent,
        CheckboxGenericComponent,
        AccountCheckBoxComponent,
        CheckboxCardComponent,
        CheckboxBeneficiaryComponent
      ],
      providers: [{ provide: MatStepper, useValue: {} }, { provide: CdkStepper, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyTransferToStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
