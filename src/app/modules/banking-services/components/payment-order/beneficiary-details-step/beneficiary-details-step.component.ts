import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatStepper } from '@angular/material';

import { PAYMENT_ORDER_CONST, BANKING_SERVICE_LIST, PAYMENT_ORDER_BENE_MAX_LENGTH } from '../../../banking-services-module.constants';
import { BANKING_CERTIFICATE_INFO } from '../../../banking-services-module.constants';
import { SharedService } from 'src/app/common/services/shared.service';
import { BankingServicesService } from '../../../services/banking-services.service';
import { GetBranchesListReqModel } from 'src/app/common/models/bank-services-module.model';

@Component({
  selector: 'app-payment-order-beneficiary-details-step',
  templateUrl: './beneficiary-details-step.component.html',
  styleUrls: ['./beneficiary-details-step.component.scss']
})
export class BeneficiaryDetailsStepComponent implements OnInit {
  subscription$ = new Subscription();
  beneficiaryDetailsFormGroup: FormGroup;
  purposeOfTransferList = [];
  beneficiaryNameMaxlength = PAYMENT_ORDER_BENE_MAX_LENGTH;
  PAYMENT_ORDER_CONST = PAYMENT_ORDER_CONST;
  collectFromList = [];
  constructor(
    private sharedService: SharedService,
    private bankingService: BankingServicesService,
    private formBuilder: FormBuilder,
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
    this.sharedService.setHorizontalLineClass(this.PAYMENT_ORDER_CONST.horizontalLineClass); // setting horizontal line
    this.createBeneficiaryDetailsForm();
    this.fetchTransferPurposeLst();
    this.getBranchList();
  }

  /**
   * @methodName createBeneficiaryDetailsForm
   * @parameter none
   * @description used to create beneficiary details form
   * @return none
   */
  createBeneficiaryDetailsForm(): void {
    this.beneficiaryDetailsFormGroup = this.formBuilder.group({
      beneficiaryName: ['', [Validators.required]],
      purposeOfTransfer: ['', [Validators.required]],
      collectFrom: ['', [Validators.required]]
    });
  }

  /**
   * @methodName handleCancelButtonClick
   * @parameter none
   * @description used to handle cancel button click
   * @return none
   */
  handleCancelButtonClick(): void {
    this.sharedService.setHorizontalLineClass(undefined);
    this.bankingService.cancelButtonClick$.next(BANKING_SERVICE_LIST.paymentOrder);
  }

  /**
   * @methodName handleNextButtonClick
   * @parameter none
   * @description used to handle next button click
   * @return none
   */
  handleNextButtonClick(): void {
    if (this.beneficiaryDetailsFormGroup.valid) {
      this.bankingService.baneficiaryDetailsFormData = this.beneficiaryDetailsFormGroup.value;
      this.stepper.next();
    }
  }

  /**
   * @methodName getBranchList
   * @parameter none
   * @description used to fetch branch list from the server
   * @return none
   */
  getBranchList(): void {
    const reqPayload = {} as GetBranchesListReqModel;
    reqPayload.country = BANKING_CERTIFICATE_INFO.UAE_COUNTRY_CODE_FOR_BRANCHES;
    this.subscription$.add(this.sharedService.getBranch(reqPayload).subscribe(res => {
      this.collectFromList = (res) ? res : undefined;
    }));
  }

  /**
   * @methodName fetchTransferPurposeLst
   * @parameter none
   * @description used to fetch the purpose of transfer list from the server
   * @return none
   */
  fetchTransferPurposeLst(): void {
    this.subscription$.add(this.sharedService.getTransferPurpose().subscribe(response => {
      this.purposeOfTransferList = (response) ? response['purposeOfTransferList'] : undefined;
    }));
  }

  ngDestroy() {
    this.beneficiaryDetailsFormGroup.reset();
    this.sharedService.setHorizontalLineClass(undefined);
    this.subscription$.unsubscribe();
  }
}
