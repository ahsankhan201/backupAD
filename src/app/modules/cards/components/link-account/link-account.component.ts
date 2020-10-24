import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { SharedService } from 'src/app/common/services/shared.service';
import { CardsService } from '../../services/cards.service';

import {
  LinkAccountCheckBox, LinkAccountSuccessScreen,
  LinkDebitCardAccountPayLoad, DebitCardData, LinkAccountDetails
} from 'src/app/common/models/cards-module.model';
import { ACCOUNT_ALLOWED_TYPE_LIST, ALLOWED_DEBITCARD_LINKING_ACCOUNTS, DOMAINS, HTTP_STATUS_CODE } from 'src/app/common/global-constants';
import { LINK_DEBITCARD_ACCOUNT_TEXT, LINK_ACCOUNT_DIVIDER_LINE_CLASS } from '../../cards-module.constants';
import { CHANGE_CARD_PRIMARY_ACCOUNT } from 'src/app/common/api-endpoints';
import { CardNumberFormatPipe } from 'src/app/common/pipes/card-number-format/card-number-format.pipe';

@Component({
  selector: 'app-link-account',
  templateUrl: './link-account.component.html',
  styleUrls: ['./link-account.component.scss']
})
export class LinkAccountComponent implements OnInit, OnDestroy {
  @Input() linkedAccount: string;
  @Input() debitcardDetails: DebitCardData;
  @Output() backButtonClicked = new EventEmitter<boolean>(false);

  enableDoneBtn = false;
  showSuccessScreen = false;

  accountsList: LinkAccountCheckBox[] = [];
  successScreenDetails = {} as LinkAccountSuccessScreen;
  selectedAccountDetails = {} as LinkAccountCheckBox;
  constructor(
    private sharedService: SharedService,
    private cardService: CardsService,
    private cardMaskFormat: CardNumberFormatPipe) { }

  ngOnInit() {
    this.generateLinkAccountsList();
    this.sharedService.setHorizontalLineClass(LINK_ACCOUNT_DIVIDER_LINE_CLASS.LINK_ACC);
  }

  /**
   * @methodName selectedAccount
   * @description used for getting selected account
   * @parameters selectedAccount<LinkAccountCheckBox>
   * @return none
   */
  selectedAccount(selectedAccount: LinkAccountCheckBox): void {
    this.selectedAccountDetails = selectedAccount;
    selectedAccount.id !== this.linkedAccount ? this.enableDoneBtn = true : this.enableDoneBtn = false;
  }

  /**
   * @methodName generateLinkAccountsList
   * @description used for populating link accounts list
   * @parameters none
   * @return none
   */
  generateLinkAccountsList(): void {
    if (this.sharedService.accountsCardsList && this.sharedService.accountsCardsList.accountsList) {
      this.sharedService.accountsCardsList.accountsList.forEach((account) => {
        if (account.status === LINK_DEBITCARD_ACCOUNT_TEXT.ACTIVE &&
          ALLOWED_DEBITCARD_LINKING_ACCOUNTS.indexOf(account.accountType) > -1) {
          const linkAccountModel = {} as LinkAccountCheckBox;
          linkAccountModel.id = account.accountNumber;
          linkAccountModel.title = ACCOUNT_ALLOWED_TYPE_LIST[account.accountType];
          linkAccountModel.description = account.accountNumber;
          linkAccountModel.branchCode = account.branchCode;
          linkAccountModel.accountType = account.accountType;
          this.accountsList.push(linkAccountModel);
        }
      });
    }
  }

  /**
   * @methodName linkAccountCancelBtnClick
   * @description used to emit back button click action to parent component
   * @parameters none
   * @return none
   */
  linkAccountCancelBtnClick(): void {
    this.backButtonClicked.emit(true);
  }

  /**
   * @methodName goToCardDetails
   * @description used to emit back button click action to parent component
   * @parameters none
   * @return none
   */
  goToCardDetails(): void {
    const selectedDebitCard = this.cardService.getSelectedDebitCard();
    selectedDebitCard.primaryAccountNumber = this.selectedAccountDetails.id;
    this.backButtonClicked.emit(true);
  }

  /**
   * @methodName changeDebitCardLinkAccount
   * @description used to change the debit card link account on server
   * @parameters none
   * @return none
   */
  changeDebitCardLinkAccount(): void {
    const API_END_URL = `${this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)}${CHANGE_CARD_PRIMARY_ACCOUNT}`;
    this.cardService.postDebitCardLinkAccPayLoad(API_END_URL, this.setLinkAccontPayLoad()).subscribe((response) => {
      if (response.status === HTTP_STATUS_CODE.NO_CONTENT) {
        this.setSuccessScreenInfo();
        this.showSuccessScreen = true;
      }
    });
  }

  /**
   * @methodName setLinkAccontPayLoad
   * @description used to set link account payload
   * @parameters none
   * @return LinkDebitCardAccountPayLoad
   */
  setLinkAccontPayLoad(): LinkDebitCardAccountPayLoad {
    const linkAccountPayLoad = {} as LinkDebitCardAccountPayLoad;
    linkAccountPayLoad.cardNumber = this.debitcardDetails.cardNumber;
    linkAccountPayLoad.mobileNumber = this.sharedService.customerBasicDetails.mobile;
    linkAccountPayLoad.currentPrimaryAccount = {} as LinkAccountDetails;
    linkAccountPayLoad.currentPrimaryAccount.accountNumber = this.linkedAccount;
    linkAccountPayLoad.currentPrimaryAccount.accountType = this.getSelectedAccountType();
    linkAccountPayLoad.currentPrimaryAccount.isNew = 'No';
    linkAccountPayLoad.newPrimaryAccount = {} as LinkAccountDetails;
    linkAccountPayLoad.newPrimaryAccount.accountNumber = this.selectedAccountDetails.id;
    linkAccountPayLoad.newPrimaryAccount.accountType = this.selectedAccountDetails.accountType;
    linkAccountPayLoad.newPrimaryAccount.isNew = 'No';
    return linkAccountPayLoad;
  }

  /**
   * @methodName getSelectedAccountType
   * @description it will return the selected account type
   * @parameters none
   * @return string
   */
  getSelectedAccountType(): string {
    let accountType: string;
    this.accountsList.forEach((ele) => {
      if (ele.id === this.selectedAccountDetails.id) {
        accountType = this.selectedAccountDetails.accountType;
      }
    });
    return accountType;
  }

  /**
   * @methodName setSuccessScreenInfo
   * @description used to set the success screen details
   * @parameters none
   * @return none
   */
  setSuccessScreenInfo() {
    this.sharedService.setHorizontalLineClass(LINK_ACCOUNT_DIVIDER_LINE_CLASS.LINK_ACC_SUCCESS);
    this.successScreenDetails = {
      accountNumber: this.selectedAccountDetails.id,
      debitCardNumber: this.cardMaskFormat.transform(this.debitcardDetails.cardNumber),
      componentTitle: LINK_DEBITCARD_ACCOUNT_TEXT.componentTitle
    };
  }

  ngOnDestroy() {
    this.sharedService.setHorizontalLineClass(undefined);
  }
}
