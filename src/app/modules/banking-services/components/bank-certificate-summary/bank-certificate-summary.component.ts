import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BankingServicesService } from '../../services/banking-services.service';
import { BankCertificateReqModel } from 'src/app/common/models/bank-services-module.model';
import { SharedService } from 'src/app/common/services/shared.service';
import { DOMAINS, CURRENCY_CODE_AED, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { BANKING_SERVICES_ENDPOINTS } from 'src/app/common/api-endpoints';
import { BANKING_SERVICE_LIST } from '../../banking-services-module.constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bank-certificate-summary',
  templateUrl: './bank-certificate-summary.component.html',
  styleUrls: ['./bank-certificate-summary.component.scss']
})
export class BankCertificateSummaryComponent implements OnInit {
  summaryDetails = {} as BankCertificateReqModel;
  deliveryBranchType: string;
  accountNumberDescription: string;
  referenceNumberForSuccessScreen: string;
  feeCurrencyCode = CURRENCY_CODE_AED;
  showSuccessScreen: boolean;
  disableSubmitBtn: boolean;
  selectedLang: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  subscription$ = new Subscription();
  @Output() showBankCertificateForm = new EventEmitter();

  constructor(
    private bankingServices: BankingServicesService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.getLanguage();
    this.setComponentInitialData();
  }

  /**
   * @methodName setComponentInitialData
   * @parameter none
   * @description used to set the component initial data
   * @return none
   */
  setComponentInitialData(): void {
    this.summaryDetails = this.bankingServices.bankCertificateRequestPayload;
    this.deliveryBranchType = this.bankingServices.deliveryBranchType;
    this.accountNumberDescription = this.bankingServices.accountNumberDescription;
  }

  /**
   * @methodName makeBankCertificateRequest
   * @parameter none
   * @description used to make certificate request
   * @return none
   */
  makeBankCertificateRequest(): void {
    const BANK_CERT_REQ_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + BANKING_SERVICES_ENDPOINTS.CERTIFICATE_REQ;
    this.disableSubmitBtn = true;
    this.bankingServices.makeBankCertificateReq(BANK_CERT_REQ_API, this.bankingServices.bankCertificateRequestPayload)
      .subscribe((response) => {
        if (response && response.serviceRequestNumber) {
          this.referenceNumberForSuccessScreen = response.serviceRequestNumber;
          this.showSuccessScreen = true;
        }
      });
  }

  /**
   * @methodName showBankCerificateDashboard
   * @parameter none
   * @description used to navigate to dashboard screen
   * @return none
   */
  showBankCerificateDashboard(): void {
    this.bankingServices.cancelButtonClick$.next(BANKING_SERVICE_LIST.bankCertificate);
  }

  /**
   * @methodName showPreviousScreen
   * @parameter none
   * @description used to navigate to the previos screen
   * @return none
   */
  showPreviousScreen(): void {
    this.showBankCertificateForm.emit();
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

}
