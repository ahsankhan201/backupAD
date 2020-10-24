import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPasswordStepComponent } from './set-password-step.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowErrorComponent } from '../../show-form-errors/show-form-errors.component';
import { MatStepper } from '@angular/material';
import { CdkStepper } from '@angular/cdk/stepper';

describe('SetPasswordStepComponent', () => {
  let component: SetPasswordStepComponent;
  let fixture: ComponentFixture<SetPasswordStepComponent>;

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
      declarations: [SetPasswordStepComponent, ShowErrorComponent],
      providers: [
        { provide: MatStepper, useValue: {} },
        { provide: CdkStepper, useValue: {} },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPasswordStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
