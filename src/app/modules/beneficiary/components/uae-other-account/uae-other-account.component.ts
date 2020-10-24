import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { BEN_UAE_OTHER, COUNTRY_CODE_UAE, CURRENCY_CODE_UAE, BENEFICIARY_FORM_TEXT } from '../../beneficiary-module.constants';
import { environment } from 'src/environments/environment';
import { ACCOUNT_TYPES, DOMAINS, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { BENEFICIARY_ENDPOINTS } from 'src/app/common/api-endpoints';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-uae-other-account',
  templateUrl: './uae-other-account.component.html',
  styleUrls: ['./uae-other-account.component.scss']
})
export class UaeOtherAccountComponent implements OnInit, AfterViewChecked {
  addbyList: any = [];
  currencyList: any = [];
  ibAddby: string;
  currency: string;
  showOtherInternationalBankComp = true;
  showADIBInternationalBankComp = false;
  showADIBUAEBankComp = false;
  showOtherUAEBankComp = false;
  showAddBy = false;
  showCard = false;
  showIBAN = false;
  showForm = false;
  currencySelected: string;
  formText = BENEFICIARY_FORM_TEXT;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(
    private beneficiaryService: BeneficiaryService,
    private sharedService: SharedService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.showAddBy = true;
    this.addbyList = BEN_UAE_OTHER.addBy;
    this.getSelectedLanguage();
  }

  /**
   * @methodName getSelectedLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getSelectedLanguage(): void {
    this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLanguage = selectedLanguage;
    });
  }

  /**
   * @methodName selectedAccount
   * @description used to  select account
   * @parameters none
   * @return none
   */

  selectedAccount(event): void {
    this.currencyList = [];
    this.beneficiaryService.setAddedBy(event);
    this.showForm = true;
    this.showIBAN = false;
    this.showCard = false;
    const CURRENCY_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) + BENEFICIARY_ENDPOINTS.GET_CURRENCY_LIST;
    if (event === 'account') {
      this.showIBAN = true;
      this.beneficiaryService.fetchCurrencyList(CURRENCY_API + COUNTRY_CODE_UAE).subscribe(res => {
        res = JSON.parse(res.toString());
        this.currencyList = this.beneficiaryService.mapCurrencyDetailsWithKeys(res);
      });
      this.beneficiaryService.internationalBenPayLoadObj.accountType = ACCOUNT_TYPES.ACCOUNT;
    }
    if (event === 'card') {
      this.currencyList = [];
      this.showCard = true;
      this.beneficiaryService.internationalBenPayLoadObj.currency = CURRENCY_CODE_UAE;
      this.beneficiaryService.internationalBenPayLoadObj.accountType = ACCOUNT_TYPES.CARD;
    }
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }
}
