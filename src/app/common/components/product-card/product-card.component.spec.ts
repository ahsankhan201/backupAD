import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

import { ProductCardComponent } from './product-card.component';
import { PRODUCT_CARD_DATA } from '../../global-test.data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCardComponent],
      imports: [HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checking component creation method
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // testing emitSelectedOption method
  xit('emitSelectedOption() should emit the value to parent component', () => {
    const productCrad = fixture.debugElement.query(By.css('.cta-btn.cta-link-btn'));
    spyOn(component, 'emitSelectedOption').and.callThrough();
    productCrad.nativeElement.click();
    expect(component.emitSelectedOption).toHaveBeenCalled();
  });
});
