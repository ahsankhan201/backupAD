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
  selector: 'app-rta-selection',
  templateUrl: './rta-selection.component.html',
  styleUrls: ['./rta-selection.component.scss']
})
export class RtaSelectionComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  rtaProvidersList: ImageCheckBoxObj[];
  enableNextBtn = false;
  navControlsText = NAV_CONTROLS;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private payeeService: PayeeService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.getRtaProvidersList();
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
   * @methodName getRtaProvidersList
   * @parameter none
   * @description Used to get RTA providers list
   * @return none
   */
  getRtaProvidersList(): void {
    this.subscription$.add(this.payeeService.getSelectedProvider().subscribe(response => {
      if (response === PAYEE_SELECTION_MASTER_DATA.RTA_TEXT) {
        this.rtaProvidersList = this.payeeService.getProductCheckBoxObj(
          this.payeeService.getServiceProvidersList(PAYEE_SELECTION_MASTER_DATA.RTA_TEXT));
      }
    }));
  }

  /**
   * @methodName handleRTASelection
   * @parameter selectProduct<CheckBoxEmittedObj>
   * @description Used to set the RTA provider object
   * @return none
   */
  handleRTASelection(selectProduct: CheckBoxEmittedObj): void {
    this.enableNextBtn = true;
    this.payeeService.selectedProviderProduct = selectProduct;
    this.payeeService.setSelectedProduct(selectProduct.value);
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
