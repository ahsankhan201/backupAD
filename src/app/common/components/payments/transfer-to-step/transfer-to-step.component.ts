import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/common/services/shared.service';
import { PaymentService } from 'src/app/common/services/payment/payment.service';
import { PayeeListResponse } from 'src/app/common/models/payee.model';
import { PAYMENT_TYPES, DONATION_LIST_CATEGORY, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { FilterTextPipe } from 'src/app/common/pipes/filter-text/filter-text.pipe';
import { TRANSFER_PAYMENT_CONST, TRANSFER_TO_PAYEE_SELECTION, PAYMENT_SCREEN_TEXT } from 'src/app/common/global-constants';
import { DonationCheckBox, DonationCheckBoxItem, DonationList } from 'src/app/common/models/payment.model';

@Component({
  selector: 'app-transfer-to-step',
  templateUrl: './transfer-to-step.component.html',
  styleUrls: ['./transfer-to-step.component.scss']
})
export class TransferToStepComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  allUtilitypayeeList = [] as PayeeListResponse[];
  donationList = {} as DonationList;
  selectedPayeeList = [] as DonationCheckBox[];
  payeeList: PayeeListResponse[];
  charityList = [];
  payeeListForFilter: PayeeListResponse[];
  enableNextBtn = false;
  transferToOptionList = TRANSFER_TO_PAYEE_SELECTION;
  transferToScreenText = PAYMENT_SCREEN_TEXT;
  selectedPaymentType = this.paymentService.selectedPaymentType;
  paymentTypeDonation = PAYMENT_TYPES.donate;
  searchText: string;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(
    private sharedService: SharedService,
    private paymentService: PaymentService,
    private filterTextPipe: FilterTextPipe) {
  }

  ngOnInit() {
    this.getSelectedLanguage();
    this.populatePayeeList();
  }

  /**
   * @methodName getSelectedLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getSelectedLanguage(): void {
    this.subscription$.add(this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLanguage = selectedLanguage;
    }));
  }

  /**
   * @methodName cancelTransaction
   * @parameter showCancelPopUp<boolean>
   * @description used to set the cancel transaction router link value
   * @return none
   */
  cancelTransaction(showCancelPopUp: boolean): void {
    this.sharedService.setCancelTransactionInfo(showCancelPopUp);
  }

  /**
   * @methodName populatePayeeList
   * @parameter none
   * @description used to populate the payeelist
   * @return none
   */
  populatePayeeList(): void {
    if (this.sharedService.allUtilityPayeeList && this.sharedService.allUtilityPayeeList.length) {
      this.payeeList = this.sharedService.clone(this.sharedService.allUtilityPayeeList);
      this.setPayeeTransferToData();
    } else {
      this.sharedService.getAllPayeeList().subscribe((response) => {
        this.payeeList = response;
        this.setPayeeTransferToData();
      });
    }
  }

  /**
   * @methodName selectedPayee
   * @parameter selectedPayee<PayeeListResponse>
   * @description used to get the selected payee objcet
   * @return none
   */
  selectedPayee(salectedPayee: PayeeListResponse): void {
    this.paymentService.selectedPayeeObj = salectedPayee;
    this.paymentService.isPayeeSelectedForPayment = true;
    this.paymentService.selectedPaymentType = PAYMENT_TYPES.utilityPayment;
    this.enableNextBtn = true;
  }

  /**
   * @methodName selectedTransferToOption
   * @parameter payeeSelectionType<string>
   * @description used to toggle the view between payee and takaful
   * @return none
   */
  selectedTransferToOption(payeeSelectionType: string): void {
    // Needs to implement this method part of takaful story
    return undefined;
  }

  /**
   * @methodName onSearchChange
   * @description used to filter the beneficiary from the beneficiary list
   * @parameters searchText<string>
   * @return none
   */
  onSearchChange(searchText: string): void {
    this.payeeList = this.filterTextPipe.transform(this.payeeListForFilter, searchText, TRANSFER_PAYMENT_CONST.nickName);
  }

  /**
   * @methodName moveToNextStep
   * @parameter none
   * @description used to set setOutStandingBalanceSubject true to make api request
   * @return none
   */
  moveToNextStep(): void {
    if (this.paymentService.isPayeeSelectedForPayment) {
      this.paymentService.setOutStandingBalanceSubject(true);
    }
  }

  /**
   * @methodName setPayeeTransferToData
   * @parameter none
   * @description used to set payee transfer to data
   * @return none
   */
  setPayeeTransferToData(): void {
    if (this.paymentService.selectedPaymentType === this.paymentTypeDonation) {
      this.subscription$.add(this.paymentService.getCharityList().subscribe( reponse => {
        if (reponse) {
          const reponseJson = JSON.parse(reponse);
          this.charityList = reponseJson.charityList;
          this.setPayeeDonateToCheckBoxData();
         }
      }));
    } else {
      this.payeeList = this.payeeList.filter(payee => payee.isInquiryRequired === TRANSFER_PAYMENT_CONST.payeeFilterAttribute);
      this.payeeListForFilter = this.payeeList && this.payeeList.length ? this.sharedService.clone(this.payeeList) : this.payeeList;
    }
  }

  /**
   * @methodName setPayeeDonateToCheckBoxData
   * @parameter none
   * @description used to set donate to checkBox data
   * @return none
   */
  setPayeeDonateToCheckBoxData(): void {
    // General Authority of Islamic Affairs & Endowments
    // Mapping: payeeCategory = 'General Authority of Islamic Affairs & Endowments'
    const GENERAL_AUTHORITY_LIST = this.charityList
      .filter(payee => payee.payeeCategory === DONATION_LIST_CATEGORY.generalAuthority);
    this.donationList.generalAuthorityList = this.mapPayeeCategoryForCheckBox(GENERAL_AUTHORITY_LIST);

    // UAE Red Crescent - Mapping: payeeSubCategory = 'UAE Red Crescent' &  payeeSubCategory != 'Sukuk Al Khair'
    const UAE_REDCRESENT_LIST = this.charityList.filter(payee => (
      payee.payeeCategory === DONATION_LIST_CATEGORY.uaeRedCrescent && payee.payeeSubCategory !== DONATION_LIST_CATEGORY.sukukAlKhair));
    this.donationList.uaeRedCrescentList = this.mapPayeeCategoryForCheckBox(UAE_REDCRESENT_LIST);

    // SUKUK -  Mapping: payeeSubCategory = 'Sukuk Al Khair'
    const SUKUK_LIST = this.charityList.filter(payee => payee.payeeSubCategory === DONATION_LIST_CATEGORY.sukukAlKhair);
    this.donationList.sukukList = this.mapPayeeCategoryForCheckBox(SUKUK_LIST);

    // ZAKAT - Mapping: payeeCategory = 'Zakat Fund'
    const ZAKAT_LIST = this.charityList.filter(payee => payee.payeeCategory === DONATION_LIST_CATEGORY.zakatFund);
    this.donationList.zakatList = this.mapPayeeCategoryForCheckBox(ZAKAT_LIST);

    if (this.donationList) {
      this.selectedPayeeList = [
        { title: DONATION_LIST_CATEGORY.generalAuthorityText, data: this.donationList.generalAuthorityList },
        { title: DONATION_LIST_CATEGORY.uaeRedCrescentText, data: this.donationList.uaeRedCrescentList },
        { title: DONATION_LIST_CATEGORY.sukukAlKhairText, data: this.donationList.sukukList },
        { title: DONATION_LIST_CATEGORY.zakatFundText, data: this.donationList.zakatList }
      ];
    }
  }

  /**
   * @methodName selectedTransferToDonationValue
   * @parameter selectedTransferTo<DonationCheckBoxItem>
   * @description used to handle selected transfer to donation value
   * @return none
   */
  selectedTransferToDonationValue(selectedTransferTo: DonationCheckBoxItem): void {
    const SELECTED_PAYEE_OBJECT: PayeeListResponse = selectedTransferTo ? selectedTransferTo.data : undefined;
    this.paymentService.selectedPayeeObj = SELECTED_PAYEE_OBJECT;
    this.enableNextBtn = true;
  }

  /**
   * @methodName mapPayeeCategoryForCheckBox
   * @parameter donationFilteredValue<PayeeListResponse>
   * @description used to handle selected transfer to donation value
   * @return none
   */
  mapPayeeCategoryForCheckBox(donationFilteredValue: PayeeListResponse[]) {
    const DONATION_FILTERED_ARRAY = [];
    donationFilteredValue.forEach((element) => {
      DONATION_FILTERED_ARRAY.push({ id: `${element.payeeCategory}-${element.nickName}`, title: element.nickName, data: element });
    });
    return (DONATION_FILTERED_ARRAY) ? DONATION_FILTERED_ARRAY : undefined;
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
