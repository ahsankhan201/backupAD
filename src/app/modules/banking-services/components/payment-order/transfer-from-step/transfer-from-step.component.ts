import { Component, OnInit } from '@angular/core';

import { AccountListModel } from 'src/app/common/models/accounts-module.model';
import { SharedService } from 'src/app/common/services/shared.service';
import { PAYMENT_SCREEN_TEXT, CURRENCY_LIST_OBJ } from 'src/app/common/global-constants';
import { BankingServicesService } from '../../../services/banking-services.service';
import { BANKING_SERVICE_LIST } from '../../../banking-services-module.constants';

@Component({
  selector: 'app-payment-order-transfer-from-step',
  templateUrl: './transfer-from-step.component.html',
  styleUrls: ['./transfer-from-step.component.scss']
})
export class TransferFromStepComponent implements OnInit {
  transferFromAccountList: AccountListModel[] = [];
  showAlertMessage = false;
  enableNextBtn = false;
  accountAlertText: string;

  constructor(
    private bankingService: BankingServicesService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getAccountListForTransfer();
  }

  /**
   * @methodName handleCancelButtonClick
   * @parameter none
   * @description used to handle cancel button click
   * @return none
   */
  handleCancelButtonClick(): void {
    this.bankingService.cancelButtonClick$.next(BANKING_SERVICE_LIST.paymentOrder);
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
   * @methodName handleSelectedAccount
   * @parameter selectedAccountObj<AccountListModel>
   * @description used to set the selected account object
   * @return none
   */
  handleSelectedAccount(selectedAccountObj: AccountListModel): void {
    this.showAlertMessage = false;
    if (selectedAccountObj) {
      const availableAmount = selectedAccountObj.balanceAvailable.toString();
      this.bankingService.selectedTransferFromAccount = selectedAccountObj;
      if (availableAmount && Number(availableAmount) > PAYMENT_SCREEN_TEXT.ZERO) {
        this.enableNextBtn = true;
        this.showAlertMessage = false;
      } else {
        this.accountAlertText = PAYMENT_SCREEN_TEXT.accountInsufficientBalanceText;
        this.enableNextBtn = false;
        this.showAlertMessage = true;
      }
    }
  }

}
