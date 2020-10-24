import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss']
})
export class AlertMessageComponent {
  @Input() message: string;
  @Input() errorType: string; // Based on the errorType alert icon will change , errorType = error | info | success
  constructor() { }
}
