import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';

import { FinanceDetailsComponent } from './finance-details.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('FinanceDetailsComponent', () => {
  let component: FinanceDetailsComponent;
  let fixture: ComponentFixture<FinanceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedDirectiveModule, HttpClientTestingModule, CommonAppModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [FinanceDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  // Testing component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // Testing backButtonClickedStatus method
  it('should emit backButtonClickedStatus', () => {
    spyOn(component.backButtonClicked, 'emit');
    component.onBackButtonClicked();
    expect(component.backButtonClicked.emit).toHaveBeenCalled();
  });
});
