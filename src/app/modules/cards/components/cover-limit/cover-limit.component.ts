import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { CardsService } from '../../services/cards.service';
import { Subscription } from 'rxjs';

import { SharedService } from 'src/app/common/services/shared.service';
import { NAV_CONTROLS, SNACKBAR_MESSAGETYPE } from 'src/app/common/global-constants';
import { COVER_LIMIT_COMPONENT_TEXT,
  MIN_COVER_CARD_LIMIT, MUST_BE_MORE_THAN_TEXT, NEW_COVER_LIMIT_TEXT } from '../../cards-module.constants';
import { RANGE_SLIDER_FORMATE_LABEL, OTP_COMPONENT_TEXT, SUCCESS_SCREEN_COMPONENT_TEXT } from '../../cards-module.constants';
import { CARDS_MASTER_DATA, COVER_LIMIT_HORIZONTAL_LINE_CLASS_NAME, MUST_BE_LESS_THAN_TEXT } from '../../cards-module.constants';
import { OTPResponse } from 'src/app/common/models/otp.model';
import { DebitCardData, ChangeCoverCardLimitPayload } from 'src/app/common/models/cards-module.model';

@Component({
  selector: 'app-cover-limit',
  templateUrl: './cover-limit.component.html',
  styleUrls: ['./cover-limit.component.scss']
})
export class CoverLimitComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  @Output() backButtonClicked = new EventEmitter<boolean|string>(false);
  readonly NAV_CONTROLS = NAV_CONTROLS;
  cardNumber: string;
  coverLimitAmount: number;
  min: number;
  max: number;
  location: string;
  coverCardsDetails: DebitCardData;
  selectedCoverCardData: any;
  currentCoverLimit: number;
  newCoverLimit: number;
  showComponent = COVER_LIMIT_COMPONENT_TEXT;
  minCoverLimit = MIN_COVER_CARD_LIMIT;
  coverCardLimitForm: FormGroup;
  constructor(
    private sharedService: SharedService,
    private cardsService: CardsService,
    private formBuilder: FormBuilder
     ) {
      this.createCoverCardLimitForm();
  }

ngOnInit() {
  this.updateHorizontalLineStyle();
  this.setCoverCardLimit();
}

/**
 * @methodName createCoverCardLimitForm
 * @description used to create cover card limit form
 * @parameters none
 * @return none
 */
createCoverCardLimitForm(): void {
  this.coverCardLimitForm = this.formBuilder.group({
    newCoverLimit: [''],
    oldCoverLimit: [this.currentCoverLimit],
  });
}

/**
 * @methodName updateHorizontalLineStyle
 * @description used to update horizontal line CSS
 * @parameters none
 * @return none
 */
updateHorizontalLineStyle(): void {
  this.sharedService.setHorizontalLineClass(COVER_LIMIT_HORIZONTAL_LINE_CLASS_NAME);
}

/**
 * @methodName setCoverCardLimit
 * @description used to set cover card Limit values cardNumber, currentCoverLimit
 * @parameters none
 * @return none
 */
setCoverCardLimit(): void {
  this.selectedCoverCardData = {};
  this.selectedCoverCardData  = this.cardsService.getSelectedCoverCard();
  if (this.selectedCoverCardData) {
    const coverAmount: number = parseInt(this.selectedCoverCardData.availableLimit, 10);
    this.cardNumber = this.selectedCoverCardData.cardNumber;
    this.currentCoverLimit = coverAmount;
    this.newCoverLimit = coverAmount;
    this.coverCardLimitForm.get(NEW_COVER_LIMIT_TEXT).setValue(this.newCoverLimit);
    this.coverCardLimitForm.get(NEW_COVER_LIMIT_TEXT)
    .setValidators([Validators.required,
      Validators.min(Number(this.minCoverLimit)),
      Validators.max(this.currentCoverLimit)]);
    this.handleNewCoverLimitChange();
    this.coverCardLimitForm.updateValueAndValidity();
  }
}

/**
 * @methodName onBackButtonClicked
 * @description used to emit backButtonClicked
 * @parameters none
 * @return none
 */
onBackButtonClicked(): void {
  this.sharedService.setHorizontalLineClass(undefined);
  this.backButtonClicked.emit(CARDS_MASTER_DATA.COVER_CARD_DETAILS);
}

/**
 * @methodName formatRangeSliderLabel
 * @description used to return range slider label text
 * @parameters value<number>
 * @return string
 */
