import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CardnumberAtmStepComponent } from './cardnumber-atm-step.component';
import { AlertMessageComponent } from '../../alert-message/alert-message.component';
import { InputGenericComponent } from '../../input-generic/input-generic.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ShowErrorComponent } from '../../show-form-errors/show-form-errors.component';
import { MaterialModule } from 'src/app/common/modules/material.module';

describe('CardnumberAtmStepComponent', () => {
  let component: CardnumberAtmStepComponent;
  let fixture: ComponentFixture<CardnumberAtmStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule ,
        HttpClientTestingModule, FormsModule, MaterialModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [CardnumberAtmStepComponent, ShowErrorComponent,
        AlertMessageComponent, InputGenericComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardnumberAtmStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
