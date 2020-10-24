import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { AccountListComponent } from './account-list.component';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AccountListComponent', () => {
  let component: AccountListComponent;
  let fixture: ComponentFixture<AccountListComponent>;
  let scrollContainer: any;
  const SCROLL_CONTAINER_WIDTH = 1400;
  const SCROLL_WIDTH = 2400;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountListComponent],
      imports: [
        CommonAppModule,
        HttpClientTestingModule,
        SharedDirectiveModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountListComponent);
    component = fixture.componentInstance;
    scrollContainer = fixture.debugElement.query(By.css('.ibd-account-list__card-wrapper')); // accessing DOM Scroll Container
    // spying scroll element get only properties
    spyOnProperty(scrollContainer.nativeElement, 'clientWidth', 'get').and.returnValue(SCROLL_CONTAINER_WIDTH);
    spyOnProperty(scrollContainer.nativeElement, 'scrollWidth', 'get').and.returnValue(SCROLL_WIDTH);
    fixture.detectChanges();
  });

  // Testing component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing promotionalCard property
  it('checking ACCOUNTS_MASTER_DATA property existence', () => {
    expect(component.ACCOUNTS_MASTER_DATA).toBeDefined();
  });
  // Testing showOrHideNavigation controls method
  xit('Show or Hide method testing', () => {
    expect(component.hideNavigationControlls).toBeUndefined();
    component.showOrHideNavControlls();
    expect(component.hideNavigationControlls).toBeTruthy();
  });
  // Testing moveScroll method
  xit('Testing moveScroll Method', () => {
    spyOnProperty(scrollContainer.nativeElement, 'scrollLeft', 'get').and.returnValue(50);
    component.moveScroll('forward');
    expect(component.disablePreviousBtn).toBeFalsy();
  });
  // Testing moveScroll method for false case
  xit('Testing moveScroll method for false case', () => {
    spyOnProperty(scrollContainer.nativeElement, 'scrollLeft', 'get').and.returnValue(0);
    component.moveScroll('backward');
    expect(component.disablePreviousBtn).toBeTruthy();
    component.moveScroll('');
  });
});
