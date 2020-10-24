import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CheckBoxEmittedObj, ImageCheckBoxObj } from '../../models/payee.model';
import { ARABIC_LANG_TEXT } from '../../global-constants';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-checkbox-with-image',
  templateUrl: './checkbox-with-image.component.html',
  styleUrls: ['./checkbox-with-image.component.scss']
})
export class CheckboxWithImageComponent implements OnInit {
  @Input() cardOptionsList: ImageCheckBoxObj[];
  @Input() componentName: string;
  @Input() emitSelectedEleID?: boolean;
  @Input() titleColor?: string;
  @Output() selectedCardValue = new EventEmitter<CheckBoxEmittedObj>();

  activeOption: string;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private sharedService: SharedService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.getSelectedLanguage();
  }
  /**
   * @methodName handleChange
   * @param event<Event>
   * @description Used to emit the value to parent component
   * @return none
   */
  handleChange(event, checkBox): void {
    checkBox.checked = true;
    this.activeOption = checkBox.value;
    this.emitSelectedEleID ? this.selectedCardValue.emit({ value: checkBox.value, id: checkBox.id }) :
      this.selectedCardValue.emit(checkBox.id);
    event.stopPropagation();
  }

  /**
   * @methodName getSelectedLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getSelectedLanguage(): void {
    this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLanguage = selectedLanguage;
    });
  }
}
