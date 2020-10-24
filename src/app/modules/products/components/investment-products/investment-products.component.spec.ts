import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestementProductsComponent } from './investment-products.component';
import { ProductCardComponent } from 'src/app/common/components/product-card/product-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';
import { CheckboxGenericComponent } from 'src/app/common/components/checkbox-generic/checkbox-generic.component';
import { SuccessScreenComponent } from 'src/app/common/components/success-screen/success-screen.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { CUSTOMER_DETAILS } from 'src/app/common/global-test.data';
import { SharedService } from '../../../../common/services/shared.service';

describe('InvestementProductsComponent', () => {
  let sharedService: SharedService;
  let component: InvestementProductsComponent;
  let fixture: ComponentFixture<InvestementProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MaterialModule, HttpClientTestingModule,
        TranslateModule.forRoot(), RouterTestingModule, SharedDirectiveModule],
      declarations: [
        InvestementProductsComponent,
        ProductCardComponent,
        ShowErrorComponent,
        CheckboxGenericComponent, SuccessScreenComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestementProductsComponent);
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
