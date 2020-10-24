import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MoneyTransferService } from './money-transfer.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('MoneyTransferService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: MoneyTransferService = TestBed.get(MoneyTransferService);
    expect(service).toBeTruthy();
  });
});
