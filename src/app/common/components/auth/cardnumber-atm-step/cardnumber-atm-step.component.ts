import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

import { ICON } from 'src/app/common/global-constants';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { AUTH_TEXT } from 'src/app/modules/auth/auth-module.constants';

@Component({
  selector: 'app-cardnumber-atm-step',
  templateUrl: './cardnumber-atm-step.component.html',
  styleUrls: ['./cardnumber-atm-step.component.scss']
})
export class CardnumberAtmStepComponent implements OnInit {
  securityIcon = ICON.securityIcon;
  @Input() loginLink: boolean;
  @Input() alertMessage: string;
  @Input() resetInputValue = false;
  @Output() nextData = new EventEmitter(undefined);
  @Output() cancelData = new EventEmitter(undefined);
  cardNumber: string;
  pinNumber: string;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.initializeComponent();
  }

  /**
   * @methodName initializeComponent
   * @params none
   * @description Used to fetch the initial component logic
   * @return none
   */
  initializeComponent() {
    this.authService.isUserBlocked.subscribe(response => {
      if (response) {
          this.alertMessage = AUTH_TEXT.user_blocked_text;
          // reset subject for next call
          this.authService.isUserBlocked$.next(undefined);

      }
    });
  }

  /**
   * @methodName handleCardNumber
   * @param cardNumber<string>
   * @description Used to handle card number response from component
   * @return none
   */
  handleCardNumber(cardNumber: string): void {
    this.cardNumber = undefined;
    if (cardNumber) { this.cardNumber = cardNumber; }
  }

  /**
   * @methodName handleAtmPinNumber
   * @param pinNumber<string>
   * @description Used to handle pin number response from component
   * @return none
   */
  handleAtmPinNumber(pinNumber: string): void {
    this.pinNumber = undefined;
    if (pinNumber) { this.pinNumber = pinNumber; }
  }

  /**
   * @methodName isNextButtonEnabled
   * @params none
   * @description Used enable and disable next button
   * @return boolean
   */
  isNextButtonEnabled(): boolean {
    return (this.cardNumber && this.pinNumber) ? false : true;
  }

  /**
   * @methodName handleCancelButtonClick
   * @description used to handle cancel button click
   * @parameters none
   * @return none
   */
  handleCancelButtonClick(): void {
    this.authService.isUserBlockedStatus = false;
    this.alertMessage = undefined;
    this.authService.clearInputFieldValues$.next(true);
    this.cancelData.emit(true);
  }

  /**
   * @methodName handleNextButtonClick
   * @description used to handle cancel button click
   * @parameters none
   * @return none
   */
  handleNextButtonClick(): void {
    const response = { cardNumber: this.cardNumber, pinNumber: this.pinNumber };
    this.nextData.emit(response);
  }
}

