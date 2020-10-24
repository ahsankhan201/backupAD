export class GetBranchesListReqModel {
    city = '';
    country: string;
}

export class BankCertificateReqModel {
    accountNumber: string;
    addressedTo: string;
    branchName: string;
    certificateType: string;
    customerName: string;
    deliveryOption: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    preferredLanguage: string;
    standardCharges: number;
}

export class ChequeBookRequestModel {
    accountNumber: string;
    branchName: string;
    customerName: string;
    deliveryOption: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    salutation: string;
    standardCharges: number;
}

export class ChequeBookResponse {
    requestTime: string;
    serviceRequestNumber: string;
}

export class BankingServiceChargesModel {
    accountNumber: string;
    category: 'CHEQUE_BOOK_FEE' | 'CERTIFICATE_FEE';
}

export class BankingServiceChargesResponse {
    certificate: string;
    fee: number;
}

export class EligibleAccountsResponse {
    accountList: AccountsResponse[];
}

export class AccountsResponse {
    accountNumber: string;
    allowed: string;
}

export class AccountsSummaryResponse {
    accountNumber: string;
    accountDesc?: string;
    branchName: string;
    certificateLanguage: string;
    certificateType: string;
    channelId: string;
    charges: number;
    createdAt: string;
    customerId: string;
    customerName: string;
    deliveryOption: string;
    reason: string;
    requestId: number;
    requestType: string;
    status: string;
    updatedAt: string;
}

export class PaymentsSummaryResponse {
    amount: number;
    beneficiaryName: string;
    channelId: string;
    collectFrom: string;
    createdAt: string;
    currency: string;
    customerId: string;
    customerName: string;
    purpose: string;
    reason: string;
    requestId: number;
    requestType: string;
    sourceAccountNumber: string;
    status: string;
    updatedAt: string;
}
