import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  BANK_CERTIFICATE_BRANCH_TYPES, LANGUAGES_LIST,
  BANK_CERTIFICATES_LIST, BANKING_CERTIFICATE_INFO, BANKING_SERVICE_LIST
} from '../../banking-services-module.constants';
import { ContactModeCheckBox } from 'src/app/common/models/products-module.model';
import { BankingServicesService } from '../../services/banking-services.service';
import { ARABIC_LANG_TEXT, DOMAINS } from 'src/app/common/global-constants';
import { SharedService } from 'src/app/common/services/shared.service';
import { Subscription } from 'rxjs';
import { BANKING_SERVICES_ENDPOINTS } from 'src/app/common/api-endpoints';
import { GetBranchesListReqModel, BankingServiceChargesModel } from 'src/app/common/models/bank-services-module.model';
import { OpenAccountService } from 'src/app/common/services/open-account/open-account.service';
import { AccountsList } from 'src/app/common/models/global.model';

@Component({
  selector: 'app-bank-certificate',
  templateUrl: './bank-certificate.component.html',
  styleUrls: ['./bank-certificate.component.scss']
})
export class BankCertificateComponent implements OnInit {
  bankCertificateFormGroup: FormGroup;
  bankBranchTypes: ContactModeCheckBox[] = BANK_CERTIFICATE_BRANCH_TYPES;
  selectedBranchType: string;
  languagesList = LANGUAGES_LIST;
  bankCertificatesList = BANK_CERTIFICATES_LIST;
  accountsList = [] as AccountsList[];
  subscription$ = new Subscription();
  branchesList = [];
  showSummaryScreen: boolean;
  enableNextBtn: boolean;
  preSelectedBranchOption: string;
  readonly ADDRESS_TO_MAXLENGTH = BANKING_CERTIFICATE_INFO.ADDRESS_TO_MAXLENGTH;
  selectedLang: string;
  arabicLanguageText = ARABIC_LANG_TEXT;

  constructor(
    private formBuilder: FormBuilder,
    private bankingServices: BankingServicesService,
    private sharedService: SharedService,
    private openAccountService: OpenAccountService) { }

  ngOnInit() {
    this.getLanguage();
    this.createBankCertificateForm();
    this.accountsList = this.openAccountService.generateAccountSelectBoxObj();
  }

  /**
   * @methodName createOpenAccountForm
   * @parameter none
   * @description used to create the bank certificate form group
   * @return none
   */
  createBankCertificateForm(): void {
    this.bankCertificateFormGroup = this.formBuilder.group({
      selectedAccount: ['', [Validators.required]],
      selectedCertificate: ['', [Validators.required]],
      certificateLanguage: ['', [Validators.required]],
      selectedBranch: [''],
      addressTo: ['', [Validators.required]]
    });
  }

  /**
   * @methodName getSelectedBranchTypes
   * @parameter selectedBranch<ContactModeCheckBox>
   * @description used to toggle the branch input field based on branch type selcetion
   * @return none
   */
  getSelectedBranchTypes(selectedBranch: ContactModeCheckBox): void {
    this.selectedBranchType = selectedBranch.id;
    this.bankingServices.deliveryBranchType = selectedBranch.value;
    this.bankCertificateFormGroup.get(BANKING_CERTIFICATE_INFO.selectedBranch)
      .setValidators(null);
    if (selectedBranch.id === BANKING_CERTIFICATE_INFO.OTHER_BRANCH) {
      this.getBranchesList();
      this.bankCertificateFormGroup.get(BANKING_CERTIFICATE_INFO.selectedBranch)
        .setValidators([Validators.required]);
    } else {
      this.enableNextBtn = true;
      this.bankingServices.bankCertificateRequestPayload.branchName = this.sharedService.customerDetail.branchName;
      this.bankCertificateFormGroup.get(BANKING_CERTIFICATE_INFO.selectedBranch).reset();
    }
    this.bankingServices.bankCertificateRequestPayload.deliveryOption = selectedBranch.id;
  }

