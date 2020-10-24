import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input-generic',
  templateUrl: './input-generic.component.html',
  styleUrls: ['./input-generic.component.scss']
})
export class InputGenericComponent implements OnInit, OnChanges, OnDestroy {
  subscription$ = new Subscription();
  @Input() type = 'cardNumber'; // type  = atmPin | cardNumber | otp | none
  @Input() inputType = 'text'; // inputType  = text | password
  @Input() maxlength = 4; // maxlength  = maxlength of individual input field
  @Input() count = 4; // count  = number of input field need to show
  @Input() componentTitle: string;
  @Input() value = '';
  @Input() resetInputValue = false;
  @Input() errors: FormControl;
  @Input() inputHint  = undefined;
  @Input() inputLabel  = undefined;
  @Output() outputData = new EventEmitter(undefined);
  cardNumber: string[] = [];
  inputArray: number[] = [];
  uniqueId = Math.random().toString(36).substring(2);
  inputWidth = 22.5; // default width for count = 4
  constructor( private authService: AuthService) { }

  ngOnInit() {
    this.initializeComponent();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.resetInputValue) {
      this.refreshInputValue();
    }
  }

  /**
   * @methodName initializeComponent
   * @description used to initialize component
   * @parameters none
   * @return none
   */
  initializeComponent(): void {
    this.inputArray = Array.from(Array(this.count).keys());
    // To generate dynamic width for each input field based on the number of input field need to show (count)
    // currently count = 6 for otp and count = 4 for card and pin
    this.inputWidth = (this.count > 4) ? ((90 / this.count) - (this.count - 4)) : (90 / this.count);
  }
  /**
   * @methodName handleKeyUp
   * @description used to handle keyup event , enabled tab and backspace
   * @parameters none
   * @return none
   */
  handleKeyUp(index: number, event: KeyboardEvent): void {
    // handling backspace click
    const target = event.target as HTMLTextAreaElement;
    if (target && event['keyCode'] === 8) {
      const inputField: HTMLElement = document.querySelector(`#input-${this.type}-${index}-${this.uniqueId}`) as HTMLElement;
      if (inputField && inputField !== null) {
        const previousElementSibling = inputField.previousElementSibling as HTMLElement;
        if (target && target.value !== '') {
          target.value.slice(0, -1);
          if (target.value.length === 0 && previousElementSibling !== null) { previousElementSibling.focus(); }
        } else if (previousElementSibling !== null) {
          previousElementSibling.focus();
        }
      }
    } else if (index !== (this.count - 1) && event['keyCode'] !== 9 && event['keyCode'] !== 16
      && target && target.value.length === this.maxlength && event['keyCode'] !== 8) {
      // handling move to next input
      const inputField: HTMLElement = document.querySelector(`#input-${this.type}-${index}-${this.uniqueId}`) as HTMLElement;
      if (inputField && inputField !== null) {
        const nextEementSibling = inputField.nextElementSibling as HTMLElement;
        nextEementSibling.focus();
      } else {
        inputField.focus();
      }
    }
    const DATA = this.cardNumber.join('').trim();
    (DATA && (DATA.length === (this.maxlength * this.count))) ? this.outputData.emit(DATA) : this.outputData.emit(undefined);
  }

  /**
   * @methodName refreshInputValue
   * @description used to handle refresh event
   * @parameters none
   * @return none
   */
  refreshInputValue(): void {
    if (this.resetInputValue) { this.cardNumber = []; this.outputData.emit(undefined); this.resetInputValue = false; }
    this.subscription$.add(this.authService.clearInputFieldValues.subscribe( response => {
      if (response) { this.cardNumber = []; }
    }));
  }

  /**
   * @methodName handleKeyDown
   * @description used to handle keydown event , disable auto tab click
   * @parameters none
   * @return none
   */
  handleKeyDown(index: string, event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    if (target && target.value.length < this.maxlength && event['keyCode'] === 9) {
      // handling tab click
      event.preventDefault();
      event.stopPropagation();
    }
  }
  /**
   * @methodName handleClickEvent
   * @description used to handle click Event
   * @parameters index<number>, event<MouseEvent>
   * @return none
   */
  handleClickEvent(index: number, event: MouseEvent): void {
    if (index && event && this.cardNumber && this.cardNumber.length > 0) {
      const inputField: HTMLElement = document.querySelector(`#input-${this.type}-${index}-${this.uniqueId}`) as HTMLElement;
      inputField.focus();
      event.stopPropagation();
    }
  }
  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
