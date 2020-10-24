import { TestBed } from '@angular/core/testing';

import { BeneficiaryService } from './beneficiary.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('BeneficiaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: BeneficiaryService = TestBed.get(BeneficiaryService);
    expect(service).toBeTruthy();
  });
});
