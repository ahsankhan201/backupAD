import { Directive, HostListener, Input } from '@angular/core';
import { PATTERN_ALPHA_NUMERIC, PATTERN_ALPHA_NUMERIC_WITHOUT_SPACE } from '../global-constants';

@Directive({
  selector: 'input[appAlphaNumeric]',
})
export class AlphaNumericDirective {
  @Input() allowSpace = true;
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const PATTERN  = (this.allowSpace) ? PATTERN_ALPHA_NUMERIC : PATTERN_ALPHA_NUMERIC_WITHOUT_SPACE;
    const REGEXP_PATTERN = new RegExp(PATTERN);
    const VALUE = String.fromCharCode(event.which);
    if (!REGEXP_PATTERN.test(VALUE)) {
      event.preventDefault();
    }
  }
}

