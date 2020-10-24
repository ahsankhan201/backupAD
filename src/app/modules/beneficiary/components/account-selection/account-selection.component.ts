import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { BEN_UAE_OTHER, BENEFICIARY_UAE_ADIB, BANK_SELECTION_SCREEN_TEXT } from '../../beneficiary-module.constants';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ACCOUNT_TYPES } from 'src/app/common/global-constants';

@Component({
  selector: 'app-account-selection',
  templateUrl: './account-selection.component.html',
  styleUrls: ['./account-selection.component.scss'],

})
export class AccountSelectionComponent implements OnInit, AfterViewChecked {
  beneficiaryForm: FormGroup;
  addbyList: any = [];
  currencyList: any = [];
  ibAddby: string;
  currency: string;
  showOtherInternationalBankComp = true;
  showADIBInternationalBankComp = false;
  showADIBUAEBankComp = false;
  showOtherUAEBankComp = false;
  showAddBy = false;
  showMobileNumber = false;
  constructor(private beneficiaryService: BeneficiaryService, private formBuilder: FormBuilder, private changeDetect: ChangeDetectorRef) { }

  ngOnInit() { }

  ngAfterViewChecked() {
    const region = this.beneficiaryService.getRegion();
    const bank = this.beneficiaryService.getBank();
    this.showOtherInternationalBankComp = false;
    this.showADIBInternationalBankComp = false;
    this.showADIBUAEBankComp = false;
    this.showOtherUAEBankComp = false;
    if (region === BANK_SELECTION_SCREEN_TEXT.uae && bank === BANK_SELECTION_SCREEN_TEXT.adib) {
      this.showAddBy = true;
      this.addbyList = BENEFICIARY_UAE_ADIB.addBy;
      this.showADIBUAEBankComp = true;
    }
    if (region === BANK_SELECTION_SCREEN_TEXT.uae && bank === BANK_SELECTION_SCREEN_TEXT.otherBanks) {
      this.showAddBy = true;
      this.addbyList = BEN_UAE_OTHER.addBy;
      this.showOtherUAEBankComp = true;
    }
    if (bank === BANK_SELECTION_SCREEN_TEXT.otherBanks && region === BANK_SELECTION_SCREEN_TEXT.international) {
      this.showOtherInternationalBankComp = true;
      this.beneficiaryService.internationalBenPayLoadObj.accountType = ACCOUNT_TYPES.ACCOUNT;
      this.beneficiaryService.selectedAccountType = ACCOUNT_TYPES.ACCOUNT;
    }
    if (bank === BANK_SELECTION_SCREEN_TEXT.adib && region === BANK_SELECTION_SCREEN_TEXT.international) {
      this.showADIBInternationalBankComp = true;
      this.beneficiaryService.internationalBenPayLoadObj.accountType = ACCOUNT_TYPES.ACCOUNT;
      this.beneficiaryService.selectedAccountType = ACCOUNT_TYPES.ACCOUNT;
    }
    this.changeDetect.detectChanges();
  }

  /**
   * @methodName selectedAccount
   * @parameter event
   * @description Used to toggle based on selected event
   * @return none
   */
  selectedAccount(event: any): void {
    this.currencyList = [];
    this.beneficiaryService.setAddedBy(event);

    if (event === 'Account') {
      this.currencyList = BEN_UAE_OTHER.currency;
    }
    if (event === 'Mobile') {
      this.showMobileNumber = true;
    }
  }

  /**
   * @methodName selectedCurrency
   * @parameter event
   * @description Used to set the selected currency
   * @return none
   */
  selectedCurrency(event: any): void {
    this.beneficiaryService.setCurrency(event);
    this.currency = this.beneficiaryService.getCurrency();
  }
}