formatRangeSliderLabel(value: number): string {
  return RANGE_SLIDER_FORMATE_LABEL + value ;
}

/**
 * @methodName handleConfirmWithOTP
 * @description used to handle confirmWithOTP button and function will call api to update card limit
 * @parameters none
 * @return none
 */
handleConfirmWithOTP(): void {
  const coverCardLimitPayload = {} as ChangeCoverCardLimitPayload;
  coverCardLimitPayload.cardNumber = this.cardNumber;
  coverCardLimitPayload.newLimit = this.newCoverLimit.toString();
  coverCardLimitPayload.oldLimit = this.currentCoverLimit.toString();
  coverCardLimitPayload.mobileNumber = this.sharedService.customerBasicDetails.mobile;
  // API call to update cover card limit
  this.cardsService.updateCoverCardLimit(coverCardLimitPayload).subscribe( response => {
    if (response && response.location) {
      this.location = response.location;
      this.showComponent = OTP_COMPONENT_TEXT;
    } else {
      this.location = null;
      this.showComponent = SUCCESS_SCREEN_COMPONENT_TEXT;
      this.updateAccountAndCards();
    }
  });
}

  /**
   * @methodName updateAccountAndCards
   * @parameter none
   * @description used to update the accounts and cards list
   * @return none
   */
  updateAccountAndCards(): void {
    this.subscription$.add(this.sharedService.setAccontsCardsList().subscribe(response => {
      if (response) {
        this.sharedService.accountsCardsList = JSON.parse(response.toString());
        this.sharedService.getAllCardsList();
        this.updateCoverCardDetailsData();
      }
    }));
  }
/**
 * @methodName resendOTPRequired
 * @param resendOTP <boolean>
 * @description Used to resend OTP Location details
 * @return none
 */
resendOTPRequired(resendOTP: boolean): void {
  if (resendOTP) {
    this.handleConfirmWithOTP();
  }
}

/**
 * @methodName getOTPResponse
 * @param otpResponseObj<OTPResponse>
 * @description Used to fetch or post the OTP info to CIAM
 * @return none
 */
getOTPResponse(otpResponseObj: OTPResponse): void {
  if (otpResponseObj && otpResponseObj.success) {
    this.handleConfirmWithOTP();
  }
}

/**
 * @methodName handleSuccessScreenBackButtonClick
 * @description used to fetch success screen back button click
 * @parameters clickStatus<boolean>
 * @return none
 */
handleSuccessScreenBackButtonClick(clickStatus: boolean): void {
  if (clickStatus) {
    this.onBackButtonClicked();
  }
}

/**
 * @methodName handleNewCoverLimitChange
 * @description used to change new cover limit
 * @parameters none
 * @return none
 */
handleNewCoverLimitChange(): void {
  const CURRENCY_CODE = this.selectedCoverCardData.currencyCode;
  this.coverCardLimitForm.get(NEW_COVER_LIMIT_TEXT).valueChanges.subscribe(
    newCoverLimit => {
      if (this.coverCardLimitForm.get(NEW_COVER_LIMIT_TEXT).hasError('min')) {
        this.coverCardLimitForm.get(NEW_COVER_LIMIT_TEXT)
        .setErrors({ min: { message: `${CURRENCY_CODE} ${ this.minCoverLimit }` } });
      }
      if (this.coverCardLimitForm.get(NEW_COVER_LIMIT_TEXT).hasError('max')) {
        this.coverCardLimitForm.get(NEW_COVER_LIMIT_TEXT)
        .setErrors({ max: { message : `${ CURRENCY_CODE } ${ this.currentCoverLimit }` } });
      }
    }
  );
  this.coverCardLimitForm.updateValueAndValidity();
}

/**
 * @methodName updateCoverCardDetailsData
 * @parameter none
 * @description used to update CoverCardDetailsData after the response from setAccontsCardsList()
 * @return none
 */
updateCoverCardDetailsData(): void {
  if (this.selectedCoverCardData && this.sharedService.accountsCardsList) {
    const SELECTED_COVER_CARD = this.sharedService.coverCardData.find(coverCard => coverCard.cardNumber
      === this.selectedCoverCardData.cardNumber);
    this.cardsService.setSelectedCoverCard(SELECTED_COVER_CARD);
  }
}

ngOnDestroy() {
  this.subscription$.unsubscribe();
}

}
