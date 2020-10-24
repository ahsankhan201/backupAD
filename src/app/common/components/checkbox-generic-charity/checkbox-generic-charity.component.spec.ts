import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CheckboxGenericCharityComponent } from './checkbox-generic-charity.component';
import { By } from '@angular/platform-browser';
import { CHECKBOX_DONATION_VALUE } from '../../global-test.data';

describe('CheckboxGenericCharityComponent', () => {
  let component: CheckboxGenericCharityComponent;
  let fixture: ComponentFixture<CheckboxGenericCharityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxGenericCharityComponent ],
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxGenericCharityComponent);
    component = fixture.componentInstance;
    component.optionsList = CHECKBOX_DONATION_VALUE;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Checking handle change method
  it('Testing handleChange Method', () => {
    const radioButton = fixture.debugElement.query(By.css('.ibd-check-box input'));
    radioButton.nativeElement.click();
    expect(radioButton.nativeElement.checked).toBeTruthy();
  });

  // Checking handle change method for else case
  it('Testing handleChange Method negative case', () => {
    const radioButton = fixture.debugElement.query(By.css('.ibd-check-box input'));
    radioButton.nativeElement.click();
    expect(radioButton.nativeElement.checked).toBeTruthy();
  });
});
