import { environment } from 'src/environments/environment';

export const TRANSLATION_DATA = {
    LANGUAGES: [
        {
            LANGUAGE_ISO_CODE: 'en',
            LANGUAGE_TEXT: 'Eng'
        },
        {
            LANGUAGE_ISO_CODE: 'ar',
            LANGUAGE_TEXT: 'عربى'
        }
    ],
    DEFAULT_LANGUAGE: 'en',
};
export const LANGUAGES_AVAILABLE = TRANSLATION_DATA.LANGUAGES.map(LANG => LANG.LANGUAGE_ISO_CODE);
export const ARABIC_LANG_TEXT = 'ar';
export const ENGLISH_LANG_TEXT = 'en';
export const NAVBAR_LIST_JSON = '/assets/json/sidebar-list.json';
export const DOMAINS = {
    APICONNECT: 'API_CONNECT_URL',
    API_SIT_CONNECT: 'API_CONNECT_URL',
    PARTY: 'API_PARTY_URL',
    FINANCE: 'API_FINANCE_URL',
};

export const MENU_ACTION = {
    copy: 'copy',
    dispute: 'dispute',
    freeze: 'freeze',
    edit: 'edit',
    delete: 'delete',
    active: 'active'
};

export const ANIMATION_JSON = {
    SECURITY_TIPS_JSON: '/assets/json/security-tips.json',
    DO_MORE_JSON: '/assets/json/do-more.json',
    DO_YOU_KNOW_JSON: '/assets/json/do-you-know.json',
    LOADER_JSON: '/assets/json/loader.json'
};

export const SECURITY_TIPS_CONST = {
    SVG: 'svg',
    APP_STORE_QR: '/assets/images/security-tips/app-store-qr.svg',
    APP_STORE_LINK: '/assets/images/security-tips/app-store-link.svg',
    GOOGLE_PLAY_QR: '/assets/images/security-tips/google-play-qr.svg',
    GOOGLE_PLAY_LINK: '/assets/images/security-tips/google-play-link.svg',
    SLIDE_INTERVAL: 20000
};

export const API_HEADERS = {
    xRim: '000',
    xChannelId: 'RIB',
    ContentType: 'text/plain',
    xApplicationName: 'sample',
    xUniqueId: 'x-unique-id',
    xLanguage: 'en',
    action_type_email: 'IB_FORGOT_USERNAME',
    any: 'ANY',
    uuidGenerator: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
};

export const ICON = {
    iconHolder: '/assets/icons/ic_IconPlaceholder_Normal.svg',
    verifyIcon: '/assets/icons/ic.verified.svg',
    settingIcon: '/assets/icons/mdi-light:dots-vertical@2x.svg',
    detailIcon: '/assets/icons/ic.Back@2x.svg',
    editIcon: '/assets/icons/ic.Edit@2x.svg',
    deleteIcon: '/assets/icons/ic.Remove@2x.svg',
    errorIcon: '/assets/icons/ic.error.svg',
    prevIcon: '/assets/icons/previous-icon.png',
    nextIcon: '/assets/icons/next-icon.png',
    infoIcon: '/assets/icons/ic.info.svg',
    addIconSmall: '/assets/icons/ic.add2x.svg',
    tickSelectedIcon: '/assets/icons/icons-selected-tick@2x.svg',
    tickNonSelectedIcon: '/assets/icons/icon-non-selected-tick@2x.svg',
    addIcon: '/assets/icons/add-icon.svg',
    doneIcon: '/assets/icons/step-done.svg',
    defaultIcon: '/assets/icons/payee/DEFAULT.svg',
    copyIcon: '/assets/icons/ic.Copy.svg',
    closeIcon: '/assets/icons/ic.close.svg',
    promotionalCardIcon: '/assets/icons/cover-card@2x.svg',
    securityIcon: '/assets/icons/security-icon.svg',
    inActiveBen: '/assets/icons/inactive-ben@2x.svg',
    inActiveBack: '/assets/icons/inactive-back@2x.svg',
    PAYEES: {
        AADC: '/assets/icons/payee/AADC.svg',
        ADDC: '/assets/icons/payee/ADDC.svg',
        DEWA: '/assets/icons/payee/DEWA.svg',
        DU: '/assets/icons/payee/DU.svg',
        ETISALAT: '/assets/icons/payee/ETISALAT.svg',
        FEWA: '/assets/icons/payee/FEWA.svg',
        RTA: '/assets/icons/payee/RTA.svg',
        SALIK: '/assets/icons/payee/SALIK.svg',
        SEWA: '/assets/icons/payee/SEWA.svg',
    }
};

export const SNACKBAR_MESSAGETYPE = {
    ERROR: 'error',
};
export const HEADER_INFO = {
    hideText: 'tr_HeaderDashboardComponent_hideText',
    showText: 'tr_HeaderDashboardComponent_showText',
    logo: '/assets/images/Logo.png',
    userImage: '/assets/icons/user0@2x.svg',
    scrollMove: 300
};

export const HEADER_CONST = {
    name: 'Bader Alzaben',
    totalAvailableFundsText: 'tr_HeaderDashboardComponent_totalFundsText',
    welcomeText: 'Welcome!',
    languageEngText: 'Eng',
    languageArText: 'عربى',
    availableFundsHiddenValue: '********',
    rtlBodyClassName: 'rtl-body'
};

export const TRANSFER_PAYMENT_CONST = {
    adib: 'ADIB',
    viewAll: 'View All',
    edit: 'edit',
    delete: 'delete',
    accountNumberLabel: 'Account Number',
    mobileNumberLabel: 'Mobile Number',
    ibanNumberLabel: 'IBAN Number',
    cardNumberLabel: 'Card Number',
    mobileIdentifierAttribute: 'utilityServiceNumber',
    nickName: 'nickName',
    itemLimit: 5,
    payeeFilterAttribute: 'YES',
    beneScrollContainer: 'beneScrollContainer',
    payeeScrollContainer: 'payeeScrollContainer',
    favoriteAttribute: 'Y',
    unFavoriteeAttribute: 'N',
    scrollDirectionForward: 'forward',
    srollDirectionSmooth: 'smooth',
    addBeneficiary: 'tr_common_addBeneficiaryText',
    addPayee: 'tr_common_addPayeeText'
};

