export class CountriesDetailsList {
    allCountryList: CountryDetails[];
}

export class RestrictedWordsList {
    restrictedWordsList: string[];
}

export class CountryDetails {
    'id': number;
    'countryISOCode': string;
    'countryName': string;
    'isIBANRequired': any;
    'isPriority': string;
    'countryCallingCode': string;
    'alternateNames': string;
    'adibPresence': string;
    'swiftCode': string;
}

export class BankDetailsList {
    bankDetailList: BankDetails[];
}

export class BankDetails {
    'countryCode': string;
    'institutionId': string;
    'bankName': string;
    'branchName': string;
    'stateCode': string;
    'achRoutingNumber': string;
    'wireRoutingNumber': string;
    'swiftBIC': string;
    'chipsUID': string;
    'nationalID': string;
    'address': AddressDetails;
}

export class AddressDetails {
    'addressType': string;
    'phone': string;
    'phoneOffice': string;
    'phoneHome': string;
    'mobile': string;
    'fax': string;
    'email': string;
    'fullAddress': string;
    'addressLine1': string;
    'addressLine2': string;
    'addressLine3': string;
    'streetNum': string;
    'streetName': string;
    'boxNumber': string;
    'city': string;
    'postalCode': string;
    'state': string;
    'country': string;
}

export class AddInternationalBeneficiary {
    'abaNumber': string;
    'accountNumber': string;
    'accountType': string;
    'beneficiaryAddress1': string;
    'beneficiaryAddress2': string;
    'beneficiaryBankAddress': string;
    'beneficiaryBankCountry': string;
    'beneficiaryBankName': string;
    'beneficiaryCity': string;
    'beneficiaryCountry': string;
    'beneficiaryName': string;
    'cardNumber': string;
    'currency': string;
    'iban': string;
    'nickName': string;
    'swiftCode': string;
}


export class SummaryDetails {
    'region': string;
    'bank': string;
    'nickName': string;
    accountDetails = new AccountDetails();
}

export class AccountDetails {
    'name': string;
    'city': string;
    'country': string;
    'address': string;
    'addressTwo': string;
    'currency': string;
    'accountTitle': string;
    'accountNumber': string;
}

export class AddInternalBeneficiary {
    'accountNumber': string;
    'accountType': string;
    'cardNumber': string;
    'mobileNumber': string;
    'nickName': string;
}

export class AccountDetailsFromApi {
    'accountNumber': string;
    'accountType': string;
    'accountSubType': string;
    'classCode': string;
    'classDesc': string;
    'branchCode': string;
    'currencyCode': string;
    'status': string;
    'relationShipName': string;
    'relationShipId': string;
    'customerNumber': string;
    'ibanNumber': string;
    'accountHolderName': string;
}

export class AccountNumber {
    'accountNumber': string;
}

export class CardDetailsFromApi {
    'cardNo': string;
    'cardType': string;
    'cardBalance': string;
    'creditLimit': string;
    'creditAvailable': string;
    'cashLimit': string;
    'cashAvailable': string;
    'customerId': string;
    'dueBalance': string;
    'minimumDueBalance': string;
    'openingBalance': string;
    'closingBalance': string;
    'lastStmtDate': string;
    'paymentDueDate': string;
    'minimumDue': string;
    'embossingName': string;
    'expiryDate': string;
    'cardStatus': string;
    'cardStatusGeneral': string;
    'primaryCardFlag': string;
    'productDesc': string;
    'balance': string;
    'currencyCode': string;
    'isVIP': string;
    'nickName': string;
    'fullName': string;
    'firstName': string;
    'lastName': string;
    'outstandingAmount': string;
}

export class CardNumber {
    'cardNumber': string;
}

export class Mobile {
    'mobileNumber': string;
}

export class AddBy {
    'title': string;
    'id': string;
}

export class UtilityProviders {
    'payeeID': string;
    'payeeName': string;
    'payeeCategory': string;
    'pinRequired': string;
    'desiredAmtRequired': string;
    'payeeNameArabic': string;
    'payeeCategoryArabic': string;
    'payeeType': string;
    'providerID': string;
    'providerProductID': string;
}

export class AllUtilityList {
    'allUtilityList': UtilityProviders[];
}
export class ValidateIBAN {
    'countryCode': string;
    'ibanNumber': string;
}
