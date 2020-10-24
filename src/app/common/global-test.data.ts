export const CARD_NUMBER_PIPE_DATA = {
    mockCardNumber: '1220122012201220'
};

export const EXPIRY_DATE_PIPE_DATA = {
    mockExpirtDateValue: '1220'
};
export const NUMBER_FORMAT_TEST_DATA = {
    number: '78654',
    formattedNumber: '78,654'
};

export const TRANSACTION_GRID_HEADERS = {
    transactionGridWebHeaders: [{ headerText: 'Date,Time', className: 'date' },
    { headerText: 'Transaction ID', className: 'transactionId' },
    { headerText: 'Memo', className: 'memo' },
    { headerText: 'Description', className: 'description' },
    { headerText: 'Amount', className: 'amount' }],
    transactionGridMobileHeaders: [
        { headerText: 'Transaction ID', className: 'transactionId' },
        { headerText: 'Memo', className: 'memo' },
        { headerText: 'Description', className: 'description' }]
};

export const TRANSACTION_HISTORY_API_URL = 'https://localhost:4200/src/assets/json/credit_tx_history.json';

export const CREDIT_CARD_TX_HISTORY = {
    cardHistory: {
        cardBalance: { dueDate: null, outStandingAuthorizationBalance: null },
        cardTransaction: [
            {
                transactionDate: '2020-02-24',
                transactionTime: '00:00:00',
                transactionAmount: '10',
                transactionCurrency: 'AED',
                description: 'PerfTest-AADC-0000860612  ',
                merchantName: null,
                location: null,
                transactionType: 'PT',
                debitCredit: 'DB',
                postingAmount: '-10',
                postingCurrency: 'AED'
            }
        ]
    },
    debitCardTransactions: null,
    moreRecords: true
};


export const CREDIT_CARD_TX_MODIFIED_HISTORY = [{
    year: '2020',
    transactionHistory: [
        {
            transactionAmount: '6.000000',
            currencyCode: 'AED',
            transactionCode: '152',
            transactionCodeDescription: 'Withdrawal-MOBN - Card Payment from 28310254 to *866',
            debitOrCreditCode: 'DB',
            dateEffective: '2020-03-17T00:00:00.000',
            description: 'MOBN - Card Payment from 28310254 to *866',
            optionalMemo: '530P8ED302500A48',
            transactionType: 'NT',
            ptId: '1112716696',
            esbReferenceNo: '530P8ED302500A48'
        }
    ]
}];

export const FINANCE_TX_HISTORY = {
    accountNumber: '79042743',
    financeHistory: [
        {
            transactionAmount: '526.470000',
            debitCredit: 'CR',
            transactionCode: '300',
            transactionCodeDescription: 'Payment - Auto Split',
            dateTransaction: '2019-12-31T00:00:00.000',
            dateEffective: '2019-12-31T00:00:00.000',
            balance: '42398.300000',
            description: 'Payment - Installment - 79042743',
            accountApplicationType: 'IL',
            employee: '0',
            currency: 'AED'
        }
    ],
    moreRecords: false
};

export const DEBIT_TX_HISTORY = {
    accountNumber: '79042743',
    debitCardTransactions: [
        {
            transactionDate: '2020-02-20',
            transactionTime: '00:00:00',
            debitAccountNumber: '28310195',
            transactionAmount: '550.00',
            transactionLocation: 'ACQUIRER NAME CITY NAME US',
            transactionCurrency: 'AED',
            description: 'Cash withdrawal',
            transactionReferenceNumber: '670407:002707001248'
        }
    ],
    moreRecords: false
};

export const ACCOUNT_TX_HISTORY = {
    accountNumber: '79042743',
    accountHistory: [
        {
            transactionAmount: '526.470000',
            debitCredit: 'CR',
            transactionCode: '300',
            transactionCodeDescription: 'Payment - Auto Split',
            dateTransaction: '2019-12-31T00:00:00.000',
            dateEffective: '2019-12-31T00:00:00.000',
            balance: '42398.300000',
            description: 'Payment - Installment - 79042743',
            accountApplicationType: 'IL',
            employee: '0',
            currency: 'AED'
        }
    ],
    moreRecords: false
};

export const PENDING_TX_HISTORY = {
    transactionList: [
        {
            transactionAmount: '6786.00',
            transactionCurrency: 'AED',
            merchantName: 'ADIB BANK',
            date: '2020-03-17T00:00:00.000',
            location: 'MOBN - Card Payment from 28310254 to *866',
            transactionType: 'PT'
        }
    ],
};

