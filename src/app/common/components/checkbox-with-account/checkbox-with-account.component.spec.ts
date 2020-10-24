import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CheckboxWithAccountComponent } from './checkbox-with-account.component';
// import { CHECKBOX__WITH_ACCOUNT_DATA } from '../../global-test.data'; // TO DO :: will be uncommented

xdescribe('CheckboxCardComponent', () => {
  let component: CheckboxWithAccountComponent;
  let fixture: ComponentFixture<CheckboxWithAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxWithAccountComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxWithAccountComponent);
    component = fixture.componentInstance;
    // component.accountsList = CHECKBOX__WITH_ACCOUNT_DATA;
    fixture.detectChanges();
  });

  // Checking component creation method
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Checking handle change method
  it('Testing handleChange Method', () => {
    const radioButton = fixture.debugElement.query(By.css('.checkbox-with-account-comp__container__wrapper'));
    radioButton.nativeElement.click();
    expect(radioButton.nativeElement.checked).toBeUndefined();
  });
});
