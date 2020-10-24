import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmPaymentComponent } from './confirm-payment.component';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { CardNumberFormatPipe } from 'src/app/common/pipes/card-number-format/card-number-format.pipe';
import { NumberFormatPipe } from 'src/app/common/pipes/number-format/number-format.pipe';
import { DecimalValuePipe } from 'src/app/common/pipes/decimal-value/decimal-value.pipe';
import { SuccessScreenComponent } from '../../success-screen/success-screen.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConfirmPaymentComponent', () => {
  let component: ConfirmPaymentComponent;
  let fixture: ComponentFixture<ConfirmPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot(), MatDialogModule, RouterTestingModule],
      declarations: [
        ConfirmPaymentComponent,
        CardNumberFormatPipe,
        NumberFormatPipe,
        DecimalValuePipe,
        SuccessScreenComponent
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
    ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
