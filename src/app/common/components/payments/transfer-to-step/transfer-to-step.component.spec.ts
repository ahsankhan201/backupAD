import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { TransferToStepComponent } from './transfer-to-step.component';
import { CheckboxGenericCharityComponent } from '../../checkbox-generic-charity/checkbox-generic-charity.component';
import { CheckboxGenericComponent } from '../../checkbox-generic/checkbox-generic.component';
import { CheckboxPayeeComponent } from '../../checkbox-payee/checkbox-payee.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('TransferToStepComponent', () => {
  let component: TransferToStepComponent;
  let fixture: ComponentFixture<TransferToStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot(), FormsModule, RouterTestingModule],
      declarations: [
        TransferToStepComponent, CheckboxGenericCharityComponent, CheckboxGenericComponent, CheckboxPayeeComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferToStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
