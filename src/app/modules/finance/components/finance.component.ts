import { Component, OnInit } from '@angular/core';
import { FINANCE_LABELS_TEXT } from '../finance-module.constants';
import { SharedService } from 'src/app/common/services/shared.service';
import { ARABIC_LANG_TEXT, DASHBOARD_NAMES } from 'src/app/common/global-constants';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit {
  selectedComponent = FINANCE_LABELS_TEXT.financeLists;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.sharedService.selectedDashboardText = DASHBOARD_NAMES.financeDashBoard;
  }

  /**
   * @methodName financeSelectionStatus
   * @description used to load @output financeSelectionStatus
   * @parameters event<boolean>
   * @return none
   */
  financeSelectionStatus(selectionStatus: boolean): void {
    this.selectedComponent = selectionStatus ? FINANCE_LABELS_TEXT.financeDetails : FINANCE_LABELS_TEXT.financeLists;
  }
  /**
   * @methodName onBackButtonClicked
   * @description used to load  @output onBackButtonClicked
   * @parameters event<boolean>
   * @return none
   */
  onBackButtonClicked(selectionStatus: boolean): void {
    this.selectedComponent = selectionStatus ? FINANCE_LABELS_TEXT.financeLists : FINANCE_LABELS_TEXT.financeDetails;
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
