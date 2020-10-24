import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { SNACK_BAR_STATUS } from '../../global-constants';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnChanges {
  @Input() showSnackBar: boolean;
  @Input() messageObj: any;
  messageText: string;
  msgAlertType: string;
  msgStatus = SNACK_BAR_STATUS;
  constructor() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.messageObj && changes.messageObj.currentValue) {
      this.messageObj = changes.messageObj.currentValue;
      this.showSnackBar = this.messageObj.hasOwnProperty('msgText') || this.messageObj.hasOwnProperty('msgType') ? true : false;
      this.messageText = this.messageObj.msgText ? this.messageObj.msgText : '';
      this.msgAlertType = this.messageObj.msgType ? this.messageObj.msgType : '';
      // hide the snackbar after 5 seconds
      setTimeout(() => { this.showSnackBar = false; }, 5000);
    }
  }
}

