import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

/* Include service files here */
import { PayeeService } from '../../services/payee.service';

/* Include constants and models here */
import { PAYEE_SELECTION_MASTER_DATA } from '../../payee-module.constants';
import { ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.component.html',
  styleUrls: ['./service-provider.component.scss']
})
export class ServiceProviderComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  showRTAView = true;
  showTelecomView = true;
  showMobileView = true;
  showWaterAndElectricity = true;
  payeeSelectionData = PAYEE_SELECTION_MASTER_DATA;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private payeeService: PayeeService,
    private sharedService: SharedService) { }
  ngOnInit() {
    this.getSelectedLanguage();
    this.getSelectedProvider();
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
   * @methodName getSelectedProvider
   * @parameter none
   * @description Used to get service provider
   * @return none
   */
  getSelectedProvider(): void {
    this.subscription$.add(this.payeeService.getSelectedProvider().subscribe(() => {
      this.toggleServiceProvidersView();
    }));
  }

  /**
   * @methodName toggleServiceProvidersView
   * @description used to toggle the servive provider views
   * @parameter none
   * @return none
   */
  toggleServiceProvidersView(): void {
    this.showRTAView = false;
    this.showTelecomView = false;
    this.showWaterAndElectricity = false;
    if (this.payeeService.selectedProvider === this.payeeSelectionData.RTA_TEXT) {
      this.showRTAView = true;
    } else if (this.payeeService.selectedProvider === this.payeeSelectionData.TELECOM_TEXT) {
      this.showTelecomView = true;
    } else if (this.payeeService.selectedProvider === this.payeeSelectionData.WATER_ELECTRICITY_TEXT) {
      this.showWaterAndElectricity = true;
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
