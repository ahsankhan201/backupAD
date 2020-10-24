import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ICON, TRANSFER_PAYMENT_CONST, ARABIC_LANG_TEXT, ACCOUNT_TYPES } from '../../global-constants';
import { BeneficiaryListResponse } from '../../models/beneficiary.model';
import { Subscription } from 'rxjs';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-checkbox-beneficiary',
  templateUrl: './checkbox-beneficiary.component.html',
  styleUrls: ['./checkbox-beneficiary.component.scss']
})
export class CheckboxBeneficiaryComponent implements OnInit, OnDestroy {
  @Input() checkBoxBeneficiaryList = [] as BeneficiaryListResponse[];
  @Input() componentName: string;
  @Output() selectedOptionValue = new EventEmitter<BeneficiaryListResponse>();

  subscription$ = new Subscription();
  readonly iconsConst = ICON;
  labelConst = TRANSFER_PAYMENT_CONST;
  selectedValue: string;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  accountTypes = ACCOUNT_TYPES;
  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getSelectedLanguage();
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
   * @methodName handleChange
   * @param account<BeneficiaryListResponse> input<HTMLInputElement>
   * @description Used to emit selected benefciary value to parent component and set the active status to clicked element
   * @return none
   */
  handleChange(account: BeneficiaryListResponse, input: HTMLInputElement): void {
    this.selectedValue = input.value;
    this.selectedOptionValue.emit(account);
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

}
