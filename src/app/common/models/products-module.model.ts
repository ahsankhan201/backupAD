export class ProductsCategoryList {
    productCategoryList = {} as ProductsCategory[];
}

export class ProductsCategory {
    categoryId: string;
    categoryNameEnglish: string;
    categoryNameArabic: string;
    subCategoryAvailable: boolean;
    id?: string;
    title?: string;
}

export class ProductCatologList {
    categoryId: number;
    categoryNameEnglish: string;
    categoryNameArabic: string;
    productCatalogResponses = [] as ProductCategoryResponse[];
}

export class ProductCategoryResponse {
    enquiryCTAText: string;
    productNameEnglish: string;
    productNameArabic: string;
    imageUrlEnglish: string;
    imageUrlArabic: string;
    shortDescriptionEnglish: string;
    shortDescriptionArabic: string;
    receivingEmail: string;
    footNoteEn: string;
    footNoteAr: string;
    isActive: boolean;
    productSubCategoryResponses: ProductSubCategoryResponses;
    productBulletsResponses?: [];
    productBenefitsResponses?: [];
    productId: string;
}

export class ProductSubCategoryResponses {
    subCategoryId: string;
    subCategoryNameArabic: string;
    subCategoryNameEnglish: string;
}

export class PreferredContactModes {
    preferredContactMethod: string[];
    preferredContactMethodArabic: string[];
    preferredContactTime: string[];
    preferredContactTimeArabic: string[];
}

export class ProductBulletResponse {
    productId: string;
    bulletDescriptionEnglish: string;
    bulletDescriptionArabic: string;
}

export class ProductCardEmittedObj {
    selectedOption: ProductCategoryResponse;
    typeOfEvent: string;
}

export class ProductCardInputObj {
    imgSrc: string;
    title: string;
    description: string;
    leftCTAText: string;
    rightCTAText: string;
    categoryId: string;
}

export class ContactModeCheckBox {
    id: string;
    title: string;
    value: string;
}

export class ProductRegisterPayLoad {
    destinationEmailAddress: string;
    productCategory: string;
    productName: string;
    productTemplate = {} as ProductTemplateModel;
}

export class ProductTemplateModel {
    carBrand: string;
    carModel: string;
    carPrice: string;
    carType: string;
    cardLimit: string;
    customerEmail: string;
    customerMobile: string;
    customerName: string;
    financeAmount: string;
    preferredContactMethod: string;
    preferredContactTime: string;
}

export class ProductListType {
    id: string;
    value: string;
}
