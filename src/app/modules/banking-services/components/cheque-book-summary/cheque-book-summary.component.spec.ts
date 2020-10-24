import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBookSummaryComponent } from './cheque-book-summary.component';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChequeBookSummaryComponent', () => {
  let component: ChequeBookSummaryComponent;
  let fixture: ComponentFixture<ChequeBookSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChequeBookSummaryComponent],
      imports: [CommonAppModule, HttpClientModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeBookSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
