export const BENEFICIARY_REGION = [{ title: 'tr_common_uaeText', id: 'UAE', imgSrc: '/assets/images/UAE_Flag@2x.svg' },
{ title: 'tr_addBene_intlText', id: 'international', imgSrc: '/assets/images/International_Glob@2x.svg' }];

export const BENEFICIARY_BANKS = [{ title: 'tr_common_adibText', id: 'ADIB', imgSrc: '/assets/images/ADIB_Globe@2x.svg' },
{ title: 'tr_addBene_otherBanksText', id: 'otherBanks', imgSrc: '/assets/images/ic.Bank-updated.svg' }];

export const BENEFICIARY_ADIB_INTERNATIONAL_BANKS = [{ title: 'ADIB Egypt', id: 'adib_egypt' },
{ title: 'ADIB Qatar', id: 'adib_qatar' }, { title: 'ADIB UK', id: 'adib_uk' }];

export const BENEFICIARY_ADIB_OTHER_BANK = [{ title: 'Account', id: 'account' },
{ title: 'Card', id: 'card' }, { title: 'Mobile', id: 'mobile' }];

export const BEN_UAE_OTHER = {
    addBy: [{ title: 'tr_common_accountText', id: 'account' }, { title: 'tr_common_cardText', id: 'card' }],
    currency: [{ title: 'INR', id: 'inr' }, { title: 'USD', id: 'usd' }, { title: 'AED', id: 'aed' },
    { title: 'GBP', id: 'gbp' }, { title: 'EUR', id: 'eur' }]
};

export const BENEFICIARY_UAE_ADIB = {
    addBy: [{ title: 'tr_common_accountText', id: 'account' },
    { title: 'tr_common_cardText', id: 'card' }, { title: 'tr_common_mobileText', id: 'mobile' }],
};

export const COUNTRY_CODE_UAE = 'ARE';

export const COUNTRY_ISO_CODE = 'countryISOCode';

export const CURRENCY_CODE_UAE = 'AED';

export const VALIDATOR_LENGTH = {
    mobile: {
        min: 6,
        max: 12
    },
    iban: {
        min: 6,
        max: 12
    },
    coverCard: {
        min: 6,
        max: 12
    },
    account: {
        main: 6,
        max: 12
    }
};

export const BENEFICIARY_FORM_TEXT = {
    addBy: 'Add by',
    currency: 'Currency',
    abaCode: 'ABA Code',
    iban: 'tr_common_ibanText',
    IS_IBAN_REQUIRED: 'Y',
    confirmIban: 'Confirm IBAN',
    account: 'Account',
    confirmAccount: 'Confirm Account',
    cardText: 'Please enter the card number you would like to make a payment to',
    name: 'Name',
    address1: 'Address Line 1',
    address2: 'Address Line 2',
    city: 'City',
    country: 'Country',
    select: 'Select',
    nickName: 'Nick name',
    previous: 'Previous',
    next: 'Next',
    optional: 'Optional',
    cardNumber: 'tr_common_cardNumberText',
    mobileNumber: 'tr_common_mobileNumberText',
    mobileNumberLabel: 'Send money to other ADIB accounts, using just their phone number',
    mobileCountyCode: '+971',
    mobileCountyCodeWithoutPlus: '971', // mobileCountyCode updated as part of beneficiary V2 migration
    card: 'card',
    utilityServiceNumber: 'utilityServiceNumber',
    accountNumber: 'tr_common_accountNumberText',
    nickNameProperty: 'nickName',
    ibanNumber: 'ibanNumber',
    mobileNumberText: 'mobileNumber',
    adibCardHint: 'tr_addBenComponent_adibCardHintText',
    noteText: 'tr_common_noteText',
    beneAccNoText: 'beneAccNo',
    addressOne: 'addressOne',
    addressTwo: 'addressTwo',
    romania: 'Romania'
};

export const SUMMARY_SCREEN_TEXT = {
    currency: 'tr_common_currencyText',
    name: 'tr_common_nameText',
    address: 'tr_addBene_addressText'
};

export const BANK_SELECTION_SCREEN_TEXT = {
    otherBanks: 'otherBanks',
    uae: 'UAE',
    adib: 'ADIB',
    international: 'international',
    selectBank: 'Select Bank',
    selectCountry: 'Select Country',
    bankName: 'Bank Name',
    branch: 'Branch',
    selectRegion: 'Select Region',
    selectedCountry: 'selectedCountry',
    selectedBank: 'selectedBank',
    selectedBranch: 'selectedBranch',
    matOptionClass: 'mat-option-text'
};

export const MOBILE_BENEFICIARY_ERROR_CODE = {
    error_7109: '7109',
    succees: '0000'

};

export const PAYEE_TYPE = {
    utility: { shortCode: 'U', name: 'Utility' },
    charity: { shotCode: 'C', name: 'CHARITY', code: '51' }
};
export const PAYEE_ID = {
    mobileBene: '51',
};

export enum AddByType {
    account = 'account',
    card = 'card',
    mobile = 'mobile'
}

export const STEPPER_TEXT = {
    REGION: 'tr_addBene_regionText',
    BANK: 'tr_addBene_bankText',
    ACCOUNT: 'tr_common_accountText',
    CONFIRM: 'tr_common_confirmText'
};

export const REGEX = {
    seprator: '|',
    param: 'i'
};

export const ACCOUNTS_OR_CARDS_MAP = {
    CARD_NUMBER: 'cardNumber',
    CARDS_LIST: 'cardsList',
    ACCOUNTS_LIST: 'accountsList',
    ACCOUNT_NUMBER: 'accountNumber'
};

export const ROMANIA_REGEX = /PO Box|Post Office Box/i;
export const ROMANIA_RESTRICTED_WORDS = ['PO Box', 'Post Office Box'];