export const ACCOUNT_DETAILS_CONST = {

    accountDetail_copyText: 'Copy Account Details',
    accountDetail_avilableFunds: 'Available Funds',
    accountDetail_currentBalance: 'Current Balance',
    accountDetail_accountNumber: 'Account Number',
    accountDetail_iban: 'IBAN',
    accountDetail_swift: 'Swift',
    accountDetail_currency: 'Currency',
    adib: 'ADIB',
    accountDetail_accountHolderName: 'Account Holder Name',
    accountDetail_bankName: 'Bank Name',
    accountDetail_drawDate: 'Next Draw Date',
    accountDetail_numberOfCopun: 'Number of Coupons',
    ghinaAccountType: 'SAV',
    GHI_YES: 'Yes',
    GHI_NO: 'No',
    accountDetailQuickLinks: [
        {
            link: '',
            action: 'MONEY_TRANSFER',
            title: 'tr_common_moneyTransferText',
            icon: '/assets/icons/ic.money-transfer@2x.svg'
        },
        {
            link: '',
            action: 'PAY_BILLS',
            title: 'tr_common_payBillsText',
            icon: '/assets/icons/ic.payments@2x.svg'
        },
        {
            link: '',
            action: 'CHEQUE_BOOK',
            title: 'tr_common_chequeBookText',
            icon: '/assets/icons/ic.cheque-book@2x.svg'
        },
        {
            link: '',
            action: 'E_STATEMENT',
            title: 'tr_common_eStatementText',
            icon: '/assets/icons/ic.e-statment@2x.svg'
        },
        {
            link: '',
            action: 'BANK_CERTIFICATE',
            title: 'tr_common_bankCertificateText',
            icon: '/assets/icons/ic.bank-certificate@2x.svg'
        }
    ],
    dashboardQuickLinks: [
        {
            action: 'MONEY_TRANSFER',
            link: '',
            title: 'tr_common_moneyTransferText',
            icon: '/assets/icons/ic.money-transfer@2x.svg'
        },
        {
            action: 'PAYMENTS',
            link: '',
            title: 'tr_common_payBillsText',
            icon: '/assets/icons/ic.payments@2x.svg'
        }
    ]

};

export const QUICKLINK_DEFAULT_COUNT = 3;
export const QUICKLINK_E_STATEMENT = 'E_STATEMENT';
export const QUICKLINK_BANK_CERTIFICATE = 'BANK_CERTIFICATE';
export const QUICKLINK_CHEQUE_BOOK = 'CHEQUE_BOOK';

export const E_STATEMENT_DIALOG_DATA = {
    TITLE: 'tr_eStatementDialog_titleText',
    CLOSE: 'tr_eStatementDialog_closeText',
    DOWNLOAD: 'tr_eStatementDialog_downloadText',
    SELECT_MESSAGE: 'tr_eStatementDialog_selectMonthText',
    WIDTH: '304px',
    HEIGHT: '294px',
    DEFAULT: 'default',
    SHORT: 'short',
    ONE: 1,
    SEVEN: 7,
    TEN: 10,
    THIRTEEN: 13,
    ZERO: 0,
    ZERO_STRING: '0',
    CONTENT_DISPOSITION: 'content-disposition',
    EQUAL_TO: '=',
    TWO: -2
};

export const ACCOUNT_TX_HEADERS = {
    transactionGridWebHeaders: [{ headerText: 'tr_transactionGrid_dateAndTimeText', className: 'date' },
    { headerText: 'tr_transactionGrid_transactionIdText', className: 'transactionId' },
    { headerText: 'tr_paymentComponent_memoText', className: 'memo' },
    { headerText: 'tr_common_descriptionText', className: 'description' },
    { headerText: 'tr_common_amountText', className: 'amount' }],
    transactionGridMobileHeaders: [
        { headerText: 'tr_transactionGrid_transactionIdText', className: 'transactionId' },
        { headerText: 'tr_paymentComponent_memoText', className: 'memo' },
        { headerText: 'tr_common_descriptionText', className: 'description' }]
};

export const COPY_BUTTON_SELECTOR = 'ibd-copy-button';
export const COPY_TEXT = {
    message: 'Data has been copied'
};

export const TRANSFER_PAYMENT_MENU_OPTIONS = [
    { label: 'Delete', icon: '/assets/icons/ic.Remove@2x.svg', action: 'delete' }
];

export const PAYEE_MENU_OPTIONS = [
    { label: 'Edit', icon: '/assets/icons/ic.Edit@2x.svg', action: 'edit' },
    { label: 'Delete', icon: '/assets/icons/ic.Remove@2x.svg', action: 'delete' }
];

export const TRANSACTION_TABLE_MENU_OPTIONS = [
    { label: 'Copy Transaction', icon: '/assets/icons/ic.Copy.svg', action: 'copy' }
];

export const ACCOUNT_TYPES = {
    ACCOUNT: 'Account',
    CARD: 'CreditCard',
    MOBILE: 'Mobile', // MOBILE added as part of beneficiary V2 migration
    SELECT_CARD: 'Cards'
};

export const MONEY_TRANSFER_TO_TYPES = {
    ACCOUNT: 'ACCOUNT',
    CARD: 'CARD',
    BEFICIARY: 'BENEFICIARY'
};
export const SLASH = '/';
export const TEXT_TO_SEARCH = 'text_to_search';
export const OTP_DATA = {
    MESSAGE: 'tr_common_otpMessageText',
    RESEND_OTP_TIMER: 30,
    TIMER_FORMAT: 'mm:ss',
    OTP_MAXLENGTH: 6,
    MASKING_SYMBOL: '**',
    SHOW_LAST_OF_MOBILE_NUMBER: 3,
    OTP_EXPIRED: 'Expired OTP',
    OTP_INVALID: 'Invalid OTP',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    NO_MOBILE_FOUND: 'No Mobile Found',
    NO_LOCATION_FOUND: 'No Location Found',
    doneText: 'done',
    submitText: 'tr_common_submitText',
    INVALID_OTP_TEXT: 'tr_common_invalidOTPText',
    invalid_otp_retryCounter_4: '4',
    invalid_otp_retryCounter_4_message: 'tr_invalid_otp_retryCounter_4',
    submitPayloadText: 'Submit'
};

export const BEARER_TOKEN = 'Bearer ';
export const CIAM = {
    OPERATION_VERIFY: 'verify',
};
export const COOLING_PERIOD = 'cooling-period';
export const HTTP_STATUS_CODE = {
    BAD_FORMAT: 400,
    INTERNAL_SERVER_ERROR: 500,
    OK: 200,
    NO_CONTENT: 204,
    CREATED: 201,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIME_OUT: 504,
    EXPECTATION_FAILED: 417,
    vendorStatus: 'vendorStatus'
};
export const LOCALE = 'locale';
export const RESPONSE_STATUS_TEXT = 'status';
// Form control length Validation
export const FORM_LENGTH_VALIDATION = {
    iban: {
        minLength: 16,
        maxLength: 34
    },
    accountNumber: {
        minLength: 8,
        maxLength: 34
    },
    adibAccountNumber: {
        minLength: 8,
        maxLength: 8
    },
    coverCard: {
        minLength: null,
        maxLength: 16
    },
    name: {
        minLength: null,
        maxLength: 30
    },
    address: {
        minLength: null,
        maxLength: 35
    },
    city: {
        minLength: null,
        maxLength: 20
    },
    nickname: {
        minLength: null,
        maxLength: 30
    },
    aba: {
        minLength: null,
        maxLength: 9
    },
    mobile: {
        minLength: 9,
        maxLength: 10
    }
};

