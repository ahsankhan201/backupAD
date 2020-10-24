import { TestBed, fakeAsync, tick, async, inject } from '@angular/core/testing';

import { FinanceService } from './finance.service';
import { FinanceData, FinancePromotionAd, FinanceDetails } from 'src/app/common/models/finance-module.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FINANCE_DETAILS_DATA, FINANCE_PROMOTION_DATA, FINANCE_DETAILS, FINANCE_DETAILS_PAYLOAD } from '../finance-module-test.data';
import { DOMAINS, SLASH } from 'src/app/common/global-constants';
import { FINANCE_ENDPOINTS } from 'src/app/common/api-endpoints';
import { SharedService } from 'src/app/common/services/shared.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('FinanceService', () => {
  let service: FinanceService;
  let httpMock: HttpTestingController;
  let sharedService: SharedService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.get(FinanceService);
    sharedService = TestBed.get(SharedService);
    httpMock = TestBed.get(HttpTestingController);
  });

  // Testing service creation
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Testing setSelectedFinanceAccount Method
  it('should call setSelectedFinanceAccount', fakeAsync(() => {
    const FINANCE_DATA: FinanceData = FINANCE_DETAILS_DATA[0];
    service.setSelectedFinanceAccount(FINANCE_DATA);
    tick();
    expect(service.selectedFinanceAccount).toEqual(FINANCE_DATA);
  }));

  // Testing fetchPayeeLIst method
  it('Should return Observable<FinancePromotionAd> getFinancePromotion ', async () => {
    const FINANCE_AD_RESPONCE_DATA = FINANCE_PROMOTION_DATA;
    let responceData: FinancePromotionAd;
    service.getFinancePromotion().subscribe((response: FinancePromotionAd) => {
      responceData = response;
      expect(responceData).toEqual(FINANCE_AD_RESPONCE_DATA);
    });
    expect(responceData).not.toBeNull();
  });

});
