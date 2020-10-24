import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CdkStepper } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { MoneyTransferDetailsStepComponent } from './money-transfer-details-step.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { CheckboxGenericComponent } from '../../checkbox-generic/checkbox-generic.component';
import { ShowErrorComponent } from '../../show-form-errors/show-form-errors.component';
import { InternationalTransferFormComponent } from './international-transfer-form/international-transfer-form.component';


xdescribe('MoneyTransferDetailsStepComponent', () => {
  let component: MoneyTransferDetailsStepComponent;
  let fixture: ComponentFixture<MoneyTransferDetailsStepComponent>;

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
        MoneyTransferDetailsStepComponent,
        CheckboxGenericComponent,
        ShowErrorComponent,
        InternationalTransferFormComponent,
      ],
      providers: [{ provide: MatStepper, useValue: {} }, { provide: CdkStepper, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyTransferDetailsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
