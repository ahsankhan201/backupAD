import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { PATTERN_NUMERIC, PATTERN_NUMERIC_WITH_DECIMAL, PATTERN_NUMERIC_WITH_DOT } from '../global-constants';
import { SharedService } from '../services/shared.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'input[numbersOnly]'
})
export class NumberDirective {
  @Input() decimals = 0;
  @Input() allowDot = false; // allow number with dot/decimal point only for DU-TV account number

  pattern = new RegExp(PATTERN_NUMERIC);
  constructor(private el: ElementRef, private sharedService: SharedService) { }

  @HostListener('keypress', ['$event']) onInputChange(event) {

    let current: string = String.fromCharCode(event.which);
    current = this.el.nativeElement.value;
    current = this.sharedService.removeCommaFromString(current); // remove commas
    if (this.decimals > 0 || this.allowDot) {
      this.pattern = (this.allowDot) ? new RegExp(PATTERN_NUMERIC_WITH_DOT) : new RegExp(PATTERN_NUMERIC_WITH_DECIMAL);
      const position = current.length;
      const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
      if (next && !String(next).match(this.pattern)) {
        event.preventDefault();
      }
    } else {
      if (!this.pattern.test(current)) {
        event.preventDefault();
      }
    }
  }
}

