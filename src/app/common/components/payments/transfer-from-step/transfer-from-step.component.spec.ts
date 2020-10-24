import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

import { TransferFromStepComponent } from './transfer-from-step.component';
import { CheckboxGenericComponent } from '../../checkbox-generic/checkbox-generic.component';
import { AccountCheckBoxComponent } from '../../account-checkbox/account-checkbox.component';
import { NumberFormatPipe } from 'src/app/common/pipes/number-format/number-format.pipe';
import { DecimalValuePipe } from 'src/app/common/pipes/decimal-value/decimal-value.pipe';
import { SharedService } from 'src/app/common/services/shared.service';
import { ACCOUNT_CARD_LIST_DATA } from 'src/app/modules/finance/finance-module-test.data';
import { ACCOUNT_DETAILS_TEST_DATA } from 'src/app/modules/dashboard/dashboard-module-test.data';
import { AccountListModel } from 'src/app/common/models/accounts-module.model';
import { CheckboxCardComponent } from '../../checkbox-card/checkbox-card.component';
import { CardNumberFormatPipe } from 'src/app/common/pipes/card-number-format/card-number-format.pipe';
import { DEBIT_CARD_DETAILS_DATA, COVER_CARD_DETAILS_DATA } from 'src/app/modules/cards/cards-module-test.data';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('TransferFromStepComponent', () => {
  let component: TransferFromStepComponent;
  let fixture: ComponentFixture<TransferFromStepComponent>;
  let service: SharedService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [
        TransferFromStepComponent,
        CheckboxGenericComponent,
        AccountCheckBoxComponent,
        CheckboxCardComponent,
        NumberFormatPipe,
        DecimalValuePipe,
        CardNumberFormatPipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferFromStepComponent);
    service = TestBed.get(SharedService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // Testing cancel transaction method
  xit('cancelTransaction() should set cancelTransaction info', () => {
    component.cancelTransaction(true);
    component.getAccountListForPayments();
    component.selectedAccount({} as AccountListModel);
  });
  // Testing getAccountListForPayments method
  it('getAccountListForPayments() should set updatedAccountsList info', () => {
    service.accountsCardsList = ACCOUNT_CARD_LIST_DATA;
    service.accountsCardsList.accountsList[0] = ACCOUNT_DETAILS_TEST_DATA;
    component.getAccountListForPayments();
    expect(component.updatedAccountsList.length).toEqual(1);
  });
  // Testing getAccountListForPayments method
  xit('getAccountListForPayments() set updatedAccountsList info length to "0" ', () => {
    service.accountsCardsList = ACCOUNT_CARD_LIST_DATA;
    service.accountsCardsList.accountsList[0] = ACCOUNT_DETAILS_TEST_DATA;
    service.accountsCardsList.accountsList[0].accountType = 'GHINAA';
    component.getAccountListForPayments();
    expect(component.updatedAccountsList.length).toEqual(0);
  });
  // Testing getCardsListForPayments method
  xit('getCardsListForPayments() should set debitCardsList info', () => {
    service.debitCardData[0] = DEBIT_CARD_DETAILS_DATA;
    service.coverCardData[0] = COVER_CARD_DETAILS_DATA;
    component.getCardsListForPayments();
    expect(component.coverCardsList.length).toEqual(1);
  });
});
