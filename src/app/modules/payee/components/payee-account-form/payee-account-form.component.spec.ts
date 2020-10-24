import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayeeAccountFormComponent } from './payee-account-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CdkStepper } from '@angular/cdk/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';

describe('PayeeAccountFormComponent', () => {
  let component: PayeeAccountFormComponent;
  let fixture: ComponentFixture<PayeeAccountFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CommonAppModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        SharedDirectiveModule
      ],
      declarations: [
        PayeeAccountFormComponent
      ],
      providers: [{
        provide: CdkStepper,
        useValue: {}
      }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
