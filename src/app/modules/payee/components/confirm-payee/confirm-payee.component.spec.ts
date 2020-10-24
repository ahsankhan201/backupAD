import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPayeeComponent } from './confirm-payee.component';
import { OTPComponent } from 'src/app/common/components/otp/otp.component';
import { SuccessScreenComponent } from 'src/app/common/components/success-screen/success-screen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountdownComponent } from 'ngx-countdown';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('ConfirmPayeeComponent', () => {
  let component: ConfirmPayeeComponent;
  let fixture: ComponentFixture<ConfirmPayeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [FormsModule, ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [
        ConfirmPayeeComponent,
        OTPComponent,
        SuccessScreenComponent,
        CountdownComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPayeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
