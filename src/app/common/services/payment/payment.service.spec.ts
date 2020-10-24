import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { PaymentService } from './payment.service';
import { RouterTestingModule } from '@angular/router/testing';


describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.get(PaymentService);
    httpMock = TestBed.get(HttpTestingController);
  });

  // Testing service creation
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
