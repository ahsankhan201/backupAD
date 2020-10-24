import { CdkStepper } from '@angular/cdk/stepper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxGenericComponent } from 'src/app/common/components/checkbox-generic/checkbox-generic.component';
import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';

import { DraftTransactionDetailsStepComponent } from './draft-transaction-details-step.component';

describe('DraftTransactionDetailsStepComponent', () => {
  let component: DraftTransactionDetailsStepComponent;
  let fixture: ComponentFixture<DraftTransactionDetailsStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedDirectiveModule,
        ReactiveFormsModule,
        MaterialModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [DraftTransactionDetailsStepComponent, CheckboxGenericComponent,
        ShowErrorComponent
      ],
      providers: [{ provide: MatStepper, useValue: {} }, { provide: CdkStepper, useValue: {} }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftTransactionDetailsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
