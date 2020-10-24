export class TransactionHistoryPayLoad {
    accountNumber: string;
    branchCode?: string;
    cardNumber?: string;
    cardType?: string;
    endDate?: string;
    isGhina: string;
    moreRecords: false;
    startDate?: string;
    textToSearch?: string;
    aliasId?: string;
}
export interface TransactionHistoryInterface {
    card_type?: string;
    end_date?: string;
    start_date?: string;
    ghina?: string;
    text_to_search?: string;
    is_more_records?: boolean;
    aliasId?: string;
    cardNumber?: string;
    accountNumber?: string;
}
export class PendingTransactionsPayLoad {
    cardNumber?: string;
    aliasId?: string;
}

export class TransactionGridModel {
    year: string;
    transactionHistory: TransactionGridRow[];
}

export class TransactionGridRow {
    transactionAmount: string;
    currencyCode: string;
    transactionCode: string;
    transactionCodeDescription: string;
    debitOrCreditCode: string;
    dateEffective: string;
    description: string;
    optionalMemo: string;
    transactionType?: string;
    ptId: string;
    esbReferenceNo: string;
}
export class TransactionGridHeaderModel {
    transactionGridWebHeaders: TransactionHeaderModel[];
    transactionGridMobileHeaders: TransactionHeaderModel[];
}
export class TransactionHeaderModel {
    headerText: string;
    className: string;
}
export class PendingTransactionModel {
    transactionList = {} as PendingTransactionRow[];
}
export class PendingTransactionRow {
    date: string;
    location: string;
    merchantName: string;
    transactionAmount: string;
    transactionCurrency: string;
    transactionType: string;
}

// It contains required properties of all types of transctions
export class GenericTransactionRowModel {
    transactionAmount: string;
    transactionCurrency: string;
    currencyCode: string;
    transactionCode: string;
    transactionCodeDescription: string;
    debitOrCreditCode: string;
    dateEffective: string;
    description: string;
    optionalMemo: string;
    transactionType: string;
    ptId: string;
    esbReferenceNo: string;
    debitCredit?: string;
    transactionReferenceNumber?: string;
    transactionDate?: string;
    transactionTime?: string;
    currency?: string;
    date?: string;
    location?: string;
    merchantName?: string;
}

// Accounts cards list model
export class AccountsList {
    accountHolderName: string;
    accountNumber: string;
    accountSubType: string;
    accountType: string;
    balanceAvailable: string;
    balanceCurrent: string;
    branchCode: string;
    classDesc: string;
    classCode: string;
    currencyCode: string;
    filters: Filter;
    ibanNumber: string;
    isDefaultAccount: boolean;
    isJointAccount: boolean;
    relationShipId: string;
    relationShipName: string;
    status: string;
    couponsCount?: string;
    nextDrawDaysCount?: string;
    nextDraw?: string;
    swiftCode?: string;
    additionalInfo?: AdditionalInfo;
    customerNumber?: string;
    aliasId?: string;

}
export class AdditionalInfo {
    'memo_float'?: string;
    'contract_dt'?: string;
    'Appl_Type'?: string;
    'Acct_Desc'?: string;
    'hold_bal'?: string;
    'title_1'?: string;
}

export class Filter {
    cardlessCash?: boolean;
    certificateRequest?: boolean;
    charityPayment?: boolean;
    chequeBook?: boolean;
    credit?: boolean;
    debit?: boolean;
    externalTransfer?: boolean;
    ownAccountTransfer?: boolean;
    p2pTransfer?: boolean;
    payCoverCard?: boolean;
    payUtilities?: boolean;

}

export class PromotionCardModel {
    cardTitle: string;
    getCardTitle: string;
    cardType: string;
}

// Changes can be made in the model once the card epic is done
export class CoverCardsListResponse {
    accountNumber: string;
    availableBalance: string;
    availableCoverAmount: string;
    availableLimit: string;
    benefitAvailable: string;
    cardNumber: string;
    cardStatus: string;
    cardStatusGeneral: string;
    cardSubType: string;
    cardType: string;
    cashAvailable: string;
    cashLimit: string;
    coverAmount: string;
    creditAvailable: string;
    creditLimit: string;
    currencyCode: string;
    customerName: string;
    dueBalance: string;
    embossingName: string;
    exchangeRate: string;
    expiryDate: string;
    firstName: string;
    fullName: string;
    lastName: string;
    lastStmtBalance: string;
    lastStmtDate: string;
    minimumDueBalance: string;
    nickName: string;
    outStandingAmount: string;
    paymentDueDate: string;
    primaryCardFlag: string;
    primaryCardNumber: string;
    productDescription: string;
    relationShipName: string;
    utilizedBalance: string;
    aliasId?: string;
}

export class DebitCardsListResponse {
    cardExpiryDate: string;
    cardHolderName: string;
    cardNumber: string;
    cardStatus: string;
    cardSubType: string;
    description: string;
    primaryAccountNumber: string;
    aliasId?: string;
}

export class AccountsCardsDetailsResponse {
    myNetWorth?: string;
    swiftCode?: string;
    accountsList: AccountsList[];
    cardsList: CoverCardsListResponse[];
    debitCardsList: DebitCardsListResponse[];
}

export class AccountCheckBoxModel {
    accountNumber: string;
    accountTypeDescription: string;
    balanceAvailable: string;
    isDefaultAccount: boolean;
    currencyCode: string;
    accountType: string;
}

export class TransferFromSelectionModel {
    id: string;
    title: string;
}

export class PaymentAmountSelectionModel {
    id: string;
    title: string;
}

export class AnimationModel {
    path: string;
    renderer: string;
    loop: boolean;
    autoplay: boolean;
}

export class ReceiptModel {
    currency: string;
    listOfFields = [] as ListOfReceiptFields[];
}

export class ListOfReceiptFields {
    name: string;
    value: string;
}

export class AllCountriesList {
    allCountryList = [] as Countries[];
}

export class Countries {
    adibPresence: string;
    alternateNames: string;
    countryCallingCode: string;
    countryISOCode: string;
    countryName: string;
    id: number;
    isIBANRequired: string;
    isPriority: string;
    swiftCode: string;
}

export class Currency {
    currency: [];
}
export class CurrencyList {
    id: string;
    title: string;
}

export class UserAgreementResponse {
    agreementCode: string;
    agreementContent: string;
    agreementStatus: boolean;
    agreementVersion: string;
}

export class UserAgreementRequest {
    agreementCode: string;
    agreementStatus: boolean;
    agreementVersion: string;
    nickName: string;
}