// Filter Text Pipe Test Data
export const COUNTRY_LIST_MOCK_DATA = [
    {
        id: 1,
        countryISOCode: 'DZA',
        countryName: 'Algeria',
        isIBANRequired: null,
        isPriority: 'N',
        countryCallingCode: '213',
        alternateNames: 'Algeria',
        adibPresence: 'No',
        swiftCode: null
    },
    {
        id: 1,
        countryISOCode: 'AZA',
        countryName: 'American Soma',
        isIBANRequired: null,
        isPriority: 'N',
        countryCallingCode: '214',
        alternateNames: 'American Soma',
        adibPresence: 'No',
        swiftCode: null
    }];

export const OTP_RESPONSE_OBJ = {
    success: true,
    message: 'Successfully updated'
};

export const CUSTOMER_DETAILS_DATA = {
    customerName: 'FIRSTNAME 1234',
    name: {
        firstName: 'firstName',
        lastName: '',
        thirdName: '',
        fourthName: '',
        nickName: '',
        fullName: 'fullName',
    }
};


export const CUSTOMER_DETAILS_PAYLOAD = {
    customerNumber: '123454',
    isSupplimentaryCard: false,
};

export const ACCOUNT_CHECKBOX_LIST = [{
    accountNumber: '123213',
    accountTypeDescription: 'Savings Account',
    balanceAvailable: '123221.34',
    isDefaultAccount: true,
    currencyCode: 'AED',
    accountType: 'SAV'
}];

export const DEBIT_CARD_CHECKBOX_LIST = [{
    cardExpiryDate: '0523',
    cardHolderName: '',
    cardNumber: '4258931908004937',
    cardStatus: 'ACTIVE',
    primaryAccountNumber: '28311030',
    availableBalance: '19999952',
    currencyCode: 'AED',
    accountType: 'SAV',
    accountDesc: 'AED - Savings Account'
}];

export const COVER_CARD_CHECKBOX_LIST = [{
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
    creditAvailable: '1000'
}];

export const PAYEE_CHECKBOX_DATA = [{
    nickName: 'Sewa Kiran',
    nickNameArabic: null,
    pin: '',
    utilityProviderId: 'SEWA',
    utilityProviderProductId: 'ALL',
    utilityServiceNumber: '3552699239',
    isInquiryRequired: 'YES',
    payeeID: '18',
    customerPayeeID: '750000000000263978',
    payeeType: 'Electricity and Water',
    payeeCategory: null,
    isFavourite: 'N',
    payeeSubCategory: null
}];

export const CHECKBOX_DONATION_VALUE = [{
    title: 'TEST',
    data: [{ id: 'TEST1', title: 'TEST TITLE' }]
}];

export const BENEFICIARY_CHECKBOX_DATA = [{
    nickName: 'CHARITY Test',
    nickNameArabic: null,
    pin: '',
    utilityProviderId: 'CHARITY',
    utilityProviderProductId: 'B',
    utilityServiceNumber: '+97167895567',
    isInquiryRequired: 'NO',
    payeeID: '51',
    customerPayeeID: '750000000000263990',
    payeeType: null,
    payeeCategory: null,
    isFavourite: 'N',
    payeeSubCategory: null
}];

export const GENERIC_CHECKBOX_DATA = [
    { value: 'ADIB Egypt', id: 'adib_egypt' },
    { value: 'ADIB Qatar', id: 'adib_qatar' }];

export const PRODUCT_CARD_DATA = [{
    enquiryCTAText: 'Apply Now',
    productId: '1',
    productNameEnglish: 'Banoon Account',
    productNameArabic: 'الحساب الجاري',
    imageUrlEnglish: 'http://www.adib.ae/en/SiteAssets/GenY/pc/curr-acc.jpg',
    imageUrlArabic: 'http://www.adib.ae/en/SiteAssets/GenY/pc/curr-acc.jpg',
    shortDescriptionEnglish: 'ADIB Current Account offers you the flexibility to sign cheques.',
    shortDescriptionArabic: 'يمنحك الحساب الجاري من ADIB - مصرف أبوظبي الإسلامي مرونة ملائمة فيما يخصّ إصدار الشيكات والسحب النقدي ',
    receivingEmail: 'esbuser@devdc.adib.local',
    footNoteEn: 'Terms & Conditions Apply',
    footNoteAr: 'تطبق الشروط والأحكام',
    isActive: true,
    productSubCategoryResponses: {
        subCategoryId: '1',
        subCategoryNameArabic: 'sample name',
        subCategoryNameEnglish: 'sample name in arabic',
    }
}];

export const CONTACT_MODES = [{
    id: 'Mobile',
    title: 'Mobile',
    value: 'Mobile'
}, {
    id: 'Email',
    title: 'Email',
    value: 'Email'
}];

