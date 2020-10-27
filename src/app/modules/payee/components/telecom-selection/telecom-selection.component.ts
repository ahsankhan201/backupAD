import { Component, OnInit, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';

// Include services here
import { PayeeService } from '../../services/payee.service';

// Include constants and models here
import { CHECKBOX_COMP_NAME, PAYEE_SELECTION_MASTER_DATA } from '../../payee-module.constants';
import { NAV_CONTROLS, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { CheckBoxEmittedObj } from 'src/app/common/models/payee.model';
import { SharedService } from 'src/app/common/services/shared.service';
import { CheckboxGenericComponent } from 'src/app/common/components/checkbox-generic/checkbox-generic.component';

@Component({
    selector: 'app-telecom-selection',
    templateUrl: './telecom-selection.component.html',
    styleUrls: ['./telecom-selection.component.scss']
})
export class TelecomSelectionComponent implements OnInit, OnDestroy {
    subscription$ = new Subscription();
    telecomProvidersList: any = [];
    enableNextBtn = false;
    navControlsText = NAV_CONTROLS;
    selectedLanguage: string;
    arabicLanguageText = ARABIC_LANG_TEXT;
    previousSelectedProvider: string;
    @ViewChildren(CheckboxGenericComponent) checkboxComponent: QueryList<CheckboxGenericComponent>;
    constructor(
        private payeeService: PayeeService,
        private sharedService: SharedService) { }

    ngOnInit() {
        this.getSelectedLanguage();
        this.getTelecomProductsList();
    }

    /**
     * @methodName getTelecomProductsList
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
     * @methodName getTelecomProductsList
     * @parameter none
     * @description Used to get the telecom provider products list
     * @return none
     */
    getTelecomProductsList(): void {
        this.subscription$.add(this.payeeService.getSelectedProvider().subscribe(response => {
            if (response === PAYEE_SELECTION_MASTER_DATA.TELECOM_TEXT) {
                this.telecomProvidersList = this.payeeService.getTelecomProductsObj
                    (this.payeeService.getServiceProvidersList(PAYEE_SELECTION_MASTER_DATA.TELECOM_TEXT));
            }
        }));
    }
    /**
     * @methodName selectedTelecomProduct
     * @parameter selectProduct<CheckBoxEmittedObj> selectedProvider<string>
     * @description Used to set the telecom provider object
     * @return none
     */
    selectedTelecomProduct(selectProduct: CheckBoxEmittedObj, selectedProvider: string): void {
        if (this.previousSelectedProvider && selectedProvider !== this.previousSelectedProvider) {
            this.checkboxComponent.forEach(checkbox => {
                if (checkbox.componentName === CHECKBOX_COMP_NAME + this.previousSelectedProvider) {
                    checkbox.handleMultipleCheckboxClickEvent();
                }
            });
        }
        this.previousSelectedProvider = selectedProvider;
        this.enableNextBtn = true;
        this.payeeService.selectedProviderProduct = selectProduct;
        this.payeeService.setSelectedProduct(selectProduct.value);
    }

    ngOnDestroy() {
        this.subscription$.unsubscribe();
    }
}