export const WATER_ELECTRICITY_PRODUCTS = {
    ADDC_PRODUCT: 'ADDC',
    AADC_PRODUCT: 'AADC',
    DEWA_PRODUCT: 'DEWA',
    FEWA_PRODUCT: 'FEWA',
    SEWA_PRODUCT: 'SEWA',
};

export const TELECOM_PRODUCTS = {
    ETISALAT_LANDLINE: 'ETISALAT - Land Line/e-Life',
    ETISALAT_INTERNET: 'ETISALAT - Internet',
    ETISALAT_GSM: 'ETISALAT - GSM',
    ETISALAT_WASEL: 'ETISALAT - Wasel - Recharge',
    ETISALAT_ALSHAMIL: 'ETISALAT - AlShamil',
    ETISALAT_EVISION: 'ETISALAT - EVision',
    DU_PREPAID: 'Du - Prepaid - Recharge',
    DU_POSTPAID: 'Du - Postpaid',
    DU_FIXED_LINE: 'Du - Fixed Line/Call Select',
    DU_TV: 'Du - TV',
    DU_BROADBAND: 'Du - Broadband'
};

export const FORM_LENGTHS = {
    FORM_LENGTH_SIX: 6,
    FORM_LENGTH_NINE: 9,
    FORM_LENGTH_TEN: 10,
    FORM_LENGTH_ELEVEN: 11,
    FORM_LENGTH_TWELVE: 12,
    FORM_LENGTH_FIFTEEN: 15,
    FORM_LENGTH_SIXTEEN: 16,
    FORM_LENGTH_THIRTEEN: 13,
    FORM_LENGTH_TWENTYONE: 21,
};

export const MOBILE_COUNTRY_CODE_UAE = '+971';
export const SUCCESS_SCREEN_TEXT = {
    BENEFICIARY: 'beneficiary',
    benAdded: 'tr_addBene_beneAddedText',
    note: 'tr_common_noteText',
    transferText: 'tr_addBene_transferFundsToText',
    twentryFourHrs: 'tr_common_twentyFourHoursText',
    only: 'tr_common_onlyText',
    after: 'tr_common_afterText',
    transferPayments: 'tr_common_transfer&PaymentText',
    payNow: 'tr_common_payNowText'
};

export const PAYEE_SUCCESS_SCREEN_TEXT = {
    PAYEE: 'payee',
    payeeAdded: 'Payee Added',
    note: 'tr_common_noteText',
    transferText: 'tr_addPayee_transferText',
    twentryFourHrs: 'tr_common_twentyFourHoursText',
    lastText: 'tr_addPayee_updatePayeeText',
};

export const BANKING_SERVICE_SUCCESS_SCREEN_TEXT = {
    PAYMENT_ORDER: 'bankingServicePaymentOrder',
    requestAddedText: 'tr_common_successText'
};

export const PAYMENT_SUCCESS_SCREEN_TEXT = {
    PAYMENT: 'payment',
    COVER_CARD_PAYMENT: 'coverCardpayment',
    DONATION_PAYMENT: 'donation',
    REF_NO_LOCATION: 'location',
    PRODUCT_ENQUIRY: 'productEnquiry',
    OPEN_ACCOUNT: 'openAccount',
    TIME_DEPOSIT_ACCOUNT: 'timeDepositAccount',
    GHINA_SAVINGS_ACCOUNT: 'openGhinaAccount',
    CHANGE_PASSWORD: 'changePassword',
    ACTIVATE_CARD: 'activateCard',
    CHANGE_COVER_LIMIT: 'changeCoverLimit',
    BANK_CERTIFICATE: 'bankCertificate',
    CHANGE_CARD_PRIMARY_ACC: 'linkAccount',
    success: 'Success',
    successHeaderText: 'tr_paymentSuccess_successText',
    billPaymentText: 'tr_paymentSuccess_billPaymentText',
    refNumberText: 'tr_paymentSuccess_refNumberText',
    coverCardPaymentText: 'tr_paymentSuccess_coverCardPaymentText',
    donationPaymentText: 'tr_paymentSuccess_donationPaymentText',
    defaultPayAmountButtonText: 'tr_common_payAmountText',
    donationPayAmountButtonText: 'tr_common_donateText',
};

export const TRANSFER_SUCCESS_SCREEN_TEXT = {
    transferAmount: 'tr_moneyTransferComponent_transferAmountText',
    internatinalTransferText: 'internationalTransfer',
    accountTransferText: 'accountTransfer'
};

export const REPLACE_PREFIX_ZERO = '^(?!00[^0])0';
export const PATTERN_ALPHA_NUMERIC = '^$|^[A-Za-z0-9 ]+';
export const PATTERN_ALPHA_NUMERIC_WITHOUT_SPACE = '^$|^[A-Za-z0-9]+';
export const PATTERN_NUMERIC = '^[0-9]*$';
export const PATTERN_NUMERIC_WITH_DOT = '^[0-9\.]*$';
export const PATTERN_NUMERIC_WITH_DECIMAL = /^(?!0)\d{1,16}(\.\d{0,3})?$/g;
export const PATTERN_SUBSTRING_TWO = /.{1,2}/g;
export const PATTERN_ALPHA_NUMERIC_ONLY = /^\w+$/;
export const PATTERN_NO_WHITESPACE = '(?!^ +$)^.+$';


export const ERROR_MESSAGES = {
    thisText: 'This',
    isRequired: 'is required',
    mustBe: 'must be at least',
    charactersLong: 'characters long',
    cannotExceed: 'cannot exceed',
    characters: 'characters',
    notValidEmail: 'is not valid.',
    notValidMobile: 'not a valid mobile',
    specialCharactersNotAllowed: 'Special Characters are not allowed',
    mustMatch: 'must match',
    isBeneficiaryTaken: 'This beneficiary already exisits',
    ownAccountAddition: 'You cannot add your account or card as a beneficiary',
    isPayeeTaken: 'This payee already exisits',
    notAllowedWord: 'tr_showFormError_notAllowedWord',
    keyword: 'Keyword'
};

