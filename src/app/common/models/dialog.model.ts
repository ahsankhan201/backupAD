import { ProductBulletResponse } from './products-module.model';
import { ReceiptModel } from './global.model';

export class Dialog {
  title?: string;
  message?: string;
  cancelText?: string;
  confirmText: string;
  showForm?: boolean;
  panelClass?: boolean;
  width?: string;
  disableClose?: boolean;
  data?: DialogData;
  formData?: object;
  cardName?: string;
  cardNumber?: string;
  freezeCard?: boolean;
  productImage?: string;
  bulletPoints?: ProductBulletResponse[];
  eStatementDialog?: boolean;
  termsAndConditionComponent?: string;
  termsAndCondtionAgreeStatus?: boolean;
  receiptDetails?: ReceiptModel;
  isReceiptDialog?: boolean;
  isRegistarationConfirmDialog?: boolean;
  dialogClassName?: string;
  isSessionTimeoutDialog?: boolean;
  textTemplate?: string;
  isBlockUser?: boolean;
  isUserAgreementDialog?: boolean;
}

export class DialogData {
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  showForm: boolean;
  formData: object;
}

export class LastSixMonths {
  id: string;
  month: string;
  year: number;
}
