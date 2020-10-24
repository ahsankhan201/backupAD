export class CustomerDetailsModel {
    returnStatus: {
        returnCode: string;
        returnCodeDesc: string;
    };
    returnStatusProvider: {
        returnCodeProvider: string;
        returnCodeDescProvider: string;
    };
    customerStatus: string;
    customerType: string;
    customerClass: string;
    name: {
        firstName: string;
        lastName: string;
        identification: string;
        tin: string;
        nickName: string;
        fullName: string;
        emboseName: string;
        thirdName: string;
        fourthName: string;
        middleName?: string;
        dob: string;
        maidenMotherName: string;
        initials: string;
        contactInfo: string;
    };
    nameLatin: {
        firstName: string;
        lastName: string;
        identification: string;
        tin: string;
        nickName: string;
        fullName: string;
        emboseName: string;
        middleName?: string;
        thirdName: string;
        fourthName: string;
        dob: string;
        maidenMotherName: string;
        initials: string;
        contactInfo: string;
    };
    nameArabic: {
        firstName: string;
        lastName: string;
        identification: string;
        tin: string;
        nickName: string;
        fullName: string;
        emboseName: string;
        middleName?: string;
        thirdName: string;
        fourthName: string;
        dob: string;
        maidenMotherName: string;
        initials: string;
        contactInfo: string;
    };
    gender: string;
    dateOfBirth: string;
    language: string;
    branchId: string;
    branchName: string;
    isVIP: string;
    sicCode: string;
    contactInfo: string;
    customerIdentifications: CustomerIdentifications[];
    customerAddress: CustomerAddress[];
    countryName?: string;
}
export class CustomerIdentifications {
    id: string;
    type: string;
    number: string;
    issueDate: string;
    expiryDate: string;
    issueCountry: string;
}

export class CustomerAddress {
    addressType: string;
    phone: string;
    phoneOffice: string;
    phoneHome: string;
    mobile: string;
    fax: string;
    email: string;
    fullAddress: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    streetNum: string;
    streetName: string;
    boxNumber: string;
    city: string;
    postalCode: string;
    state: string;
    country: string;
    countryName?: string;
}

export class CustomerBasicDetailsModel {
    fullName: string;
    firstName: string;
    lastName: string;
    mobile: string;
    email?: string;
}
