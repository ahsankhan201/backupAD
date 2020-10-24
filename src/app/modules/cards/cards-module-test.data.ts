export const DEBIT_CARD_DETAILS_DATA = {
    cardExpiryDate: '0523',
    cardHolderName: '',
    cardNumber: '4258931908004937',
    cardStatus: 'ACTIVE',
    primaryAccountNumber: '28311030',
    availableBalance: '19999952',
    currencyCode: 'AED',
    accountType: 'SAV',
    accountDesc: 'AED - Savings Account'
};

export const COVER_CARD_DETAILS_DATA = {
    cardNumber: '4258931908004937',
    cardStatus: 'ACTIVE',
    coverAmount: '678',
    currencyCode: 'AED',
    customerName: 'Mr test',
    dueBalance: '432',
    expiryDate: '0523',
    lastStmtDate: '01/02/2020',
    minimumDueBalance: '12321',
    outStandingAmount: '989',
    paymentDueDate: '01/02/2020',
    primaryCardFlag: 'P',
    productDescription: 'Darhoom Card',
    lastStmtBalance: '10000',
    creditAvailable: '1000',
    cardSubType: 'VALUECARD',
    cardImage: '/assets/images/cover-card/value-card.png'
};

export const CARDS_ADS_DATA = {
    cardTitle: 'ADIB Covered Card is Available',
    getCardTitle: 'Get your card instantly',
    cardType: 'cover-card'
};
export const DEBIT_CARD_QUICKLINKS_TEST_DATA = [
    {
        link: '',
        title: 'Linked Account',
        icon: '/assets/icons/cards/icon-holder.svg',
        id: 'linkAccount'
    }
];

export const ACCOUNTS_CARDS_LIST_DATA = {
    accountsList: [{
        accountHolderName: 'Sathish',
        accountNumber: '123456',
        accountSubType: 'savings',
        accountType: 'SAV',
        balanceAvailable: '213213.4',
        balanceCurrent: '231223',
        branchCode: '1',
        classDesc: '299',
        currencyCode: 'AED',
        filters: {},
        ibanNumber: 'string',
        isDefaultAccount: false,
        isJointAccount: false,
        relationShipId: '1232',
        relationShipName: 'Dummy relationShip',
        status: 'Active',
        classCode: 'string'
    }],
    cardsList: [],
    debitCardsList: [],
};

export const SELECTED_LINKED_INFO = {
    id: '123456',
    title: 'tr_common_savingAccount',
    description: '123456',
    branchCode: '1',
    accountType: 'SAV'
};

export const COVER_CARD_LIMIT_PAYLOAD =  {
    cardNumber: '123456',
    limit: '1001',
};

export const QUICK_LINK_COVER_LIMIT = {
    id: 'ChangeCoverLimit',
    link: '',
    title: 'Change Cover Limit',
    icon: '/assets/icons/cards/icon-holder.svg'
};

export const QUICK_LINK_COVER_LIMIT_WITHOUT_ID = {
    link: '',
    title: 'Change Cover Limit',
    icon: '/assets/icons/cards/icon-holder.svg'
};

export const OTP_RESPONSE_DATA = {
    success: true,
    message: 'Test message',
};

export const OTP_RESPONSE_DATA_NOT_SUCCESS = {
    success: false,
    message: 'Test message',
};
