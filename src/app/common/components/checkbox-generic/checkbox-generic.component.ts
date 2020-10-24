import { Component, Input, Output, EventEmitter, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CheckBoxEmittedObj } from '../../models/payee.model';
import { ARABIC_LANG_TEXT } from '../../global-constants';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-checkbox-generic',
  templateUrl: './checkbox-generic.component.html',
  styleUrls: ['./checkbox-generic.component.scss']
})
export class CheckboxGenericComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Input() optionsList: CheckBoxEmittedObj[];
  @Input() componentName: string;
  @Input() emitSelectedEleID?: boolean;
  @Output() selectedOptionValue = new EventEmitter<CheckBoxEmittedObj | string>();
  @Input() customClassName: string;
  @Input() preSelectedOption?: string;
  @Input() disabledOption?: string;
  @Input() hiddenOption?: string;

  subscription$ = new Subscription();
  activeOption: string;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private sharedService: SharedService) { }

  ngOnInit() {
    this.getSelectedLanguage();
  }


  ngAfterViewChecked() {
    this.handleSelectedItemClickEvent();
  }

  /**
   * @methodName handleChange
   * @param event<Event>
   * @description Used to emit the value to parent component and set the active status to clicked element
   * @return none
   */
  handleChange(event: Event, checkBox: HTMLInputElement, item: CheckBoxEmittedObj): void {
    this.preSelectedOption = item.id;
    checkBox.checked = true; // restricted emiting multiple times for same value
    this.emitSelectedEleID ? this.selectedOptionValue.emit({ value: checkBox.value, id: item.id }) :
      this.selectedOptionValue.emit(item.id);
    event.stopPropagation();
  }

  /**
   * @methodName handleSelectedItemClickEvent
   * @parameter none
   * @description Used to trigger click event based on the UNIQUE_ID
   * @return none
   */
  handleSelectedItemClickEvent(): void {
    // it will select the option if passed from parent component
    const UNIQUE_ID = this.componentName + this.preSelectedOption;
    if (this.preSelectedOption && this.componentName && document.getElementById(UNIQUE_ID) &&
      !document.getElementById(UNIQUE_ID)['checked']) {
      document.getElementById(UNIQUE_ID).click();
    }
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