export const CONTACT_TIMINGS = [{
    id: '9AM - 12PM',
    title: '9AM - 12PM',
    value: '9AM - 12PM'
}, {
    id: '1PM - 5PM',
    title: '1PM - 5PM',
    value: '1PM - 5PM'
}];
export const CUSTOMER_DETAILS = {
    returnStatus: {
        returnCode: '0000',
        returnCodeDesc: 'Success'
    },
    returnStatusProvider: {
        returnCodeProvider: '0000',
        returnCodeDescProvider: 'Success'
    },
    customerStatus: null,
    customerType: 'NonPersonal',
    customerClass: '350',
    name: {
        firstName: null,
        lastName: null,
        identification: '1',
        tin: null,
        nickName: null,
        fullName: 'Phoenix',
        emboseName: null,
        thirdName: null,
        fourthName: null,
        dob: null,
        maidenMotherName: null,
        initials: null,
        contactInfo: ''
    },
    nameLatin: {
        firstName: 'AutoFNamee8pphd',
        lastName: 'AutoLNamee8pphd',
        identification: null,
        tin: null,
        nickName: null,
        fullName: null,
        emboseName: null,
        thirdName: null,
        fourthName: null,
        dob: null,
        maidenMotherName: null,
        initials: null,
        contactInfo: ''
    },
    nameArabic: {
        firstName: null,
        lastName: null,
        identification: null,
        tin: null,
        nickName: null,
        fullName: null,
        emboseName: null,
        thirdName: null,
        fourthName: null,
        dob: null,
        maidenMotherName: null,
        initials: null,
        contactInfo: ''
    },
    gender: 'M',
    dateOfBirth: null,
    language: '',
    branchId: '1',
    branchName: 'Al Najda St Branch فرع شارع النجده',
    isVIP: '',
    sicCode: '0',
    contactInfo: '',
    customerIdentifications: [
        {
            id: '16',
            type: 'Trade Licence',
            number: '1231236',
            issueDate: null,
            expiryDate: null,
            issueCountry: null
        }
    ],
    customerAddress: [
        {
            addressType: 'Primary',
            phone: null,
            phoneOffice: '568903423',
            phoneHome: null,
            mobile: null,
            fax: null,
            email: 'busstest@test.com',
            fullAddress: null,
            addressLine1: null,
            addressLine2: null,
            addressLine3: null,
            streetNum: '',
            streetName: null,
            boxNumber: null,
            city: null,
            postalCode: null,
            state: null,
            country: 'AE'
        }
    ]
};

export const ACCOUNTS_SUMMARY_DATA = [{
    accountNumber: '69696986896',
    accountDesc: 'AED - Savings',
    branchName: 'Al Najda St Branch فرع شارع النجده',
    certificateLanguage: 'EN',
    certificateType: 'LIABILITY',
    channelId: '98698689',
    charges: 99,
    createdAt: '2020-03-17T00:00:00.000',
    customerId: 'A B C',
    customerName: 'A B C',
    deliveryOption: 'To Home',
    reason: 'No',
    requestId: 98798,
    requestType: 'DD',
    status: 'NEW',
    updatedAt: '2020-03-17T00:00:00.000'
}];

export const PAYMENTS_SUMMARY_DATA = [{
    amount: 100,
    beneficiaryName: 'MR ABC',
    channelId: '8798',
    collectFrom: 'Al Najda',
    createdAt: '2020-03-17T00:00:00.000',
    currency: 'AED',
    customerId: 'A B C',
    customerName: 'A B C',
    purpose: 'Required',
    reason: 'NO',
    requestId: 8998789,
    requestType: 'PO',
    sourceAccountNumber: '8987893',
    status: 'NEW',
    updatedAt: '2020-03-17T00:00:00.000'
}];

export const ACCOUNTS_DETAILS_DATA = {
    accountNumber: '69696986896',
    accountDesc: 'AED - Savings',
    branchName: 'Al Najda St Branch فرع شارع النجده',
    certificateLanguage: 'EN',
    certificateType: 'LIABILITY',
    channelId: '98698689',
    charges: 99,
    createdAt: '2020-03-17T00:00:00.000',
    customerId: 'A B C',
    customerName: 'A B C',
    deliveryOption: 'To Home',
    reason: 'No',
    requestId: 98798,
    requestType: 'DD',
    status: 'NEW',
    updatedAt: '2020-03-17T00:00:00.000'
};

export const PAYMENTS_DETAILS_DATA = {
    amount: 100,
    beneficiaryName: 'MR ABC',
    channelId: '8798',
    collectFrom: 'Al Najda',
    createdAt: '2020-03-17T00:00:00.000',
    currency: 'AED',
    customerId: 'A B C',
    customerName: 'A B C',
    purpose: 'Required',
    reason: 'NO',
    requestId: 8998789,
    requestType: 'PO',
    sourceAccountNumber: '8987893',
    status: 'NEW',
    updatedAt: '2020-03-17T00:00:00.000'
};
