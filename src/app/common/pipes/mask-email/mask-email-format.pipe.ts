import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskEmail'
})
export class MaskEmailPipe implements PipeTransform {

  /**
   * @methodName transform
   * @description mask the email id like m*****l@domain.com
   * @param value<string>
   * @return string
   */
  transform(emailId: string): string {
    if (emailId) {
      const lastIndex = emailId.lastIndexOf('@');
      const prefix = emailId.substring(0, lastIndex);
      const postfix = emailId.substring(lastIndex);

      const mask = prefix.split('').map((value, index) => {
        if (index === 0 || index === (lastIndex - 1)) {
          return value;
        } else {
          return '*';
        }
      }).join('');

      return mask + postfix;
    }
  }
}
