import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/common/services/shared.service';
import { CardsService } from '../../services/cards.service';
import { CARDS_MASTER_DATA } from '../../cards-module.constants';
import { NAV_CONTROLS, E_STATEMENT_DIALOG_DATA, SNACKBAR_MESSAGETYPE, DOMAINS, HTTP_STATUS_CODE } from 'src/app/common/global-constants';
import { DebitCardData } from 'src/app/common/models/cards-module.model';
import { MatSelectChange } from '@angular/material/select';
import { OTPResponse } from 'src/app/common/models/otp.model';
import { DEBIT_CARD_STATUS_API_URL } from 'src/app/common/api-endpoints';

@Component({
  selector: 'app-activate-card',
  templateUrl: './activate-card.component.html',
  styleUrls: ['./activate-card.component.scss']
})
export class ActivateCardComponent implements OnInit, OnDestroy {
  @Output() backButtonClicked = new EventEmitter<boolean>(false);
  readonly CARDS_MASTER_DATA = CARDS_MASTER_DATA;
  subscription$ = new Subscription();
  cardDetails: DebitCardData;
  monthsList = [];
  yearsList = [];
  activateCardFormGroup: FormGroup;
  selectedMonth: string;
  selectedYear: string;
  currentMonth: string;
  currentYear: number;
  selectedExpiryDate: string;
  showOTPScreen: boolean;
  location: string;
  showSuccessScreen: boolean;
  alertMessage: string;
  constructor(
    private sharedService: SharedService,
    private cardsService: CardsService,
    private formBuilder: FormBuilder) {
    this.sharedService.setHorizontalLineClass(NAV_CONTROLS.CHANGE_PASSWORD_DIVIDER_CLASS);
  }

  ngOnInit() {
    this.setComponentInitialData();
  }

  /**
   * @methodName setComponentInitialData
   * @parameter none
   * @description used to set the component initial data
   * @return none
   */
  setComponentInitialData(): void {
    this.cardDetails = this.cardsService.selectedNewCard;
    this.createActivateCardForm();
    this.getMonthsYearsList();
  }

  /**
   * @methodName createActivateCardForm
   * @parameter none
   * @description used to create the finance enquiry form group
   * @return none
   */
  createActivateCardForm(): void {
    this.activateCardFormGroup = this.formBuilder.group({
      months: ['', [Validators.required]],
      years: ['', [Validators.required]]
    });
  }

  /**
   * @methodName getMonthsYearsList
   * @parameter none
   * @description used to get months and years list
   * @return none
   */
  getMonthsYearsList() {
    const currentDate = new Date();
    this.currentMonth = (currentDate.getMonth() + E_STATEMENT_DIALOG_DATA.ONE < E_STATEMENT_DIALOG_DATA.TEN
      ? E_STATEMENT_DIALOG_DATA.ZERO_STRING + (currentDate.getMonth() + E_STATEMENT_DIALOG_DATA.ONE) :
      currentDate.getMonth() + E_STATEMENT_DIALOG_DATA.ONE).toString();
    this.currentYear = currentDate.getFullYear();
    // calculate months data
    for (let i = E_STATEMENT_DIALOG_DATA.ONE; i < E_STATEMENT_DIALOG_DATA.THIRTEEN; i++) {
      this.monthsList.push({
        id: i,
        value: (i < E_STATEMENT_DIALOG_DATA.TEN ? E_STATEMENT_DIALOG_DATA.ZERO_STRING + i : i)
      });
    }
    // calculate years data
    for (let i = E_STATEMENT_DIALOG_DATA.ZERO; i < E_STATEMENT_DIALOG_DATA.TEN; i++) {
      this.yearsList.push({
        id: this.currentYear + i,
        value: this.currentYear + i
      });
    }
  }

  /**
   * @methodName onMonthChange
   * @parameter event
   * @description set value of selected month
   * @return none
   */
  onMonthChange(event: MatSelectChange): void {
    this.selectedMonth = event.source.value;
  }

  /**
   * @methodName onYearChange
   * @parameter event
   * @description set value of selected year
   * @return none
   */
  onYearChange(event: MatSelectChange): void {
    this.selectedYear = event.source.value;
  }

  /**
   * @methodName showOTPComponent
   * @parameter none
   * @description used to show OTP component
   * @return none
   */
  showOTPComponent(): void {
    this.alertMessage = undefined;
    this.selectedExpiryDate = this.selectedMonth.toString() +
      this.selectedYear.toString().slice(E_STATEMENT_DIALOG_DATA.TWO);
    if (this.selectedExpiryDate === this.cardDetails.cardExpiryDate) {
      this.showOTPScreen = true;
      this.getOTPLocationDetails();
    } else {
      this.alertMessage = this.CARDS_MASTER_DATA.wrongExpiryMessage;
    }
  }

  /**
   * @methodName onBackButtonClicked
   * @description used to emit backButtonClicked
   * @parameters none
   * @return none
   */
  onBackButtonClicked(): void {
    this.backButtonClicked.emit(true);
  }

  /**
   * @methodName getOTPLocationDetails
   * @param <boolean>
   * @description Used to otp location details
   * @return none
   */
  getOTPLocationDetails(isItPostCall?: boolean): void {
    if (!isItPostCall) {
      this.showOTPScreen = true;
    }
    const OTP_LOCATION_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, true) + DEBIT_CARD_STATUS_API_URL +
      this.CARDS_MASTER_DATA.ACTIVE_CARD_STATUS;
    const payload = { cardNumber: this.cardDetails.cardNumber };
    this.subscription$.add(this.cardsService.fetchOTPLocation(OTP_LOCATION_API, payload).subscribe(response => {
      if (response['body']) {
        response['body'] = JSON.parse(response['body'].toString());
      }
      if (isItPostCall && response['status'] === HTTP_STATUS_CODE.NO_CONTENT) {
        this.showOTPScreen = false;
        this.showSuccessScreen = true;
      }
      response && response['body'] && response['body'].location ?
        (this.location = response['body'].location, this.showOTPScreen = true) : this.location = null;
    }));
  }

  /**
   * @methodName resendOTPRequired
   * @param <boolean>
   * @description Used to fetch the OTP Location details
   * @return none
   */
  resendOTPRequired(resendOTP): void {
    if (resendOTP) {
      this.getOTPLocationDetails(false);
    }
  }

  /**
   * @methodName getResponse
   * @param <OTPResponse>
   * @description Used to fetch or post the OTP info to CIAM
   * @return none
   */
  getResponse(otpResponseObj: OTPResponse): void {
    if (otpResponseObj && otpResponseObj.success) {
      this.getOTPLocationDetails(true);
    } else if (otpResponseObj && Object.keys(otpResponseObj).length && !otpResponseObj.success) {
      this.sharedService.setSnackBarMessage(otpResponseObj, SNACKBAR_MESSAGETYPE.ERROR);
      this.getOTPLocationDetails(false);
    }
  }

  /**
   * @methodName handleNextButtonClick
   * @description used to update handle next event
   * @parameters status<boolean>
   * @return none
   */
  handleNextButtonClick(status: boolean): void {
    if (status) {
      this.cardsService.reLoadCardList(false);
      this.subscription$.add(this.cardsService.updateCardList.subscribe(updateStatus => {
        if (updateStatus) {
          this.onBackButtonClicked();
        }
      }));
    }
  }

  ngOnDestroy() {
    this.sharedService.setHorizontalLineClass(undefined);
    this.subscription$.unsubscribe();
  }

}
