import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordStepComponent } from './password-step.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatStepper } from '@angular/material';
import { CdkStepper } from '@angular/cdk/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';
import { PASSWORD, RE_TYPE_PASSWORD } from '../../registration-module-test.data';

describe('PasswordStepComponent', () => {
  let component: PasswordStepComponent;
  let fixture: ComponentFixture<PasswordStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        FormsModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      declarations: [PasswordStepComponent, ShowErrorComponent],
      providers: [
        { provide: MatStepper, useValue: {} },
        { provide: CdkStepper, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing setPasswordForm method
  it('should test setPasswordForm method ', () => {
    component.setPasswordForm();
    expect(component.enableNextBtn).toBeFalsy();
  });

  // Testing validatePassword method
  it('should test validatePassword method ', () => {
    component.validatePassword();
    component.passwordControl.setValue(PASSWORD);
    expect(component.passwordControl.valid).toBeFalsy();
  });

  // Testing matchPassword method
  it('should test matchPassword method ', () => {
    component.matchPassword();
    component.passwordControl.setValue(PASSWORD);
    component.confirmPasswordControl.setValue(RE_TYPE_PASSWORD);
    expect(component.confirmPasswordControl.valid).toBeFalsy();
  });

  // Testing setVisibility method
  it('should test setVisibility method ', () => {
    component.hide = true;
    component.setVisibility();
    expect(component.hide).toBeFalsy();
  });
});
