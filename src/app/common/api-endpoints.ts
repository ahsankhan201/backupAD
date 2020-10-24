import { environment } from 'src/environments/environment';

/* Add Local Routing URL'S */
export const ROUTING_URLS = {
    BENEFICIARY: '/beneficiary',
    PAYEE: '/payee'
};

// Add Benefciary API End Points below

export const BENEFICIARY_ENDPOINTS = {
    GET_COUNTRIES_LIST: '/support/bank/country',
    GET_BANKS_LIST: '/support/bank/bank-details',
    GET_CURRENCY_LIST: '/support/bank/currency/',
    ACCOUNTS_BENEFICIARY: '/accounts/v2/beneficiary',
    ADD_INTERNATIONAL_BEN: '/accounts/v2/beneficiary/external',
    ADD_INTERNAL_BEN: '/accounts/v2/beneficiary/internal',
    ADD_UAE_OTHER_BEN: '/accounts/v2/beneficiary/local',
    ACCOUNT_NUMBER_DETAILS: '/accounts/accounts/detail',
    CARD_NUMBER_DETAILS: '/cards/covered-card/detail',
    UTILITY_PROVIDER: '/support/utility-providers',
    IS_ADIB_UAE_BANK_EXCLUDED: 'is_adib_uae_bank_excluded',
    GET_RESTRICT_WORDS_LIST: '/support/bank/restricted-word',
    VALIDATE_IBAN: '/accounts/accounts/iban-validate'
};
export const PARTY_ENDPOINTS = {
    GET_CUSTOMER_DETAILS: '/party/rim',
    GET_CUSTOMER_NAME_BY_MOBILE: '/party/name'
};
export const GET_MFP_CUSTOMER_DETAILS_BY_MOBILE = '/ADIBMBA/adapters/SMSAndEmailMgtAdapter/getCustomerNameByMobile';
// GET_MFP_CUSTOMER_DETAILS_BY_RIM endpoint will remove after integrating user login
export const GET_MFP_CUSTOMER_DETAILS_BY_RIM = '/ADIBMBA/adapters/LoginRegistrationAdapter/getCustomerDetails';
export const PAYEE_ENDPOINTS = {
    UTILITY_BENEFICIARY: '/accounts/v2/utility-beneficiary',
    MARK_AS_FAV: '/favourite'
};

export const ACCOUNTS_ENDPOINTS = {
    GET_ALL_BENIFICIARY: '/accounts/v2/beneficiary',
    MARK_AS_FAV: '/favourite',
    LIST_OF_ACCOUNTS: '/accounts/accounts/v2/details',
    DOWNLOAD_STATEMENT: '/accounts/accounts/estatement',
    OPEN_ACCOUNT: '/accounts/accounts/v2',
    GET_CHARITY_LIST: '/accounts/charities'
};

export const FINANCE_ENDPOINTS = {
    FINANCE_DETAILS: '/finance/detail',
    FINANCE_HISTORY: '/finance/history',
};
export const CARDS_ENDPOINTS = {
    COVER_CARD_LIMIT: '/cards/coveredCard/supplementary/limit',
};
// finance JSON files and this will remove after integrating with API endpoints
export const FINANCE_PROMOTION_JSON = '/assets/json/finance-ads.json';

export const TRANSACTION_HISTORY_API_URL = '/enquiry/transaction/history';
export const PENDING_TRANSACTION_API_URL = '/cards/covered-card/pending';

export const ACCOUNTS_CARDS_ENDPOINTS = '/enquiry/accounts-cards-details';

export const DEBIT_CARD_STATUS_API_URL = '/cards/debit-card/status/';
export const COVER_CARD_STATUS_API_URL = '/cards/covered-card/status/';

export const UTILITY_PAYMENT_ENDPOINTS = {
    INQUIRY: '/payments/utility/inquiry',
    PAYMENT: '/payments/utility/v2/payment',
    COVER_CARD_PAYMENT: '/payments/v2/covered-card'
};

export const TRANSFER_ENDPOINTS = {
    UAE_INTERNAL_TRANSFER: '/payments/v2/account/internal',
    UAE_EXTERNAL_TRANSFER: '/payments/v2/account/external',
    UAE_COVERECARD_ACC_INTERNAL_TRANSFER: '/payments/v2/accounts',
    EXCHANGE_RATE: '/payments/transfer-rate',
    TRANSFER_PURPOSE: '/support/transfer-purpose',
    INTERNATIONAL_TRANSFER: '/payments/v2/account/external',
    ACCOUNT_INTERNAL_TRANSFER: '/payments/account/internal',
    CARD_ACCOUNT_TRANSFER: '/payments/accounts'
};

export const PAYMENTS_ENDPOINTS = {
    PAYMENT_ORDER: '/payments/service/payment-order'
};

export const CACHED_DATA_ENDPOINTS = {
    ENTITY_DATA: '/support/cached-data/entity-data?entityList=COUNTRY_CODE_DETAILS',
    BRANCH_SEARCH: '/support/location/branch/search',
    COUNTRY_CODE_DETAILS: '/support/cached-data/country-codes'
};

export const PRODUCTS_ENDPOINTS = {
    CATEGORY: '/products/categories',
    PRODUCT_CATALOG: '/products/catalog',
    CONTACT_MODES: '/products/preferred-contact',
    CAR_BRAND: '/products/cars/brands',
    REGISTER: '/products/register-product',
    CAR_MODEL: '/products/cars/models'
};

export const DOWNLOAD_COVER_CARD_STATEMENT = '/cards/covered-card/estatement';
export const RECAPTCHA = {
    URL: environment.CAPTCHA.URL,
    PARAMS: '?onload=grecaptchaCallback&render=explicit',
};

export const DEVICE_REGISTRATION = '/enquiry/log/browser-login';
export const SUBSCRIPTION_ENDPOINT = '/enquiry/subscription/status';

export const BANKING_SERVICES_ENDPOINTS = {
    CHEQUE_BOOK_ELIGIBILITY: '/accounts/service/cheque-book/eligibility',
    BRANCH_LIST: '/support/location/branch/search',
    CERTIFICATE_REQ: '/accounts/service/bank-certificate',
    GET_CHARGES: '/payments/service/fees',
    CHEQUE_BOOK_REQ: '/accounts/service/cheque-book',
    ACCOUNTS_SERVICE_SUMMARY: '/accounts/service/summary',
    PAYMENTS_SERVICE_SUMMARY: '/payments/service/summary',
    ACCOUNTS_SERVICE_DETAILS: '/accounts/service/details/',
    PAYMENTS_SERVICE_DETAILS: '/payments/service/details/'
};
export const CHANGE_CARD_PRIMARY_ACCOUNT = '/cards/debit-card/primary-account';

export const AGREEMENT_ENDPOINTS = {
    AGREEMENT_REQ: '/party/agreement',
};

export const DISPLACE_SESSION = '?displacesession=true';
