import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APISyncService } from 'src/app/common/services/sync.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { FINANCE_PROMOTION_JSON, FINANCE_ENDPOINTS } from 'src/app/common/api-endpoints';
import { FinanceData, FinanceDetails, FinancePromotionAd, FinanceDetailsPayload } from 'src/app/common/models/finance-module.model';
import { DOMAINS, SLASH } from 'src/app/common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  selectedFinanceAccount = {} as FinanceData ;
  financeDetails = [] as FinanceData[];
  constructor(private syncService: APISyncService, private sharedService: SharedService) { }

  /**
   * @methodName getFinancePromotion
   * @description used to fetch the finance Ads from the server
   * @parameters none
   * @return Observable<FinancePromotionAd>
   */
  getFinancePromotion(): Observable<FinancePromotionAd> {
    const URL = FINANCE_PROMOTION_JSON;
    return this.syncService.get(URL, 'json');
  }

  /**
   * @methodName getFinanceDetails
   * @description used to fetch finance details
   * @parameters payloadObj<FinanceDetailsPayload>
   * @return Observable<FinanceDetails>
   */
  getFinanceDetails(payloadObj: FinanceDetailsPayload): Observable<FinanceDetails> {
    const FINANCE_DETAILS_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) + FINANCE_ENDPOINTS.FINANCE_DETAILS
    + SLASH + payloadObj.aliasId;
    return this.syncService.get(FINANCE_DETAILS_API, undefined, undefined, this.sharedService.removeKeyFromObject('aliasId', payloadObj))
    .pipe( map( res => res.body ? JSON.parse(res.body) : res));
  }

  /**
   * @methodName setSelectedFinanceAccount
   * @description used to set selected finance account
   * @parameters financeData<FinanceData>
   * @return void
   */
  setSelectedFinanceAccount(financeData: FinanceData): void {
    this.selectedFinanceAccount  = financeData;
  }

  /**
   * @methodName getselectedFinanceAccount
   * @description used to fetch selected finance account
   * @parameters none
   * @return FinanceData
   */
  getSelectedFinanceAccount(): FinanceData {
    return this.selectedFinanceAccount;
  }
}
