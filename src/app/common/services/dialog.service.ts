import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { DialogComponent } from '../components/dialog/dialog.component';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Dialog } from '../models/dialog.model';
import { DIALOG_DEFAULT, HIDE_OVERFLOW_CLASS, E_STATEMENT_DIALOG_DATA, DIALOG_OPTION_USER_SESSION_MANAGEMENT } from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) { }
  private dialogRef: MatDialogRef<DialogComponent>;

  /**
   * @methodName open
   * @description used to open dialog box
   * @param options<Dialog>
   * @return none
   */
  open(options: Dialog): void {
    const DIALOGCONFIG = new MatDialogConfig();
    DIALOGCONFIG.panelClass = options.isSessionTimeoutDialog ? options.dialogClassName : DIALOG_DEFAULT.panelClass;
    DIALOGCONFIG.disableClose = options.disableClose ? options.disableClose : true;
    DIALOGCONFIG.width = options.eStatementDialog ? E_STATEMENT_DIALOG_DATA.WIDTH : undefined;
    DIALOGCONFIG.height = options.eStatementDialog ? E_STATEMENT_DIALOG_DATA.HEIGHT : undefined;
    DIALOGCONFIG.maxWidth = options.eStatementDialog ? E_STATEMENT_DIALOG_DATA.WIDTH : DIALOGCONFIG.maxWidth;
    DIALOGCONFIG.data = {
      title: options.title,
      message: options.message,
      cancelText: options.cancelText ? options.cancelText : undefined,
      confirmText: options.confirmText,
      showForm: options.showForm ? options.showForm : false,
      formData: options.formData ? options.formData : false,
      freezeCard: options.freezeCard ? options.freezeCard : false,
      cardName: options.cardName ? options.cardName : undefined,
      cardNumber: options.cardNumber ? options.cardNumber : undefined,
      productImage: options.productImage ? options.productImage : undefined,
      bulletPoints: options.bulletPoints ? options.bulletPoints : undefined,
      eStatementDialog: options.eStatementDialog ? options.eStatementDialog : false,
      termsAndConditionComponent: options.termsAndConditionComponent ? options.termsAndConditionComponent : undefined,
      termsAndCondtionAgreeStatus: options.termsAndCondtionAgreeStatus ? options.termsAndCondtionAgreeStatus : false,
      isReceiptDialog: options.isReceiptDialog ? options.isReceiptDialog : false,
      isRegistarationConfirmDialog: options.isRegistarationConfirmDialog ? options.isRegistarationConfirmDialog : false,
      receiptDetails: options.receiptDetails ? options.receiptDetails : undefined,
      isSessionTimeoutDialog: options.isSessionTimeoutDialog ? options.isSessionTimeoutDialog : false,
      textTemplate: options.textTemplate ? options.textTemplate : undefined,
      isBlockUser: options.isBlockUser ? options.isBlockUser : undefined,
      isUserAgreementDialog: options.isUserAgreementDialog ? options.isUserAgreementDialog : false
    };
    this.dialogRef = this.dialog.open(DialogComponent, DIALOGCONFIG);
    document.querySelector('body').classList.add(HIDE_OVERFLOW_CLASS);
    if (options.dialogClassName) {
      document.querySelector('mat-dialog-container').classList.add(options.dialogClassName);
    }
  }

  /**
   * @methodName confirmed
   * @description used to get the value from dialog box
   * @parameters none
   * @return Observable<any>
   */
  // Return type to be changed after API integration
  confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(take(1), map(res => {
      return res;
    }
    ));
  }

  /**
   * @methodName openEstatementDialog
   * @description open download e-statement dialog
   * @parameters none
   * @return boolean
   */
  openEstatementDialog(): Observable<boolean> {
    const OPTIONS = {} as Dialog;
    OPTIONS.title = E_STATEMENT_DIALOG_DATA.TITLE;
    OPTIONS.cancelText = E_STATEMENT_DIALOG_DATA.CLOSE;
    OPTIONS.confirmText = E_STATEMENT_DIALOG_DATA.DOWNLOAD;
    OPTIONS.message = E_STATEMENT_DIALOG_DATA.SELECT_MESSAGE;
    OPTIONS.eStatementDialog = true;
    this.open(OPTIONS);
    return this.confirmed();
  }

  /**
   * @methodName closeDialog
   * @description It is called before opening session timeout modal to close existing modal
   * @parameters none
   * @return none
   */
  closeDialog(): void {
    if (this.dialogRef && this.dialogRef.close) {
      this.dialogRef.close(undefined);
    }
  }

  /**
   * @methodName handleMultipleUserSessionManagment
   * @parameter none
   * @description used to handle multiple user session managment
   * @return Observable<boolean>
   */
  handleMultipleUserSessionManagment(): Observable<boolean> {
    const OPTIONS: Dialog = DIALOG_OPTION_USER_SESSION_MANAGEMENT;
    this.open(OPTIONS);
    return this.confirmed();
  }
}

