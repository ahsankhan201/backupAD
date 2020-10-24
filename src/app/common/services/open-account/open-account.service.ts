import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ACCOUNT_ALLOWED_TYPE_LIST, INTERNATIONAL_TRANSFER_TEXT, TIME_DEPOSIT_ACCOUNT_DURATION_MONTH, OPEN_GHINA_ACCOUNT_TEXT,
  ACCOUNTS_ALLOWED_IN_DROPDOWN_FOR_OPEN_ACCOUNT, OPEN_SAVINGS_ACCOUNT_TEXT, ACCOUNT_ALLOWED_STATUS_LIST
} from '../../global-constants';
import { APISyncService } from '../sync.service';
import { SharedService } from '../shared.service';
import {
  SavingsAccountSummaryModel, OpenAccountRequestPayLoad, DebitAccount, TimeDepositDetail, TransferTo
} from '../../models/open-account.model';
import { TimeDepositAccountRequestPayLoad, TimeDepositAccountSummary } from '../../models/open-account.model';
import { AccountsList } from '../../models/global.model';
import { ExchangeRateResponsePayLoad } from '../../models/money-transfer.model';

@Injectable({
  providedIn: 'root'
})
export class OpenAccountService {
  savingsAccountSummaryDetails = {} as SavingsAccountSummaryModel;
  selectedSourceAccount = {} as AccountsList;
  exchangeRateResponse = {} as ExchangeRateResponsePayLoad;
  openAccountReqPayLoad = {} as OpenAccountRequestPayLoad;
  openAccountSelectedCard: string;
  openAccountSelectedFrom: string;
  selectedMaturityAccount = {} as AccountsList;
  selectedProfitCreditAccount = {} as AccountsList;
  timeDepositDebitAmount = {} as DebitAccount;
  timeDepositPayload = {} as TimeDepositAccountRequestPayLoad;
  timeDepositSummaryDetails = {} as TimeDepositAccountSummary;
  selectedMaturityTransferTo = {} as TransferTo;
  selectedProfitCreditTransferTo = {} as TransferTo;
  isBankSeviceTermsAgreed = false;
  ghinaSeviceTermsAgreed = false;
  constructor(private httpService: APISyncService, private sharedService: SharedService) { }

  /**
   * @methodName generateAccountSelectBoxObj
   * @param <none>
   * @description used to generate the account list for transfer from dropdown
   * @return AccountsList[]
   */
  generateAccountSelectBoxObj(): AccountsList[] {
    const formattedAccountList = [] as AccountsList[];
    const clonedAccountList = this.sharedService.accountsList && this.sharedService.accountsList.length ?
      this.sharedService.clone(this.sharedService.accountsList) : [];
    if (clonedAccountList.length) {
      clonedAccountList.forEach(element => {
        if (ACCOUNTS_ALLOWED_IN_DROPDOWN_FOR_OPEN_ACCOUNT.includes(element.accountType) &&
          ACCOUNT_ALLOWED_STATUS_LIST.includes(element.status)) {
          element[OPEN_SAVINGS_ACCOUNT_TEXT.ACCOUNT_VALUE_FOR_DROPDOWN] =
            `${element.currencyCode}  ${ACCOUNT_ALLOWED_TYPE_LIST[element.accountType]} ${element.accountNumber}`;
          element[OPEN_SAVINGS_ACCOUNT_TEXT.ACCOUNT_NAME_FOR_DROPDOWN] = ACCOUNT_ALLOWED_TYPE_LIST[element.accountType];
          formattedAccountList.push(element);
        }
      });
    }
    return formattedAccountList;
  }
  /**
   * @methodName generateOpenAccountReqPayLoad
   * @parameter none
   * @description used to generate the request payload
   * @return none
   */
  generateOpenAccountReqPayLoad(): void {
    this.openAccountReqPayLoad.emailId = this.savingsAccountSummaryDetails.emailId;
    this.openAccountReqPayLoad.accountType = OPEN_SAVINGS_ACCOUNT_TEXT.SAVINGS_ACCOUNT_TYPE;
    this.openAccountReqPayLoad.accountTitle = OPEN_SAVINGS_ACCOUNT_TEXT.SAVINGS_ACCOUNT_TITLE;
    this.openAccountReqPayLoad.accountTypeCurrency = this.savingsAccountSummaryDetails.targetAccountCurency;
    this.openAccountReqPayLoad.creditAmount = this.savingsAccountSummaryDetails.depositAmount;
    this.openAccountReqPayLoad.creditCurrencyCode = this.savingsAccountSummaryDetails.targetAccountCurency;
    this.openAccountReqPayLoad.creditRates = this.exchangeRateResponse.creditRates;
    this.openAccountReqPayLoad.customerNumber = this.selectedSourceAccount.customerNumber;
    this.openAccountReqPayLoad.debitAccount = {} as DebitAccount;
    this.openAccountReqPayLoad.debitAccount.currencyCode = this.selectedSourceAccount.currencyCode;
    this.openAccountReqPayLoad.debitAccount.accountNumber = this.selectedSourceAccount.accountNumber;
    this.openAccountReqPayLoad.debitAccount.amount = this.savingsAccountSummaryDetails.debitAmount;
    this.openAccountReqPayLoad.debitRates = this.exchangeRateResponse.debitRates;
  }
  /**
   * @methodName createNewAccount
   * @parameter url<string>, payLoad<OpenAccountRequestPayLoad>
   * @description used to send the open account request payload to server
   * @return none
   */
  createNewAccount(url: string, payLoad: OpenAccountRequestPayLoad | TimeDepositAccountRequestPayLoad): Observable<any> {
    return this.httpService.post(url, payLoad);
  }

