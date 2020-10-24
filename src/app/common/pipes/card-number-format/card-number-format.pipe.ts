import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { VISIBLE_DIGITS, MASK_TYPE, MASK_NUMBER_REGEX, NUMBER_GROUP_REGEX } from '../../global-constants';

@Pipe({
  name: 'formatMaskCardNumber'
})

@Injectable({
  providedIn: 'root'
})
export class CardNumberFormatPipe implements PipeTransform {

  /**
   * @methodName transform
   * @description mask the card number in group of 4 and show only last three digits
   * @param value<string>
   * @return string
   */
  transform(value: string): string {
    if (value) {
      const maskedSection = value.slice(0, -VISIBLE_DIGITS);
      const visibleSection = value.slice(-VISIBLE_DIGITS);
      let cardNumber = maskedSection.replace(MASK_NUMBER_REGEX, MASK_TYPE) + visibleSection;
      cardNumber = cardNumber.match(NUMBER_GROUP_REGEX).join(' ');
      return cardNumber;
    }
  }
}
