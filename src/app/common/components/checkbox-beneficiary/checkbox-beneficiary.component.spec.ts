import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CheckboxBeneficiaryComponent } from './checkbox-beneficiary.component';
import { BENEFICIARY_CHECKBOX_DATA } from '../../global-test.data';

describe('CheckboxBeneficiaryComponent', () => {
  let component: CheckboxBeneficiaryComponent;
  let fixture: ComponentFixture<CheckboxBeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxBeneficiaryComponent],
      imports: [HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing handleChange method
  xit('should emit selectedOptionValue', () => {
    spyOn(component.selectedOptionValue, 'emit');
    const SELECTED_DATA = BENEFICIARY_CHECKBOX_DATA[0];
    const checkBoxInput = fixture.debugElement.query(By.css('.ibd-check-box input'));
    component.handleChange(SELECTED_DATA, checkBoxInput.nativeElement);
    expect(component.selectedOptionValue.emit).toHaveBeenCalled();
  });
});
