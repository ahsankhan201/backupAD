import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OPEN_ACCOUNT_TEXT, ARABIC_LANG_TEXT, ENGLISH_LANG_TEXT } from '../../global-constants';

@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.scss']
})
export class TermsAndConditionComponent implements OnInit {
  @ViewChild('scrollContainer', { static: false }) scrollContainer: ElementRef;
  @Output() readStatus = new EventEmitter(false);
  @Input() name = OPEN_ACCOUNT_TEXT.termsAndConditionBankingService;
  @Input() agreementContent?: string;
  selectedLang: string;
  readonly arabicLanguageText = ARABIC_LANG_TEXT;
  readonly englishLanguageText = ENGLISH_LANG_TEXT;
  constructor(private translateService: TranslateService) {
    this.getLanguage();
  }

  ngOnInit() { }

  /**
   * @methodName scrollTermsAndCondition
   * @parameter none
   * @description Used to check scroll scrollTop,offsetHeight,scrollHeight and emit read status
   * @return none
   */
  scrollTermsAndCondition(): void {
    const scroll = this.scrollContainer.nativeElement;
    if ((scroll.scrollTop + scroll.offsetHeight) >= scroll.scrollHeight) {
      this.readStatus.emit(true);
    }
  }

  /**
   * @methodName getLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getLanguage(): void {
    this.selectedLang = this.translateService.getDefaultLang();
  }
}
