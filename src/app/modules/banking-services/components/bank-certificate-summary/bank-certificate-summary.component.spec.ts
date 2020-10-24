import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankCertificateSummaryComponent } from './bank-certificate-summary.component';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('BankCertificateSummaryComponent', () => {
  let component: BankCertificateSummaryComponent;
  let fixture: ComponentFixture<BankCertificateSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BankCertificateSummaryComponent],
      imports: [CommonAppModule, HttpClientModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankCertificateSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
