import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChequeBookComponent } from './cheque-book.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChequeBookSummaryComponent } from '../cheque-book-summary/cheque-book-summary.component';
import { CUSTOMER_DETAILS } from 'src/app/common/global-test.data';
import { SharedService } from 'src/app/common/services/shared.service';

describe('ChequeBookComponent', () => {
  let component: ChequeBookComponent;
  let sharedService: SharedService;
  let fixture: ComponentFixture<ChequeBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChequeBookComponent, ChequeBookSummaryComponent],
      imports: [
        MaterialModule, ReactiveFormsModule, CommonAppModule,
        TranslateModule.forRoot(), SharedDirectiveModule, HttpClientModule,
        RouterTestingModule, BrowserAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeBookComponent);
    component = fixture.componentInstance;
    sharedService = TestBed.get(SharedService);
    sharedService.customerDetail = CUSTOMER_DETAILS;
    sharedService.customerFilteredPrimaryAddress = CUSTOMER_DETAILS.customerAddress[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
