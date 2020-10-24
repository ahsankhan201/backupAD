import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputGenericComponent } from './input-generic.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowErrorComponent } from '../show-form-errors/show-form-errors.component';
import { MaterialModule } from '../../modules/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('InputGenericComponent', () => {
  let component: InputGenericComponent;
  let fixture: ComponentFixture<InputGenericComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [InputGenericComponent, ShowErrorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
