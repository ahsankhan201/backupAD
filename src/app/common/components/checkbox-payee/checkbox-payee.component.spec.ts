import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CheckboxPayeeComponent } from './checkbox-payee.component';
import { PAYEE_CHECKBOX_DATA } from '../../global-test.data';

describe('CheckboxPayeeComponent', () => {
  let component: CheckboxPayeeComponent;
  let fixture: ComponentFixture<CheckboxPayeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxPayeeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxPayeeComponent);
    component = fixture.componentInstance;
    component.checkBoxPayeeList = PAYEE_CHECKBOX_DATA;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing handleChange method
  it('should emit selectedOptionValue', () => {
    spyOn(component.selectedOptionValue, 'emit');
    const SELECTED_DATA = PAYEE_CHECKBOX_DATA[0];
    const checkBoxInput = fixture.debugElement.query(By.css('.ibd-check-box input'));
    component.handleChange(SELECTED_DATA, checkBoxInput.nativeElement);
    expect(component.selectedOptionValue.emit).toHaveBeenCalled();
  });
});
