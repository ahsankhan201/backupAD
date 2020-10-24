import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { TransactionGridService } from './transaction-grid.service';
import { SharedService } from '../shared.service';

import {
  FINANCE_TX_HISTORY, DEBIT_TX_HISTORY, ACCOUNT_TX_HISTORY,
  TRANSACTION_HISTORY_API_URL, CREDIT_CARD_TX_HISTORY, PENDING_TX_HISTORY
} from '../../global-test.data';
import { TRANSACTION_GRID_TEXT } from '../../global-constants';
import { RouterTestingModule } from '@angular/router/testing';

describe('TransactionGridService', () => {
  let service: TransactionGridService;
  let sharedService: SharedService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.get(TransactionGridService);
    sharedService = TestBed.get(SharedService);
    httpMock = TestBed.get(HttpTestingController);
  });

  // Testing service creation
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Testing fetchPayeeLIst method
  xit('Should return transaction history Observable<any>', () => {
    const TRANSACTION_LIST_API = TRANSACTION_HISTORY_API_URL;
    service.getTransactionHistory(TRANSACTION_LIST_API, sharedService.transactionHistoryPayLoad).subscribe((response: any) => {
      expect(response.body).toEqual(CREDIT_CARD_TX_HISTORY);
    });
    const req = httpMock.expectOne(TRANSACTION_LIST_API);
    expect(req.request.method).toBe('POST');
    req.flush(CREDIT_CARD_TX_HISTORY);
    httpMock.verify();
  });

  // Testing generateTransactionGridData method
  it('Should return transaction history FINANCE object', () => {
    const FINANCE_TX_HISTORY_OBJ = service.getTransactionHistoryResponseObject(FINANCE_TX_HISTORY, TRANSACTION_GRID_TEXT.FINANCE_TEXT);
    expect(FINANCE_TX_HISTORY_OBJ.length).toEqual(1);
    service.generateTransactionProperties(TRANSACTION_GRID_TEXT.FINANCE_TEXT, FINANCE_TX_HISTORY_OBJ[0]);
  });

  // Testing getTransactionHistoryResponseObject method for debit card history
  it('Should return transaction history DEBIT CARD object', () => {
    const DEBIT_TX_HISTORYOBJ = service.getTransactionHistoryResponseObject(DEBIT_TX_HISTORY, TRANSACTION_GRID_TEXT.DEBIT_TEXT);
    expect(DEBIT_TX_HISTORYOBJ.length).toEqual(1);
    service.generateTransactionProperties(TRANSACTION_GRID_TEXT.DEBIT_TEXT, DEBIT_TX_HISTORYOBJ[0]);
  });

  // Testing getTransactionHistoryResponseObject method for account history
  it('Should return transaction history ACCOUNT HISTORY object', () => {
    const ACCOUNT_TX_HISTORYOBJ = service.getTransactionHistoryResponseObject(ACCOUNT_TX_HISTORY, TRANSACTION_GRID_TEXT.ACCOUNT_TEXT);
    expect(ACCOUNT_TX_HISTORYOBJ.length).toEqual(1);
    service.generateTransactionProperties(TRANSACTION_GRID_TEXT.ACCOUNT_TEXT, ACCOUNT_TX_HISTORYOBJ[0]);
  });

  // Testing getTransactionHistoryResponseObject method for account history
  it('Should return transaction history ACCOUNT HISTORY object', () => {
    const CREDIT_TX_HISTORYOBJ = service.getTransactionHistoryResponseObject(CREDIT_CARD_TX_HISTORY, TRANSACTION_GRID_TEXT.CREDIT_TEXT);
    expect(CREDIT_TX_HISTORYOBJ.length).toEqual(1);
    service.generateTransactionProperties(TRANSACTION_GRID_TEXT.CREDIT_TEXT, CREDIT_TX_HISTORYOBJ[0]);
  });

  // Testing getTransactionHistoryResponseObject method for account history
  it('Should return transaction history ACCOUNT HISTORY object', () => {
    const PENDING_TX_HISTORYOBJ = service.getTransactionHistoryResponseObject(PENDING_TX_HISTORY, TRANSACTION_GRID_TEXT.PENDING_TEXT);
    expect(PENDING_TX_HISTORYOBJ.length).toEqual(1);
    service.generateTransactionProperties(TRANSACTION_GRID_TEXT.PENDING_TEXT, PENDING_TX_HISTORYOBJ[0]);
  });

  // Testing generateTransactionGridData method for account history
  it('Should return transaction history TransactionGridModel[] object', () => {
    const ACCOUNT_TX_HISTORY_ROW = service.generateTransactionGridData(ACCOUNT_TX_HISTORY.accountHistory,
      TRANSACTION_GRID_TEXT.ACCOUNT_TEXT);
    expect(ACCOUNT_TX_HISTORY_ROW).toBeDefined();
  });

  // Testing filterPendingTransactionHistory method for account history
  it('Should return transaction history PendingTransactionRow[] object', () => {
    const PENDING_TX_HISTORY_ROW = service.filterPendingTransactionHistory(PENDING_TX_HISTORY,
      '78');
    expect(PENDING_TX_HISTORY_ROW[0].transactionAmount).toContain('78');
  });
});
