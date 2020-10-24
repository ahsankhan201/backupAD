import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material';
import { Subscription } from 'rxjs';

import { SharedService } from '../../services/shared.service';
import { DialogService } from '../../services/dialog.service';

import {
  PAYMENT_STEPPER_TEXT,
  CANCEL_TRANSACTION_POPUP_TEXT
} from 'src/app/modules/transfers-payments/transfers-payments-module.constants';
import { PAYMENT_VIEW_MAPPING_OBJ, ARABIC_LANG_TEXT } from '../../global-constants';
import { Dialog } from '../../models/dialog.model';

@Component({
  selector: 'app-money-transfer',
  templateUrl: './money-transfer.component.html',
  styleUrls: ['./money-transfer.component.scss']
})
export class MoneyTransferComponent implements OnInit, OnDestroy {
  @Input() showMoneyTransferFromStep: boolean;
  @Input() showMoneyTransferToStep: boolean;
  @Input() parentComponentTitle: string;
  @Input() selectedComponentTitle: string;
  @Input() selectedAccountNumber: string;
  @Input() selectedCardNumber: string;
  @Input() showCardsTabInStepFrom?: boolean;
  @Output() completeTransferEvent: EventEmitter<boolean> = new EventEmitter();

  stepperText = PAYMENT_STEPPER_TEXT;
  showFromCardsTransferView: boolean;
  subscription$ = new Subscription();
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(private sharedService: SharedService, private dialogService: DialogService) { }

  ngOnInit() {
    this.getSelectedLanguage();
    this.getCancelTransactionRoute();
    this.setCardsMoneyTransferView();
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
   * @methodName stepIndexChanged
   * @param stepper, event
   * @description Used to fetch the current step and set other steps interacted accordingly
   * @return none
   */
  stepIndexChanged(stepper: MatStepper, event: StepperSelectionEvent): void {
    const currentStep = event.selectedIndex;
    stepper.steps.toArray().forEach((step, index) => {
      step.interacted = index < currentStep ? true : false;
    });
  }

  /**
   * @methodName setCardsMoneyTransferView
   * @parameter none
   * @description used to set card money transfer view
   * @return none
   */
  setCardsMoneyTransferView(): void {
    this.showFromCardsTransferView = this.parentComponentTitle === PAYMENT_VIEW_MAPPING_OBJ.cardsDashBoard ? true : false;
  }
  /**
   * @methodName getCancelTransactionRoute
   * @description listen to the cancel transaction route info from stepper form
   * @parameters none
   * @return none
   */
  getCancelTransactionRoute(): void {
    this.sharedService.setCancelTransactionInfo(undefined);
    this.subscription$.add(this.sharedService.getCancelTransactionInfo().subscribe(cancelTransaction => {
      if (cancelTransaction && cancelTransaction.cancelTransaction) {
        this.cancelTransaction();
        this.sharedService.setCancelTransactionInfo(undefined);
      } else if (cancelTransaction && cancelTransaction.hidePopUp) {
        this.completeTransferEvent.emit(false);
        this.sharedService.setCancelTransactionInfo(undefined);
      }
    }));
  }

  /**
   * @methodName cancelTransaction
   * @description used to toggle the payments view on cancelling transaction
   * @parameters none
   * @return none
   */
  cancelTransaction(): void {
    this.dialogService.open(this.setTransactionDialogInfo());
    this.dialogService.confirmed().subscribe((dialogResponse: boolean) => {
      if (dialogResponse) {
        this.completeTransferEvent.emit(false);
      }
    });
  }
  /**
   * @methodName setTransactionDialogInfo
   * @description used to set the cancel transaction dialog model info
   * @parameters none
   * @return object<Dialog>
   */
  setTransactionDialogInfo(): Dialog {
    const dialogModel = {} as Dialog;
    dialogModel.title = CANCEL_TRANSACTION_POPUP_TEXT.cancelTitle;
    dialogModel.showForm = false;
    dialogModel.message = CANCEL_TRANSACTION_POPUP_TEXT.cancelMessage;
    dialogModel.cancelText = CANCEL_TRANSACTION_POPUP_TEXT.noText;
    dialogModel.confirmText = CANCEL_TRANSACTION_POPUP_TEXT.yesText;
    return dialogModel;
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
