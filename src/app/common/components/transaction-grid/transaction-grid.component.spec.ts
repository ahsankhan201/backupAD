import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SharedDirectiveModule } from '../../modules/shared-directives-module';
import { MaterialModule } from '../../modules/material.module';

import { TransactionGridService } from '../../services/transaction-grid/transaction-grid.service';
import { SharedService } from '../../services/shared.service';

import { MenuOptionComponent } from '../menu-option/menu-option.component';
import { TransactionGridComponent } from './transaction-grid.component';
import { InfiniteScrollComponent } from '../inifnite-scroll/infinite-scroll.component';

import {
  TRANSACTION_GRID_HEADERS, TRANSACTION_HISTORY_API_URL,
  CREDIT_CARD_TX_HISTORY,
  CREDIT_CARD_TX_MODIFIED_HISTORY,
  PENDING_TX_HISTORY
} from '../../global-test.data';
import { TRANSACTION_GRID_TEXT } from '../../global-constants';
import { RouterTestingModule } from '@angular/router/testing';

describe('TransactionGridComponent', () => {
  let component: TransactionGridComponent;
  let fixture: ComponentFixture<TransactionGridComponent>;
  let service: TransactionGridService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionGridComponent, MenuOptionComponent, InfiniteScrollComponent],
      imports: [SharedDirectiveModule, MaterialModule, HttpClientTestingModule,
        FormsModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [SharedService]
    })
      .compileComponents();
    service = TestBed.get(TransactionGridService);
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(TransactionGridComponent);
    component = fixture.componentInstance;
    component.transactionGridComponentName = TRANSACTION_GRID_TEXT.CREDIT_TEXT;
    component.transactionHeaderList = TRANSACTION_GRID_HEADERS;
    component.transactionsAPIURL = TRANSACTION_HISTORY_API_URL;
    fixture.detectChanges();
  }));

  // Checking component creation method
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Checking ngOnChanges method
  it('Testing handleOnChanges() method', () => {
    component.ngOnChanges({ transactionHistoryAPIURL: new SimpleChange(null, component.transactionHistoryAPIURL, true) });
    expect(component.transactionsAPIURL).toBeDefined();
    // Checking else part of the handle on change method
    component.transactionsAPIURL = undefined;
    component.ngOnChanges({ transactionHistoryAPIURL: new SimpleChange(null, component.transactionHistoryAPIURL, true) });
    expect(component.transactionsAPIURL).toBeUndefined();
  });

  // Testing fetchTransactionData method
  xit('Should update the Transaction history table', async () => {
    component.transactionGridComponentName = TRANSACTION_GRID_TEXT.CREDIT_TEXT;
    component.fetchTransactionData();
    const req = httpMock.expectOne(component.transactionsAPIURL);
    expect(req.request.method).toBe('POST');
    req.flush(CREDIT_CARD_TX_HISTORY);
    httpMock.verify();
    component.isLoadMoreRecords = true;
    component.fetchTransactionData();
    const reqTwo = httpMock.expectOne(component.transactionsAPIURL);
    expect(reqTwo.request.method).toBe('POST');
    reqTwo.flush(CREDIT_CARD_TX_HISTORY);
    httpMock.verify();
    fixture.detectChanges();
  });

  // Testing pending transaction details
  xit('Should update the grid with pending transactions', async () => {
    component.transactionGridComponentName = TRANSACTION_GRID_TEXT.PENDING_TEXT;
    component.fetchTransactionData();
    component.showPendingTransactions = true;
    const req = httpMock.expectOne(component.transactionsAPIURL);
    expect(req.request.method).toBe('POST');
    req.flush(PENDING_TX_HISTORY);
    httpMock.verify();
    fixture.detectChanges();
  });

  // Testing getTansactionHistory method
  it('Should load the grid with corresponding component data', async () => {
    component.getTansactionHistory();
    expect(component.loadSearchedTransactions).toBeFalsy();
    component.getTansactionHistory(true);
    expect(component.loadSearchedTransactions).toBeTruthy();
  });

  // Testing filterPendingTransactions method
  it('Should update the Transaction history table with pending transactions', async () => {
    const pendingTxBtn = fixture.debugElement.query(By.css('.ibd-check-box input'));
    pendingTxBtn.nativeElement.click();
    expect(component.showPendingTransactions).toBeTruthy();
    pendingTxBtn.nativeElement.click();
    expect(component.showPendingTransactions).toBeFalsy();
  });

  // Testing resetTransactionGrid method
  it('Should update the Transaction history table to dealut state', async () => {
    component.loadSearchedTransactions = true;
    component.resetTransactionGrid();
    expect(component.isShowingFilteredTransactions).toBeFalsy();
  });

  // Checking ngOnChanges method
  it('Testing updateGridOnScroll() Method', () => {
    component.isLoadMoreRecords = true;
    component.updateGridOnScroll();
    component.isLoadMoreRecords = false;
    component.updateGridOnScroll();
    expect(component.isLoadMoreRecords).toBeFalsy();
  });

  // Checking ngOnChanges method
  it('Testing updateGridOnScroll() Method', () => {
    component.isLoadMoreRecords = true;
    component.updateGridOnScroll();
    component.isLoadMoreRecords = false;
    component.updateGridOnScroll();
    expect(component.isLoadMoreRecords).toBeFalsy();
  });

  // Testing handleContentToggle method
  it('Should toggle the button content', async () => {
    component.modifiedTransactionHistoryList = CREDIT_CARD_TX_MODIFIED_HISTORY;
    fixture.detectChanges();
    const btnELement = fixture.debugElement.query(By.css(`.${TRANSACTION_GRID_TEXT.HIDE_CONTENT}`));
    btnELement.nativeElement.click();
    btnELement.nativeElement.click();
    expect(btnELement.nativeElement.classList[0]).toEqual(TRANSACTION_GRID_TEXT.HIDE_CONTENT);
    fixture.detectChanges();
  });
});
