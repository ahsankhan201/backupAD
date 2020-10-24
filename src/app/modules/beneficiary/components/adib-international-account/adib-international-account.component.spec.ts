import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'src/app/common/modules/material.module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { AdibInternationalAccountComponent } from './adib-international-account.component';
import { AccountSelectionFormComponent } from '../account-selection-form/account-selection-form.component';
import { CdkStepper } from '@angular/cdk/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdibInternationalAccountComponent', () => {
  let component: AdibInternationalAccountComponent;
  let fixture: ComponentFixture<AdibInternationalAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CommonAppModule,
        SharedDirectiveModule,
        HttpClientTestingModule,
        MatStepperModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [
        AdibInternationalAccountComponent ,
        AccountSelectionFormComponent,      ],
      providers: [{
          provide: CdkStepper,
          useValue: {}
        }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdibInternationalAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
