import { OTPLocation } from './otp.model';

export class PayeeListResponse {
    nickName?: string;
    nickNameArabic?: string;
    pin?: string;
    utilityProviderId?: string;
    utilityProviderProductId?: string;
    utilityServiceNumber?: string;
    isInquiryRequired?: string;
    payeeID?: string;
    customerPayeeID?: string;
    payeeType?: string;
    payeeCategory?: string;
    isFavourite?: string;
    payeeSubCategory?: string;
}
export class ImageCheckBoxObj {
    id: string;
    title: string;
    imgSrc: string;
}

export class TelecomProvidersProductsObj {
    imgSrc: string;
    provider: string;
    providerProduct: ProviderProductObj[];
}
export class ProviderProductObj {
    id: string;
    title: string;
}

export class AddPayeePayLoadObj {
    consumerNumber: string;
    desiredAmount: string;
    nickName: string;
    payeeId: string;
    pin?: string;
}

export class CheckBoxEmittedObj {
    id: string;
    value: string;
}

export class PayeeSummaryDetails {
    nickName: string;
    serviceProvider: string;
    accountNumber: string;
    payeeType: string;
}

export class SuccessPayeeResponse {
    status: number;
    body: OTPLocation;
}

export class EditPayeePayload {
    nickName: string;
}