  /**
   * @methodName getBranchesList
   * @parameters none
   * @description used to get the branches list from server
   * @return none
   */
  getBranchesList(): void {
    if (!this.branchesList || !this.branchesList.length) {
      const COUNTRY_LIST_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
        + BANKING_SERVICES_ENDPOINTS.BRANCH_LIST;
      const reqPayload = {} as GetBranchesListReqModel;
      reqPayload.country = BANKING_CERTIFICATE_INFO.UAE_COUNTRY_CODE_FOR_BRANCHES;
      this.subscription$.add(this.bankingServices.fetchBankBranches(COUNTRY_LIST_API, reqPayload).subscribe(response => {
        this.branchesList = response;
      }));
    }
  }

  /**
   * @methodName branchSelectionChanges
   * @parameter selectedBranch<string>
   * @description used to set selected branch value
   * @return none
   */
  branchSelectionChanges(selectedBranch: string): void {
    this.enableNextBtn = true;
    this.bankingServices.bankCertificateRequestPayload.branchName = selectedBranch;
  }

  /**
   * @methodName accountSelectionChange
   * @parameter string
   * @description it will set the selected account value
   * @return none
   */
  accountSelectionChange(selectedAccount: string): void {
    this.bankingServices.bankCertificateRequestPayload.accountNumber = selectedAccount;
    this.bankingServices.accountNumberDescription = this.bankCertificateFormGroup.get('selectedAccount').value;
    const selectedSourceAcc = this.accountsList.find(accountObj => {
      return selectedAccount === accountObj.accountNumber;
    });
  }

  /**
   * @methodName showSummaryScreenComp
   * @parameter none
   * @description used to show summary screen
   * @return none
   */
  showSummaryScreenComp(): void {
    this.bankingServices.bankCertificateRequestPayload.addressedTo = this.bankCertificateFormGroup.get('addressTo').value;
    this.bankingServices.bankCertificateRequestPayload.certificateType = this.bankCertificateFormGroup.get('selectedCertificate').value;
    this.bankingServices.bankCertificateRequestPayload.preferredLanguage = this.bankCertificateFormGroup.get('certificateLanguage').value;
    this.bankingServices.bankCertificateRequestPayload.firstName = this.sharedService.customerBasicDetails.firstName;
    this.bankingServices.bankCertificateRequestPayload.lastName = this.sharedService.customerBasicDetails.lastName;
    this.bankingServices.bankCertificateRequestPayload.customerName = this.sharedService.customerBasicDetails.fullName;
    this.bankingServices.bankCertificateRequestPayload.emailAddress = this.sharedService.customerBasicDetails.email;
    this.bankingServices.bankCertificateRequestPayload.mobileNumber = this.sharedService.customerBasicDetails.mobile;
    this.showSummaryScreen = true;
    this.getCertificateCharges();
  }

  /**
   * @methodName getCertificateCharges
   * @parameter none
   * @description used to fetch certificate changes from server
   * @return none
   */
  getCertificateCharges(): void {
    const CERTIFICATE_CHARGE_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false)
      + BANKING_SERVICES_ENDPOINTS.GET_CHARGES;
    const reqPayload = {} as BankingServiceChargesModel;
    reqPayload.accountNumber = this.bankingServices.bankCertificateRequestPayload.accountNumber;
    reqPayload.category = 'CERTIFICATE_FEE'; // it's enum
    this.bankingServices.fetchBankCertificateCharges(CERTIFICATE_CHARGE_API, reqPayload).subscribe((response) => {
      if (response && response.fee) {
        this.bankingServices.bankCertificateRequestPayload.standardCharges = response.fee;
      }
    });
  }

  /**
   * @methodName cancelRequest
   * @parameter none
   * @description used to to navigate dashboard screen
   * @return none
   */
  cancelRequest(): void {
    this.bankingServices.cancelButtonClick$.next(BANKING_SERVICE_LIST.bankCertificate);
  }

  /**
   * @methodName toggleSummaryScreen
   * @parameter none
   * @description used to toggle form and summary screen
   * @return none
   */
  toggleSummaryScreen(): void {
    this.showSummaryScreen = false;
    this.preSelectedBranchOption = this.selectedBranchType;
    this.enableNextBtn = true;
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
