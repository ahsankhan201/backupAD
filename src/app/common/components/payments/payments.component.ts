import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatStepper } from '@angular/material';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Subscription } from 'rxjs';

// import services
import { SharedService } from 'src/app/common/services/shared.service';
import { DialogService } from '../../services/dialog.service';
import { NAV_CONTROLS, PAYMENT_VIEW_MAPPING_OBJ, PAYMENT_SCREEN_TEXT, ARABIC_LANG_TEXT } from '../../global-constants';
import {
  PAYMENT_STEPPER_TEXT,
  CANCEL_TRANSACTION_POPUP_TEXT
} from '../../../modules/transfers-payments/transfers-payments-module.constants';
import { Dialog } from '../../models/dialog.model';
import { PaymentService } from '../../services/payment/payment.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, OnDestroy {
  @Input() showTransferFromStep: boolean;
  @Input() showTransferToStep: boolean;
  @Input() parentComponentTitle: string;
  @Input() selectedComponentTitle: string;
  @Input() selectedAccountNumber: string;
  @Output() completeTransactionEvent: EventEmitter<boolean> = new EventEmitter();

  stepperText = this.sharedService.clone(PAYMENT_STEPPER_TEXT);
  navControls = NAV_CONTROLS;
  transferFromScreenText = PAYMENT_SCREEN_TEXT;
  subscription$ = new Subscription();
  componentSelectionTitle: string;
  showWrapperTitleTransferTo = true;
  isPaymentToCoverCard: boolean;
  showCardsPayBillsView: boolean;
  stepperTextTransferDetailsTitle = this.stepperText.transferDetails;
  stepperTextConfirmTitle = PAYMENT_STEPPER_TEXT.summary;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  constructor(
    private sharedService: SharedService,
    private paymentService: PaymentService,
    private dialogService: DialogService) {
    this.handleStepperText();
  }

  ngOnInit() {
    this.getSelectedLanguage();
    this.sharedService.setCancelTransactionInfo(false);
    this.getCancelTransactionRoute();
    this.setIsPayPaymentToCoverCard();
    this.setCardsPayBillsView();
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
   * @methodName cancelTransaction
   * @description used to toggle the payments view on cancelling transaction
   * @parameters none
   * @return none
   */
  cancelTransaction(): void {
    this.dialogService.open(this.setTransactionDialogInfo());
    this.dialogService.confirmed().subscribe((dialogResponse: boolean) => {
      if (dialogResponse) {
        this.completeTransactionEvent.emit(false);
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

  /**
   * @methodName handleStepperText
   * @description used to udpate stepperText in required
   * @parameters none
   * @return none
   */
  handleStepperText(): void {
    if (this.paymentService.isPaymentTypeDonation()) {
      const STEPPER_TEXT = this.sharedService.clone(PAYMENT_STEPPER_TEXT);
      this.stepperText.transferTo = STEPPER_TEXT.donateTo;
      this.stepperText.transferDetails = STEPPER_TEXT.transactionDetails;
      this.stepperTextTransferDetailsTitle = STEPPER_TEXT.transferDetails;
      this.showWrapperTitleTransferTo = false;
    }
  }

  /* @methodName getCancelTransactionRoute
   * @description listen to the cancel transaction route info from stepper form
   * @parameters none
   * @return none
   */
  getCancelTransactionRoute(): void {
    this.subscription$.add(this.sharedService.getCancelTransactionInfo().subscribe(cancelTransaction => {
      if (cancelTransaction && cancelTransaction.cancelTransaction) {
        this.cancelTransaction();
      } else if (cancelTransaction && cancelTransaction.hidePopUp) {
        this.completeTransactionEvent.emit(false);
      }
    }));
  }

  /**
   * @methodName setIsPayPaymentToCoverCard
   * @parameter none
   * @description used to set isPaymentToCoverCard value
   * @return none
   */
  setIsPayPaymentToCoverCard(): void {
    this.isPaymentToCoverCard = false;
    if (this.parentComponentTitle === PAYMENT_VIEW_MAPPING_OBJ.paymentToCoverCard) {
      this.isPaymentToCoverCard = true;
      this.stepperText.transferFrom = PAYMENT_VIEW_MAPPING_OBJ.payFromStepperText;
    }
  }

  /**
   * @methodName setCardsPayBillsView
   * @parameter none
   * @description used to set card paybills view
   * @return none
   */
  setCardsPayBillsView(): void {
    this.showCardsPayBillsView = this.parentComponentTitle === PAYMENT_VIEW_MAPPING_OBJ.cardsDashBoard ? true : false;
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