export const DIALOG_DEFAULT = {
    panelClass: 'ibd-dialog-com',
};
export const NAV_CONTROLS = {
    BACK: 'Back',
    NEXT: 'Next',
    PREV: 'Previous',
    DONE: 'done',
    STEP_DONE: 'stepDone',
    BACK_ARROW: '<',
    TRANSFER_PAYMENTS: 'tr_common_transfer&PaymentText',
    TRANSFER_PAYMENTS_ROUTE: 'transfers-payments',
    ADD_BEN_DIVIDER_CLASS: 'add-beneficiary-divider',
    OPEN_ACCOUNT_DIVIDER_CLASS: 'open-account-divider',
    CHANGE_PASSWORD_DIVIDER_CLASS: 'change-password-divider',
    PROFILE_DIVIDER_CLASS: 'profile-divider-class'
};
export const NICKNAME_LABEL = 'Nick name';
export const RESPONSE_TYPE_TEXT = 'text';
export const TEXT_SUFFIX = '_TEXT';
export const IMG_SUFFIX = '_IMG';
export const NICKNAME_LENGTH = 20;
export const NUMBER_FORMAT_REGEX = /\B(?=(\d{3})+(?!\d))/g;
export const REMOVE_ARRAY_STRING = /[\]\[]/g;
export const BASE64 = 'base64';
export const PADDING = 16;
export const HEX = 'hex';
export const UTF8 = 'utf8';
export const CRYPTO_ALGORITHM = 'aes-256-cbc';
export const TEXT_PLAIN = 'text/plain';
export const CONTENT_TYPE_TEXT = 'content-type';
export const APPLICATION_JSON_TEXT = 'application/json';
export const VISIBLE_DIGITS = 3;
export const MASK_NUMBER_REGEX = /./g;
export const MASK_TYPE = '*';
export const NUMBER_GROUP_REGEX = /.{1,4}/g;
export const EXPIRY_DATE_REGEX = /.{1,2}/g;
export const EXPIRY_DATE_SEPARATOR = '/';
export const UNDERSCORE_TEXT = '_';
export const EMAIL_REGEX =
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
export const NO_WHITESPACE_REGEX = /\s/g;
export const REMOVE_SLASH_REGEX = /\//g;
// Transaction history grid constants
export const TRANSACTION_GRID_TEXT = {
    CREDIT_TEXT: 'Credit',
    FINANCE_TEXT: 'Finance',
    DEBIT_TEXT: 'Debit',
    ACCOUNT_TEXT: 'Account',
    PENDING_TEXT: 'Pending',
    TRANSACTION_DATE: 'transactionDate',
    DATE_EFFECTIVE: 'dateEffective',
    PENDING_TX_DATE: 'date',
    DISPLAY_FLEX: 'display-flex',
    HIDE_CONTENT: 'hide-content',
    DEBIT_KEY_TEXT: 'DB',
    SCROLL_AUTO_TEXT: 'auto',
    SCROLL_OVERFLOW_TEXT: 'scroll',
    INITIAL_PAGINATION_COUNT: 0,
    MAX_PAGINATION_COUNT: 20,
    COPY_CMD: 'copy',
    TEXT_CMD: 'text',
    CLIPBOARD_CMD: 'clipboardData',
    DATE_FORMAT: 'dd MMM HH:mm'

};

export const HYPHEN_TEXT = '—';

export const ALLOWED_DEBITCARD_LINKING_ACCOUNTS = ['CUR', 'SPA', 'SAV', 'SAV-Ghina'];
export const ACCOUNT_ALLOWED_TYPE_LIST = {
    CUR: 'tr_common_currentAccount',
    SPA: 'tr_common_salariedPackageAccount',
    SAV: 'tr_common_savingAccount',
    STI: 'tr_common_shortTermInvestmentAccount',
    CSA: 'tr_common_banoonAccount',
    TD: 'tr_common_timeDepositAccount',
    'SAV-Ghina': 'tr_common_saveGhinaAccount'
};
export const ACCOUNT_ALLOWED_STATUS_LIST = ['Active'];

export const ACCOUNT_ALLOWED_FOR_PAYMENTS = {
    CUR: 'tr_common_currentAccount',
    SPA: 'tr_common_salariedPackageAccount',
    SAV: 'tr_common_savingAccount',
    STI: 'tr_common_shortTermInvestmentAccount'
};

export const TRANSFER_FROM_PAYEE_SELECTION = [
    {
        id: 'ACCOUNT',
        title: 'tr_paymentComponent_myAccountsText'
    },
    {
        id: 'CARDS',
        title: 'tr_paymentComponent_myCardsText'
    }
];

export const MONEY_TRANSFER_TO_SELECTION = [
    {
        id: 'ACCOUNT',
        title: 'tr_moneyTransferComponent_myAdibAccountsText'
    },
    {
        id: 'CARD',
        title: 'tr_moneyTransferComponent_myAdibCardsText'
    },
    {
        id: 'BENEFICIARY',
        title: 'tr_moneyTransferComponent_beneficiaryText'
    }
];

export const TRANSFER_TO_PAYEE_SELECTION = [
    {
        id: 'Payee',
        title: 'tr_paymentComponent_payeeText'
    },
    {
        id: 'Takaful',
        title: 'tr_paymentComponent_takafulText'
    }
];

export const PAYMENT_TYPES = {
    donate: 'DONATE',
    utilityPayment: 'UTILITY PAYEE',
    ccPayment: 'COVER CARD',
    payments: 'PAYMENTS',
    payBills: 'PAY_BILLS',
    moneyTransfer: 'MONEY_TRANSFER'
};

export const TRANSFER_TYPES = {
    moneyTransfer: 'MONEY_TRANSFER',
    transferToAdibCard: 'ADIB CARD',
    transferToAccount: 'ACCOUNT',
    transferToAdibAccount: 'ADIB ACCOUNT',
    transferToBeneficiary: 'BENEFICIARY'
};

export const PAYMENT_ROUTING_BUTTONS = {
    accountsDashBoard: 'tr_paymentComponent_accountsDashBoardText',
    accountDetails: 'tr_paymentComponent_accountDetailsText',
    transferAndPayments: 'tr_common_transfer&PaymentText',
    coverCardDetails: 'tr_paymentComponent_coverCardDetailsText'
};

export const PAYMENT_VIEW_MAPPING_OBJ = {
    payBillsText: 'tr_common_payBillsText',
    transferAndPayments: 'tr_common_transfer&PaymentText',
    paymentToCoverCard: 'tr_cards_coveredCardText',
    donateText: 'tr_common_donateText',
    accountsDashBoard: 'tr_paymentComponent_accountsDashBoardText',
    cardsDashBoard: 'tr_cards_cardsDashBoardText',
    accountDetail: 'tr_account_detailText',
    payFromStepperText: 'tr_paymentComponent_payFromStepperText'
};

export const TRANSFER_VIEW_MAPPING_OBJ = {
    moneyTransferText: 'tr_common_moneyTransferText'
};

