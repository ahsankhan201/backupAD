export class DebitCardData {
    cardExpiryDate: string;
    cardHolderName: string;
    cardNumber: string;
    cardStatus: string;
    primaryAccountNumber: string;
    availableBalance: string;
    currencyCode: string;
    accountType: string;
    accountDesc: string;
    aliasId?: string;
}

export class ChangeCoverCardLimitPayload {
    cardNumber: string;
    limit: string;
    mobileNumber: string;
    newLimit: string;
    oldLimit: string;
}

export class LinkAccountCheckBox {
    id: string;
    title: string;
    description: string;
    branchCode?: string;
    accountType?: string;
}

export class LinkAccountSuccessScreen {
    accountNumber: string;
    debitCardNumber: string;
    componentTitle: string;
}

export class LinkDebitCardAccountPayLoad {
    cardNumber: string;
    currentPrimaryAccount = {} as LinkAccountDetails;
    mobileNumber: string;
    newPrimaryAccount = {} as LinkAccountDetails;
}
export class LinkAccountDetails {
    accountNumber: string;
    accountType: string;
    isNew: 'Yes' | 'No';
}
export class CoverCardData {
    availableLimit?: string;
    cardNumber: string;
    cardStatus: string;
    coverAmount: string;
    currencyCode: string;
    customerName: string;
    dueBalance: string;
    expiryDate: string;
    lastStmtDate: string;
    minimumDueBalance: string;
    outStandingAmount: string;
    paymentDueDate: string;
    primaryCardFlag: string;
    productDescription: string;
    lastStmtBalance: string;
    creditAvailable: string;
    cardSubType: string;
    cardImage: string;
    cardType?: string;
    aliasId?: string;
}

export class DebitCoverCardData {
    availableLimit?: string;
    cardNumber: string;
    cardStatus: string;
    coverAmount?: string;
    currencyCode: string;
    customerName?: string;
    dueBalance?: string;
    expiryDate?: string;
    lastStmtDate?: string;
    minimumDueBalance?: string;
    outStandingAmount?: string;
    paymentDueDate?: string;
    primaryCardFlag?: string;
    productDescription?: string;
    lastStmtBalance?: string;
    creditAvailable?: string;
    cardExpiryDate?: string;
    cardHolderName?: string;
    primaryAccountNumber?: string;
    availableBalance?: string;
    accountType?: string;
    accountDesc?: string;
    aliasId?: string;
}

export class CardStatusPayload {
    cardNumber: string;
}

export class CoverCardStatementPayload {
    cardNumber: string;
    month: string;
    year: number;
}

