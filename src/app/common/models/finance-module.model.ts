export class FinancePromotionAd {
    title: string;
    subTitle: string;
}

export class FinanceData {
    accountHolderName: string;
    accountNumber?: string;
    agreementNumber?: string;
    dateMaturity?: string;
    murabhaAmount?: string;
    installmentAmount?: string;
    accountType: string;
    classCode?: string;
    classDesc: string;
    currencyCode: string;
    status: string;
    referenceNum?: string;
    outstandingBalance?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    customerNumber?: string;
    aliasId?: string;
  }

export class FinanceDetails {
    product: Product;
    referenceNum: string;
    agreementNumber: string;
    murabhaAmount: string;
    installmentAmount: InstallmentAmount;
    accountNumber: string;
    outstandingBalance: string;
    dateMaturity: string;
  }

export class Product {
    code: string;
    description: string;
  }

export class InstallmentAmount {
    nextPaymentAmount: string;
    lastPaymentAmount: string;
  }

export class FinanceDetailsPayload {
    accountNumber?: string;
    aliasId?: string;
}

export class CustomerDetails  {
  customerName: string;
  name: NameDetails;
}

export class NameDetails  {
  firstName: string;
  lastName: string;
  thirdName: string;
  fourthName: string;
  nickName: string;
  fullName: string;
}

export class CustomerDetailsPayload {
   customerNumber: string;
   isSupplimentaryCard: boolean;
}
