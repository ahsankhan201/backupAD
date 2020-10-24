import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalValuePipe } from '../pipes/decimal-value/decimal-value.pipe';
import { DocumentClickDirective } from '../directives/document-click.directive';
import { RouterModule } from '@angular/router';
import { FilterTextPipe } from '../pipes/filter-text/filter-text.pipe';
import { NumberDirective } from '../directives/numbers-only.directive';
import { NumberFormatPipe } from '../pipes/number-format/number-format.pipe';
import { AlphaNumericDirective } from '../directives/alpha-numeric.directive';
import { CopyClipboardDirective } from '../directives/copy-clipboard.directive';
import { CardNumberFormatPipe } from '../pipes/card-number-format/card-number-format.pipe';
import { ExpiryDateFormatPipe } from '../pipes/expiry-date-format/expiry-date-format.pipe';
import { MaskEmailPipe } from '../pipes/mask-email/mask-email-format.pipe';
import { NoWhitespaceDirective } from '../directives/no-whitespace.directive';
import { InputCommaDirective } from '../directives/input-comma.directive';

@NgModule({
    declarations: [
        DecimalValuePipe,
        DocumentClickDirective,
        FilterTextPipe,
        NumberDirective,
        NumberFormatPipe,
        AlphaNumericDirective,
        CopyClipboardDirective,
        NoWhitespaceDirective,
        CardNumberFormatPipe,
        ExpiryDateFormatPipe,
        MaskEmailPipe,
        InputCommaDirective
    ],
    imports: [
        CommonModule,
        RouterModule,
    ],

    exports: [
        FilterTextPipe,
        DecimalValuePipe,
        DocumentClickDirective,
        NumberDirective,
        NumberFormatPipe,
        AlphaNumericDirective,
        NoWhitespaceDirective,
        CopyClipboardDirective,
        CardNumberFormatPipe,
        ExpiryDateFormatPipe,
        MaskEmailPipe,
        InputCommaDirective
    ]
})
export class SharedDirectiveModule { }
