import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatStepper } from '@angular/material';
import { CdkStepper } from '@angular/cdk/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { UsernameStepComponent } from './username-step.component';
import { RegistrationService } from '../../services/registration.service';
import { USER_NAME, USER_NAME_VALID } from '../../registration-module-test.data';


describe('UsernameStepComponent', () => {
  let component: UsernameStepComponent;
  let fixture: ComponentFixture<UsernameStepComponent>;
  let registrationService: RegistrationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [UsernameStepComponent, ShowErrorComponent],
      providers: [
        RegistrationService,
        { provide: MatStepper, useValue: {} },
        { provide: CdkStepper, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernameStepComponent);
    component = fixture.componentInstance;
    registrationService = TestBed.get(RegistrationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing setUserNameForm method
  it('should test setUserNameForm method ', () => {
    component.setUserNameForm();
    expect(component.enableNextBtn).toBeFalsy();
  });

  // Testing validateUserName method
  it('should test validateUserName method ', () => {
    component.validateUserName();
    component.userNameControl.setValue(USER_NAME);
    expect(component.userNameControl.valid).toBeFalsy();
  });

});