export const PAYMENT_SCREEN_TEXT = {
    addPayeeText: 'tr_common_addPayeeText',
    MEMO_MAX_LENGTH: 60,
    aedCurrencyCode: 'AED',
    MEMO: 'memo',
    AMOUNT: 'amount',
    minimumAmount: 'MINIMUM',
    fullAmount: 'FULL',
    uaeCountryCode: 'UAE',
    availableBalance: 'tr_paymentComponent_availableBalanceText',
    availableLimit: 'tr_paymentComponent_availableLimitText',
    searchText: 'tr_paymentComponent_searchPayeeText',
    accountInsufficientBalanceText: 'tr_paymentComponent_insufficientBalanceAccText',
    cardInsufficientBalanceText: 'tr_paymentComponent_insufficientBalanceCardText',
    noPayeeText: 'tr_paymentComponent_noPayeeText',
    noAccountText: 'tr_paymentComponent_noAccountText',
    payFromAccounts: 'tr_paymentComponent_payFromAccountsText',
    makePayment: 'tr_cards_makePaymentText',
    minAmountError: 'tr_paymentComponent_minAmountErrorText',
    validAmountError: 'tr_paymentComponent_validAmountErrorText',
    formOptionalText: 'tr_common_optionalText',
    payFullAmountErrorText: 'tr_paymentComponent_payFullAmountErrorText',
    ZERO: 0,
    internationalPaymentModeError: 'tr_moneyTransferComponent_paymentModeErrorText'
};

export const MONEY_TRANSFER_SCREEN_TEXT = {
    searchText: 'tr_moneyTransferComponent_searchBeneficiaryText',
    noAccountText: 'tr_moneyTransferComponent_noAccountText',
    noBeneficiaryText: 'tr_moneyTransferComponent_noBeneficiaryText',
    noCardText: 'tr_moneyTransferComponent_noCardText',
};

export const ACCEPTED_COVER_CARDS_FOR_PAYMENT = ['DARHOOM', 'COVER'];

export const DONATION_LIST_CATEGORY = {
    generalAuthorityText: 'tr_paymentComponent_generalAuthorityText',
    uaeRedCrescentText: 'tr_paymentComponent_uaeRedCrescentText',
    sukukAlKhairText: 'tr_paymentComponent_sukukAlKhairText',
    zakatFundText: 'tr_paymentComponent_zakatFundText',
    generalAuthority: 'General Authority of Islamic Affairs & Endowments',
    uaeRedCrescent: 'UAE Red Crescent',
    sukukAlKhair: 'Sukuk Al Khair',
    zakatFund: 'Zakat Fund',
};

export const PAYMENT_AMOUNT_SELECTION = [
    {
        id: 'MINIMUM',
        title: 'tr_paymentComponent_payMinimumText'
    },
    {
        id: 'FULL',
        title: 'tr_paymentComponent_payFullText'
    },
    {
        id: 'OTHER',
        title: 'tr_paymentComponent_payOtherText'
    }
];

export const DONATION_MEMO_MAX_LENGTH = 30;

export const ACCOUNT_TEXT = 'ACCOUNT';
export const ALLOWED_PAYEES_FOR_FULLORMORE_PAYMENT = ['AADC', 'ADDC', 'SEWA'];
export const USA_TEXT = 'USA';
export const NETWORTH_REQUIRED = 'is_netWorth_required';

export const SNACK_BAR_STATUS = {
    error: 'error',
    success: 'success'
};

export const INTERNATIONAL_TRANSFER_TEXT = {
    EXTERNAL: 'EXTERNAL',
    CONTRY_CODE: 'country_code',
    CURRENCY_CODE: 'currency',
    DEFAULT_TRANSFER_AMOUNT: '1',
    TRANSFER_TYPE: '3',
    FIXED_AMOUNT_DECIMAL: 2,
    SUMMARY_TITEL_CLASS: 'moneyTransferSummaryStepTitle',
    HIDE_CLASS_TEXT: 'hide-summary-title',
    remittanceDetails: 'remittanceDetails',
    purposeOfTransfer: 'purposeOfTransfer',
    localAmount: 'localAmount',
    memo: 'memo',
    internationalAmount: 'internationalAmount',
    external: 'External',
    location: 'location',
    minimumAmountError: 'tr_moneyTransferComponent_minimumAmountErrorText',
    insufficientBalanceError: 'tr_moneyTransferComponent_inSufficientFundErrorText',
    minimumTransferAmount: 100,
    UAE_COUNTRY: 'ARE',
    EXCHANGE_RATE_DECIMAL_LIMIT: 4,
    ZERO_TEXT: '0'
};

export const X_APPLICATION_SECRET = {
    text: 'x-application-secret'
};
export const INSIDE_UAE_TRANSFER_TEXT = {
    EXTERNAL: 'EXTERNAL',
    CONTRY_CODE: 'country_code',
    CURRENCY_CODE: 'currency',
    DEFAULT_TRANSFER_AMOUNT: '1',
    TRANSFER_TYPE_INSIDE_ADIB: '2',
    TRANSFER_TYPE_OUTSIDE_ADIB: '3',
    FIXED_AMOUNT_DECIMAL: 2,
    SUMMARY_TITEL_CLASS: 'moneyTransferSummaryStepTitle',
    HIDE_CLASS_TEXT: 'hide-summary-title',
    memo: 'memo',
    external: 'External',
    accountBeneficiary: 'Account',
    minimumAmountError: 'tr_moneyTransferComponent_insideUae_minimumAmountErrorText',
    minimumAmountErrorCrossCurrency: 'tr_moneyTransferComponent_minimumAmountErrorText',
    insufficientBalanceError: 'tr_moneyTransferComponent_inSufficientFundErrorText',
    minimumTransferAmount: 1,
    minimumTransferAmountCrossCurrency: 100,
    UAE_COUNTRY: 'ARE',
    INTRABANK: 'Intrabank',
    AMOUNT: 'amount',
    DEBIT_AMOUNT: 'debitAmount',
    CREDIT_AMOUNT: 'creditAmount',
    CREDIT_TEXT: 'CREDIT',
    summaryScreenText: 'summaryScreen',
    successScreen: 'successScreen',
    insideUaeTransferComponent: 'InsideUaeTransferComponent',
    savCardType: 'SAV',
    uaeCountryCode: 'UAE',
    uaeCurrencyCode: 'AED',
    expiryDate: '0000',
    creditCardText: 'CreditCard'
};
export const TRANSFER_ACCOUNT_PAYLOAD = {
    stpTypeCode: 'PMS',
    transferType: '1'
};
export const API_ERROR_LIST = {
    6003: 'tr_moneyTransferComponent_limitExceededText',
    6000: 'tr_moneyTransferComponent_enterMinimumAmountText',
    NO_STATEMENT_AVAILABLE: 'tr_common_noStatementAvailable'
};
export const LOCATION_TEXT = 'location';
export const COUNTRY_NAME_UAE = 'United Arab Emirates';
export const LOCAL_CURRENCY = ['AED'];
export const FORGIN_CURRENCY = ['EUR', 'USD', 'QAR', 'GBP', 'EGP'];
export const HIDE_OVERFLOW_CLASS = 'hide-overflow';
export const DEFAULT_HORIZONTAL_LINE_CLASS = 'horizontal-line';
// Open Account constants
export const CURRENCY_LIST_OBJ = {
    USD: 'USD',
    AED: 'AED',
    GBP: 'GBP'
};
export const OPEN_ACCOUNT_CURRENCY = [
    { id: CURRENCY_LIST_OBJ.AED, title: CURRENCY_LIST_OBJ.AED },
    { id: CURRENCY_LIST_OBJ.USD, title: CURRENCY_LIST_OBJ.USD, },
    { id: CURRENCY_LIST_OBJ.GBP, title: CURRENCY_LIST_OBJ.GBP, }];
