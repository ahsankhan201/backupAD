import { Component, OnInit } from '@angular/core';

import { AccountListModel } from 'src/app/common/models/accounts-module.model';
import { SharedService } from 'src/app/common/services/shared.service';
import { ARABIC_LANG_TEXT, CURRENCY_LIST_OBJ, PAYMENT_SCREEN_TEXT } from 'src/app/common/global-constants';
import { BankingServicesService } from '../../../services/banking-services.service';
import { BANKING_SERVICE_LIST } from '../../../banking-services-module.constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-draft-transfer-from-step',
  templateUrl: './draft-transfer-from-step.component.html',
  styleUrls: ['./draft-transfer-from-step.component.scss']
})
export class DraftTransferFromStepComponent implements OnInit {

  subscription$ = new Subscription();
  transferFromAccountList: AccountListModel[] = [];
  showAlertMessage = false;
  enableNextBtn = false;
  accountAlertText: string;
  selectedLang: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private bankingService: BankingServicesService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getLanguage();
    this.getAccountListForTransfer();
  }

  /**
   * @methodName handleCancelButtonClick
   * @parameter none
   * @description used to handle cancel button click
   * @return none
   */
  handleCancelButtonClick(): void {
    this.bankingService.cancelButtonClick$.next(BANKING_SERVICE_LIST.demandDraft);
  }

  /**
   * @methodName getAccountListForTransfer
   * @description used to get account list for money transfer component
   * @parameters none
   * @return none
   */
  getAccountListForTransfer(): void {
    if (this.sharedService.accountsCardsList) {
      this.transferFromAccountList = this.sharedService.getAccountListByCurrencyCode(CURRENCY_LIST_OBJ.AED);
    }
  }

  /**
   * @methodName selectedAccount
   * @parameter selectedAccountObj<AccountListModel>
   * @description used to set the selected account object
   * @return none
   */
  selectedAccount(selectedAccountObj: AccountListModel): void {
    this.showAlertMessage = false;
    if (selectedAccountObj) {
      const availableAmount = selectedAccountObj.balanceAvailable ? selectedAccountObj.balanceAvailable.toString() : '';
      this.bankingService.selectedTransferFromAccount = selectedAccountObj;
      if (availableAmount && Number(availableAmount) > PAYMENT_SCREEN_TEXT.ZERO) {
        this.enableNextBtn = true;
      } else {
        this.accountAlertText = PAYMENT_SCREEN_TEXT.accountInsufficientBalanceText;
        this.enableNextBtn = false;
        this.showAlertMessage = true;
      }
    }
  }

  /**
   * @methodName getLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getLanguage(): void {
    this.subscription$.add(this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLang = selectedLanguage;
    }));
  }

}
