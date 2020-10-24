import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalAccountComponent } from './other-international-account.component';
import { AccountSelectionFormComponent } from '../account-selection-form/account-selection-form.component';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CdkStepper } from '@angular/cdk/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('InternationalAccountComponent', () => {
  let component: InternationalAccountComponent;
  let fixture: ComponentFixture<InternationalAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonAppModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedDirectiveModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [
        InternationalAccountComponent,
        AccountSelectionFormComponent,
      ],
      providers: [
        {
          provide: CdkStepper,
          useValue: {},
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternationalAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
