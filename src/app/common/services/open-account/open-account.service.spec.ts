import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OpenAccountService } from './open-account.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('OpenAccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: OpenAccountService = TestBed.get(OpenAccountService);
    expect(service).toBeTruthy();
  });
});
