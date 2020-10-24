import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { DonationCheckBox, DonationCheckBoxItem } from '../../models/payment.model';
import { ARABIC_LANG_TEXT } from '../../global-constants';

@Component({
  selector: 'app-checkbox-generic-charity',
  templateUrl: './checkbox-generic-charity.component.html',
  styleUrls: ['./checkbox-generic-charity.component.scss']
})
export class CheckboxGenericCharityComponent implements OnInit, OnDestroy {
  @Input() optionsList = [] as DonationCheckBox[];
  @Input() componentName: string;
  @Output() selectedOptionValue = new EventEmitter<DonationCheckBoxItem | string>();
  @Input() customClassName: string;
  @Input() preSelectedOption?: string;

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
   * @param event<Event>, selectedOptionValue<DonationCheckBoxItem>, checkBox<HTMLInputElement>
   * @description Used to emit the value to parent component and set the active status to clicked element
   * @return none
   */
  handleChange(event: Event, selectedOptionValue: DonationCheckBoxItem, checkBox: HTMLInputElement): void {
    this.preSelectedOption = checkBox.id;
    this.selectedOptionValue.emit(selectedOptionValue);
    event.stopPropagation();
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
