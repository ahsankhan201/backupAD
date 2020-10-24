import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { BeneficiaryService } from '../../services/beneficiary.service';
import { DOMAINS, USA_TEXT } from 'src/app/common/global-constants';
import { BENEFICIARY_ENDPOINTS } from 'src/app/common/api-endpoints';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-international-account',
  templateUrl: './other-international-account.component.html',
  styleUrls: ['./other-international-account.component.scss']
})
export class InternationalAccountComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();

  searchtext: string;
  showIntlABACode: boolean;
  showIntlAccountNumber: boolean;
  showIBANNumber: boolean;
  selectedCountryCode: string;
  currencyList: any;
  constructor(private beneficiaryService: BeneficiaryService, private sharedService: SharedService) {

  }

  ngOnInit() {
    this.getSelectedCountry();
  }

  /**
   * @methodName getCountryCurrencyList
   * @parameters none
   * @description Used to get the currency list for selected country
   * @return none
   */
  getCountryCurrencyList(): void {
    const CURRENCY_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
    BENEFICIARY_ENDPOINTS.GET_CURRENCY_LIST + this.selectedCountryCode;
    this.subscription$.add(this.beneficiaryService.fetchCountriesList(CURRENCY_API).subscribe(response => {
      if (response) {
        response = JSON.parse(response.toString());
        this.currencyList = this.beneficiaryService.mapCurrencyDetailsWithKeys(response);
      }
    }));
  }

  /**
   * @methodName getSelectedCountry
   * @parameters none
   * @description Used to fetch the country list from server and to set the logic
   * @return none
   */
  getSelectedCountry(): void {
    this.subscription$.add(this.beneficiaryService.getSelectedCountry().subscribe((value) => {
      if (value) {
        this.showIntlABACode = value === USA_TEXT ? true : false;
        const countryList = this.beneficiaryService.countriesList;
        if (this.beneficiaryService.checkIBANRequied(value, countryList)) {
          this.showIntlAccountNumber = false;
          this.showIBANNumber = true;
        } else {
          this.showIntlAccountNumber = true;
          this.showIBANNumber = false;
        }
        this.beneficiaryService.setSelectedCountry(undefined);
      }
      value ? (this.selectedCountryCode = value, this.getCountryCurrencyList()) : this.selectedCountryCode = null;
    }));
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
