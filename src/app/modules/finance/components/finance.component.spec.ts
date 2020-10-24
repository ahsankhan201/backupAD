import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { FinanceComponent } from './finance.component';
import { FinanceListComponent } from './finance-list/finance-list.component';
import { FinanceDetailsComponent } from './finance-details/finance-details.component';
import { FINANCE_LABELS_TEXT } from '../finance-module.constants';

describe('FinanceComponent', () => {
  let component: FinanceComponent;
  let fixture: ComponentFixture<FinanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedDirectiveModule,
                HttpClientTestingModule,
                RouterTestingModule,
                CommonAppModule,
                TranslateModule.forRoot()],
      declarations: [ FinanceComponent,
        FinanceListComponent,
        FinanceDetailsComponent,
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  // Testing component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // Testing app-finance-list component
  it('should create app-finance-list component ', () => {
    component.selectedComponent = FINANCE_LABELS_TEXT.financeLists;
    const APP_LIST_COMPONENT = fixture.debugElement.nativeElement.querySelector('app-finance-list');
    expect(APP_LIST_COMPONENT.innerHTML).not.toBeNull();
  });
  // Testing app-finance-details component
  xit('should create app-finance-details component ', () => {
    component.financeSelectionStatus(true);
    expect(component.selectedComponent).toEqual(FINANCE_LABELS_TEXT.financeDetails);
    fixture.detectChanges();
    const APP_DETAILS_COMPONENT = fixture.debugElement.nativeElement.querySelector('app-finance-details');
    expect(APP_DETAILS_COMPONENT.innerHTML).not.toBeNull();
  });
  // Testing onBackButtonClicked method
  it('should call onBackButtonClicked method', () => {
    component.onBackButtonClicked(true);
    expect(component.selectedComponent).toEqual(FINANCE_LABELS_TEXT.financeLists);
  });
});
