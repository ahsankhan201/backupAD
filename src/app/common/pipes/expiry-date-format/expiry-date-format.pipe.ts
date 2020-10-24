import { Pipe, PipeTransform } from '@angular/core';
import { EXPIRY_DATE_REGEX, EXPIRY_DATE_SEPARATOR } from '../../global-constants';

@Pipe({
  name: 'expiryDateFormat'
})
export class ExpiryDateFormatPipe implements PipeTransform {

  /**
   * @methodName transform
   * @description format expiry date in mm/yy format
   * @param value<string>
   * @return string
   */
  transform(value: string): string {
    if (value) {
      return value.match(EXPIRY_DATE_REGEX).join(EXPIRY_DATE_SEPARATOR);
    }
  }
}
