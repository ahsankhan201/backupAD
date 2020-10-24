import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AccountDetailsComponent } from './account-details.component';

import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { QuickLinksComponent } from 'src/app/common/components/quick-links/quick-links.component';
import { TransactionGridComponent } from 'src/app/common/components/transaction-grid/transaction-grid.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { MenuOptionComponent } from 'src/app/common/components/menu-option/menu-option.component';
import { InfiniteScrollComponent } from 'src/app/common/components/inifnite-scroll/infinite-scroll.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedService } from 'src/app/common/services/shared.service';
import { ACCOUNT_DETAILS_TEST_DATA } from '../../dashboard-module-test.data';
import { AccountlistService } from '../../services/accountlist.service';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AccountDetailsComponent', () => {
  let component: AccountDetailsComponent;
  let fixture: ComponentFixture<AccountDetailsComponent>;
  let sharedService: SharedService;
  let accountListService: AccountlistService;
  let snackbarService: SnackBarService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountDetailsComponent, QuickLinksComponent, TransactionGridComponent, MenuOptionComponent, InfiniteScrollComponent],

      imports: [SharedDirectiveModule, FormsModule, MaterialModule,
        HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
      providers: [SharedService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDetailsComponent);
    component = fixture.componentInstance;
    sharedService = TestBed.get(SharedService);
    accountListService = TestBed.get(AccountlistService);
    snackbarService = TestBed.get(SnackBarService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing ghinaAccountInfo property
  it('checking Ghina account property existence', () => {
    expect(component.isGhina).toBeDefined();
    expect(component.accountDetailsConst).toBeDefined();
    fixture.detectChanges();
  });

  it('should emit showAccountList', () => {
    spyOn(component.showAccountList, 'emit');
    component.onBackButtonClicked();
    expect(component.showAccountList.emit).toHaveBeenCalled();
  });

  // Testing loadTransactionHistoryData method
  it('should test loadTransactionHistoryData method ', () => {
    expect(component.ACCOUNT_TX_HEADERS).toBeDefined();
    expect(component.transactionHistoryURL).toBeDefined();
  });

  // Testing copy detail method
  it('checking copy detail method', () => {
    fixture.detectChanges();
    component.getAccountDetails();
    component.getCopyData();
    expect(component.copyData).not.toBeNull();
  });

  // Testing copy detail method  If Condition
  it('checking copy detail method If Condition', () => {
    fixture.detectChanges();
    component.accountData = ACCOUNT_DETAILS_TEST_DATA;
    component.getCopyData();
    if (component.accountData) {
      expect(component.copyData).not.toBeNull();
    }
  });

  // Testing getAccountHistoryPayload method
  xit('checking getAccountHistoryPayload method', () => {
    component.accountData = ACCOUNT_DETAILS_TEST_DATA;
    component.getAccountHistoryPayload();
    expect(sharedService.transactionHistoryPayLoad.is_more_records).toBeFalsy();
  });

  // Testing getAccountHistoryPayload isGhina Property
  xit('checking getAccountHistoryPayload isGhina Property', () => {
    component.accountData = ACCOUNT_DETAILS_TEST_DATA;
    component.isGhina = true;
    component.getAccountHistoryPayload();
    expect(sharedService.transactionHistoryPayLoad.ghina).toEqual('Yes');
  });

  // Testing getAccountHistoryPayload isGhina Property
  xit('checking getAccountHistoryPayload isGhina Not set', () => {
    component.accountData = ACCOUNT_DETAILS_TEST_DATA;
    component.isGhina = false;
    component.getAccountHistoryPayload();
    expect(sharedService.transactionHistoryPayLoad.ghina).toEqual('No');
  });

  // Testing getAccountDetails method if condition
  it('checking getAccountDetails IF condition', () => {
    component.getAccountDetails();
    if (accountListService.accountDetailData === undefined) {
      expect(component.isGhina).toBeFalsy();
    }
  });

  it('checking getAccountDetails IF condition', () => {
    component.getAccountDetails();
    accountListService.accountDetailData = undefined;
    expect(component.accountData).toBeUndefined();

  });

  // Testing getGhinaAccountDetail
  it('checking getGhinaAccountDetail', () => {
    component.accountData = ACCOUNT_DETAILS_TEST_DATA;
    component.getGhinaAccountDetail();
    expect(component.accountData.couponsCount).toBeUndefined();

  });
});
