import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { RegionSelectionComponent } from './region-selection-component';
import { CheckboxWithImageComponent } from 'src/app/common/components/checkbox-with-image/checkbox-with-image.component';
import { BENEFICIARY_REGION } from '../../beneficiary-module.constants';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';


describe('RegionSelectionComponent', () => {
  let component: RegionSelectionComponent;
  let fixture: ComponentFixture<RegionSelectionComponent>;
  const regionList = BENEFICIARY_REGION;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule],
      declarations: [RegionSelectionComponent, CheckboxWithImageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionSelectionComponent);
    component = fixture.componentInstance;
    component.regionSelectionList = regionList;
    fixture.detectChanges();
  });
  // Testing component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing selectedRegion method
  it('Testing Selected region method', () => {
    const radioButton = fixture.debugElement.query(By.css('.region-card .ibd-check-box input'));
    radioButton.nativeElement.click();
    expect(radioButton.nativeElement.checked).toBeTruthy();
  });
});
