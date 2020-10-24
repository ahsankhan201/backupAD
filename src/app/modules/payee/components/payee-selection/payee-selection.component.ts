import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// Include services here
import { PayeeService } from '../../services/payee.service';
import { SharedService } from 'src/app/common/services/shared.service';

// Include constants and models here
import { NAV_CONTROLS, DOMAINS, ARABIC_LANG_TEXT } from '../../../../common/global-constants';
import { BENEFICIARY_ENDPOINTS } from 'src/app/common/api-endpoints';
import { ImageCheckBoxObj } from 'src/app/common/models/payee.model';

@Component({
  selector: 'app-payee-selection',
  templateUrl: './payee-selection.component.html',
  styleUrls: ['./payee-selection.component.scss']
})
export class PayeeSelectionComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  payeeSelectionList: ImageCheckBoxObj[];
  enableNextBtn: boolean;
  navCtrolsText = NAV_CONTROLS;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(private payeeService: PayeeService, private sharedService: SharedService) {
  }
  ngOnInit() {
    this.getPayeeList();
    this.getSelectedLanguage();
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
   * @methodName selectedPayee
   * @description used to set the selected payee type value and enables the next button
   * @parameter payeeList
   * @return payeeTypeList<Object>
   */
  selectedPayee(selectedProvider: string): void {
    this.payeeService.setSelectedProvider(selectedProvider);
    this.enableNextBtn = true;
  }
  /**
   * @methodName getPayeeList
   * @description used to get the payeeList details
   * @parameter none
   * @return none
   */
  getPayeeList(): void {
    const PAYEE_LIST_URL = `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)}${BENEFICIARY_ENDPOINTS.UTILITY_PROVIDER}`;
    this.subscription$.add(this.payeeService.fetchPayeeLIst(PAYEE_LIST_URL).subscribe(response => {
      response = JSON.parse(response.toString());
      (response && response.allUtilityList) ? (this.payeeSelectionList = this.payeeService.mapImagesWithPayeeList(response.allUtilityList),
        this.payeeService.utilityProvidersList = response.allUtilityList) :
        (this.payeeSelectionList = null, this.payeeService.utilityProvidersList = null);
    }));
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
