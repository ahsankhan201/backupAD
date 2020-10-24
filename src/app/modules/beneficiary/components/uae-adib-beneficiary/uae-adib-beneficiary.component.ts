import { Component, OnInit, OnDestroy } from '@angular/core';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { BENEFICIARY_UAE_ADIB, MOBILE_BENEFICIARY_ERROR_CODE, AddByType } from '../../beneficiary-module.constants';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FORM_LENGTH_VALIDATION, DOMAINS, ERROR_MESSAGES, ARABIC_LANG_TEXT, CARD_NUMBER_TEXT } from 'src/app/common/global-constants';
import { MustMatch } from 'src/app/common/validators/must-match.validator';
import { HTTP_STATUS_CODE } from '../../../../common/global-constants';
import { BENEFICIARY_ENDPOINTS } from 'src/app/common/api-endpoints';
import { AccountNumber, CardNumber, AddBy } from 'src/app/common/models/beneficiary-module.model';
import { MatStepper } from '@angular/material/stepper';
import { BENEFICIARY_FORM_TEXT } from '../../beneficiary-module.constants';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-uae-adib-beneficiary',
  templateUrl: './uae-adib-beneficiary.component.html',
  styleUrls: ['./uae-adib-beneficiary.component.scss']
})
export class UaeAdibBeneficiaryComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  addbyList: AddBy[];
  showCard = false;
  formText = BENEFICIARY_FORM_TEXT;
  showAccount = false;
  showForm = false;
  uaeAdibBeneForm: FormGroup;
  FORM_LENGTH = FORM_LENGTH_VALIDATION;
  accountDetailsPayLoadObj = new AccountNumber();
  cardDetailsPayLoadObj = new CardNumber();
  isCardSelected = false;
  showMobile = false;
  enableNextBtn: boolean;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  resetInputValue = false;
  constructor(
    private beneficiaryService: BeneficiaryService,
    private formBuilder: FormBuilder,
    private stepper: MatStepper,
    private sharedService: SharedService) {
    this.createForm();
  }

  ngOnInit() {
    this.addbyList = BENEFICIARY_UAE_ADIB.addBy;
    this.getSelectedLanguage();
  }

  /**
   * @methodName createForm
   * @description used to create form group
   * @parameters none
   * @return none
   */
  createForm(): void {
    this.uaeAdibBeneForm = this.formBuilder.group({
      nickName: [null, [Validators.required, this.sharedService.retrictWordValidator()]],
    });
  }

  /**
   * @methodName addAccountDynamicFormControls
   * @description used to add dynamic controls to account form
   * @parameters none
   * @return none
   */
  addAccountDynamicFormControls(): void {
    this.removeFormControls();
    this.uaeAdibBeneForm.addControl('account', new FormControl('', [Validators.required,
    Validators.minLength(this.FORM_LENGTH.adibAccountNumber.minLength)]));
    this.uaeAdibBeneForm.addControl('confirmAccount', new FormControl('', [Validators.required]));
    this.uaeAdibBeneForm.setValidators(MustMatch('account', 'confirmAccount').bind(this));
    this.uaeAdibBeneForm.updateValueAndValidity();
  }

  /**
   * @methodName addCardDynamicFormControls
   * @description used to add dynamic controls to card form
   * @parameters none
   * @return none
   */
  addCardDynamicFormControls(): void {
    this.removeFormControls();
    this.uaeAdibBeneForm.addControl('cardNumber', new FormControl('', [Validators.required,
    Validators.maxLength(this.FORM_LENGTH.coverCard.maxLength)]));
    this.uaeAdibBeneForm.updateValueAndValidity();
  }

  /**
   * @methodName createMobileBeneficiaryForm
   * @description used to create mobile beneficiary form
   * @parameters none
   * @return none
   */
  createMobileBeneficiaryForm(): void {
    this.removeFormControls();
    this.uaeAdibBeneForm.addControl('mobileNumber', new FormControl('', [Validators.required,
    Validators.minLength(this.FORM_LENGTH.mobile.minLength)]));
  }

  /**
   * @methodName removeFormControls
   * @description used to remove form controls
   * @parameters none
   * @return none
   */
  removeFormControls(): void {
    this.uaeAdibBeneForm.setValidators(null);
    this.uaeAdibBeneForm.removeControl('account');
    this.uaeAdibBeneForm.removeControl('confirmAccount');
    this.uaeAdibBeneForm.removeControl('cardNumber');
    this.uaeAdibBeneForm.removeControl('mobileNumber');
    this.uaeAdibBeneForm.reset();
    this.uaeAdibBeneForm.updateValueAndValidity();
  }

  /**
   * @methodName selectedAccount
   * @description used to check selected option
   * @parameters event
   * @return none
   */
  selectedAccount(event: any): void {
    this.beneficiaryService.setAddedBy(event);
    this.showForm = true;
    this.enableNextBtn = true;
    this.hideOtherAccounts(event, true);
    if (event === AddByType.account) {
      this.addAccountDynamicFormControls();
    }
    if (event === AddByType.card) {
      this.addCardDynamicFormControls();
    }
    if (event === AddByType.mobile) {
      this.createMobileBeneficiaryForm();
    }
  }

  /**
   * @methodName hideOtherAccounts
   * @description used to hide forms based on the selection
   * @parameters addBy, status
   * @return none
   */
  hideOtherAccounts(addBy: string, status: boolean): void {
    if (addBy === AddByType.account) {
      this.showAccount = status;
      this.showCard = !status;
      this.showMobile = !status;
    }
    if (addBy === AddByType.card) {
      this.showCard = status;
      this.showAccount = !status;
      this.showMobile = !status;
    }
    if (addBy === AddByType.mobile) {
      this.showCard = !status;
      this.showAccount = !status;
      this.showMobile = status;
    }
  }

  /**
   * @methodName onSubmit
   * @description used to submit the form with the payload
   * @parameters none
   * @return none
   */
  onSubmit(): void {
    if (this.showAccount) {
      this.accountDetailsPayLoadObj.accountNumber = this.uaeAdibBeneForm.value.account;
      const ACCOUNTS_LIST_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) +
        BENEFICIARY_ENDPOINTS.ACCOUNT_NUMBER_DETAILS;
      this.beneficiaryService.fetchAccountDetails(ACCOUNTS_LIST_API, this.accountDetailsPayLoadObj).subscribe((response: any) => {
        response.body = JSON.parse(response.body.toString());
        if (response.status === HTTP_STATUS_CODE.OK) {
          this.beneficiaryService.setInternalBeneficiaryPayLoad(this.uaeAdibBeneForm, this.isCardSelected, response.body.accountHolderName);
          this.beneficiaryService.setADIBBenSummaryDetails(response.body.currencyCode);
          this.stepper.next();
        }
      });
    } else if (this.showCard) {
      this.isCardSelected = true;
      this.cardDetailsPayLoadObj.cardNumber = this.uaeAdibBeneForm.value.cardNumber;
      const CARDS_LIST_API = this.sharedService.generateApiUrl(DOMAINS.APICONNECT, true, false) + BENEFICIARY_ENDPOINTS.CARD_NUMBER_DETAILS;
      this.beneficiaryService.fetchCardDetails(CARDS_LIST_API, this.cardDetailsPayLoadObj).subscribe((response: any) => {
        if (response && response.status === HTTP_STATUS_CODE.OK) {
          response = JSON.parse(response.body.toString());
          this.beneficiaryService.setInternalBeneficiaryPayLoad(this.uaeAdibBeneForm, this.isCardSelected, response.fullName);
          this.beneficiaryService.setADIBBenSummaryDetails(response.currencyCode);
          this.stepper.next();
        }
      }, errors => {
        if (errors && errors.error && errors.error.details && errors.error.details.description) {
          this.uaeAdibBeneForm.get('cardNumber').setErrors({ isCustomError: true, message: errors.error.details.description.desc });
          this.uaeAdibBeneForm.updateValueAndValidity();
        }
      });
    } else if (this.showMobile) {
      this.validateMobileFormData();
    }
  }

  /**
   * @methodName mobileNumber
   * @description used to get mobile controller from uaeAdibBeneForm form
   * @parameters none
   * @return none
   */
  get mobileNumber() { return this.uaeAdibBeneForm.value.mobileNumber.trim(); }

  /**
   * @methodName validateMobileFormData
   * @description used to validate mobile form data
   * @parameters none
   * @return none
   */
  validateMobileFormData(): void {
    const mobileNoWithCountryCode = this.getMobileNoWithCountryCode();
    this.subscription.add(this.beneficiaryService.getCustomerNameByMobile(mobileNoWithCountryCode).subscribe(res => {
      res.body = JSON.parse(res.body.toString());
      const CUSTOMER_NAME = res.body.customerName;
      this.uaeAdibBeneForm.value.nickName = this.uaeAdibBeneForm.value.nickName
          ? this.uaeAdibBeneForm.value.nickName : CUSTOMER_NAME;
      this.beneficiaryService.setMobileBeneficiaryPayLoad(this.uaeAdibBeneForm.value);
      this.stepper.next();
    }));
  }

  /**
   * @methodName getMobileNoWithCountryCode
   * @description used to get mobile number with country code
   * @parameters none
   * @return string
   */
  getMobileNoWithCountryCode(): string {
    let mobileNoWithCountryCode = BENEFICIARY_FORM_TEXT.mobileCountyCodeWithoutPlus;
    if (this.mobileNumber.length > FORM_LENGTH_VALIDATION.mobile.minLength) {
      return mobileNoWithCountryCode += this.mobileNumber.substring(1);
    } else {
      return mobileNoWithCountryCode += this.mobileNumber;
    }
  }

  /**
   * @methodName isBeneficiaryExists
   * @description used to check beneficiary exisits
   * @parameters formData<string>, filterName<string>
   * @return none
   */
  isBeneficiaryExists(formData: string, filterName: string): void {
    let data = this.uaeAdibBeneForm.get(formData).value;
    if (!this.sharedService.isEmpty(data)) {
      if (formData === BENEFICIARY_FORM_TEXT.mobileNumberText) {
        data = this.getMobileNoWithCountryCode();
      }
      this.subscription.add(this.beneficiaryService.isBeneficiaryExisits(filterName, data).subscribe(
        res => {
          res ? this.uaeAdibBeneForm.get(formData).setErrors({ isTaken: true, message: ERROR_MESSAGES.isBeneficiaryTaken })
            : this.selfAccountCardValidation(formData);
        }
      ));
    }
  }
  /**
   * @methodName selfAccountCardValidation
   * @description check if the account / card number is already of logged in account holder
   * @param filterName<string>, data <string>
   * @return boolean
   */
  selfAccountCardValidation(formItem: string): void {
    const data: string = this.uaeAdibBeneForm.get(formItem).value;
    if (!this.sharedService.isEmpty(data)) {
      this.subscription.add(this.beneficiaryService.checkSelfAccountsCards(formItem, data).subscribe(
        res => {
          res ? this.uaeAdibBeneForm.get(formItem).setErrors({ isTaken: true, message: ERROR_MESSAGES.ownAccountAddition })
            : this.uaeAdibBeneForm.get(formItem).updateValueAndValidity();
        }
      ));
    }
  }

  /**
   * @methodName getSelectedLanguage
   * @parameter none
   * @description Used to set selected language EN | AR
   * @return none
   */
  getSelectedLanguage(): void {
    this.sharedService.getSelectedLanguge().subscribe((selectedLanguage: string) => {
      this.selectedLanguage = selectedLanguage;
    });
  }

  /**
   * @methodName handleCardNumber
   * @param cardNumber<string>
   * @description Used to handle card number response from input generic component
   * @return none
   */
  handleCardNumber(cardNumber: string): void {
    this.uaeAdibBeneForm.get(CARD_NUMBER_TEXT).setValue(cardNumber);
    if (cardNumber) {
      this.isBeneficiaryExists(CARD_NUMBER_TEXT, BENEFICIARY_FORM_TEXT.beneAccNoText);
   }
  }
  ngOnDestroy() {
    this.removeFormControls();
    this.subscription.unsubscribe();
  }
}
