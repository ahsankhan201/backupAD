import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IsTaken } from 'src/app/common/validators/is-taken.validator';
import { MustMatch } from 'src/app/common/validators/must-match.validator';
import {
  FORM_LENGTH_VALIDATION, PATTERN_ALPHA_NUMERIC, ERROR_MESSAGES, ARABIC_LANG_TEXT, CARD_NUMBER_TEXT
} from 'src/app/common/global-constants';
import { BENEFICIARY_FORM_TEXT } from '../../beneficiary-module.constants';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-account-selection-form',
  templateUrl: './account-selection-form.component.html',
  styleUrls: ['./account-selection-form.component.scss']
})
export class AccountSelectionFormComponent implements OnInit, OnChanges, OnDestroy {
  subscription = new Subscription();
  @Output() formValues = new EventEmitter<object>();
  @Input() showIBAN: boolean;
  @Input() showABACode: boolean;
  @Input() showAccountNumber: boolean;
  @Input() currencyList: any;
  @Input() showCard = false;
  @Input() showCardConfirm = false;
  @Input() showForm = true;
  isValidOtherInternationalForm: boolean;
  accountForm: FormGroup;
  isSubmited = false;
  countriesList: any;
  FORM_LENGTH = FORM_LENGTH_VALIDATION;
  formText = BENEFICIARY_FORM_TEXT;
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  resetInputValue = false;
  addedValidatorForRomania = false;
  constructor(
    private formBuilder: FormBuilder,
    private beneficiaryService: BeneficiaryService,
    private sharedService: SharedService,
  ) {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.onChangeAccountForm(changes);
  }

  ngOnInit() {
    this.beneficiaryService.getBeneficiaryListInfo();
    this.getSelectedLanguage();
  }

