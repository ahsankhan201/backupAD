import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountDetailsComponent } from './account-details/account-details.component';

import { RouterTestingModule } from '@angular/router/testing';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        AccountListComponent,
        AccountDetailsComponent
            ],
      imports: [
        RouterTestingModule,
        CommonAppModule,
        HttpClientTestingModule,
        SharedDirectiveModule,
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing ghinaAccountInfo property
  it('checking Detail view property existence', () => {
    expect(component.detailView).toBeDefined();
    fixture.detectChanges();
  });

  // Testing on account card click method
  xit('should test showAccountDetail method ', () => {
    component.showAccountDetail();
    expect(component.detailView).toBeTruthy();
  });

  // Testing onBackButtonClicked method
  it('should test showDashboard method ', () => {
    component.showDashboard();
    expect(component.detailView).toBeFalsy();
  });
});
