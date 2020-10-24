import { Component, Output, EventEmitter, OnDestroy, OnInit, AfterViewInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { RECAPTCHA } from '../../api-endpoints';
import { RECAPTCHA_CONFIG } from '../../global-constants';
import { SharedService } from '../../services/shared.service';

declare var window: any;

@Component({
  selector: 'app-recaptcha',
  templateUrl: './recaptcha.component.html',
  styleUrls: ['./recaptcha.component.scss']
})
export class RecaptchaComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  @ViewChild('recaptcha', { static: true }) recaptchaElement: ElementRef;
  @Output() public response = new EventEmitter<string>(undefined);
  @Input() resetInputValue = false;
  subscription$ = new Subscription();
  SITE_KEY = RECAPTCHA_CONFIG.SITE_KEY ;
  public constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.initializeComponent();
  }
  /**
   * @methodName initializeComponent
   * @parameter none
   * @description used to set component and initialise data if required
   * @return none
   */
  initializeComponent(): void {
    if (!window.recaptcha) {
      this.loadReCaptchaScript();
      this.addRecaptchaScript();
    }
  }
  /**
   * @methodName loadReCaptchaScript
   * @description used to load reCaptch script in DOM
   * @parameters nonce?<string>
   * @return none
   */
  loadReCaptchaScript( nonce?: string): void {
    const script = document.createElement('script');
    script.innerHTML = '';
    script.id = 'recaptcha-component';
    script.src =  `${RECAPTCHA.URL}${RECAPTCHA.PARAMS}`;
    if (nonce) {
      (script as any).nonce = nonce;
    }
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  /**
   * @methodName addRecaptchaScript
   * @description used to bind recaptcha callback on onload
   * @parameters none
   * @return none
   */
  addRecaptchaScript(): void {
    window[RECAPTCHA_CONFIG.CALLBACK] =  this.renderReCaptch.bind(this);
  }

  /**
   * @methodName renderReCaptch
   * @description used to render and callback from reCaptcha api
   * @parameters none
   * @return none
   */
  renderReCaptch(): void {
    try {
      this.subscription$.add(window[RECAPTCHA_CONFIG.DOM_ATTR].render(this.recaptchaElement.nativeElement, {
        sitekey : RECAPTCHA_CONFIG.SITE_KEY,
        callback: (response: string) => {
          if (!response || response.length === 0) {
              window[RECAPTCHA_CONFIG.DOM_ATTR].reset();
              this.response.emit(undefined);
          } else {
            this.response.emit(response);
          }
        },
        'expired-callback': (response: string) => {
          window[RECAPTCHA_CONFIG.DOM_ATTR].reset();
          this.response.emit(response);
        },
      }));
    } catch (error) { /* to avoid duplicate instances */ }
  }

  ngAfterViewInit() {
    this.renderReCaptch();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.resetInputValue && changes.resetInputValue.currentValue && window[RECAPTCHA_CONFIG.DOM_ATTR]) {
      window[RECAPTCHA_CONFIG.DOM_ATTR].reset();
    }
  }

  ngOnDestroy() {
    if (window[RECAPTCHA_CONFIG.DOM_ATTR]) { window[RECAPTCHA_CONFIG.DOM_ATTR].reset(); }
    if (this.subscription$) { this.subscription$.unsubscribe(); }
  }
}
