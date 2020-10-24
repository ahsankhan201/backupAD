import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'getDecimalValue'
})
@Injectable({
  providedIn: 'root'
})
export class DecimalValuePipe implements PipeTransform {

  transform(value: number | string): string {
    let decimalNumber = value ? Number(value).toFixed(2).toString().split('.') : '0';
    decimalNumber = decimalNumber.length >= 2 ? decimalNumber[1] : '00';
    return decimalNumber;
  }

}
