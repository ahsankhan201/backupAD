import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CdkStepper } from '@angular/cdk/stepper';

import { AccountSelectionFormComponent } from './account-selection-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';


describe('AccountSelectionFormComponent', () => {
  let component: AccountSelectionFormComponent;
  let fixture: ComponentFixture<AccountSelectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CommonAppModule,
        SharedDirectiveModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [ AccountSelectionFormComponent ],
      providers: [{
        provide: CdkStepper,
        useValue: {}
      }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
