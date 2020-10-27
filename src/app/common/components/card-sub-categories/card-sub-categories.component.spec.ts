import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CardSubCategoriesComponent } from './card-sub-categories.component';
import { CARD_SUB_CATEGORY } from '../../global-test.data';

describe('CardSubCategoriesComponent', () => {
  let component: CardSubCategoriesComponent;
  let fixture: ComponentFixture<CardSubCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardSubCategoriesComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSubCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('testing emitSelectedOption() method', () => {
    component.emitSelectedOption(CARD_SUB_CATEGORY, 'account');
    expect(component).toBeTruthy();
  });
});
