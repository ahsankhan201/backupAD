import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CdkStepper } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionDetailsStepComponent } from './transaction-details-step.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { CheckboxGenericComponent } from 'src/app/common/components/checkbox-generic/checkbox-generic.component';
import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';

describe('TransactionDetailsStepComponent', () => {
  let component: TransactionDetailsStepComponent;
  let fixture: ComponentFixture<TransactionDetailsStepComponent>;

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
      declarations: [
        TransactionDetailsStepComponent,
        CheckboxGenericComponent,
        ShowErrorComponent
      ],
      providers: [{ provide: MatStepper, useValue: {} }, { provide: CdkStepper, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
