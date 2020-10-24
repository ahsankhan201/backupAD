import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LinkAccountComponent } from './link-account.component';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { CardsService } from '../../services/cards.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { ACCOUNTS_CARDS_LIST_DATA, SELECTED_LINKED_INFO } from '../../cards-module-test.data';
import { RouterTestingModule } from '@angular/router/testing';

describe('LinkAccountComponent', () => {
  let component: LinkAccountComponent;
  let fixture: ComponentFixture<LinkAccountComponent>;
  let sharedService: SharedService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonAppModule, HttpClientTestingModule, RouterTestingModule],
      providers: [CardsService, SharedService],
      declarations: [LinkAccountComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkAccountComponent);
    sharedService = TestBed.get(SharedService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Checking component creation method
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Checkinh generateLinkAccountsList() method
  it('generateLinkAccountsList() should set linkAccountList property', () => {
    sharedService.accountsCardsList = ACCOUNTS_CARDS_LIST_DATA;
    component.generateLinkAccountsList();
    expect(component.accountsList.length).toEqual(1);
    sharedService.accountsCardsList.accountsList[0].status = 'Freezed';
    component.generateLinkAccountsList();
  });
  // Checking linkAccountBackBtnClick method
  xit('linkAccountBackBtnClick() method should be called', () => {
    component.linkAccountCancelBtnClick();
    spyOn(component, 'linkAccountCancelBtnClick');
    const radioButton = fixture.debugElement.query(By.css('.cta-back-btn'));
    radioButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.linkAccountCancelBtnClick).toHaveBeenCalled();
  });

  // Checking selectedAccount() method
  it('selectedAccount() should enable the Done button', () => {
    component.selectedAccount(SELECTED_LINKED_INFO);
    expect(component.enableDoneBtn).toBeTruthy();
    // covering else case
    component.linkedAccount = '123456';
    component.selectedAccount(SELECTED_LINKED_INFO);
    expect(component.enableDoneBtn).toBeFalsy();
  });
});
