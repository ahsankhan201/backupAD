import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CheckboxCardComponent } from './checkbox-card.component';
import { NumberFormatPipe } from '../../pipes/number-format/number-format.pipe';
import { DecimalValuePipe } from '../../pipes/decimal-value/decimal-value.pipe';
import { COVER_CARD_CHECKBOX_LIST } from '../../global-test.data';
import { CardNumberFormatPipe } from '../../pipes/card-number-format/card-number-format.pipe';

describe('CheckboxCardComponent', () => {
  let component: CheckboxCardComponent;
  let fixture: ComponentFixture<CheckboxCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxCardComponent, NumberFormatPipe, DecimalValuePipe, CardNumberFormatPipe],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxCardComponent);
    component = fixture.componentInstance;
    component.checkBoxCoverCardList = [];
    fixture.detectChanges();
  });

  // Checking component creation method
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Checking handle change method
  xit('handleChange() method should set preSelectedValue value', () => {
    const cardCheckBox = fixture.debugElement.query(By.css('.ibd-check-box input'));
    cardCheckBox.nativeElement.click();
    expect(cardCheckBox.nativeElement.checked).toBeTruthy();
    expect(component.preSelectedValue).toEqual(COVER_CARD_CHECKBOX_LIST[0].cardNumber);
  });
});
