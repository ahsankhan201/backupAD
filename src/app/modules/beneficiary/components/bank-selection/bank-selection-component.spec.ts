import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BankSelectionComponent } from './bank-selection-component';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CdkStepper } from '@angular/cdk/stepper';
import { RouterTestingModule } from '@angular/router/testing';

describe('BankSelectionComponent', () => {
  let component: BankSelectionComponent;
  let fixture: ComponentFixture<BankSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonAppModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedDirectiveModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [BankSelectionComponent],
      providers: [
        {
          provide: CdkStepper,
          useValue: {},
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
