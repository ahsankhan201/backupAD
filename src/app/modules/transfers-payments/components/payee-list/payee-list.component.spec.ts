import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { PayeeListComponent } from './payee-list.component';
import { SharedService } from 'src/app/common/services/shared.service';

xdescribe('PayeeListComponent', () => {
  let component: PayeeListComponent;
  let fixture: ComponentFixture<PayeeListComponent>;
  let scrollContainer: any;
  let sharedService: SharedService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, CommonAppModule, HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [PayeeListComponent],
      providers: [SharedService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeListComponent);
    component = fixture.componentInstance;
    scrollContainer = fixture.debugElement.query(By.css('.transfers-payments-list'));
    sharedService = TestBed.get(SharedService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing scroll moveScroll Method
  it('Testing moveScroll Method', () => {
    spyOnProperty(scrollContainer.nativeElement, 'scrollLeft', 'get').and.returnValue(50);
    component.moveScroll('forward');
    expect(component.disablePreviousBtn).toBeTruthy();
  });

  // Testing moveScroll method for false case
  it('Testing moveScroll method for false case', () => {
    spyOnProperty(scrollContainer.nativeElement, 'scrollLeft', 'get').and.returnValue(0);
    component.moveScroll('backward');
    expect(component.disablePreviousBtn).toBeTruthy();
    component.moveScroll('');
  });

  // Testing negative case for showOrHideNavigation controls method
  it('Show or Hide method testing', () => {
    spyOnProperty(scrollContainer.nativeElement, 'offsetWidth', 'get').and.returnValue(10);
    spyOnProperty(scrollContainer.nativeElement, 'scrollWidth', 'get').and.returnValue(10);
    component.showOrHideNavControlls();
    expect(component.hideNavigationControlls).toBeFalsy();
  });

  // Testing Testing Nav Controll method
  it('Testing Nav Controll', () => {
    spyOn(component, 'showOrHideNavControlls');
    component.handleNavControll();
    expect(component.showOrHideNavControlls).toHaveBeenCalled();
  });

  // Testing Show all payee method
  it('Testing Show all payee', () => {
    component.showAllPayee();
    expect(component.showAll).toBeTruthy();
  });

  // Testing onContextMenu method
  it('Testing onContextMenu', () => {
    const mouseclick = new MouseEvent('mouseclick');
    component.onContextMenu(mouseclick, '2');
    expect(component.menuSelectedBeneID).toEqual('2');
  });

  // Testing onSearchChange
  it('Testing onSearchChange', () => {
    component.onSearchChange('search');
    expect(component.formatedPayeeList).toBeUndefined();
  });

  // Testing payeeRoutingURL
  it('Testing payeeRoutingURL', () => {
    expect(component.payeeRoutingURL).toBeTruthy();
  });

  // Testing markFavorite
  it('Testing markFavorite', () => {
    spyOn(sharedService, 'generateApiUrl');
    component.markFavorite('yes', '2');
    expect(sharedService.generateApiUrl).toHaveBeenCalled();
  });

  // Testing updateFavorite
  it('Testing updateFavorite', () => {
    spyOn(component.refreshPayee, 'emit');
    component.updateFavorite();
    expect(component.refreshPayee.emit).toHaveBeenCalled();
  });

});
