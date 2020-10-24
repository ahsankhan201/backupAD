import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

/* Include services here */
import { APISyncService } from 'src/app/common/services/sync.service';

/* Include constants and models here */
import { PAYEE_SELECTION_MASTER_DATA } from '../payee-module.constants';
import { AllUtilityList, UtilityProviders } from 'src/app/common/models/beneficiary-module.model';
import {
  ImageCheckBoxObj,
  AddPayeePayLoadObj,
  CheckBoxEmittedObj,
  PayeeSummaryDetails,
  SuccessPayeeResponse,
  TelecomProvidersProductsObj
} from 'src/app/common/models/payee.model';
import { TEXT_SUFFIX, IMG_SUFFIX } from 'src/app/common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class PayeeService {
  selectedProvider: string;
  utilityProvidersList: UtilityProviders[];
  selectedProviderProduct = {} as CheckBoxEmittedObj;
  addPayeePayLoad = {} as AddPayeePayLoadObj;
  payeeSummaryDetails = {} as PayeeSummaryDetails;
  selectedProviderSubject$ = new BehaviorSubject(undefined);
  selectedProduct: string;
  selectedProductSubject$ = new BehaviorSubject(undefined);

  constructor(private apiSyncService: APISyncService) { }

  /**
   * @methodName setSelectedProvider
   * @description used to set the user selected provider value
   * @parameter value<string>
   * @return none
   */
  setSelectedProvider(value: string): void {
    this.selectedProvider = value;
    this.selectedProviderSubject$.next(value);
  }

  /**
   * @methodName dispatchSelectedProvider
   * @description used to broadcast the selected provider value
   * @parameter none
   * @return Observable<string>
   */
  getSelectedProvider(): Observable<string> {
    return this.selectedProviderSubject$.asObservable();
  }

  /**
   * @methodName setSelectedProduct
   * @description used to set the user selected product value
   * @parameter value<string>
   * @return none
   */
  setSelectedProduct(value: string): void {
    this.selectedProduct = value;
    this.selectedProductSubject$.next(value);
  }

  /**
   * @methodName getSelectedProduct
   * @description used to broadcast the selected product value
   * @parameter none
   * @return Observable<string>
   */
  getSelectedProduct(): Observable<string> {
    return this.selectedProductSubject$.asObservable();
  }

  /**
   * @methodName fetchPayeeLIst
   * @description used to fetch payeeList details
   * @parameter url<string>
   * @return Object<AllUtilityList>
   */
  fetchPayeeLIst(url: string): Observable<AllUtilityList> {
    return this.apiSyncService.get(url);
  }

  /**
   * @methodName mapImagesWithPayeeList
   * @description used to map the images with the payee types
   * @parameter payeeList
   * @return payeeTypeList<Object>
   */
  mapImagesWithPayeeList(payeeList: UtilityProviders[]): ImageCheckBoxObj[] {
    const payeeListWithImages = [];
    const payeeListObj = {};
    payeeList.forEach((item) => {
      if (payeeListObj[item.payeeType] === undefined && payeeListObj[item.payeeType] !== null) {
        payeeListObj[item.payeeType] = item.payeeType;
        if (item.payeeType && item.payeeType === PAYEE_SELECTION_MASTER_DATA.TELECOM_TEXT) {
          payeeListWithImages.push({ title: item.payeeType, imgSrc: PAYEE_SELECTION_MASTER_DATA.TELECOM_IMG, id: item.payeeType });
        } else if (item.payeeType && item.payeeType === PAYEE_SELECTION_MASTER_DATA.RTA_TEXT) {
          payeeListWithImages.push({ title: item.payeeType, imgSrc: PAYEE_SELECTION_MASTER_DATA.RTA_IMG, id: item.payeeType });
        } else if (item.payeeType && item.payeeType === PAYEE_SELECTION_MASTER_DATA.WATER_ELECTRICITY_TEXT) {
          // tslint:disable-next-line: max-line-length
          payeeListWithImages.push({ title: item.payeeType, imgSrc: PAYEE_SELECTION_MASTER_DATA.WATER_ELECTRICITY_IMG, id: item.payeeType });
        }
      }
    });
    return payeeListWithImages;
  }

  /**
   * @methodName getServiceProvidersList
   * @description used to form the provider product checkbox object
   * @parameter servicePrividerType<string>
   * @return providersList<UtilityProviders>
   */
  getServiceProvidersList(servicePrividerType: string): UtilityProviders[] {
    return this.utilityProvidersList.filter(obj => obj.payeeType === servicePrividerType);
  }
  /**
   * @methodName getProductCheckBoxObj
   * @description used to form the provider product checkbox object
   * @parameter providersList<UtilityProviders>
   * @return imgCheckBoxObj<ImageCheckBoxObj>
   */
  getProductCheckBoxObj(utilityProviderList: UtilityProviders[]): ImageCheckBoxObj[] {
    const imgCheckBoxObj = [];
    utilityProviderList.forEach((ele) => {
      // tslint:disable-next-line: max-line-length
      if (ele.providerProductID && ele.providerProductID.toUpperCase() === PAYEE_SELECTION_MASTER_DATA[`${ele.providerProductID.toUpperCase()}_TEXT`].toUpperCase()) {
        // tslint:disable-next-line: max-line-length
        imgCheckBoxObj.push({ id: ele.payeeID, title: ele.providerProductID, imgSrc: PAYEE_SELECTION_MASTER_DATA[`${ele.providerProductID.toUpperCase()}_IMG`] });
      }
    });
    return imgCheckBoxObj;
  }

  /**
   * @methodName getTelecomProductsObj
   * @description used to form the provider product checkbox object
   * @parameter providersList<UtilityProviders>
   * @return telecomProductsObj<TelecomProvidersProductsObj>
   */
  getTelecomProductsObj(utilityProviderList: UtilityProviders[]): TelecomProvidersProductsObj[] {
    const telecomProductsObj = [];
    const duProvider: TelecomProvidersProductsObj = {
      imgSrc: PAYEE_SELECTION_MASTER_DATA.DU_IMG,
      provider: PAYEE_SELECTION_MASTER_DATA.DU_TEXT,
      providerProduct: []
    };
    const etisalatProvider: TelecomProvidersProductsObj = {
      imgSrc: PAYEE_SELECTION_MASTER_DATA.ETISALAT_IMG,
      provider: PAYEE_SELECTION_MASTER_DATA.ETISALAT_TEXT,
      providerProduct: []
    };
    utilityProviderList.filter((ele) => {
      if (ele.payeeCategory) {
        if (ele.payeeCategory.toUpperCase() === PAYEE_SELECTION_MASTER_DATA.DU_TEXT) {
          duProvider.providerProduct.push({ id: ele.payeeID, title: ele.payeeName });
        } else if (ele.payeeCategory === PAYEE_SELECTION_MASTER_DATA.ETISALAT_TEXT) {
          etisalatProvider.providerProduct.push({ id: ele.payeeID, title: ele.payeeName });
        }
      }
    });
    return telecomProductsObj.concat(duProvider, etisalatProvider);
  }
  /**
   * @methodName getProductCheckBoxObjWithProviderID
   * @description used to form the provider product checkbox object
   * @parameter payeeAccountForm<ImageCheckBoxObj>
   * @return imgCheckBoxObj<ImageCheckBoxObj>
   */
  getProductCheckBoxObjUsingProviderID(utilityProviderList: UtilityProviders[]): ImageCheckBoxObj[] {
    const imgCheckBoxObj = [];
    utilityProviderList.forEach((ele) => {
      if (ele.providerID &&
        ele.providerID.toUpperCase() === PAYEE_SELECTION_MASTER_DATA[`${ele.providerID.toUpperCase()}${TEXT_SUFFIX}`].toUpperCase()) {
        imgCheckBoxObj.push({
          id: ele.payeeID, title: ele.payeeName,
          imgSrc: PAYEE_SELECTION_MASTER_DATA[`${ele.providerID.toUpperCase()}${IMG_SUFFIX}`]
        });
      }
    });
    return imgCheckBoxObj;
  }

  /**
   * @methodName setPayeePayLoadObj
   * @description used to set the payee payload object
   * @parameter payeeAccountForm<AddPayeePayLoadObj>
   * @return none
   */
  setPayeePayLoadObj(payeeAccountForm: AddPayeePayLoadObj): void {
    this.addPayeePayLoad = {} as AddPayeePayLoadObj;
    this.addPayeePayLoad.pin = payeeAccountForm.pin ? payeeAccountForm.pin : undefined;
    this.addPayeePayLoad.consumerNumber = payeeAccountForm.consumerNumber;
    this.addPayeePayLoad.nickName = payeeAccountForm.nickName;
    this.addPayeePayLoad.payeeId = this.selectedProviderProduct.id;
    this.setPayeeSummaryInfo();
  }
  /**
   * @methodName setPayeeSummaryInfo
   * @description used to set the payee summary details
   * @parameter none
   * @return none
   */
  setPayeeSummaryInfo(): void {
    this.payeeSummaryDetails.nickName = this.addPayeePayLoad.nickName;
    this.payeeSummaryDetails.accountNumber = this.addPayeePayLoad.consumerNumber;
    this.payeeSummaryDetails.payeeType = this.selectedProvider;
    this.payeeSummaryDetails.serviceProvider = this.selectedProviderProduct.value;
  }

  /**
   * @methodName fetchOTPLocation
   * @description used to fetch the otp location details
   * @parameter url payload
   * @return Observable
   */
  fetchOTPLocation(url: string, payloadObj: AddPayeePayLoadObj | string): Observable<SuccessPayeeResponse> {
    return this.apiSyncService.post(url, payloadObj);
  }

  /**
   * @methodName getUtilityProviderByPayeeName
   * @description used to getUtilityProviderByPayeeName
   * @parameter servicePrividerType<string>
   * @return providersList<UtilityProviders>
   */
  getUtilityProviderByPayeeName(payeeName: string): UtilityProviders {
    return this.utilityProvidersList.find(obj => obj.payeeName === payeeName);
  }

}
