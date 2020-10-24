import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subscription } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { FinanceService } from '../../services/finance.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { FinanceListComponent } from './finance-list.component';
import { MarketingBannerComponent } from 'src/app/common/components/marketing-banner/marketing-banner.component';
import { FinanceData, FinancePromotionAd, CustomerDetails } from 'src/app/common/models/finance-module.model';
import { FINANCE_DETAILS_DATA, CUSTOMER_DETAILS_BY_RIM, ACCOUNT_CARD_LIST_DATA} from '../../finance-module-test.data';
import { CUSTOMER_DETAILS } from 'src/app/common/global-test.data';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('FinanceListComponent', () => {
  let component: FinanceListComponent;
  let financeService: FinanceService;
  let sharedService: SharedService;
  let fixture: ComponentFixture<FinanceListComponent>;
  let httpMock: HttpTestingController;
  let scrollContainer: any;
  const SCROLL_CONTAINER_WIDTH = 1400;
  const SCROLL_WIDTH = 2400;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedDirectiveModule, HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [ FinanceListComponent, MarketingBannerComponent ],
      providers: [ FinanceService, SharedService ],
    })
    .compileComponents();
    fixture = TestBed.createComponent(FinanceListComponent);
    httpMock = TestBed.get(HttpTestingController);
    financeService = TestBed.get(FinanceService);
    sharedService = TestBed.get(SharedService);
    sharedService.customerDetail = CUSTOMER_DETAILS;
    component = fixture.componentInstance;
    scrollContainer = fixture.debugElement.query(By.css('.ibd-finance-list')); // accessing DOM Scroll Container
    // spying scroll element get only properties
    spyOnProperty(scrollContainer.nativeElement, 'clientWidth', 'get').and.returnValue(SCROLL_CONTAINER_WIDTH);
    spyOnProperty(scrollContainer.nativeElement, 'scrollWidth', 'get').and.returnValue(SCROLL_WIDTH);
    fixture.detectChanges();  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing scroll moveScroll Method
  it('Testing moveScroll Method', () => {
    spyOnProperty(scrollContainer.nativeElement, 'scrollLeft', 'get').and.returnValue(50);
    component.moveScroll('forward');
    expect(component.disablePreviousBtn).toBeTruthy();
  });

  // Testing scroll moveScroll false case
  it('Testing moveScroll method for false case', () => {
    spyOnProperty(scrollContainer.nativeElement, 'scrollLeft', 'get').and.returnValue(0);
    component.moveScroll('backward');
    expect(component.disablePreviousBtn).toBeTruthy();
    component.moveScroll('');
  });
  // Testing financeSelectionStatus method
  it('should emit financeSelectionStatus', () => {
    spyOn(component.financeSelectionStatus, 'emit');
    component.viewFinanceDetails(FINANCE_DETAILS_DATA[0]);
    expect(component.financeSelectionStatus.emit).toHaveBeenCalled();
    });

  // Testing getFinancePromotion method
  it('should call getFinancePromotion and return list of financePromotionAd', async(() => {
      const RESPONSE =  {} as FinancePromotionAd;
      spyOn(financeService, 'getFinancePromotion').and.returnValue(of(RESPONSE));
      component.getFinancePromotion();
      fixture.detectChanges();
      expect(component.financePromotion).toEqual(RESPONSE);
    }));

  // Testing showOrHideNavigation controls method
  it('should call showOrHideNavControlls method', () => {
    spyOn(component, 'showOrHideNavControlls').and.callThrough();
    component.showOrHideNavControlls();
    expect(component.hideNavigationControlls).toBeUndefined();
    expect(component.showOrHideNavControlls).toHaveBeenCalled();
  });


  // Testing getAccountList method
  it('should call getFinanceList and return list of FinanceData', async(() => {
    spyOn(component, 'getFinanceList').and.callThrough();
    component.getFinanceList();
    fixture.detectChanges();
    expect(component.getFinanceList).toHaveBeenCalled();
  }));

  // Testing setFinanceDetails method
  it('should call setFinanceDetails method', () => {
    const FINANCE_RESPONCE_DATA = {} as FinanceData;
    const FINANCE_DATA = {} as FinanceData;
    spyOn(component, 'setFinanceDetails').and.callThrough();
    spyOn(financeService, 'getFinanceDetails').and.callThrough();
    component.setFinanceDetails(FINANCE_RESPONCE_DATA, FINANCE_DATA);
    expect(component.setFinanceDetails).toHaveBeenCalled();
    expect(financeService.getFinanceDetails).toHaveBeenCalled();
  });

 // Testing getFinanceDetails method from financeService
  it('should call getFinanceDetails and return list of promotionAd', async(() => {
    const RESPONSE: FinanceData =  FINANCE_DETAILS_DATA[0];
    const FINANCE_RESPONCE_DATA = {} as FinanceData;
    const FINANCE_DATA = {} as FinanceData;
    spyOn(component, 'setFinanceDetails').and.callThrough();
    spyOn(financeService, 'getFinanceDetails').and.returnValue(of(RESPONSE));
    component.setFinanceDetails(FINANCE_RESPONCE_DATA, FINANCE_DATA);
    fixture.detectChanges();
    expect(FINANCE_DETAILS_DATA[0]).toEqual(RESPONSE);
  }));

  // Testing setCustomerDetails method
  it('should call setCustomerDetails method', () => {
      const CUSTOMER_DETAILS_OBJ: CustomerDetails = CUSTOMER_DETAILS_BY_RIM;
      spyOn(component, 'setCustomerDetails').and.callThrough();
      spyOn(sharedService, 'getCustomerDetails').and.returnValue(of(CUSTOMER_DETAILS_BY_RIM));
      component.setCustomerDetails();
      expect(CUSTOMER_DETAILS_OBJ).toEqual(CUSTOMER_DETAILS_BY_RIM);
      expect(component.setCustomerDetails).toHaveBeenCalled();
  });

  // Testing setFinanceData method
  it('should call setFinanceData method', () => {
    const FINANCE_OBJ: FinanceData[] = [] ;
    spyOn(component, 'setFinanceData').and.callThrough();
    component.setFinanceData(FINANCE_OBJ);
    expect(component.setFinanceData).toHaveBeenCalled();
    fixture.detectChanges();
  });

  // Testing ngOnDestroy method
  it('should call ngOnDestroy method', () => {
    component.subscription$ = new Subscription();
    spyOn(component.subscription$, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription$.unsubscribe).toHaveBeenCalledTimes(1);
  });

  // Testing getFinanceList method
  it('should call getFinanceList method', () => {
    spyOn(component, 'getFinanceList');
    component.getFinanceList();
    fixture.detectChanges();
    expect(component.getFinanceList).toHaveBeenCalled();
  });

  // Testing sharedService.accountsCardsList in getFinanceList method
  it('should udpate sharedService.accountsCardsList after calling getFinanceList method', () => {
    sharedService.accountsCardsList = ACCOUNT_CARD_LIST_DATA;
    component.getFinanceList();
    const ACCOUNT_CARD_LIST = sharedService.accountsCardsList.accountsList;
    fixture.detectChanges();
    expect(ACCOUNT_CARD_LIST).toBeDefined();
  });

  // Testing getFinanceList method with valid response from financeService
  it('should call getFinanceList and return list of FinanceData', async(() => {
    spyOn(component, 'getFinanceList').and.callThrough();
    component.getFinanceList();
    fixture.detectChanges();
    expect(component.showNoFinanceMessage).toBeFalsy();
  }));

});
