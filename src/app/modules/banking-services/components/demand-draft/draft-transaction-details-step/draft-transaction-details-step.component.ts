import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatStepper } from '@angular/material';
import { BankingServicesService } from '../../../services/banking-services.service';
import { BANKING_SERVICE_LIST } from '../../../banking-services-module.constants';
import { ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-draft-transaction-details-step',
  templateUrl: './draft-transaction-details-step.component.html',
  styleUrls: ['./draft-transaction-details-step.component.scss']
})
export class DraftTransactionDetailsStepComponent implements OnInit, OnDestroy {

  subscription$ = new Subscription();
  draftDetailsFormGroup: FormGroup;
  accountList = [];
  selectedLang: string;
  arabicLanguageText = ARABIC_LANG_TEXT;


  constructor(
    private formBuilder: FormBuilder,
    private bankingService: BankingServicesService,
    private stepper: MatStepper,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.getLanguage();
    this.createTransactionDetailsForm();

  }

  /**
   * @methodName createTransactionDetailsForm
   * @parameter none
   * @description used to create transaction details form
   * @return none
   */
  createTransactionDetailsForm(): void {
    this.draftDetailsFormGroup = this.formBuilder.group({
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
    this.bankingService.cancelButtonClick$.next(BANKING_SERVICE_LIST.demandDraft);
  }

  /**
   * @methodName handleNextButtonClick
   * @parameter none
   * @description used to handle next button click
   * @return none
   */
  handleNextButtonClick(): void {
    if (this.draftDetailsFormGroup.valid) {
      this.bankingService.amount = this.draftDetailsFormGroup.get('amount').value ?
        this.sharedService.removeCommaFromString(this.draftDetailsFormGroup.get('amount').value) :
        this.draftDetailsFormGroup.get('amount').value;
      this.bankingService.enableSummaryScreen$.next(true);
      this.stepper.next();
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

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

}
