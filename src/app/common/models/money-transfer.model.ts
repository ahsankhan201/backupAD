export class ExchangeRateRequestPayLoad {
    creditAccNumber: string;
    creditAcctNumberCurrencyCode: string;
    debitAcctNumber: string;
    transferAccountCurrencyCode: string;
    transferAmount: string;
    transferType: string;
}

export class ExchangeRateResponsePayLoad {
    debitAcctNumber: string;
    debitAmount: string;
    debitCurrencyCode: string;
    creditAcctNumber: string;
    creditAmount: string;
    creditCurrencyCode: string;
    rate: string;
    localCurrencyAmount: string;
    chargeAcctNumber: string;
    chargeAmount: string;
    chargeCurrencyCode: string;
    creditRates = {} as CreditRates;
    debitRates = {} as DebitRates;
}

export class InternationalTransferRequestPayLoad {
    additionalRemittanceDetails: string;
    beneficiary = {} as TransferBeneficiaryDetails;
    branchCode: string;
    chargeCode = {} as ChargeCode;
    chargeCodeDesc: string;
    creditAccount = {} as DebitORCreditAccount;
    creditRates = {} as CreditRates;
    debitAccount = {} as DebitORCreditAccount;
    debitRates = {} as DebitRates;
    debitTransDescription: string;
    optionalMemo: string;
    stpTypeCode: string;
    transferDate: string;
    transferPurpose: string;
    transferType: string;
}

export class TransferPurposeModel {
    id: number;
    stpTypeCode: string;
    purposeOfTransferEn: string;
    purposeOfTransferAr: string;
    currency: string;
}

export class InternationalTransferSummaryModel {
    debitAccountNumber: string;
    creditAccountNumber: string;
    debitCurrency: string;
    creditCurrency: string;
    beneficiaryName: string;
    debitAmount: string;
    creditAmount: string;
    totalAmount: string;
    exchangeRate: string;
    memo: string;
    fee: string;
    purposeOfTransfer: string;
    accountType: string;
    additionalDetails: string;
    accountDescription: string;
}

export class DebitRates {
    buyRate: number;
    sellRate: number;
    midRate: number;
    rate: number;
}

export class CreditRates {
    buyRate: number;
    sellRate: number;
    midRate: number;
    rate: number;
}

export class TransferBeneficiaryDetails {
    abaNumber: string;
    accountBankFormat: string;
    bankSwiftCode: string;
    beneficiaryAccountCurrency: string;
    beneficiaryAccountNumber: string;
    beneficiaryAddress1: string;
    beneficiaryAddress3: string;
    beneficiaryBankAddress1: string;
    beneficiaryBankAddress2: string;
    beneficiaryBankBranch: string;
    beneficiaryBankCity: string;
    beneficiaryBankCountry: string;
    beneficiaryBankId: string;
    beneficiaryBankName: string;
    beneficiaryCity: string;
    beneficiaryCountry: string;
    beneficiaryExternalAccountType: string;
    beneficiaryId: string;
    beneficiaryName: string;
    beneficiaryType: string;
    customerNumber: string;
    nickName: string;
    swiftRoutingCode: string;
}

export class DebitORCreditAccount {
    accountNumber: string;
    amount: string;
    currencyCode: string;
    description: string;
    force: string;
}
export class ChargeCode {
    chargeAccount: string;
    chargeAmount: string;
    chargeCurrencyCode: string;
}
export class MoneyTransferDetails {
    avaialableText?: string;
    availableAmount?: string;
    currencyCode?: string;
}

export class MoneyTransferSummaryModel {
    transferfromNumber?: string;
    transferfromDesc?: string;
    transferfromCurrency?: string;
    transferToNumber?: string;
    transferToDesc?: string;
    transferToCurrency?: string;
    memo?: string;
    amount?: string;
    debitAmount?: string;
    outstandingBalance?: string;
    exchangeRate?: string;
}

export class CoverCardPaymentPayload {
    accountNumber: string;
    amount: number;
    beneficiaryID: string;
    card: CardPayload;
    description: string;
    isIntraBank: true;
    optionalMemo: string;
}

export class CardPayload {
    cardNumber: string;
    cardType: string;
    countryCode: string;
    currencyCode: string;
    expiryDate: string;
}

export class CardToAccountPayload {
    accountNumber: string;
    amount: number;
    beneficiaryID: string;
    card: CardPayload;
    description: string;
    isIntraBank: true;
    optionalMemo: string;
}

export class TransferToAccountPayLoad {
    creditAccount: AccountPayload;
    debitAccount: AccountPayload;
    debitTransDescription?: string;
    optionalMemo?: string;
    stpTypeCode?: string;
    transferDate?: string;
    transferPurpose?: string;
    transferType: string;
    amount: string;
    exchangeRate?: string;
    debitAmount?: string;
    creditRates ? = {} as CreditRates;
    debitRates ? = {} as DebitRates;

}

export class AccountPayload {
    accountNumber: string;
    amount: string;
    currencyCode: string;
    description?: string;
    force?: string;
}
