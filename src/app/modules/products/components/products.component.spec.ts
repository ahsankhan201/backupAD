import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/common/modules/material.module';

import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { ProductsComponent } from './products.component';
import { AccountProductsComponent } from './account-products/account-products.component';
import { FinanceProductsComponent } from './finance-products/finance-products.component';
import { CardProductsComponent } from './card-products/card-products.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { ProductsService } from '../services/products.service';
import { SharedService } from 'src/app/common/services/shared.service';


describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: ProductsService;
  let sharedService: SharedService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonAppModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        MaterialModule, SharedDirectiveModule
      ],
      declarations: [
        ProductsComponent,
        AccountProductsComponent,
        FinanceProductsComponent,
        CardProductsComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.get(ProductsService);
    sharedService = TestBed.get(SharedService);
    httpMock = TestBed.get(HttpTestingController);
    fixture.detectChanges();
  });
  afterEach(() => {
    httpMock.verify();
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
