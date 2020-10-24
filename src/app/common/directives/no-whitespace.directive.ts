import { Directive, HostListener } from '@angular/core';
import { PATTERN_NO_WHITESPACE } from '../global-constants';

@Directive({
    selector: 'input[appNoWhitespace]',
})
export class NoWhitespaceDirective {
    @HostListener('keypress', ['$event']) onInputChange(event) {
        const PATTERN = PATTERN_NO_WHITESPACE;
        const REGEXP_PATTERN = new RegExp(PATTERN);
        const VALUE = String.fromCharCode(event.which);
        if (!REGEXP_PATTERN.test(VALUE)) {
            event.preventDefault();
        }
    }
}
