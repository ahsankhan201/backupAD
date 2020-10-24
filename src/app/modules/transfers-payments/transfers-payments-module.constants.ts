export const EDIT_PAYEE_DIALOG = {
    title: 'tr_transfer_module_edit_payee',
    message: 'tr_transfer_module_edit_nickname',
    cancelText: 'tr_common_cancelText',
    confirmText: 'tr_linkAccount_doneText'
};

export const DELETE_PAYEE_DIALOG_DATA = {
    title: 'tr_transfer_module_delete_payee_confirm',
    message: 'tr_transfer_module_delete_payee',
    cancelText: 'tr_common_cancelText',
    confirmText: 'tr_linkAccount_doneText',
    showForm: false,
};

export const DELETE_PAYEE_SUCCESS_MESSAGE = {
    prefix: 'tr_transfer_module_payee_text',
    suffix: 'tr_transfer_module_delete_beneficiary',
};

export const BENEFICIARY_FAVORITE_MESSAGE = {
    favorite: 'tr_transfer_module_fav_bene',
};

export const PAYEE_FAVORITE_MESSAGE = {
    favorite: 'tr_transfer_module_fav_payee',
};

export const EDIT_PAYEE_SUCCESS_SNACKBAR = {
    message: 'tr_transfer_module_payee_nickname'
};

export const DELETE_BENEFICIARY_DIALOG_DATA = {
    title: 'tr_transfer_module_delete_bene_text',
    message: 'tr_transfer_module_delete_bene_confirm',
    cancelText: 'tr_common_cancelText',
    confirmText: 'tr_transfer_module_delete_text',
    showForm: false,
};

export const DELETE_BENEFICIARY_SUCCESS_MESSAGE = {
    prefix: 'tr_moneyTransferComponent_beneficiaryText',
    suffix: 'tr_transfer_module_delete_beneficiary',
};

export const PAYMENT_STEPPER_TEXT = {
    transferFrom: 'tr_common_transferFromText',
    transferDetails: 'tr_paymentComponent_transferDetails',
    transferTo: 'tr_paymentComponent_transferToText',
    confirm: 'tr_common_confirmText',
    summary: 'tr_common_summary',
    donateTo: 'tr_paymentComponent_donateTo',
    transactionDetails: 'tr_paymentComponent_transactionDetails',
};

export const CANCEL_TRANSACTION_POPUP_TEXT = {
    cancelTitle: 'tr_transactionPayments_cancelTransactionText',
    noText: 'tr_transactionPayments_noText',
    yesText: 'tr_transactionPayments_yesText',
    cancelMessage: 'tr_transactionPayments_cancelMessageText'
};

export const QUICK_LINKS_INFO = [
    {
        link: '',
        title: 'tr_common_moneyTransferText',
        icon: '/assets/icons/ic.money-transfer@2x.svg',
        action: 'MONEY_TRANSFER'
    },
    {
        link: '',
        title: 'tr_common_payBillsText',
        icon: '/assets/icons/ic.payments@2x.svg',
        action: 'PAYMENTS'
    },
    {
        link: '',
        title: 'tr_common_donateText',
        icon: '/assets/icons/ic.donate@2x.svg',
        action: 'DONATE'
    }
];
