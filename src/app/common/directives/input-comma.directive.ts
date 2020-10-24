import { Directive, HostListener } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { THREE_DIGITS_COMMA_REGEX } from '../global-constants';

@Directive({
  selector: 'input[appInputWithComma]',
})
export class InputCommaDirective {
  constructor(private sharedService: SharedService) { }

  @HostListener('focusout', ['$event']) onInputChange(event) {
    let value = event.target.value;
    if (event.target.value) {
      value = this.sharedService.removeCommaFromString(value); // remove commas
      value = value.toString().replace(THREE_DIGITS_COMMA_REGEX, ',');
    }
    event.target.value = value;
  }
}
