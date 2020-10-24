import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCertificateComponent } from './bank-certificate.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { BankCertificateSummaryComponent } from '../bank-certificate-summary/bank-certificate-summary.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BankCertificateComponent', () => {
  let component: BankCertificateComponent;
  let fixture: ComponentFixture<BankCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BankCertificateComponent, BankCertificateSummaryComponent],
      imports: [
        MaterialModule, ReactiveFormsModule, CommonAppModule,
        TranslateModule.forRoot(), SharedDirectiveModule, HttpClientModule,
        RouterTestingModule, BrowserAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
