import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// include services
import { APISyncService } from 'src/app/common/services/sync.service';
import { SharedService } from 'src/app/common/services/shared.service';

// include model and constants
import { BeneficiaryListResponse } from '../../../common/models/beneficiary.model';
import { TRANSFER_PAYMENT_CONST, DOMAINS } from '../../../common/global-constants';
import { EditPayeePayload } from '../../../common/models/payee.model';
import { RestrictedWordsList } from 'src/app/common/models/beneficiary-module.model';
import { BENEFICIARY_ENDPOINTS } from 'src/app/common/api-endpoints';


@Injectable({
  providedIn: 'root'
})
export class TransfersPaymentsService {
  constructor(
    private syncService: APISyncService,
    private sharedService: SharedService
  ) { }
  /**
   * @methodName getAccountList
   * @description used to fetch the accounts info from the server
   * @parameters url<string>
   * @return Observable
   */
  getAccountList(url: string): Observable<any> {
    return this.syncService.get(url);
  }

  /**
   * @methodName updateBeneficiaryAsFav
   * @description update beneficiary as favourite
   * @parameters url<string> payload<any>
   * @return Observable
   */
  updateBeneficiaryAsFav(url: string, payload: any): Observable<any> {
    return this.syncService.put(url, payload);
  }

  /**
   * @methodName changeFavorite
   * @description get favorite status and swap it.
   * @parameters status
   * @return opposit status<string>
   */
  changeFavorite(status: string): string {
    return status === 'Y' ? 'N' : 'Y';
  }

  /**
   * @methodName getFavoriteList
   * @description get array of Beneficiar/Payee type and filter the favorite data
   * @parameters listItems<array>
   * @return favorite listItems<array>
   */
  getFavoriteList(listItems: BeneficiaryListResponse[]): BeneficiaryListResponse[] {
    if (listItems.length) {
      let favoriteItem = listItems.filter(item => (item && item.isFavourite === TRANSFER_PAYMENT_CONST.favoriteAttribute));
      if (favoriteItem.length < TRANSFER_PAYMENT_CONST.itemLimit) {
        let selectedItem = [];
        const UNFAVORITEITEM = listItems.filter(item => (item && item.isFavourite === TRANSFER_PAYMENT_CONST.unFavoriteeAttribute));
        const REMAININGITEM = TRANSFER_PAYMENT_CONST.itemLimit - favoriteItem.length;
        selectedItem = UNFAVORITEITEM.splice(0, REMAININGITEM);
        return favoriteItem = [...favoriteItem, ...selectedItem];
      } else {
        return favoriteItem = favoriteItem.splice(0, TRANSFER_PAYMENT_CONST.itemLimit);
      }
    }
  }
  /** @methodName editPayeeNickName
   * @methodName deleteBeneficiary
   * @description delete beneficiary using customerPayeeID
   * @param payee<BeneficiaryListResponse>
   * @return Observable
   */

  deleteUtility(deleteUtilityURL: string): Observable<any> {
    return this.syncService.delete(deleteUtilityURL);
  }

  /* @methodName editPayeeNickName
   * @description edit payee nick name
   * @parameter payloadObj<EditPayeePayload>
   * @return none
   */
  // Return type to be changed after API integration
  editPayeeNickName(url: string, payloadObj: EditPayeePayload): Observable<any> {
    return this.syncService.put(url, payloadObj);
  }

  /**
   * @methodName getRestricWordsList
   * @description used to fetch all the restrict words list from sever
   * @parameter none
   * @return observable object
   */

  getRestricWordsList(): Observable<RestrictedWordsList> {
    const URL = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) + BENEFICIARY_ENDPOINTS.GET_RESTRICT_WORDS_LIST;
    return this.syncService.get(URL);
  }
}