export const OPEN_SAVINGS_ACCOUNT_TEXT = {
    OTP_COMPONENT: 'OTP_COMPONENT',
    SUCCESS_SCREEN: 'SUCCESS_SCREEN',
    SUMMARY_SCREEN: 'SUMMARY_SCREEN',
    SAVINGS_ACCOUNT: 'Savings Account',
    SAVINGS_ACCOUNT_COMPONENT: 'SAVINGS_ACCOUNT_COMPONENT',
    DEPOSIT_AMOUNT: 'depositAmount',
    TRANSFER_FROM_ACCOUNT: 'transferFromAccount',
    MOBILE_NUMBER: 'mobileNumber',
    EMAIL_ID: 'emailId',
    EXCHANGE_TRANSFER_AMOUNT: '1',
    SAVINGS_ACCOUNT_TYPE: 'SAV',
    ACCOUNT_VALUE_FOR_DROPDOWN: 'accountValueForDropDown',
    ACCOUNT_NAME_FOR_DROPDOWN: 'accountNameForDropDown',
    SAVINGS_ACCOUNT_TITLE: 'tr_openAccount_savingsAccount',
    TIME_DEPOSIT_ACCOUNT_TYPE: 'TD',
    TIME_DEPOSIT_ACCOUNT_TITLE: 'Time Deposit',
    TIME_DEPOSIT_ACCOUNT_CUTOMERTYPE: 'Personal'
};
export const MIN_AMOUNT_FOR_OPENING_SAVINGS_ACCOUNT = {
    AED: 3000,
    USD: 820,
    GBP: 650
};
export const ACCOUNTS_ALLOWED_IN_DROPDOWN_FOR_OPEN_ACCOUNT = ['SAV', 'CUR'];
export const OPEN_ACCOUNT_TYPES = [
    {
        id: 'Ghina Savings Account', imageUrl: 'assets/images/ghina-saving-account.svg',
        title: 'tr_openAccount_ghinaSavingsAccount', description: 'tr_openAccount_ghinaSavingsAccountDes'
    },
    {
        id: 'Savings Account', imageUrl: 'assets/images/saving-account.svg',
        title: 'tr_openAccount_savingsAccount', description: 'tr_openAccount_savingsAccountDes'
    },
    {
        id: 'Time Deposit', imageUrl: 'assets/images/investment-deposit-account.svg',
        title: 'tr_openAccount_timeDeposit', description: 'tr_openAccount_timeDepositDes'
    },
];
export const OPEN_ACCOUNT_TITILE = 'tr_openAccount_openAccountLabel';
export const OPEN_ACCOUNT_CTA_LINK_LABEL = 'tr_openAccount_ctaLinkLabel';
export const OPEN_ACCOUNT_COMPONENT = 'OpenAccountComponent';
export const INVESMENT_DEPOSIT_ACCOUNT_COMPONENT = 'InvestmentDepositAccountComponent';
export const SUCCESS_SCREEN_COMPONENT = 'SuccessScreenComponent';
export const OTP_COMPONENT = 'OTPComponent';
export const SUMMARY_COMPONENT = 'SummaryComponent';
export const INVESTMENT_DEPOSIT_COMPONENT = 'InvestmentDepositAccountComponent';
export const INVESTMENT_SUMMARY_COMPONENT = 'InvestmentDepositAccountsSummaryComponent';
export const OPEN_ACCOUNT_CURRENCY_LIST = [
    { id: 'AED', title: 'AED' },
    { id: 'USD', title: 'USD' },
    { id: 'GBP', title: 'GBP' }];
export const TIME_DEPOSIT_ACCOUNT_DURATION = ['1', '3', '6', '9', '12'];
export const TIME_DEPOSIT_ACCOUNT_DURATION_MONTH = 'Month';
export const TIME_DEPOSIT_ACCOUNT_MIN_AMOUNT = {
    AED: 10000,
    USD: 2800,
    GBP: 2200,
};
export const TIME_DEPOSIT_ACCOUNT_TEXT = {
    timeDeposit: 'Time Deposit',
    investmentDepositAccount: 'Investment Deposit Account',
    accountCurrency: 'accountCurrency',
    accountDuration: 'accountDuration',
    depositAmount: 'depositAmount',
    transferFromAccount: 'transferFromAccount',
    maturityOptionTransferTo: 'maturityOptionTransferTo',
    maturityOptionAccount: 'maturityOptionAccount',
    profitCreditOptionTransferTo: 'profitCreditOptionTransferTo',
    profitCreditOptionAccount: 'profitCreditOptionAccount',
    autoRenew: 'Auto Renew',
    capitalize: 'Capitalize',
    maturityAccount: 'maturityAccount',
    profitCreditAccount: 'profitCreditAccount',
    Transfer: 'Transfer',
    TIME_DEPOSIT_TITLE: 'tr_timeDepositeAccountComponent_successScreenText'
};
export const OPEN_ACCOUNT_TEXT = {
    termsAndCondtionsText: 'tr_common_termsAndConditions',
    termsAndConditionGhinaService: 'terms-and-condition-ghina-service',
    termsAndConditionBankingService: 'terms-and-condition-banking-service',
    termsAndConditionDisagreeText: 'tr_common_disgree',
    termsAndConditionAgreeText: 'tr_common_agree'
};
export const EXCHANGE_TRANSFER_AMOUNT_DEFAULT = '1';
export const MATURIY_OPTIONS = [
    { id: 'AutoRenew', value: 'Auto Renew' },
    { id: 'Transfer', value: 'Transfer To Account' }];
export const PROFIT_CREDIT_OPTIONS = [
    { id: 'Capitalize', value: 'Capitalize' },
    { id: 'Transfer', value: 'Transfer To Account' }];
export const BODY = 'body';

