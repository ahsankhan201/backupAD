import { Component, Inject, OnInit, HostListener, ViewChildren, QueryList, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import {
  NICKNAME_LABEL, NICKNAME_LENGTH, PATTERN_ALPHA_NUMERIC,
  E_STATEMENT_DIALOG_DATA, ICON, TIME_INTERVAL_VALUE, HIDE_OVERFLOW_CLASS, ARABIC_LANG_TEXT
} from 'src/app/common/global-constants';
import { TranslateService } from '@ngx-translate/core';
import { LastSixMonths } from '../../models/dialog.model';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})

export class DialogComponent implements OnInit, AfterViewInit {
  @ViewChild('bulletPoints', { static: false}) bulletPoints: ElementRef;
  lastSixMonths: LastSixMonths[] = [];
  nickNameText = NICKNAME_LABEL;
  nickNameMaxLength = NICKNAME_LENGTH;
  dialogForm: FormGroup;
  selectedLang: string;
  activeOption: number;
  disableAgreeButton = !this.dialogData.termsAndCondtionAgreeStatus;
  closeIcon = ICON.closeIcon;
  sessionCount = environment.SESSION_LOGOUT_INDICATION_TIME;
  intervalCounter: number;
  subscription$ = new Subscription();
  arabicLanguageText = ARABIC_LANG_TEXT;
  agreementVersion: string;
  agreementContent: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData,
    public dialogRef: MatDialogRef<DialogComponent>,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private sharedService: SharedService,
    private translateService: TranslateService
  ) { this.getLanguage(); }

  ngOnInit() {
    this.setDialogContent();
  }

  /**
   * @methodName setDialogContent
   * @description set the dialog content
   * @parameters none
   * @return none
   */
  setDialogContent(): void {
    if (this.dialogData.showForm) {
      this.createDialogForm();
    } else if (this.dialogData.eStatementDialog) {
      this.calculateLastSixMonths();
    } else if (this.dialogData.isSessionTimeoutDialog) {
      this.updateSessionCounter();
    } else if (this.dialogData.isUserAgreementDialog) {
      this.setUserAgreementContent();
    }
  }

  /**
   * @methodName cancelDialog
   * @description used to cancel dialog box
   * @parameters none
   * @return none
   */
  cancelDialog(): void {
    this.closeDialog(false);
  }

  /**
   * @methodName closeDialog
   * @description used to cancel dialog box
   * @param value <boolean>
   * @return none
   */
  closeDialog(value: boolean): void {
    document.querySelector('body').classList.remove(HIDE_OVERFLOW_CLASS);
    this.dialogRef.close(value);
  }

  /**
   * @methodName confirmDialog
   * @description used to confirm dialog box
   * @parameters none
   * @return none
   */
  confirmDialog(): void {
    if (this.dialogData.showForm) {
      this.closeDialog(this.dialogForm ? this.dialogForm.value : true);
    } else {
      this.closeDialog(true);
    }
  }


  /**
   * @methodName HostListener onEsc
   * @description used to close dialog on esc key press
   * @parameters none
   * @return none
   */
  @HostListener('keydown.esc')
  onEsc(): void {
    this.closeDialog(false);
  }

  /**
   * @methodName createDialogForm
   * @description used to create form
   * @parameters none
   * @return none
   */
  createDialogForm(): void {
    this.dialogForm = this.formBuilder.group({
      nickName: [this.dialogData.formData ? this.dialogData.formData.nickname : '',
      [Validators.required, Validators.pattern(PATTERN_ALPHA_NUMERIC), this.sharedService.retrictWordValidator()]]
    });
  }

  /**
   * @methodName isButtonDisabled
   * @description used to validate form
   * @parameters none
   * @return boolean
   */
  isButtonDisabled(): boolean {
    if (this.dialogData.showForm) {
      return !this.dialogForm.valid;
    } else if ((this.dialogData.eStatementDialog && this.activeOption === undefined)
      || (this.dialogData.termsAndConditionComponent && this.disableAgreeButton)) {
      return true;
    }
    return false;
  }

  /**
   * @methodName getLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getLanguage(): void {
    this.subscription$.add(this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLang = selectedLanguage;
    }));
  }

  /**
   * @methodName calculateLastSixMonths
   * @parameter none
   * @description Used to fetch last six months for downloading e-statement
   * @return none
   */
  calculateLastSixMonths(): void {
    const currentDate = new Date();
    const eligibleMonthsDate = new Date();
    for (let i = E_STATEMENT_DIALOG_DATA.ONE; i < E_STATEMENT_DIALOG_DATA.SEVEN; i++) {
      eligibleMonthsDate.setMonth(currentDate.getMonth() - i);
      this.lastSixMonths.push({
        id: ((eligibleMonthsDate.getMonth() + E_STATEMENT_DIALOG_DATA.ONE) < E_STATEMENT_DIALOG_DATA.TEN ?
          E_STATEMENT_DIALOG_DATA.ZERO_STRING : '') +
          (eligibleMonthsDate.getMonth() + E_STATEMENT_DIALOG_DATA.ONE),
        month: eligibleMonthsDate.toLocaleString(E_STATEMENT_DIALOG_DATA.DEFAULT, { month: E_STATEMENT_DIALOG_DATA.SHORT }),
        year: eligibleMonthsDate.getFullYear()
      });
    }
  }

  /**
   * @methodName setSelectedMonthYear
   * @parameter selectedMonth<number>, selectedYear<number>
   * @description Used to set selected month and year for downloading
   * @return none
   */
  setSelectedMonthYear(selectedMonth: number, selectedYear: number): void {
    this.activeOption = selectedMonth;
    this.sharedService.selectedStatementMonth = selectedMonth;
    this.sharedService.selectedStatementYear = selectedYear;
  }

  /**
   * @methodName readStatusTermsAndCondition
   * @parameter status<boolean>
   * @description read status for terms and condition
   * @return none
   */
  readStatusTermsAndCondition(status: boolean): void {
    this.disableAgreeButton = (status) ? false : true;
  }

  /**
   * @methodName handleCloseDialog
   * @parameter status<string>
   * @description read handle close button action
   * @return none
   */
  handleCloseDialog(status: string): void {
    if (status) { this.dialogRef.close(undefined); }
  }

  /**
   * @methodName updateSessionCounter
   * @parameter none
   * @description it will decrease the session counter time
   * @return none
   */
  updateSessionCounter(): void {
    this.intervalCounter = window.setInterval(() => {
      this.sessionCount--;
      if (this.sessionCount <= 0) {
        clearInterval(this.intervalCounter);
        this.sharedService.isSessionExpired = true;
        this.cancelDialog();
      }
    }, TIME_INTERVAL_VALUE);
  }

  /**
   * @methodName setUserAgreementContent
   * @parameter none
   * @description set agreement dialog data
   * @return none
   */
  setUserAgreementContent(): void {
    this.agreementVersion = this.sharedService.agreementVersion;
    this.agreementContent = this.sharedService.agreementContent;
  }

  ngAfterViewInit() {
    if (this.bulletPoints) {
      const links = this.elementRef.nativeElement.querySelectorAll('a');
      links.forEach(link => link.target = '_blank');
    }
  }
}
