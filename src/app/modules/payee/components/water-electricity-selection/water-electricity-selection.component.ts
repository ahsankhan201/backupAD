import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// Include services here
import { PayeeService } from '../../services/payee.service';

// Include constants and models here
import { PAYEE_SELECTION_MASTER_DATA } from '../../payee-module.constants';
import { ImageCheckBoxObj, CheckBoxEmittedObj } from 'src/app/common/models/payee.model';
import { NAV_CONTROLS, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-water-electricity-selection',
  templateUrl: './water-electricity-selection.component.html',
  styleUrls: ['./water-electricity-selection.component.scss']
})
export class WaterElectricitySelectionComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  providersList: ImageCheckBoxObj[];
  enableNextBtn = false;
  navControlsText = NAV_CONTROLS;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private payeeService: PayeeService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.getProvidersList();
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
   * @methodName getProvidersList
   * @parameter none
   * @description Used to get water and electricity providers list
   * @return none
   */
  getProvidersList(): void {
    this.subscription$.add(this.payeeService.getSelectedProvider().subscribe(response => {
      if (response === PAYEE_SELECTION_MASTER_DATA.WATER_ELECTRICITY_TEXT) {
        this.providersList = this.payeeService.getProductCheckBoxObjUsingProviderID(
          this.payeeService.getServiceProvidersList(PAYEE_SELECTION_MASTER_DATA.WATER_ELECTRICITY_TEXT));
      }
    }));
  }

  /**
   * @methodName onSelectProduct
   * @parameter none
   * @description Used to set the water and electricity provider object
   * @return none
   */
  onSelectProduct(selectProduct: CheckBoxEmittedObj): void {
    this.enableNextBtn = true;
    this.payeeService.selectedProviderProduct = selectProduct;
    this.payeeService.setSelectedProduct(selectProduct.value);
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
