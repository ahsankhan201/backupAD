import { TestBed } from '@angular/core/testing';

import { AccountlistService } from './accountlist.service';
import { HttpClientModule, } from '@angular/common/http';

describe('AccountlistService', () => {
  const accountlistObj = [{ accountNumber: '1232456' }];
  const coverCardObj = { cardTitle: 'ADIB Covered Card is Available' };
  const accontMockedObj = [{ accountNumber: '1232456' }, { accountNumber: '1232456' }, { accountNumber: '1232456' },
  { accountNumber: '1232456' }];
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: AccountlistService = TestBed.get(AccountlistService);
    expect(service).toBeTruthy();
  });

  // Testing addCoverCardToAccountList method
  xit('Testing sorting of accounts list info', () => {
    const service: AccountlistService = TestBed.get(AccountlistService);
    service.addCoverCardToAccountList(accountlistObj, coverCardObj);
    expect(accountlistObj.length).toEqual(2);
    service.addCoverCardToAccountList(accontMockedObj, coverCardObj);
    expect(accontMockedObj.length).toEqual(5);
  });
});
