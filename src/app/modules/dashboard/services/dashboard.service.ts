import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { APISyncService } from 'src/app/common/services/sync.service';
import { AccountsList } from 'src/app/common/models/global.model';
import { AccountStatementPayload } from 'src/app/common/models/accounts-module.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  changePaymentsView$ = new BehaviorSubject(undefined);
  constructor(
    private httpService: APISyncService,
  ) { }


  /**
   * @methodName setPaymentSummaryDetails
   * @parameter transferDetails<PaymentTransferDetails>
   * @description used to dispatch the transfer details to it's subscribers
   * @return none
   */
  toggleDashBoardPaymentsView(selectedAccount: AccountsList, typeOfView?: string): void {
    this.changePaymentsView$.next(selectedAccount ? { account: selectedAccount, viewType: typeOfView } : selectedAccount);
  }
  /**
   * @methodName getDashBoardPaymentsViewSubject
   * @parameter none
   * @description It'll dispatch the outstanding balance details
   * @return Observable<PaymentTransferDetails>
   */
  getDashBoardPaymentsViewSubject(): Observable<AccountsList> {
    return this.changePaymentsView$.asObservable();
  }

  /**
   * @methodName generateAccountStatement
   * @description used to generate account statement
   * @parameter url<string> payload<AccountStatementPayload>
   * @return Observable<AccountStatementPayload>
   */
  generateAccountStatement(url: string, payloadObj: AccountStatementPayload): Observable<any> {
    return this.httpService.post(url, payloadObj, 'blob');
  }
}
