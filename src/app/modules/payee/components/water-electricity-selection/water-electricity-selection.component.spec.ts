import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { WaterElectricitySelectionComponent } from './water-electricity-selection.component';
import { CheckBoxEmittedObj } from 'src/app/common/models/payee.model';
import { PayeeService } from '../../services/payee.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('WaterElectricitySelectionComponent', () => {
  let component: WaterElectricitySelectionComponent;
  let fixture: ComponentFixture<WaterElectricitySelectionComponent>;
  let payeeService: PayeeService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonAppModule, HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [WaterElectricitySelectionComponent],
      providers: [PayeeService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterElectricitySelectionComponent);
    component = fixture.componentInstance;
    payeeService = TestBed.get(PayeeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing onSelectProduct method
  it('should call onSelectProduct method', () => {
    spyOn(component, 'onSelectProduct').and.callThrough();
    const checkBoxData = {} as CheckBoxEmittedObj;
    component.onSelectProduct(checkBoxData);
    expect(component.onSelectProduct).toHaveBeenCalled();
  });

});
