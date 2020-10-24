import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatStepper } from '@angular/material';
import { BankingServicesService } from '../../../services/banking-services.service';
import { BANKING_SERVICE_LIST } from '../../../banking-services-module.constants';
import { INSIDE_UAE_TRANSFER_TEXT } from 'src/app/common/global-constants';

@Component({
  selector: 'app-payment-order-transaction-details-step',
  templateUrl: './transaction-details-step.component.html',
  styleUrls: ['./transaction-details-step.component.scss']
})
export class TransactionDetailsStepComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  transactionDetailsFormGroup: FormGroup;
  sharedService: any;
  accountList = [];

  constructor(
    private formBuilder: FormBuilder,
    private bankingService: BankingServicesService,
    private stepper: MatStepper) { }

  ngOnInit() {
    this.setComponentInitialData();
  }

  /**
   * @methodName setComponentInitialData
   * @parameter none
   * @description used to set the component initial data
   * @return none
   */
  setComponentInitialData(): void {
    this.createTransactionDetailsForm();
  }

  /**
   * @methodName createTransactionDetailsForm
   * @parameter none
   * @description used to create transaction details form
   * @return none
   */
  createTransactionDetailsForm(): void {
    this.transactionDetailsFormGroup = this.formBuilder.group({
      amount: ['', [Validators.required]]
    });
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
   * @methodName handleNextButtonClick
   * @parameter none
   * @description used to handle next button click
   * @return none
   */
  handleNextButtonClick(): void {
    if (this.transactionDetailsFormGroup.valid) {
      this.bankingService.amount = this.transactionDetailsFormGroup.get('amount').value ?
        this.sharedService.removeCommaFromString(this.transactionDetailsFormGroup.get('amount').value) :
        this.transactionDetailsFormGroup.get('amount').value;
      this.bankingService.enableSummaryScreen$.next(true);
      this.stepper.next();
    }
  }


  /**
   * @methodName validateAmount
   * @parameter none
   * @description used to validate the amount field
   * @return none
   */
  validateAmount(): void {
    const FORM_CONTROL_AMOUNT = this.transactionDetailsFormGroup.get('amount');
    let amountValue = FORM_CONTROL_AMOUNT.value;
    amountValue = amountValue ? this.sharedService.removeCommaFromString(amountValue) : amountValue;
    if (this.bankingService.selectedTransferFromAccount &&
      amountValue > Number(this.bankingService.selectedTransferFromAccount.balanceAvailable)) {
      // handle error validaiton for amount is greater than availableAmount
      FORM_CONTROL_AMOUNT.setErrors(
        { notValidAmount: { message: INSIDE_UAE_TRANSFER_TEXT.minimumAmountError } });
    }
  }

  ngOnDestroy() {
    this.transactionDetailsFormGroup.reset();
    this.subscription$.unsubscribe();
  }

}
