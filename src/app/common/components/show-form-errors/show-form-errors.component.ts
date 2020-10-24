import { Component, OnInit, Input } from '@angular/core';
import { ERROR_MESSAGES } from '../../global-constants';
@Component({
  selector: 'app-show-form-errors',
  templateUrl: './show-form-errors.component.html',
  styleUrls: ['./show-form-errors.component.scss']
})
export class ShowErrorComponent implements OnInit {
  errorMessage = ERROR_MESSAGES;
  @Input() control: any;
  @Input() label: string;
  constructor() { }

  ngOnInit() {
  }

}
