import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { PayeeListResponse } from '../../models/payee.model';
import { ICON, ARABIC_LANG_TEXT } from '../../global-constants';

@Component({
  selector: 'app-checkbox-payee',
  templateUrl: './checkbox-payee.component.html',
  styleUrls: ['./checkbox-payee.component.scss']
})
export class CheckboxPayeeComponent implements OnInit, OnDestroy {
  @Input() checkBoxPayeeList: PayeeListResponse[] = [] as PayeeListResponse[];
  @Input() preSelectedValue?: string;
  @Input() componentName: string;
  @Output() selectedOptionValue = new EventEmitter<PayeeListResponse>();
  readonly iconsConst = ICON;
  subscription$ = new Subscription();
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  activeOption: string;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.getSelectedLanguage();
   }

  /**
   * @methodName handleChange
   * @param account<PayeeListResponse> input<HTMLInputElement>
   * @description Used to emit selected payee value to parent component and set the active status to clicked element
   * @return none
   */
  handleChange(account: PayeeListResponse, input: HTMLInputElement): void {
    this.preSelectedValue = input.value;
    this.selectedOptionValue.emit(account);
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

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