  /**
   * @methodName generateOpenGhinaAccountReqPayLoad
   * @parameter none
   * @description used to generate the request payload
   * @return none
   */
  generateOpenGhinaAccountReqPayLoad(): void {
    this.openAccountReqPayLoad.emailId = this.savingsAccountSummaryDetails.emailId;
    this.openAccountReqPayLoad.accountType = OPEN_GHINA_ACCOUNT_TEXT.SAVINGS_ACCOUNT_TYPE;
    this.openAccountReqPayLoad.accountTitle = OPEN_GHINA_ACCOUNT_TEXT.SAVINGS_ACCOUNT_TITLE;
    this.openAccountReqPayLoad.accountTypeCurrency = this.savingsAccountSummaryDetails.targetAccountCurency;
    this.openAccountReqPayLoad.creditAmount = this.savingsAccountSummaryDetails.depositAmount;
    this.openAccountReqPayLoad.creditCurrencyCode = this.savingsAccountSummaryDetails.targetAccountCurency;
    this.openAccountReqPayLoad.creditRates = this.exchangeRateResponse.creditRates;
    this.openAccountReqPayLoad.customerNumber = this.selectedSourceAccount.customerNumber;
    this.openAccountReqPayLoad.debitAccount = {} as DebitAccount;
    this.openAccountReqPayLoad.debitAccount.currencyCode = this.selectedSourceAccount.currencyCode;
    this.openAccountReqPayLoad.debitAccount.accountNumber = this.selectedSourceAccount.accountNumber;
    this.openAccountReqPayLoad.debitAccount.amount = this.savingsAccountSummaryDetails.debitAmount;
    this.openAccountReqPayLoad.debitRates = this.exchangeRateResponse.debitRates;
  }

  /** @methodName getDebitAmount
   * @parameter none
   * @description used to calculate the debit amount
   * @return string
   */
  getDebitAmount(amount: number, transferRateForCalculation: number): string {
    if (amount && transferRateForCalculation) {
      return this.sharedService.trimNumberWithoutRounding((Number(amount) / Number(transferRateForCalculation)),
        INTERNATIONAL_TRANSFER_TEXT.FIXED_AMOUNT_DECIMAL);
    }
  }
  /**
   * @methodName generateTimeDepositPayload
   * @parameter none
   * @description used to generate time deposit account request payload
   * @return string
   */
  generateTimeDepositPayload(): void {
    this.timeDepositPayload = {} as TimeDepositAccountRequestPayLoad;
    this.timeDepositPayload.accountType = OPEN_SAVINGS_ACCOUNT_TEXT.TIME_DEPOSIT_ACCOUNT_TYPE;
    this.timeDepositPayload.accountTitle = OPEN_SAVINGS_ACCOUNT_TEXT.TIME_DEPOSIT_ACCOUNT_TITLE;
    this.timeDepositPayload.accountTypeCurrency = this.timeDepositSummaryDetails.accountCurrency;
    this.timeDepositPayload.creditAmount = this.timeDepositSummaryDetails.depositAmount;
    this.timeDepositPayload.creditRates = this.exchangeRateResponse.creditRates;
    this.timeDepositPayload.customerNumber = this.selectedSourceAccount.customerNumber;
    this.timeDepositPayload.debitRates = this.exchangeRateResponse.debitRates;
    this.timeDepositPayload.customerType = OPEN_SAVINGS_ACCOUNT_TEXT.TIME_DEPOSIT_ACCOUNT_CUTOMERTYPE;
    // adding timeDepositDebitAmount object to timeDepositPayload payload
    this.timeDepositPayload.debitAccount = this.timeDepositDebitAmount;
    // creating TimeDepositDetail payload
    this.timeDepositPayload.timeDepositDetail = {} as TimeDepositDetail;
    this.timeDepositPayload.timeDepositDetail.accountTypeIntMaturity = this.selectedMaturityAccount.accountType;
    this.timeDepositPayload.timeDepositDetail.interestInternalaccount = this.selectedProfitCreditAccount.accountNumber;
    this.timeDepositPayload.timeDepositDetail.interestPaymentMethod = this.selectedProfitCreditTransferTo.id;
    this.timeDepositPayload.timeDepositDetail.interestInternalaccountType = this.selectedProfitCreditAccount.accountType;
    this.timeDepositPayload.timeDepositDetail.accountTerm = Number(this.timeDepositSummaryDetails.accountDuration);
    this.timeDepositPayload.timeDepositDetail.accountPeriod = TIME_DEPOSIT_ACCOUNT_DURATION_MONTH;
    this.timeDepositPayload.timeDepositDetail.depositAmount = this.timeDepositSummaryDetails.depositAmount;
    this.timeDepositPayload.timeDepositDetail.accountNumberMaturity = this.selectedMaturityAccount.accountNumber;
    this.timeDepositPayload.timeDepositDetail.maturityMethod = this.selectedMaturityTransferTo.id;
  }
}
