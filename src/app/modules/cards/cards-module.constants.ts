export const CARDS_TRANSLATION_TEXT = {
    cards_cardNumberText: 'Card Number',
    cards_expiryDateText: 'Expiry Date',
    cards_currencyText: 'Currency',
};

export const CARDS_QUICKLINKS_DATA = [
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
    }
];

export const CARDS_MASTER_DATA = {
    COVER_CARD: 'tr_cards_coveredCardText',
    AVAILABLE_BALANCE: 'tr_cards_availableBalanceText',
    OUTSTANDING_BALANCE: 'tr_cards_outstandingBalanceText',
    ACTIVATE_CARD_TITLE: 'tr_cards_activateCardText',
    DEBIT_CARD_NUMBER: 'tr_cards_debitCardNumberText',
    NEW_CARD_INFO: 'tr_cards_newCardInfoText',
    PREV_ICON: '/assets/icons/previous-icon.png',
    NEXT_ICON: '/assets/icons/next-icon.png',
    COVER_CARD_JSON: '/assets/json/cover-card.json',
    CARDS_INFO_ICON: '/assets/icons/cards/cards-info.svg',
    DEBIT_CARD_IMAGE: '/assets/images/debit-card/default.png',
    CARD_LINK_ICON: '/assets/icons/cards/card-link.svg',
    FORWARD: 'forward',
    SMOOTH: 'smooth',
    BACKWARD: 'backward',
    COVER_CARD_PLACEHOLDER: '/assets/images/cover-card/default-placeholder.png',
    FREEZE_CARD_STATUS: 'FREEZE',
    FREZ_CARD_STATUS: 'FREZ',
    NEW_CARD_STATUS: 'NEW',
    ACTIVE_CARD_STATUS: 'ACTIVE',
    DEBIT_CARD_DETAILS: 'debitCardDetails',
    COVER_CARD_DETAILS: 'coverCardDetails',
    ACTIVATE_CARD: 'activateCard',
    CARDS_LIST: 'cardsList',
    SCROLL_MOVE_WIDTH: 140,
    PRIMARY_CARD_FLAG: 'P',
    UN_FREEZE_CARD_STATUS: 'UNFREEZE',
    BLOCK_CARD_STATUS: 'REPLACE',
    PRIMARY_ACCOUNT_KEY: 'primaryAccountNumber',
    CARD_HOLDER_NAME_KEY: 'cardHolderName',
    cardsRoute: 'cards',
    wrongExpiryMessage: 'tr_cards_wrongExpiryMessage'
};

export const CARDS_DIALOG_TEXT = {
    blockTitle: 'tr_dialog_blockTitle',
    blockMessage: 'tr_dialog_blockMessage',
    blockCancelText: 'tr_dialog_blockCancelText',
    blockConfirmText: 'tr_dialog_blockConfirmText',
    blockSuccessMessage: 'tr_dialog_blockSuccessMessage',
    freezeTitle: 'tr_dialog_freezeTitle',
    unFreezeTitle: 'tr_dialog_unFreezeTitle',
    freezeMessage: 'tr_dialog_freezeMessage',
    unFreezeMessage: 'tr_dialog_unFreezeMessage',
    freezeCancelText: 'tr_dialog_freezeCancelText',
    freezeConfirmText: 'tr_dialog_freezeConfirmText',
    freezeSuccessMessage: 'tr_dialog_freezeSuccessMessage',
    unFreezeSuccessMessage: 'tr_dialog_unFreezeSuccessMessage'
};

export const DEBIT_CARD_MENU_OPTIONS = [
    { label: 'Freeze Card', icon: '', action: 'freeze' },
    { label: 'Block/Replace', icon: '', action: 'block' },
    { label: 'Linked Account', icon: '', action: 'linkAccount' }
];

export const COVER_CARD_MENU_OPTIONS = [
    { label: 'Freeze Card', icon: '', action: 'freeze' },
    { label: 'Block/Replace', icon: '', action: 'block' },
    { label: 'Pay In Full', icon: '', action: 'pay' }
];

