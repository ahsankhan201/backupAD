import { TestBed } from '@angular/core/testing';

import { HttpHeaderService } from './http-header.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('HttpHeaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: HttpHeaderService = TestBed.get(HttpHeaderService);
    expect(service).toBeTruthy();
  });
});
