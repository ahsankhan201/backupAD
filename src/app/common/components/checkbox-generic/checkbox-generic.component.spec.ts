import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CheckboxGenericComponent } from './checkbox-generic.component';
import { GENERIC_CHECKBOX_DATA } from '../../global-test.data';

describe('CheckboxGenericComponent', () => {
  let component: CheckboxGenericComponent;
  let fixture: ComponentFixture<CheckboxGenericComponent>;
  const currencyChecBoxList = GENERIC_CHECKBOX_DATA;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxGenericComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxGenericComponent);
    component = fixture.componentInstance;
    component.optionsList = currencyChecBoxList;
    fixture.detectChanges();
  });

  // Checking component creation method

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
  it('Testing handleChange Method', () => {
    const radioButton = fixture.debugElement.query(By.css('.ibd-check-box input'));
    component.emitSelectedEleID = true;
    radioButton.nativeElement.click();
    expect(radioButton.nativeElement.checked).toBeTruthy();
  });
});
