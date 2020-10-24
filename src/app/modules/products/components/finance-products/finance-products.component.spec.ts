import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FinanceProductsComponent } from './finance-products.component';
import { ProductCardComponent } from 'src/app/common/components/product-card/product-card.component';
import { CheckboxGenericComponent } from 'src/app/common/components/checkbox-generic/checkbox-generic.component';
import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { SuccessScreenComponent } from 'src/app/common/components/success-screen/success-screen.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOMER_DETAILS } from 'src/app/common/global-test.data';
import { SharedService } from '../../../../common/services/shared.service';

describe('FinanceProductsComponent', () => {
  let sharedService: SharedService;
  let component: FinanceProductsComponent;
  let fixture: ComponentFixture<FinanceProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedDirectiveModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule],
      declarations: [
        FinanceProductsComponent,
        ProductCardComponent,
        CheckboxGenericComponent,
        ShowErrorComponent,
        SuccessScreenComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceProductsComponent);
    sharedService = TestBed.get(SharedService);
    sharedService.customerDetail = CUSTOMER_DETAILS;
    sharedService.customerFilteredPrimaryAddress = CUSTOMER_DETAILS.customerAddress[0];
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