export const DEBIT_CARD_QUICKLINKS_DATA = [
    {
        action: 'block',
        title: 'tr_common_blockAndReplaceText',
        icon: '/assets/icons/ic.block-replace@2x.svg'
    },
    {
        action: 'freeze',
        title: 'tr_common_freezeCardText',
        icon: '/assets/icons/ic.freez-card@2x.svg'
    },
    {
        action: 'linkedAccount',
        title: 'tr_cards_linkedAccountText',
        icon: '/assets/icons/ic.linked-account@2x.svg'
    },
    {
        action: 'atmWithDraw',
        title: 'tr_cards_ATMWithdrawalAccountsText',
        icon: '/assets/icons/ic.atm-withdraw@2x.svg'
    }
];


export const PRIMARY_COVER_CARD_QUICK_LINKS = [
    {
        action: 'block',
        title: 'tr_common_blockAndReplaceText',
        icon: '/assets/icons/ic.block-replace@2x.svg'
    },
    {
        action: 'freeze',
        title: 'tr_common_freezeCardText',
        icon: '/assets/icons/ic.freez-card@2x.svg'
    },
    {
        action: 'E_STATEMENT',
        title: 'tr_common_viewStatementText',
        icon: '/assets/icons/ic.e-statment@2x.svg'
    }
];

export const SUPP_COVER_CARD_QUICK_LINKS = [
    {
        action: 'changeLimit',
        title: 'tr_common_changeCoverLimittText',
        icon: '/assets/icons/ic.change-cover-limit@2x.svg'
    },
    {
        action: 'block',
        title: 'tr_common_blockAndReplaceText',
        icon: '/assets/icons/ic.block-replace@2x.svg'
    },
    {
        action: 'freeze',
        title: 'tr_common_freezeCardText',
        icon: '/assets/icons/ic.freez-card@2x.svg'
    },
    {
        action: 'E_STATEMENT',
        title: 'tr_common_viewStatementText',
        icon: '/assets/icons/ic.e-statment@2x.svg'
    }
];

export const CARD_TRANSACTIONS_HEADERS = {
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

export const TRANSACTION_GRID_COMPONENT_NAME = 'Debit';
export const COVER_LIMIT_COMPONENT_TEXT = 'CoverLimitComponent';
export const COVER_CARD_DETAILS_COMPONENT_TEXT = 'CoverCardDetailsComponent';
export const OTP_COMPONENT_TEXT = 'OTPComponent';
export const SUCCESS_SCREEN_COMPONENT_TEXT = 'SuccessScreenComponent';

export const MIN_COVER_CARD_LIMIT = '1000';
export const RANGE_SLIDER_FORMATE_LABEL = 'tr_cards_newCoverLimitText';
export const QUICK_LINK_ID_CHANGE_COVER_LIMIT =  'changeLimit';

export const LINK_DEBITCARD_ACCOUNT_TEXT = {
    ACTIVE: 'Active',
    componentTitle: 'tr_linkAccount_linkAccountText'
};
export const LINK_ACCOUNT_TYPE_MAPPING = {
    SAV: 'SAVINGS',
    CUR: 'CURRENT',
    SPA: 'SAVINGS',
    'SAV-Ghina': 'SAVINGS'
};
export const DEBIT_CARD_TRANSACTION_GRID = 'Debit';
export const COVER_CARD_TRANSACTION_GRID = 'Credit';

export const COVER_LIMIT_HORIZONTAL_LINE_CLASS_NAME = 'cover-limit-horizontal-line';
export const MUST_BE_LESS_THAN_TEXT = 'tr_common_lessthanText';
export const MUST_BE_MORE_THAN_TEXT = 'tr_common_morethanText';
export const ACTION_ITEMS = {
    block: 'block',
    freeze: 'freeze',
    unFreeze: 'unFreeze',
    activate: 'activate',
    linkedAccount: 'linkedAccount',
    atmWithdraw: 'atmWithDraw',
    payFull: 'payFull'
};

export const COVER_CARD_IMAGE_MAPPING = {
    VALUE_CARD: '/assets/images/cover-card/value-card.png',
    ETIHAD_PLATINUM: '/assets/images/cover-card/etihad-platinum.png',
    DARHOOM_CARD: '/assets/images/cover-card/darhoom-card.png'
};

export const LINK_ACCOUNT_DIVIDER_LINE_CLASS = {
    LINK_ACC_SUCCESS: 'horizontal-line-link-acoount-success',
    LINK_ACC: 'horizontal-line-link-acoount'
};

export const NEW_COVER_LIMIT_TEXT = 'newCoverLimit';
export const CHANGE_LIMIT_TEXT = 'changeLimit';
