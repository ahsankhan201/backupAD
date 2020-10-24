export const PAYEE_SELECTION_TEST_INFO = [{ id: 'RTA', title: 'RTA', imgSrc: '/assets/icons/payee/RTA@2x.svg' },
{ id: 'Electricity and Water', title: 'Electricity and Water', imgSrc: '/assets/icons/payee/Water_Electricity@2x.svg' },
{ id: 'Telecom', title: 'Telecom', imgSrc: '/assets/icons/payee/Telecome@2x.svg' }];

export const CHECK_BOX_SELECTOR = 'ibd-check-box input';

export const UTILITY_PROVIDERS_LIST = {
    allUtilityList: [{
        payeeID: '30',
        payeeName: 'Salik',
        payeeCategory: 'Salik',
        pinRequired: 'Y',
        desiredAmtRequired: 'N',
        payeeNameArabic: 'Arabic Name',
        payeeCategoryArabic: 'Arabic Category',
        payeeType: 'RTA',
        providerID: 'RTA',
        providerProductID: 'SALIK'
    },
    {
        payeeID: '48',
        payeeName: 'FEWA',
        payeeCategory: 'FEWA',
        pinRequired: 'N',
        desiredAmtRequired: 'N',
        payeeNameArabic: '(FEWA)',
        payeeCategoryArabic: '(FEWA)',
        payeeType: 'Electricity and Water',
        providerID: 'FEWA',
        providerProductID: 'ALL'
    }]
};
