import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CardProductsComponent } from './card-products.component';
import { CardCategoriesComponent } from 'src/app/common/components/card-categories/card-categories.component';
import { CardSubCategoriesComponent } from 'src/app/common/components/card-sub-categories/card-sub-categories.component';
import { ShowErrorComponent } from 'src/app/common/components/show-form-errors/show-form-errors.component';
import { CheckboxGenericComponent } from 'src/app/common/components/checkbox-generic/checkbox-generic.component';
import { SuccessScreenComponent } from 'src/app/common/components/success-screen/success-screen.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { CUSTOMER_DETAILS } from 'src/app/common/global-test.data';
import { SharedService } from '../../../../common/services/shared.service';

describe('CardProductsComponent', () => {
  let sharedService: SharedService;
  let component: CardProductsComponent;
  let fixture: ComponentFixture<CardProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        SharedDirectiveModule
      ],
      declarations: [
        CardProductsComponent,
        CardCategoriesComponent,
        CardSubCategoriesComponent,
        ShowErrorComponent,
        CheckboxGenericComponent,
        SuccessScreenComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardProductsComponent);
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
