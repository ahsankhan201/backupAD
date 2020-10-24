import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CheckboxWithImageComponent } from './checkbox-with-image.component';
import { BENEFICIARY_REGION } from '../../../modules/beneficiary/beneficiary-module.constants';

describe('CheckboxWithImageComponent', () => {
  let component: CheckboxWithImageComponent;
  let fixture: ComponentFixture<CheckboxWithImageComponent>;
  const regionList = BENEFICIARY_REGION;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [CheckboxWithImageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxWithImageComponent);
    component = fixture.componentInstance;
    component.cardOptionsList = regionList;
    fixture.detectChanges();
  });

  // Checking component creation method
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Checking handle change method
  it('Check handleChange method', () => {
    const radioButton = fixture.debugElement.query(By.css('.ibd-check-box input'));
    radioButton.nativeElement.click();
    expect(radioButton.nativeElement.checked).toBeTruthy();
  });

  // Checking handle change method for else case
  it('Check handleChange method', () => {
    const radioButton = fixture.debugElement.query(By.css('.ibd-check-box input'));
    component.emitSelectedEleID = true;
    radioButton.nativeElement.click();
    expect(radioButton.nativeElement.checked).toBeTruthy();
  });
});
