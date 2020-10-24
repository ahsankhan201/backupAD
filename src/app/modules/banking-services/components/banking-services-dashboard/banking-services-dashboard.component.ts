import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/common/services/shared.service';
import { BANKING_SERVICE_CONSTANTS, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { AccountsSummaryResponse, PaymentsSummaryResponse } from 'src/app/common/models/bank-services-module.model';


@Component({
  selector: 'app-banking-services-dashboard',
  templateUrl: './banking-services-dashboard.component.html',
  styleUrls: ['./banking-services-dashboard.component.scss']
})
export class BankingServicesDashboardComponent implements OnInit {
  @Input() selectedService: string;
  @Input() accountsServiceSummaryData: AccountsSummaryResponse[];
  @Input() paymentsServiceSummaryData: PaymentsSummaryResponse[];
  @Output() selectedRequestId = new EventEmitter<number>();
  readonly BANKING_SERVICE_LABELS = BANKING_SERVICE_CONSTANTS;
  paymentsSummaryData: PaymentsSummaryResponse[] = [];
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  subscription$ = new Subscription();

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.setAccountsSummaryData();
  }

  /**
   * @methodName setAccountsSummaryData
   * @parameter none
   * @description Used to set accounts summary data
   * @return none
   */
  setAccountsSummaryData(): void {
    if (this.sharedService.accountsListData && this.accountsServiceSummaryData.length > 0) {
      const accountList = this.sharedService.clone(this.sharedService.accountsListData);
      this.accountsServiceSummaryData.forEach(accountSummary => {
        if (accountList[accountSummary.accountNumber]) {
          accountSummary.accountDesc = accountList[accountSummary.accountNumber].classDesc;
        }
      });
    }
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
   * @methodName getSelectedRequestId
   * @parameter selectedServiceID<number>
   * @description Used to get selected requestId
   * @return none
   */
  getSelectedRequestId(selectedServiceID: number): void {
    this.selectedRequestId.emit(selectedServiceID);
  }
}
