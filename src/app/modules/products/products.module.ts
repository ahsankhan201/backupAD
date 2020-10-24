import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Include custom modules
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { ProductsRoutingModule } from './products-routing.module';
import { MaterialModule } from 'src/app/common/modules/material.module';

// Include custom components
import { ProductsComponent } from './components/products.component';
import { FinanceProductsComponent } from './components/finance-products/finance-products.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { AccountProductsComponent } from './components/account-products/account-products.component';
import { CardProductsComponent } from './components/card-products/card-products.component';
import { InvestementProductsComponent } from './components/investment-products/investment-products.component';
import { TakafulProductsComponent } from './components/takaful-products/takaful-products.component';

@NgModule({
  declarations: [
    ProductsComponent,
    FinanceProductsComponent,
    AccountProductsComponent,
    CardProductsComponent,
    InvestementProductsComponent,
    TakafulProductsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    CommonAppModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedDirectiveModule
  ]
})
export class ProductsModule { }