export const OPEN_GHINA_ACCOUNT_TEXT = {
    OTP_COMPONENT: 'OTP_COMPONENT',
    SUCCESS_SCREEN: 'SUCCESS_SCREEN',
    SUMMARY_SCREEN: 'SUMMARY_SCREEN',
    GHINA_ACCOUNT: 'Ghina Savings Account',
    GHINA_ACCOUNT_COMPONENT: 'GHINA_ACCOUNT_COMPONENT',
    DEPOSIT_AMOUNT: 'depositAmount',
    TRANSFER_FROM_ACCOUNT: 'transferFromAccount',
    MOBILE_NUMBER: 'mobileNumber',
    EMAIL_ID: 'emailId',
    EXCHANGE_TRANSFER_AMOUNT: '1',
    SAVINGS_ACCOUNT_TYPE: 'GHINA',
    ACCOUNT_VALUE_FOR_DROPDOWN: 'accountValueForDropDown',
    ACCOUNT_NAME_FOR_DROPDOWN: 'accountNameForDropDown',
    SAVINGS_ACCOUNT_TITLE: 'tr_openAccount_ghinaSavingsAccount'
};

export const TRANSFER_RECEIPT_LABELS = {
    statusText: 'tr_common_statusText',
    referenceNumberText: 'tr_common_referenceNumberText',
    dateAndTimeText: 'tr_transferReceipt_dateAndTimeText',
    fromAccountNumberText: 'tr_transferReceipt_fromAccountText',
    toAccountText: 'tr_transferReceipt_benAccountNumberText',
    amountText: 'tr_transferReceipt_amountText',
    bankNameText: 'tr_transferReceipt_receivingBankText',
    successfulText: 'tr_transferReceipt_successFulText',
    benNameText: 'tr_common_beneNameText',
    selfText: 'tr_transferReceipt_selfText',
    adibText: 'tr_common_adibText',
    UAE_TEXT: 'UAE',
    transferredToText: 'tr_transferReceipt_transferredToText',
    transferAmountText: 'tr_moneyTransferComponent_transferAmountText',
    fromCoverCardText: 'tr_transferReceipt_coverCardText'
};
export const BANK_NAME = 'tr_transferReceipt_bankNameText';
export const BANK_COUNTRY = 'tr_transferReceipt_bankCountryText';

export const RECEIPT_COPY_TRANSLATION_KEYS = [
    TRANSFER_RECEIPT_LABELS.referenceNumberText, TRANSFER_RECEIPT_LABELS.transferredToText,
    BANK_NAME, BANK_COUNTRY, TRANSFER_RECEIPT_LABELS.transferAmountText,
    TRANSFER_RECEIPT_LABELS.selfText, TRANSFER_RECEIPT_LABELS.adibText];

export const PAYMENT_RECEIPT_LABELS = {
    paymentToCardNumberText: 'tr_cards_cardNumberText',
    paymentAmountText: 'tr_paymentReceipt_amountText',
    paymentDateText: 'tr_paymentReceipt_paymentDateText',
    utilityProviderText: 'tr_paymentReceipt_utilityProviderText',
    serviceProviderNumberText: 'tr_paymentReceipt_servicePrividerNumberText',
    cardNumberText: 'tr_paymentReceipt_cardNumberText',
    donatedToText: 'tr_paymentReceipt_donatingToText',
    donationAmountText: 'tr_paymentReceipt_donationAmountText',
    donationTypeText: 'tr_paymentReceipt_donationTypeText',
    phoneNumberText: 'tr_paymentReceipt_phoneNumberText',
    fromAccountNumberText: ''
};

export const PAYMENT_RECEIPT_COPY_TRANSLATION_KEYS = [TRANSFER_RECEIPT_LABELS.fromAccountNumberText,
TRANSFER_RECEIPT_LABELS.referenceNumberText, PAYMENT_RECEIPT_LABELS.paymentAmountText, PAYMENT_RECEIPT_LABELS.cardNumberText,
PAYMENT_RECEIPT_LABELS.donatedToText, PAYMENT_RECEIPT_LABELS.donationAmountText, PAYMENT_RECEIPT_LABELS.phoneNumberText,
PAYMENT_RECEIPT_LABELS.serviceProviderNumberText, PAYMENT_RECEIPT_LABELS.paymentToCardNumberText];

export const MIN_AMOUNT_FOR_OPENING_GHINA_ACCOUNT = {
    AED: 20000,
    USD: 5466,
    GBP: 4333
};

// Mat Dialog Option configuration
export const DIALOG_OPTION_BANKING_SERVICE_TERMS = {
    cancelText: OPEN_ACCOUNT_TEXT.termsAndConditionDisagreeText,
    confirmText: OPEN_ACCOUNT_TEXT.termsAndConditionAgreeText,
    showForm: false,
    termsAndConditionComponent: OPEN_ACCOUNT_TEXT.termsAndConditionBankingService
};

export const DIALOG_OPTION_GHINA_SERVICE_TERMS = {
    cancelText: OPEN_ACCOUNT_TEXT.termsAndConditionDisagreeText,
    confirmText: OPEN_ACCOUNT_TEXT.termsAndConditionAgreeText,
    showForm: false,
    termsAndConditionComponent: OPEN_ACCOUNT_TEXT.termsAndConditionGhinaService
};

export const DIALOG_OPTION_TERMS_CONDITIONS_REGISTRATION = {
    cancelText: 'tr_common_cancelText',
    confirmText: 'tr_common_agree',
    showForm: false,
    termsAndConditionComponent: 'terms-and-conditions-registration',
    termsAndCondtionAgreeStatus: false
};

export const DIALOG_OPTION_USER_AGREEMENT = {
    confirmText: 'tr_common_agree',
    showForm: false,
    termsAndConditionComponent: 'terms-and-conditions-login',
    termsAndCondtionAgreeStatus: false,
    isUserAgreementDialog: true
};

export const DIALOG_OPTION_USER_SESSION_MANAGEMENT = {
    title: 'tr_common_activeSessionHeadingText',
    cancelText: 'tr_common_cancelText',
    confirmText: 'tr_common_continueText',
    showForm: false,
    textTemplate: 'existing-user-session',
    isBlockUser: true
};

export const LOGIN_HEADER_URLS = ['/registration', '/auth', '/logout']; // login for switching view dashboard or login
export const ADIB_WEBSITE_URL_TEXT = 'www.adib.ae';
export const RECAPTCHA_CONFIG = {
    SITE_KEY: environment.CAPTCHA.SITEKEY, // RECAPTCHA_SITE_KEY
    CALLBACK: 'grecaptchaCallback',
    DOM_ATTR: 'grecaptcha'
};
export const REGISTRATION_CONFIG = {
    cancelRouterLink: '/',
    loginRouterLink: '/'
};



