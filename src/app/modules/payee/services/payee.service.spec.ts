import { TestBed } from '@angular/core/testing';

import { PayeeService } from './payee.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { BENEFICIARY_ENDPOINTS } from 'src/app/common/api-endpoints';
import { UTILITY_PROVIDERS_LIST } from '../payee-module-test.data';
import { AllUtilityList } from 'src/app/common/models/beneficiary-module.model';

describe('PayeeService', () => {
  let service: PayeeService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(PayeeService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Testing fetchPayeeLIst method
  xit('Should return Observable<UtilityProviders[]>', () => {
    const UTILITY_LIST_API = `${environment.API_CONNECT_URL}${environment.ADIB}${environment.APP}${BENEFICIARY_ENDPOINTS.UTILITY_PROVIDER}`;
    service.fetchPayeeLIst(UTILITY_LIST_API).subscribe((response: AllUtilityList) => {
      expect(response).toEqual(UTILITY_PROVIDERS_LIST);
    });
    const req = httpMock.expectOne(UTILITY_LIST_API);
    expect(req.request.method).toBe('GET');
    req.flush(UTILITY_PROVIDERS_LIST);
  });
});
