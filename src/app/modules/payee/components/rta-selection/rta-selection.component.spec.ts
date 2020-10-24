import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { RtaSelectionComponent } from './rta-selection.component';
import { CheckboxWithImageComponent } from 'src/app/common/components/checkbox-with-image/checkbox-with-image.component';
import { PayeeService } from '../../services/payee.service';
import { UTILITY_PROVIDERS_LIST, CHECK_BOX_SELECTOR, PAYEE_SELECTION_TEST_INFO } from '../../payee-module-test.data';
import { PAYEE_SELECTION_MASTER_DATA } from '../../payee-module.constants';
import { RouterTestingModule } from '@angular/router/testing';

describe('RtaSelectionComponent', () => {
  let component: RtaSelectionComponent;
  let fixture: ComponentFixture<RtaSelectionComponent>;
  let payeeService: PayeeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RtaSelectionComponent,
        CheckboxWithImageComponent
      ],
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [PayeeService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtaSelectionComponent);
    component = fixture.componentInstance;
    payeeService = TestBed.get(PayeeService);
    payeeService.utilityProvidersList = UTILITY_PROVIDERS_LIST.allUtilityList;
    component.rtaProvidersList = payeeService.getProductCheckBoxObj(
      payeeService.getServiceProvidersList(PAYEE_SELECTION_MASTER_DATA.RTA_TEXT));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing rtaProviderList property
  it('checking rtaProviderList property existence', () => {
    payeeService.setSelectedProvider(PAYEE_SELECTION_MASTER_DATA.RTA_TEXT);
    payeeService.setSelectedProvider(PAYEE_SELECTION_MASTER_DATA.SALIK_TEXT);
    expect(component.rtaProvidersList).toBeDefined();
    expect(component.rtaProvidersList.length).toEqual(1);
    fixture.detectChanges();
  });

  // Testing handleRTASelection method
  it('checking handleRTASelection method', () => {
    const payeeOptionEle = fixture.debugElement.query(By.css(`.${CHECK_BOX_SELECTOR}`));
    payeeOptionEle.nativeElement.click();
    expect(component.enableNextBtn).toBeTruthy();
    expect(payeeService.selectedProviderProduct.value.toUpperCase()).toEqual(PAYEE_SELECTION_MASTER_DATA.SALIK_TEXT.toUpperCase());
  });

  // Testing handleRTASelection method
  it('checking handleRTASelection method', () => {
    const payeeOptionEle = fixture.debugElement.query(By.css(`.${CHECK_BOX_SELECTOR}`));
    payeeOptionEle.nativeElement.click();
    expect(component.enableNextBtn).toBeTruthy();
    expect(payeeService.selectedProviderProduct.value.toUpperCase()).toEqual(PAYEE_SELECTION_MASTER_DATA.SALIK_TEXT.toUpperCase());
  });
});
