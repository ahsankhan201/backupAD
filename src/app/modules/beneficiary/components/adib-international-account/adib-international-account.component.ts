import { Component, OnInit, OnDestroy } from '@angular/core';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { DOMAINS } from 'src/app/common/global-constants';
import { BENEFICIARY_ENDPOINTS } from 'src/app/common/api-endpoints';
import { SharedService } from 'src/app/common/services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adib-international-account',
  templateUrl: './adib-international-account.component.html',
  styleUrls: ['./adib-international-account.component.scss']
})
export class AdibInternationalAccountComponent implements OnInit, OnDestroy {
  subsscription$ = new Subscription();
  showIntlAccountNumber: boolean;
  showIBANNumber: boolean;
  selectedCountryCode: string;
  currencyList: any;
  constructor(private beneficiaryService: BeneficiaryService, private sharedService: SharedService) { }

  ngOnInit() {
    this.subsscription$.add(this.beneficiaryService.getSelectedCountry().subscribe((value) => {
      if (value) {
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

  /**
   * @methodName getCountryCurrencyList
   * @parameters none
   * @description Used to get the currency list for selected country
   * @return none
   */
  getCountryCurrencyList(): void {
    const CURRENCY_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
      BENEFICIARY_ENDPOINTS.GET_CURRENCY_LIST + this.selectedCountryCode;
    this.beneficiaryService.fetchCountriesList(CURRENCY_API).subscribe(response => {
      if (response) {
        response = JSON.parse(response.toString());
        this.currencyList = this.beneficiaryService.mapCurrencyDetailsWithKeys(response);
      }
    });
  }
  ngOnDestroy() {
    this.subsscription$.unsubscribe();
  }
}
