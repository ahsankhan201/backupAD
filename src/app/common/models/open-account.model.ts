import { DebitRates, CreditRates } from './money-transfer.model';

export class TimeDepositAccountRequestPayLoad {
  creditAmount: string;
  timeDepositDetail: TimeDepositDetail;
  accountTypeCurrency: string;
  debitRates: DebitRates;
  accountType: string;
  transferPurpose?: string;
  customerNumber: string;
  accountTitle: string;
  customerType?: string;
  debitAccount: DebitAccount;
  email?: string;
  creditRates: CreditRates;
}

export class TimeDepositDetail {
  accountTypeIntMaturity: string;
  interestInternalaccount: string;
  interestPaymentMethod: string;
  interestInternalaccountType: string;
  accountTerm: number;
  accountPeriod: string;
  depositAmount: string;
  accountNumberMaturity: string;
  maturityMethod: string;
}

export class TimeDepositAccountSummary {
  accountCurrency: string;
  accountDuration: string;
  depositAmount: string;
  transferFromAccount: string;
  maturityOptionAccount: string;
  maturityOptionTransferTo?: string;
  profitCreditOptionAccount: string;
  profitCreditOptionTransferTo?: string;
}
export class SavingsAccountSummaryModel {
    sourceAccountCurrency: string;
    targetAccountCurency: string;
    depositAmount: string;
    payFromAccount: string;
    mobileNumber: string;
    emailId: string;
    debitAmount: string;
}

export class OpenAccountRequestPayLoad {
    creditAmount: string;
    otpValue: string;
    otpValidationToken: string;
    creditCurrencyCode: string;
    accountTypeCurrency: string;
    debitRates: DebitRates;
    accountType: string;
    transferPurpose?: string;
    customerNumber: string;
    accountTitle: string;
    customerType?: string;
    debitAccount: DebitAccount;
    emailId: string;
    creditRates: CreditRates;
}

export class DebitAccount {
    currencyCode: string;
    accountNumber: string;
    amount: string;
}
export class OpenAccountCard {
    id?: string;
    title: string;
    description: string;
    ctaLinkLabel: string;
    imageUrl: string;
  }

export class TransferTo {
  id: string;
  value: string;
}
