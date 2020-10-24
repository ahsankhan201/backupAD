import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { APISyncService } from 'src/app/common/services/sync.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { LogoutService } from 'src/app/modules/logout/services/logout.service';

import { NAVBAR_LIST_JSON, ARABIC_LANG_TEXT, LOGOUT_DROPDOWN, PROFILE_MENU_DATA } from 'src/app/common/global-constants';
import { MenuOptionItem, MenuOption } from 'src/app/common/models/menu-option.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  logoutDropDownList: MenuOptionItem[] = LOGOUT_DROPDOWN;
  collapseMenu = false;
  navlists: string[];
  selectedLanguage: string;
  arabicLanguageText = ARABIC_LANG_TEXT;
  subscription$ = new Subscription();
  customerName: string;

  @ViewChild('sideNavContent', { static: true }) sideNavContent: ElementRef;
  constructor(
    private router: Router,
    private syncService: APISyncService,
    private sharedService: SharedService,
    private logoutService: LogoutService) { }

  ngOnInit() {
    this.syncService.get(NAVBAR_LIST_JSON, 'json').subscribe(
      data => {
        this.navlists = data as string[];
      });
    this.loadUserData();
    this.getSelectedLanguage();
  }

  /**
   * @methodName closeMenu
   * @description Toggle navbar after clicking outside on the grey background
   * @parameters event
   * @return none
   */
  closeMenu(event): void {
    if (event.target.classList.contains('showBg')) {
      this.collapseMenu = false;
      this.sideNavContent.nativeElement.classList.contains('show') ? this.sideNavContent.nativeElement.classList.remove('show') :
        this.sideNavContent.nativeElement.classList.add('show');
    }
  }

  /**
   * @methodName loadUserData
   * @description used to load userData from userService
   * @parameters none
   * @return none
   */

  loadUserData(): void {
    this.subscription$.add(this.sharedService.customerDetailsSubject.subscribe(response => {
      this.customerName = response;
    }));
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
   * @methodName menuClickHandler
   * @description used to recieve clicked menu option and logout from the application
   * @parameters selectedMenuItem<string>
   * @return none
   */
  menuClickHandler(selectedMenuItem: MenuOption): void {
    if (selectedMenuItem.actionType === PROFILE_MENU_DATA.logout) {
      this.logoutService.logoutUser();
    } else if (selectedMenuItem.actionType === PROFILE_MENU_DATA.changePassword) {
      this.router.navigateByUrl(PROFILE_MENU_DATA.changePasswordRoute);
    } else if (selectedMenuItem.actionType === PROFILE_MENU_DATA.myProfile) {
      this.router.navigateByUrl(PROFILE_MENU_DATA.profileRoute);
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
