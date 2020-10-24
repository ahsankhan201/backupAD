import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/common/services/shared.service';
import { NAV_CONTROLS, ARABIC_LANG_TEXT } from 'src/app/common/global-constants';
import { Subscription } from 'rxjs';
import { CustomerDetailsModel } from 'src/app/common/models/customer-details.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  subscription$ = new Subscription();
  profileInformation = {} as CustomerDetailsModel;
  selectedLang: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  selectedDashboard: string;
  customerName: string;
  constructor(
    private sharedService: SharedService,
    private router: Router) {
    this.sharedService.setHorizontalLineClass(NAV_CONTROLS.PROFILE_DIVIDER_CLASS);
  }

  ngOnInit() {
    this.activateMenuTab();
    this.getCustomerDetails();
    this.getLanguage();
    this.selectedDashboard = this.sharedService.selectedDashboardText;
  }

  /**
   * @methodName getCustomerDetails
   * @description used to get customer details
   * @parameters none
   * @return none
   */
  getCustomerDetails(): void {
    this.profileInformation = this.sharedService.customerDetail;
    this.customerName = this.sharedService.customerBasicDetails.fullName;
  }

  /**
   * @methodName handleCancelButtonClick
   * @description used to update handle cancel event
   * @parameters none
   * @return none
   */
  handleCancelButtonClick(): void {
    this.router.navigateByUrl(this.sharedService.getPreviousRoute());
  }

  /**
   * @methodName activateMenuTab
   * @params none
   * @description activating the menu tab in side nav
   * @return none
   */
  activateMenuTab(): void {
    const routerLinkClass = this.sharedService.getPreviousRoute() ?
      document.querySelector('[ng-reflect-router-link=' + this.sharedService.getPreviousRoute() + ']') : '';
    if (routerLinkClass) {
      document.querySelector('[ng-reflect-router-link=' + this.sharedService.getPreviousRoute() + ']').classList.add('active');
    }
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

  ngOnDestroy() {
    this.subscription$.unsubscribe();
    this.sharedService.setHorizontalLineClass(undefined);
    if (document.querySelector('[ng-reflect-router-link=' + this.sharedService.getPreviousRoute() + ']')
    && this.sharedService.getPreviousRoute()) {
      document.querySelector('[ng-reflect-router-link=' + this.sharedService.getPreviousRoute() + ']').classList.remove('active');
    }
  }
}
