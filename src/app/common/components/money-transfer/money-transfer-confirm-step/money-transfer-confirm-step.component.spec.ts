import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { SuccessScreenComponent } from '../../success-screen/success-screen.component';
import { InternationalTransferSummaryComponent } from './international-summary/international-summary.component';
import { MoneyTransferConfirmStepComponent } from './money-transfer-confirm-step.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { CdkStepper } from '@angular/cdk/stepper';

describe('MoneyTransferConfirmStepComponent', () => {
  let component: MoneyTransferConfirmStepComponent;
  let fixture: ComponentFixture<MoneyTransferConfirmStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedDirectiveModule, HttpClientTestingModule, MaterialModule, RouterTestingModule],
      declarations: [MoneyTransferConfirmStepComponent, SuccessScreenComponent, InternationalTransferSummaryComponent],
      providers: [{
        provide: CdkStepper,
        useValue: {}
      }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyTransferConfirmStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
