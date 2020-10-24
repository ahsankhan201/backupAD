import { FinanceData } from 'src/app/common/models/finance-module.model';

export const FINANCE_DETAILS_DATA: FinanceData[] =  [{
    accountHolderName: 'Nushaiba Shabeeb',
    firstName: null,
    lastName: null,
    fullName: 'Nushaiba Shabeeb',
    accountNumber: '79396657',
    accountType: 'RFF',
    classCode: '102',
    classDesc: 'Istissna Retail AED',
    currencyCode: 'AED',
    outstandingBalance: '0.00',
    agreementNumber: '79396657',
    dateMaturity: '2032-02-27',
    murabhaAmount: '0.00',
    installmentAmount: '0.00',
    status: 'Active',
    referenceNum: '530EA8DB25758DE4',
    customerNumber: '1443678'
  }];
export const FINANCE_PROMOTION_DATA = {
    title: 'Personal Finance is Available',
    subTitle: 'Lorem ipsum dummy text'
  };

export const FINANCE_DETAILS = {
    product: {
      code: '102',
      description: 'Istissna Retail AED'
    },
    referenceNum: '530EA8DB25758DE4',
    agreementNumber: '79396657',
    murabhaAmount: '0.00',
    installmentAmount: {
      nextPaymentAmount: '0.00',
      lastPaymentAmount: '0.00'
    },
    accountNumber: '79396657',
    outstandingBalance: '0.00',
    dateMaturity: '2032-02-27'
  };
export const FINANCE_DETAILS_PAYLOAD = { accountNumber : '123123123', aliasId: '23456-56766-86864-28688-98427'};
export const CUSTOMER_DETAILS_BY_RIM = {
  customerName: '1443678',
  name: {
    firstName: 'Nushaiba',
    lastName: 'Shabeeb',
    nickName: null,
    fullName: 'Nushaiba Shabeeb',
    thirdName: null,
    fourthName: null,
  }
};
export const ACCOUNT_LIST_DATA = {
  accountNumber: '28311061',
  accountType: 'CSA',
  accountSubType: null,
  classCode: '499',
  classDesc: 'Banoon Account - AED',
  branchCode: '1',
  currencyCode: 'AED',
  status: 'Active',
  relationShipName: 'Phoenix',
  relationShipId: '1',
  customerNumber: '1443678',
};

export const ACCOUNT_CARD_LIST_DATA = {
  accountsList: [],
  cardsList: [],
  debitCardsList: [],
};
