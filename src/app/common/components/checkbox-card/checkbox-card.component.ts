import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoverCardData, DebitCardData } from '../../models/cards-module.model';
import { CARDS_MASTER_DATA } from 'src/app/modules/cards/cards-module.constants';
import { ARABIC_LANG_TEXT } from '../../global-constants';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-checkbox-card',
  templateUrl: './checkbox-card.component.html',
  styleUrls: ['./checkbox-card.component.scss']
})
export class CheckboxCardComponent implements OnInit, OnDestroy {
  @Input() checkBoxCoverCardList: CoverCardData[] = {} as CoverCardData[];
  @Input() componentName: string;
  @Input() preSelectedValue?: string;
  @Output() selectedCardOption = new EventEmitter<DebitCardData | CoverCardData>();
  subscription$ = new Subscription();
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  readonly CARDS_MASTER_DATA = CARDS_MASTER_DATA;
  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getSelectedLanguage();
  }

  /**
   * @methodName getSelectedLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getSelectedLanguage(): void {
    this.subscription$.add(this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLanguage = selectedLanguage;
    }));
  }

  /**
   * @methodName handleChange
   * @param card<DebitCardData | CoverCardData> input<HTMLInputElement>
   * @description Used to emit the value to parent component and set the active status to clicked element
   * @return none
   */
  handleChange(card: DebitCardData | CoverCardData, input: HTMLInputElement): void {
    this.preSelectedValue = input.value;
    this.selectedCardOption.emit(card);
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

}