export enum HTTP_HEADER_TYPES {
    OTP = 'OTP',
    COMMON = 'COMMON',
    CIAM_VALIDATE_CARD = 'CIAM_VALIDATE_CARD'
}
export const CUSTOMER_ADDRESS_TYPE = { PRIMARY: 'Primary', ADDRESS_TYPE: 'addressType' };
export const NEW_USER_REG_CIAM_PAYLOAD = {};
export const CIAM_MECHANISMS = {
    otp_failure: 'urn:ibm:security:authentication:asf:mechanism:macotp',
    otp_success: 'urn:ibm:security:authentication:asf:mechanism:uc1usernameregistration',
    forget_password_otp_success: 'urn:ibm:security:authentication:asf:mechanism:uc4checkusername',
    forget_password_username_success: 'urn:ibm:security:authentication:asf:mechanism:uc4collectresetpassword',
    forget_password_success: 'urn:ibm:security:authentication:asf:mechanism:uc4withoutcredential',
    username_success: 'urn:ibm:security:authentication:asf:mechanism:uc1passwordregistration',
    password_success: 'urn:ibm:security:authentication:asf:mechanism:uc1withoutcredential',
    unlock_username_otp_success: 'urn:ibm:security:authentication:asf:mechanism:uc6unlockusername',
    unlock_username_password_success: 'urn:ibm:security:authentication:asf:mechanism:uc6withoutcredential',
    otp_success_change_password: 'urn:ibm:security:authentication:asf:mechanism:uc7collectchangepassword',
    forget_username_otp_success: 'urn:ibm:security:authentication:asf:mechanism:uc5sendforgottenusername',
    forget_username_verify_success: 'urn:ibm:security:authentication:asf:mechanism:uc5withoutcredential',
    mappingRuleData_R07: 'R07'
};

export const CIAM_ERROR_CODE = {
    cancelRegistration: 'R299'
};

export const LOGOUT_DROPDOWN = [{ label: 'tr_logoutComponent_myProfileText', icon: '/assets/icons/profile@2x.svg', action: 'myProfile' },
{ label: 'tr_logoutComponent_changePasswordText', icon: '/assets/icons/change-password@2x.svg', action: 'changePassword' },
{ label: 'tr_logoutComponent_logoutText', icon: '/assets/icons/logout@2x.svg', action: 'logout' }];
export const PROFILE_MENU_DATA = {
    logoutRoute: '/logout',
    changePassword: 'changePassword',
    changePasswordRoute: 'change-password',
    logout: 'logout',
    myProfile: 'myProfile',
    profileRoute: '/profile'
};
export const SESSION_TIMEOUT_CLASS = 'session-timeout-modal';
export const TIME_INTERVAL_VALUE = 1000;
export const MENU_OPTION_CDK_CONTAINER_CLASS = 'cdk-overlay-connected-position-bounding-box';
export const IS_REGISTERED_TEXT = 'is_registered';

export const BLOCKED_USER_DIALOG_DATA = {
    title: 'tr_user_blocked_dialog_text',
    cancelText: '',
    confirmText: 'Close',
    textTemplate: 'invalid-otp'
};

export const DASHBOARD_NAMES = {
    accountsDashBoard: 'tr_paymentComponent_accountsDashBoardText',
    cardsDashBoard: 'tr_cards_cardsDashBoardText',
    financeDashBoard: 'tr_common_financeDashBoardText',
    transferAndPayments: 'tr_common_transferAndPaymentsText',
    bankingServices: 'tr_common_bankingServicesDashboardText',
    productsDashBoard: 'tr_common_productsDashboardText'
};

export const COUNTRY_CODE_ARE = 'ARE';
export const CURRENCY_CODE_AED = 'AED';
export const DEMAND_DRAFT_DASHBOARD = 'tr_demandDraft_DashboardText';
export const MECHANISM_TEXT = 'mechanism';
export const USER_STATE_TEXT = 'userState';
export const MESSAGE_TEXT = 'message';
export const CAPTCHA_TEXT = 'captcha';
export const LOGOUT_DROPDOWN_CLASSES = {
    ARABIC: 'rtl-logout-dropdown',
    ENGLISH: 'logout-dropdown'
};
export const FOOTER_LINKS = {
    bankingFees: 'https://simple.adib.ae/efs/efs/docs/ADIBInternetBankingFees.pdf',
    termsCondition: 'https://simple.adib.ae/efs/efs/docs/ADIBTermsAndConditions.pdf',
    securityTips: 'https://adib.ae/en/Pages/Online-security-Tips.aspx'
};
export const AGREEMENT_CODE = 'BSA';
export const MOBILE_NUMBER_LENGTH = 12;
export const SNACK_BAR_RESTRICTED_MESSAGES = ['tr_error_R01', 'tr_error_R02', 'tr_error_R03', 'tr_error_R15', 'R115', '8072'];
export const SNACK_BAR_RESTRICTED_ERROR_CODES = ['8072'];
export const COOLING_PERIOD_CALCULATION = {
    MINUTES: 60,
    MIN_TEXT: ' mins',
    HRS_TEXT: ' hrs'
};
export const CARD_NUMBER_TEXT = 'cardNumber';

export const BANKING_SERVICE_TYPE = {
    PAYMENT_ORDER: 'PAYMENT_ORDER_REQUEST',
    DEMAND_DRAFT: 'DEMAND_DRAFT_REQUEST',
    CHEQUE_BOOK: 'CHEQUE_BOOK_REQUEST',
    BANK_CERTIFICATE: 'BANK_CERTIFICATE_REQUEST'
};

export const BANKING_SERVICE_CONSTANTS = {
    DATE_REQUESTED: 'tr_bankingServiceComponent_dateRequestedText',
    BENE_NAME: 'tr_common_beneNameText',
    PAYMENT_ORDER_AMT: 'tr_bankingServiceComponent_paymentOrderAmtText',
    DEMAND_ORDER_AMT: 'tr_bankingServiceComponent_demandDraftAmtText',
};

export const EVENT_LIST = {
    contextmenu: 'contextmenu',
    paste: 'paste',
    copy: 'copy',
    cut: 'cut',
    beforeUnload: 'window:popstate',
    event: ['$event']
};
export const SIDE_NAV_SELECTOR = 'nav.showBg';
export const DuTvText = 'Du - TV';
export const INPUT_COMMA_REGEX = /,/g;
export const THREE_DIGITS_COMMA_REGEX = /\B(?=(\d{3})+(?!\d))/g;
export const PRE_LOGIN_BG_CLASS_NAME = 'pre-login-bg';
export const codeText = 'code';
export const descText = 'desc';

export const LOGOUT_SCREEN_IMAGES = {
    LOGOUT_SUCCESS_IMG_BLUE: '/assets/images/Logout_Success@2x.svg',
    SESSION_EXP_IMG_BLUE: '/assets/images/Logout_Session_Exp@2x.svg',
    LOGOUT_SUCCESS_IMG_WHITE: '/assets/images/Logout_Success_White@2x.svg',
    SESSION_EXP_IMG_WHITE: '/assets/images/Session_Expired_White@2x.svg'
};
