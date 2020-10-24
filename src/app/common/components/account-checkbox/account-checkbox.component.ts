import { Component, Input, Output, EventEmitter, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { AccountCheckBoxModel } from '../../models/global.model';
import { ARABIC_LANG_TEXT } from '../../global-constants';
import { ACCOUNTS_MASTER_DATA } from 'src/app/modules/dashboard/dashboard-module.constants';

@Component({
  selector: 'app-account-checkbox',
  templateUrl: './account-checkbox.component.html',
  styleUrls: ['./account-checkbox.component.scss']
})
export class AccountCheckBoxComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Input() checkBoxAccountsList: AccountCheckBoxModel[] = {} as AccountCheckBoxModel[];
  @Input() componentName: string;
  @Input() preSelectedValue?: string;
  @Output() selectedAccountOption = new EventEmitter<AccountCheckBoxModel>();

  subscription$ = new Subscription();
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  readonly ACCOUNTS_MASTER_DATA = ACCOUNTS_MASTER_DATA;

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

  ngAfterViewChecked() {
    this.handleSelectedItemClickEvent();
  }

  /**
   * @methodName handleChange
   * @param account<AccountCheckBoxModel> input<HTMLInputElement>
   * @description Used to emit the value to parent component and set the active status to clicked element
   * @return none
   */
  handleChange(account: AccountCheckBoxModel, input: HTMLInputElement): void {
    this.preSelectedValue = input.value;
    this.selectedAccountOption.emit(account);
  }

  /**
   * @methodName handleSelectedItemClickEvent
   * @parameter none
   * @description Used to trigger click event based on the UNIQUE_ID
   * @return none
   */
  handleSelectedItemClickEvent(): void {
    // it will select the option if passed from parent component
    const UNIQUE_ID = this.componentName + this.preSelectedValue;
    if (this.preSelectedValue && this.componentName && document.getElementById(UNIQUE_ID) &&
      !document.getElementById(UNIQUE_ID)['checked']) {
      document.getElementById(UNIQUE_ID).click();
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
