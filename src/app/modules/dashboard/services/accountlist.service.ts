import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Include services here
import { APISyncService } from 'src/app/common/services/sync.service';
import { AccountsList } from 'src/app/common/models/global.model';

@Injectable({
  providedIn: 'root'
})
export class AccountlistService {

  public accountDetailData: AccountsList;
  constructor(private syncService: APISyncService) { }
  /**
   * @methodName getAccountList
   * @description used to fetch the accounts info from the server
   * @parameters url<string>
   * @return none
   */
  getAccountList(url: string): Observable<any> {
    return this.syncService.get(url);
  }

 /** @methodName getJsonList
  * @description used to fetch the accounts info from the local file
  * @parameters url<string>
  * @return none
  */
 getJsonList(url: string): Observable<any> {
   return this.syncService.get(url, 'json');
 }
  /**
   * @methodName addCoverCardToAccountList
   * @description used to push the cover card into accounts list array
   * @parameters accountsInfo[]<Object>, coverCardInfo<Object>
   * @return none
   */
  addCoverCardToAccountList(accountsInfo, coverCardInfo): any {
    if (accountsInfo.length && accountsInfo.length >= 4 && Object.keys(coverCardInfo).length) {
      accountsInfo.splice(3, 0, coverCardInfo);
    } else if (Object.keys(coverCardInfo).length && accountsInfo.length) {
      accountsInfo.push(coverCardInfo);
    }
    return accountsInfo;
  }
}
