import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/common/services/shared.service';
import { BENEFICIARY_REGION, BANK_SELECTION_SCREEN_TEXT } from '../../beneficiary-module.constants';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { NAV_CONTROLS, ARABIC_LANG_TEXT } from '../../../../common/global-constants';

@Component({
  selector: 'app-region-selection',
  templateUrl: './region-selection-component.html',
  styleUrls: ['./region-selection-component.scss']
})
export class RegionSelectionComponent implements OnInit {
  regionSelectionList: any = BENEFICIARY_REGION;
  region: string;
  enableNextBtn: boolean;
  selectRegionScreenText = BANK_SELECTION_SCREEN_TEXT;
  navControls = NAV_CONTROLS;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(
    private beneficiaryService: BeneficiaryService,
    private sharedService: SharedService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.getSelectedLanguage();
  }
  /**
   * @methodName selectedRegion
   * @param region<String>
   * @description Used to get the selected region information
   * @return none
   */
  selectedRegion(region: string): void {
    this.enableNextBtn = true;
    this.beneficiaryService.setRegion(region);
    this.region = this.beneficiaryService.getRegion();
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
}
