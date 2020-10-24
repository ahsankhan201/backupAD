import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDetailsStepComponent } from './card-details-step.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatStepper } from '@angular/material';
import { CdkStepper } from '@angular/cdk/stepper';

import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CardDetailsStepComponent', () => {
  let component: CardDetailsStepComponent;
  let fixture: ComponentFixture<CardDetailsStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        FormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        MaterialModule,
        CommonAppModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        CardDetailsStepComponent
      ],
      providers: [
        { provide: MatStepper, useValue: {} },
        { provide: CdkStepper, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDetailsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
