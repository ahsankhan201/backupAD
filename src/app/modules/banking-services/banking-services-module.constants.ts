export const BANKING_SERVICE_LIST = {
    chequeBook: 'tr_common_chequeBook',
    bankCertificate: 'tr_common_bankCertificateText',
    repeatTransfer: 'tr_common_repeatTransfer',
    demandDraft: 'tr_common_demandDraft',
    paymentOrder: 'tr_common_paymentOrder'
};

export const BANKING_SERVICE_ICON_LIST = [
    {
        serviceName: 'tr_common_chequeBook',
        serviceIcon: '/assets/images/ic.ChequeBook@2x.svg'
    },
    {
        serviceName: 'tr_common_bankCertificateText',
        serviceIcon: '/assets/images/ic.BankCertificate@2x.svg'
    },
    // will be added later
    // {
    //     serviceName: 'tr_common_repeatTransfer',
    //     serviceIcon: '/assets/images/ic.CardMaintenance@2x.svg'
    // },
    {
        serviceName: 'tr_common_demandDraft',
        serviceIcon: '/assets/images/ic.DemandDraft@2x.svg'
    },
    {
        serviceName: 'tr_common_paymentOrder',
        serviceIcon: '/assets/images/ic.PaymentOrder@2x.svg'
    }
];

export const BANKING_SERVICES_CONST = {
    bankingServicesComponent: 'tr_bankingServiceComponent_title',
    bankingServicesText: 'tr_bankingServiceComponent_title',
    horizontalLineClass: 'banking-service-divider',
    requestDemandDraftText: 'tr_bankingServiceComponent_requestDemandDraft',
    requestPaymentOrderText: 'tr_bankingServiceComponent_requestPaymentOrder',
    noRequestPaymentOrderText: 'tr_paymentOrder_no_request',
    requestNewChequeBookText: 'tr_bankingServiceComponent_requestNewChequeBook',
    requestBankCertificateText: 'tr_bankingServiceComponent_requestBankCertificate'
};

export const BANK_CERTIFICATE_BRANCH_TYPES = [{
    id: 'SAME_BRANCH',
    title: 'tr_bankCertificateComponent_myBranch',
    value: 'SAME_BRANCH'
}, {
    id: 'OTHER_BRANCH',
    title: 'tr_bankCertificateComponent_otherBranch',
    value: 'OTHER_BRANCH'
}];
// these are static values not required read from translation file
export const LANGUAGES_LIST = [{ id: 'ar', value: 'عربى' }, { id: 'en', value: 'English' }];

export const BANK_CERTIFICATES_LIST = [
    { id: 'No Liability', value: 'No Liability' },
    { id: 'Liability', value: 'Liability' },
    { id: 'Balance Confirmation', value: 'Balance Confirmation' },
    { id: 'Salary Transfer', value: 'Salary Transfer' },
    { id: 'IBAN and Reference Letter', value: 'IBAN and Reference Letter' }];

export const BANKING_CERTIFICATE_INFO = {
    UAE_COUNTRY_CODE_FOR_BRANCHES: 'UAE',
    OTHER_BRANCH: 'OTHER_BRANCH',
    selectedBranch: 'selectedBranch',
    ADDRESS_TO_MAXLENGTH: 40
};

// Payment order stepper constants
export const PAYMENT_ORDER_STEPPER_TEXT = {
    beneficiaryDetails: 'tr_paymentOrder_beneficiaryDetailsStepperText',
    transferFrom: 'tr_common_transferFromText',
    transactionDetails: 'tr_paymentOrder_transactionDetailsStepperText',
    confirmation: 'tr_paymentOrder_confirmationStepperText',
    stepperTitle: 'tr_paymentOrder_confirmationStepperText'
};

export const PAYMENT_ORDER_CONST = {
    beneficiaryDetails: 'tr_paymentOrder_beneficiaryDetailsStepperText',
    horizontalLineClass: 'payment-order-divider',
    successButtonText: 'tr_paymentOrder_successButtonText',
    summaryComponent: 'SummaryComponent',
    successScreenComponent: 'SuccessScreenComponent'
};

export enum REQUEST_TYPE {
    PAYMENT_ORDER = 'PAYMENT_ORDER',
    DEMAND_DRAFT = 'DEMAND_DRAFT'
}

export const PAYMENT_ORDER_BENE_MAX_LENGTH = 32;

export const CHEQUE_BOOK_INFO = {
    ALLOWED_ACCOUNTS: 'Yes',
    DELIVERY_OPTION: 'TO_HOME',
    DELIVER_TO_ME: 'Deliver To Me',
    LEAVES_PER_BOOK: 25,
    MOBILE_NUMBER: 'mobileNumber',
};

export const BANK_SERVICES_ALERT_TEXT = {
    NO_CHEQUE_BOOK: 'tr_bankingServiceComponent_noChequeBookRequest',
    NO_DEMAND_DRAFT: 'tr_bankingServiceComponent_noDemandDraftRequest',
    NO_PAYMENT_ORDER: 'tr_bankingServiceComponent_noPaymentOrderRequest',
    NO_BANK_CERTIFICATE: 'tr_bankingServiceComponent_noCertificateRequest'
};

export const BANK_SERVICES_DETAILS_TEXT = {
    CHEQUE_BOOK_DETAILS: 'tr_bankingServiceComponent_chequeBookDetails',
    DEMAND_DRAFT_DETAILS: 'tr_bankingServiceComponent_demandDraftDetails',
    PAYMENT_ORDER_DETAILS: 'tr_bankingServiceComponent_paymentOrderDetails',
    BANK_CERTIFICATE_DETAILS: 'tr_bankingServiceComponent_bankCertificateDetails'
};

export const BANKING_SERVICES_ROUTE_URL = '/services';
