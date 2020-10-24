import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountCheckBoxComponent } from './account-checkbox.component';
import { NumberFormatPipe } from '../../pipes/number-format/number-format.pipe';
import { DecimalValuePipe } from '../../pipes/decimal-value/decimal-value.pipe';
import { ACCOUNT_CHECKBOX_LIST } from '../../global-test.data';

describe('AccountCheckBoxComponent', () => {
  let component: AccountCheckBoxComponent;
  let fixture: ComponentFixture<AccountCheckBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountCheckBoxComponent, NumberFormatPipe, DecimalValuePipe],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCheckBoxComponent);
    component = fixture.componentInstance;
    component.checkBoxAccountsList = ACCOUNT_CHECKBOX_LIST;
    fixture.detectChanges();
  });

  // Checking component creation method
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Checking handle change method
  it('handleChange() method should set preSelectedValue value', () => {
    const accountCheckBox = fixture.debugElement.query(By.css('.ibd-check-box input'));
    accountCheckBox.nativeElement.click();
    expect(accountCheckBox.nativeElement.checked).toBeTruthy();
    expect(component.preSelectedValue).toEqual(ACCOUNT_CHECKBOX_LIST[0].accountNumber);
  });
});
