import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BankingServicesService } from './banking-services.service';

describe('BankingServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: BankingServicesService = TestBed.get(BankingServicesService);
    expect(service).toBeTruthy();
  });
});
