import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { SharedDirectiveModule } from './common/modules/shared-directives-module';
import { MaterialModule } from './common/modules/material.module';

import { SnackBarService } from './common/services/snack-bar.service';

import { AppComponent } from './app.component';
import { HeaderDashboardComponent } from './common/components/layout/header-dashboard/header-dashboard.component';
import { SidebarComponent } from './common/components/layout/sidebar/sidebar.component';
import { SnackBarComponent } from './common/components/snack-bar/snack-bar.component';
import { MenuOptionComponent } from './common/components/menu-option/menu-option.component';

import { LOCALE_DATA, SNACK_BAR_RESPONSE } from './app-component.test.data';
import { FooterDashboardComponent } from './common/components/layout/footer-dashboard/footer-dashboard.component';
import { LoaderComponent } from './common/components/layout/loader/loader.component';
import { LottieAnimationViewModule } from 'ng-lottie';
import { LogoutService } from './modules/logout/services/logout.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let app: AppComponent;
  let snackBarService: SnackBarService;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async(() => {
    localStorage.removeItem(LOCALE_DATA.localeText);
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        SharedDirectiveModule,
        MaterialModule,
        LottieAnimationViewModule
      ],
      declarations: [
        AppComponent,
        HeaderDashboardComponent,
        SidebarComponent,
        SnackBarComponent,
        MenuOptionComponent,
        FooterDashboardComponent,
        LoaderComponent
      ],
      providers: [
        TranslateService,
        SnackBarService,
        LogoutService
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    snackBarService = TestBed.get(SnackBarService);
    component = fixture.componentInstance;
    app = fixture.debugElement.componentInstance;
  }));

  // Testing APP creation
  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  // Testing setLocale set method
  it('setLocale should set locale', () => {
    app.setLocale();
    expect(localStorage.getItem(LOCALE_DATA.localeText)).toBe(LOCALE_DATA.defaultLocale);
  });

  // Testing setLocale get method
  it('setLocale should get locale', () => {
    localStorage.setItem(LOCALE_DATA.localeText, LOCALE_DATA.arabicLocale);
    app.setLocale();
    expect(localStorage.getItem(LOCALE_DATA.localeText)).toBe(LOCALE_DATA.arabicLocale);
  });

  // Testing setLocale method get locale which is not in the list
  it('setLocale should get locale which is not in the list', () => {
    localStorage.setItem(LOCALE_DATA.localeText, LOCALE_DATA.invalidLocale);
    app.setLocale();
    expect(localStorage.getItem(LOCALE_DATA.localeText)).toBe(LOCALE_DATA.defaultLocale);
  });

  // Testing showSnackBarWithMessage method
  it('should call showSnackBarWithMessage', () => {
    spyOn(component, 'showSnackBarWithMessage').and.callThrough();
    spyOn(snackBarService, 'getSnackBarInfo').and.returnValue(of(SNACK_BAR_RESPONSE));
    component.showSnackBarWithMessage();
    fixture.detectChanges();
    expect(component.showSnackBarWithMessage).toHaveBeenCalled();
    expect(component.showSnackBar).toEqual(SNACK_BAR_RESPONSE.showSnackBar);
  });
});