  /**
   * @methodName onChangeAccountForm
   * @parameter none
   * @description Used to detec simpleChanges of account form
   * @return none
   */
  onChangeAccountForm(changes: SimpleChanges): void {
    if (changes && (changes.showABACode && changes.showABACode.currentValue)
      || (changes.showAccountNumber && changes.showAccountNumber.currentValue) || changes.showCard
      || changes.showIBAN || changes.showCard) {
      this.addDynamicFormControls();
      this.countriesList = this.beneficiaryService.countriesList && this.beneficiaryService.countriesList.length ?
        this.sharedService.clone(this.beneficiaryService.countriesList) : undefined;
    }
    if (this.accountForm && this.accountForm.get('country')) {
      this.accountForm.get('country').setValue(this.beneficiaryService.selectedBenCountryDetails.value);
      this.setValidatorforRomania();
    }
  }
  /**
   * @methodName createForm
   * @parameter none
   * @description Used to build form along with validators
   * @return none
   */
  createForm(): void {
    this.accountForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(PATTERN_ALPHA_NUMERIC), this.sharedService.retrictWordValidator()]],
      addressOne: [null, [Validators.required, this.sharedService.retrictWordValidator()]],
      addressTwo: [null, [Validators.required, this.sharedService.retrictWordValidator()]],
      city: [null, [Validators.required, this.sharedService.retrictWordValidator()]],
      country: [null, Validators.required],
      nickName: [null, [Validators.required, this.sharedService.retrictWordValidator()]],
    });
    this.addDynamicFormControls();
  }

  /**
   * @methodName addDynamicFormControls
   * @parameter none
   * @description Used to add dynamic controls to form
   * @return none
   */
  addDynamicFormControls(): void {
    this.accountForm.reset();
    // this.accountFormDirective.resetForm();
    this.removeFormControls();
    if (this.showIBAN) {
      // tslint:disable-next-line: max-line-length
      this.accountForm.addControl('ibanNumber', new FormControl('', [Validators.required, Validators.minLength(this.FORM_LENGTH.iban.minLength),
      Validators.maxLength(this.FORM_LENGTH.iban.maxLength)]));
      this.accountForm.addControl('confirmIban', new FormControl('', [Validators.required,
      Validators.minLength(this.FORM_LENGTH.iban.minLength), Validators.maxLength(this.FORM_LENGTH.iban.maxLength)]));
      this.accountForm.setValidators(IsTaken('ibanNumber').bind(this));
      this.accountForm.setValidators(MustMatch('ibanNumber', 'confirmIban').bind(this));
      this.accountForm.updateValueAndValidity();
    } else if (this.showAccountNumber) {
      this.accountForm.addControl('account', new FormControl('', [Validators.required,
      Validators.minLength(this.FORM_LENGTH.accountNumber.minLength)]));
      this.accountForm.addControl('confirmAccount', new FormControl('', [Validators.required]));
      this.accountForm.setValidators(MustMatch('account', 'confirmAccount').bind(this));
      this.accountForm.updateValueAndValidity();
    } else if (this.showCard) {
      this.isValidOtherInternationalForm = true;
      this.currencyList = [];
      this.accountForm.setValidators(null);
      this.accountForm.addControl('cardNumber', new FormControl('', [Validators.required,
      Validators.maxLength(this.FORM_LENGTH.coverCard.maxLength)]));
      this.accountForm.updateValueAndValidity();
    }
    if (this.showABACode) {
      this.accountForm.addControl('abaCode', new FormControl(''));
      this.accountForm.updateValueAndValidity();
    }
    this.accountForm.get('country').setValue(this.beneficiaryService.selectedBenCountryDetails.value);
    this.setValidatorforRomania();
  }

  /**
   * @methodName removeFormControls
   * @parameter none
   * @description Used to remove form controls
   * @return none
   */
  removeFormControls(): void {
    this.accountForm.setValidators(null);
    this.accountForm.removeControl('ibanNumber');
    this.accountForm.removeControl('confirmIban');
    this.accountForm.removeControl('account');
    this.accountForm.removeControl('confirmAccount');
    this.accountForm.removeControl('abaCode');
    this.accountForm.removeControl('confirmABACode');
    this.accountForm.removeControl('cardNumber');
    this.accountForm.clearValidators();
    this.accountForm.reset();
    this.accountForm.updateValueAndValidity();
  }

  /**
   * @methodName onSubmit
   * @parameter none
   * @description Used to submit form data
   * @return none
   */
  onSubmit(): void {
    this.isSubmited = true;
    if (this.accountForm.valid) {
      this.formValues.emit({ status: this.accountForm.status, data: this.accountForm.value, errors: this.accountForm });
      this.beneficiaryService.setBeneficiaryPayLoad(this.accountForm);
    }
  }

  /**
   * @methodName selectedCurrency
   * @parameter event
   * @description Used to check selected currency
   * @return none
   */
  selectedCurrency(event: any): void {
    this.isValidOtherInternationalForm = true;
    this.beneficiaryService.setCurrency(event);
    this.beneficiaryService.internationalBenPayLoadObj.currency = event;
  }

  /**
   * @methodName onCountryChange
   * @parameter event
   * @description Used to fetch value of country on change
   * @return none
   */
  onCountryChange(event: any): void {
    this.beneficiaryService.selectedBenCountryDetails = { countryISOCode: event.option.id, value: event.option.value };
    this.setValidatorforRomania();
  }

  /**
   * @methodName setValidatorforRomania
   * @parameter none
   * @description Used to set validators for Romania
   * @return none
   */
  setValidatorforRomania(): void {
    if (this.beneficiaryService.selectedBenCountryDetails.value === BENEFICIARY_FORM_TEXT.romania) {
      this.addValidatorforRomania();
    } else if (this.addedValidatorForRomania) {
      this.clearValidatorforRomania();
    }
  }

  /**
   * @methodName addValidatorforRomania
   * @parameter none
   * @description Used to add validator for Romania
   * @return none
   */
  addValidatorforRomania(): void {
    this.accountForm.get(BENEFICIARY_FORM_TEXT.addressOne).setValidators([this.beneficiaryService.retrictWordForRomaniaValidator()]);
    this.accountForm.get(BENEFICIARY_FORM_TEXT.addressTwo).setValidators([this.beneficiaryService.retrictWordForRomaniaValidator()]);
    this.accountForm.updateValueAndValidity();
    this.addedValidatorForRomania = true;
  }

  /**
   * @methodName clearValidatorforRomania
   * @parameter none
   * @description Used to clear validator for Romania
   * @return none
   */
  clearValidatorforRomania(): void {
    this.accountForm.get(BENEFICIARY_FORM_TEXT.addressOne).clearValidators();
    this.accountForm.get(BENEFICIARY_FORM_TEXT.addressTwo).clearValidators();
    this.accountForm.get(BENEFICIARY_FORM_TEXT.addressOne).setValidators([Validators.required, this.sharedService.retrictWordValidator()]);
    this.accountForm.get(BENEFICIARY_FORM_TEXT.addressTwo).setValidators([Validators.required, this.sharedService.retrictWordValidator()]);
    this.accountForm.updateValueAndValidity();
    this.addedValidatorForRomania = false;
  }

  /**
   * @methodName isBeneficiaryExisits
   * @description used to check duplicate beneficiary and validates IBAN if found
   * @param filterName<string>, data <string>
   * @return boolean
   */
  isBeneficiaryExisits(formItem: string, check: string): void {
    const data: string = this.accountForm.get(formItem).value;
    if (data && formItem === BENEFICIARY_FORM_TEXT.ibanNumber && data.length >= this.FORM_LENGTH.iban.minLength) {
      this.beneficiaryService.validateIBAN(data).subscribe((res) => {
      }, errors => {
        if (errors && errors.error && errors.error.details && errors.error.details.description) {
          this.accountForm.get(formItem).setErrors({ isCustomError: true, message: errors.error.details.description.desc });
        }
      });
    }
    if (!this.sharedService.isEmpty(data)) {
      this.subscription.add(this.beneficiaryService.isBeneficiaryExisits(check, data).subscribe(
        res => {
          res ? this.accountForm.get(formItem).setErrors({ isTaken: true, message: ERROR_MESSAGES.isBeneficiaryTaken })
            : this.selfAccountCardValidation(formItem);
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
    const data: string = this.accountForm.get(formItem).value;
    if (!this.sharedService.isEmpty(data)) {
      this.subscription.add(this.beneficiaryService.checkSelfAccountsCards(formItem, data).subscribe(
        res => {
          res ? this.accountForm.get(formItem).setErrors({ isTaken: true, message: ERROR_MESSAGES.ownAccountAddition })
            : this.accountForm.get(formItem).updateValueAndValidity();
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
   * @description Used to handle card number response from component
   * @return none
   */
  handleCardNumber(cardNumber: string): void {
    this.accountForm.get(CARD_NUMBER_TEXT).setValue(cardNumber);
    if (cardNumber) {
      this.isBeneficiaryExisits(CARD_NUMBER_TEXT, BENEFICIARY_FORM_TEXT.beneAccNoText);
    }
  }
  ngOnDestroy() {
    this.removeFormControls();
    this.subscription.unsubscribe();
  }
}
