import { PayeeListResponse } from './payee.model';

export class UtilityPaymentPayLoad {
    accountNumber: string;
    amount: string;
    card = {} as UtilityPaymentCardObj;
    description: string;
    optionalMemo: string;
    payeeId: string;
    pin: string;
    referenceNumConsumer: string;
    utilityProviderId: string;
    utilityProviderProductId: string;
    utilityServiceNumber: string;
    beneficiaryId?: number;
}

export class UtilityPaymentCardObj {
    cardNumber: string;
    cardType: string;
    countryCode: string;
    currencyCode: string;
    expiryDate: string;
}

export class UtilityInquiryPayLoad {
    pin: string;
    utilityProviderId: string;
    utilityProviderProductId: string;
    utilityServiceNumber: string;
}

export class PaymentTransferDetails {
    avaialableText?: string;
    availableAmount?: string;
    currencyCode?: string;
}

export class UtilityOutStandingBalanceResponse {
    outstandingAmount: string;
    utilityBillReferenceNumber: string;
}

export class PaymentSummaryDetailsModel {
    accountTypeDescription?: string;
    accountNumber?: string;
    memo?: string;
    amount: string;
    outstandingAmount?: string;
    cardNumber?: string;
    currencyCode?: string;
    payeeName?: string;
    utilityServiceNumber?: string;
    cardDescription?: string;
    donationTo?: string;
    payToCardNumber?: string;
    cardCurrencyCode?: string;
}

export class PaymentCancelRouting {
    cancelTransaction: boolean;
    hidePopUp: boolean;
}

export class DonationCheckBoxItem {
    id: string;
    title: string;
    data?: PayeeListResponse;
}

export class DonationCheckBox {
    title: string;
    data: DonationCheckBoxItem[];
}

export class CoverCardPaymentPayLoad {
    accountNumber: string;
    amount: string;
    beneficiaryId: string;
    card = {} as UtilityPaymentCardObj;
    intraBank: boolean;
    optionalMemo: string;
}

export class DonationList {
    generalAuthorityList: DonationCheckBoxItem[];
    uaeRedCrescentList: DonationCheckBoxItem[];
    sukukList: DonationCheckBoxItem[];
    zakatList: DonationCheckBoxItem[];
}
