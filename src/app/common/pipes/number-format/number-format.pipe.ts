import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { NUMBER_FORMAT_REGEX } from '../../global-constants';

@Pipe({
  name: 'numberFormat'
})
@Injectable({
  providedIn: 'root'
})

export class NumberFormatPipe implements PipeTransform {
  /**
   * @methodName transform
   * @description used format the number with comma seperated
   * @param value<string> | <number>
   * @return string
   */
  transform(value: string | number): string {
    let formattedValue;
    if (value || value === 0) {
      const data = value.toString();
      if (data) {
        formattedValue = parseInt(data, 0);
        formattedValue = formattedValue.toString().replace(NUMBER_FORMAT_REGEX, ',');
      }
    } else {
      formattedValue = 0;
    }
    return formattedValue;
  }
}
