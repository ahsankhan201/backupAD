import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedService } from './shared.service';

import { OTP_RESPONSE_OBJ, COUNTRY_LIST_MOCK_DATA, CUSTOMER_DETAILS_DATA, CUSTOMER_DETAILS_PAYLOAD } from '../global-test.data';
import { DOMAINS } from '../global-constants';
import { ACCOUNTS_ENDPOINTS, GET_MFP_CUSTOMER_DETAILS_BY_RIM } from '../api-endpoints';
import { CustomerDetails, CustomerDetailsPayload, FinanceData } from '../models/finance-module.model';
import { FINANCE_DETAILS_DATA } from 'src/app/modules/finance/finance-module-test.data';
import { DatePipe } from '@angular/common';

describe('SharedService', () => {
  let service: SharedService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.get(SharedService);
    httpMock = TestBed.get(HttpTestingController);
  });

  // Testing service creation
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Testing isEmpty method
  it('Should return boolean', () => {
    let returnValue = service.isEmpty(null);
    expect(returnValue).toBeTruthy();
    returnValue = service.isEmpty(' ');
    expect(returnValue).toBeFalsy();
  });

  // Testing generateApiUrl method
  it('should return string object', () => {
    const returnedURL = service.generateApiUrl('dummyDomain', true, true);
    expect(returnedURL).toEqual('undefined/adib/sb/app');
  });

  // Testing setSnackBarMessage method
  it('Should set the snackBarMessage object', () => {
    service.setSnackBarMessage(OTP_RESPONSE_OBJ, 'error');
    expect(service.snackBarObject.showSnackBar).toBeTruthy();
  });

  // Testing sliceElementFromList method
  it('should return Array', () => {
    expect(COUNTRY_LIST_MOCK_DATA.length).toEqual(2);
    const returnElements = service.sliceElementFromList(COUNTRY_LIST_MOCK_DATA, 'countryISOCode', 'DZA');
    expect(returnElements.length).toEqual(1);
  });

  // Testing clone method
  it('should return cloned object', () => {
    const clonedObject = service.clone(COUNTRY_LIST_MOCK_DATA);
    expect(clonedObject).toEqual(COUNTRY_LIST_MOCK_DATA);
  });

  // Testing getMobileNoWithCountryCode method
  it('should return mobile no with country code', () => {
    const result = service.getMobileNoWithCountryCode('123456789');
    expect(result).toEqual('+971123456789');
    const result2 = service.getMobileNoWithCountryCode('0123456789');
    expect(result2).toEqual('+971123456789');
  });

  // Testing getCustomerDetails method
  it('Should call getCustomerDetails and return  Observable<CustomerDetails>', () => {
    const CUSTOMER_DETAILS: CustomerDetails = CUSTOMER_DETAILS_DATA;
    const PAYLOAD: CustomerDetailsPayload = CUSTOMER_DETAILS_PAYLOAD;
    const CUSTOMER_DETAILS_API = service.generateApiUrl(DOMAINS.APICONNECT, true, false) + GET_MFP_CUSTOMER_DETAILS_BY_RIM;
    service.getCustomerDetails(PAYLOAD).subscribe((response: CustomerDetails) => {
      expect(response).toEqual(CUSTOMER_DETAILS);
    });
    const req = httpMock.expectOne(CUSTOMER_DETAILS_API);
    expect(req.request.method).toBe('POST');
    req.flush(CUSTOMER_DETAILS);
  });

  // Testing getCustomerDetails method
  it('Should call getAccountList and return  Observable<FinanceData[]>', () => {
    const FINANCE_DATA: FinanceData[] = FINANCE_DETAILS_DATA;
    const ACCOUNTS_LIST_API = service.generateApiUrl(DOMAINS.APICONNECT, true, false) + ACCOUNTS_ENDPOINTS.LIST_OF_ACCOUNTS;
    service.getAccountList().subscribe((response: FinanceData[]) => {
      expect(response).toEqual(FINANCE_DATA);
    });
    const req = httpMock.expectOne(ACCOUNTS_LIST_API);
    expect(req.request.method).toBe('GET');
    req.flush(FINANCE_DATA);
  });

  // Testing getMobileNoWithCountryCode method
  it('setCancelTransactionInfo() should set the cancelTransaction info', () => {
    service.setCancelTransactionInfo(true);
    service.getCancelTransactionInfo().subscribe((response) => {
      expect(response).toBeDefined();
    });
  });
});
