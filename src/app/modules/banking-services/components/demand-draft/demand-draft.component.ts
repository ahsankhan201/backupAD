import { Component, OnInit } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material';

import { SharedService } from 'src/app/common/services/shared.service';
import { PAYMENT_ORDER_STEPPER_TEXT, PAYMENT_ORDER_CONST } from '../../banking-services-module.constants';
import { ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-demand-draft',
  templateUrl: './demand-draft.component.html',
  styleUrls: ['./demand-draft.component.scss']
})
export class DemandDraftComponent implements OnInit {
  stepperText = PAYMENT_ORDER_STEPPER_TEXT;
  PAYMENT_ORDER_CONST = PAYMENT_ORDER_CONST;
  selectedLang: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  subscription$ = new Subscription();

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.getLanguage();
    this.sharedService.setHorizontalLineClass(this.PAYMENT_ORDER_CONST.horizontalLineClass);
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
