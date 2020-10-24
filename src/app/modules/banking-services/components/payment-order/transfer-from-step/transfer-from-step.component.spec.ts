import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CdkStepper } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TransferFromStepComponent } from './transfer-from-step.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { CheckboxGenericComponent } from 'src/app/common/components/checkbox-generic/checkbox-generic.component';
import { AccountCheckBoxComponent } from 'src/app/common/components/account-checkbox/account-checkbox.component';
import { CheckboxCardComponent } from 'src/app/common/components/checkbox-card/checkbox-card.component';
import { CheckboxBeneficiaryComponent } from 'src/app/common/components/checkbox-beneficiary/checkbox-beneficiary.component';


describe('TransferFromStepComponent', () => {
  let component: TransferFromStepComponent;
  let fixture: ComponentFixture<TransferFromStepComponent>;

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
      declarations: [TransferFromStepComponent,
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
    fixture = TestBed.createComponent(TransferFromStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
