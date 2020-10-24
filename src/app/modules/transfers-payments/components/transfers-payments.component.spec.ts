import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { TransfersPaymentsComponent } from './transfers-payments.component';
import { BenificiaryListComponent } from './beneficiary-list/beneficiary-list.component';
import { PayeeListComponent } from './payee-list/payee-list.component';


describe('TransfersPaymentsComponent', () => {
  let component: TransfersPaymentsComponent;
  let fixture: ComponentFixture<TransfersPaymentsComponent>;
  const dialogMock = {
    close: () => { }
    };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonAppModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule
      ],
      declarations: [
        TransfersPaymentsComponent,
        BenificiaryListComponent,
        PayeeListComponent,
      ],
      providers: [
        {provide: MatDialogRef, useValue: dialogMock},
        {provide: MAT_DIALOG_DATA, useValue: []}]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfersPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
