import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LinkAccountCheckBox } from '../../models/cards-module.model';

@Component({
  selector: 'app-checkbox-with-account',
  templateUrl: './checkbox-with-account.component.html',
  styleUrls: ['./checkbox-with-account.component.scss']
})
export class CheckboxWithAccountComponent implements OnInit {
  @Input() accountsList: LinkAccountCheckBox[];
  @Input() componentName: string;
  @Input() inputType: string;
  @Input() selectedValue?: string;
  @Output() selectedOptionValue = new EventEmitter<LinkAccountCheckBox>();

  activeOption: string;

  constructor() { }

  ngOnInit() {
  }

  /**
   * @methodName handleChange
   * @param account<LinkAccountCheckBox>, input<HTMLInputElement>
   * @description Used to emit the value to parent component and set the active status to clicked element
   * @return none
   */
  handleChange(account: LinkAccountCheckBox, input: HTMLInputElement): void {
    this.selectedValue = input.value;
    this.selectedOptionValue.emit(account);
  }
}
