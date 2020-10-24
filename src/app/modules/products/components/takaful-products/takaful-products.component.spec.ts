import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { PRODUCT_CARD_DATA, CONTACT_MODES, CONTACT_TIMINGS } from 'src/app/common/global-test.data';
import { PRODUCT_CARD_TEXT } from '../../products-module.constants';
import { ProductsService } from '../../services/products.service';

import { TakafulProductsComponent } from './takaful-products.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOMER_DETAILS } from 'src/app/common/global-test.data';
import { SharedService } from '../../../../common/services/shared.service';

describe('TakafulProductsComponent', () => {
  let sharedService: SharedService;
  let component: TakafulProductsComponent;
  let fixture: ComponentFixture<TakafulProductsComponent>;
  let productService: ProductsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        CommonAppModule,
        ReactiveFormsModule,
        MaterialModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [TakafulProductsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakafulProductsComponent);
    productService = TestBed.get(ProductsService);
    sharedService = TestBed.get(SharedService);
    sharedService.customerDetail = CUSTOMER_DETAILS;
    sharedService.customerFilteredPrimaryAddress = CUSTOMER_DETAILS.customerAddress[0];
    component = fixture.componentInstance;
    component.catalogList = PRODUCT_CARD_DATA;
    component.takafulEquiryModes = CONTACT_MODES;
    component.takafulEquiryTimings = CONTACT_TIMINGS;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // testing getSelectedProductInfo method
  it('checking getSelectedProductInfo() method', () => {
    const productCradViewMoreBtn = fixture.debugElement.query(By.css('span.cta-btn'));
    productCradViewMoreBtn.nativeElement.click();
    const productCrad = fixture.debugElement.query(By.css('.cta-btn.cta-link-btn'));
    productCrad.nativeElement.click();
    expect(component.selectedProductInfo.productNameEnglish).toEqual(PRODUCT_CARD_DATA[0].productNameEnglish);
  });
  // Testing getSelectedContactMode method
  it('checking getSelectedContactMode() method', () => {
    component.getSelectedContactMode(CONTACT_MODES[1]);
    expect(component.selectedContactMode).toEqual(CONTACT_MODES[1].id);
  });
  // Testing getSelectedTimings method
  it('checking getSelectedTimings() method', () => {
    component.getSelectedTimings(CONTACT_TIMINGS[0]);
    expect(component.selectedContactTime).toEqual(CONTACT_TIMINGS[0].id);
  });
  // Testing showtakafulsTab and registerProductEnquiry method
  it('checking showtakafulsTab() and registerProductEnquiry() method', () => {
    component.showtakafulsTab();
    component.registerProductEnquiry();
    expect(component.showComponentName).toEqual(PRODUCT_CARD_TEXT.PRODUCT_LIST_TEXT);
  });
});
