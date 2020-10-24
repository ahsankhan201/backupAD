export class PaymentOrderPayload {
    amount: string;
    beneficiaryName: string;
    collectFrom: string;
    currency: string;
    customerName: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    purpose: string;
    requestType: string;
    sourceAccountNumber: string;
}

export class PaymentOrderSummaryScreenModel extends PaymentOrderPayload {
    sourceAccountDetails?: string;
}

export class BaneficiaryDetailsForm {
    beneficiaryName: string;
    purposeOfTransfer: string;
    collectFrom: string;
    country?: string;
    currency?: string;
}

export class DemandDraftPayload {
    amount: string;
    beneficiaryName: string;
    collectFrom: string;
    currency: string;
    customerName: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    purpose: string;
    requestType: string;
    sourceAccountNumber: string;
}

export class DemandDraftSummaryScreenModel extends DemandDraftPayload {
    sourceAccountDetails?: string;
}
