import { AccountsList } from './global.model';

export class AccountListModel {
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
    filters?: Filter;
    ibanNumber: string;
    isDefaultAccount?: boolean;
    isJointAccount?: boolean;
    relationShipId: string;
    relationShipName: string;
    status: string;
    couponsCount?: string;
    nextDrawDaysCount?: string;
    nextDraw?: string;
    swiftCode?: string;
    additionalInfo?: AdditionalInfo;
    customerNumber?: string;
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


export class AccountDetailModel {
    swiftCode: string;
    myNetWorth: string;
    accountsList: AccountsList[];
    debitCardsList: DebitCardList[];
}

export class DebitCardList {
    cardExpiryDate: string;
    cardHolderName: string;
    cardNumber: string;
    cardStatus: string;
    cardSubType: string;
    description: string;
    primaryAccountNumber: string;
}

export class Coupon {
    accountNumber: string;
    couponNumber: string;
    couponType: string;
    nextDraw: string;
    nextDrawDaysCount: string;
}

export class AccountStatementPayload {
    accountNumber: string;
    month: string;
    year: number;
}
