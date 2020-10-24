import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public isHidden = new BehaviorSubject<boolean>(false);
  isHiddenObservable = this.isHidden.asObservable();
  configJson: any = {};
  user: any = {};
  totalAvailableFunds: any = {};

  constructor() { }

/**
 * @methodName changeValue
 * @description used to update BehaviorSubject for available funds status
 * @parameters none
 * @return none
 */

  changeValue(data): void {
    this.isHidden.next(data);
  }

/**
 * @methodName availableFundsStatus
 * @description used to subscribe  availableFundsStatus as BehaviorSubject
 * @parameters none
 * @return boolean
 */

  availableFundsStatus(): BehaviorSubject<boolean> {
    return this.isHidden;
  }

}
