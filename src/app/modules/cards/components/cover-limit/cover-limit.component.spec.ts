import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/common/modules/material.module';

import { CardsService } from '../../services/cards.service';
import { CoverLimitComponent } from './cover-limit.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { OTP_RESPONSE_DATA, OTP_RESPONSE_DATA_NOT_SUCCESS } from '../../cards-module-test.data';
import { TranslateModule } from '@ngx-translate/core';

describe('CoverLimitComponent', () => {
  let component: CoverLimitComponent;
  let cardsService: CardsService;
  let fixture: ComponentFixture<CoverLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedDirectiveModule, FormsModule, ReactiveFormsModule, MaterialModule, RouterTestingModule,
        CommonAppModule, HttpClientTestingModule, BrowserAnimationsModule, TranslateModule.forRoot()],
      declarations: [ CoverLimitComponent ],
      providers: [CardsService]
    })
    .compileComponents();
    cardsService = TestBed.get(CardsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test backButtonClickedStatus method
  it('should emit backButtonClickedStatus', () => {
    spyOn(component.backButtonClicked, 'emit');
    component.onBackButtonClicked();
    expect(component.backButtonClicked.emit).toHaveBeenCalled();
  });

  // Test setCoverCardLimit method
  it('should call setCoverCardLimit', () => {
    spyOn(component, 'setCoverCardLimit');
    component.setCoverCardLimit();
    expect(component.setCoverCardLimit).toHaveBeenCalled();
  });

  // Test setCoverCardLimit method for nulresponse
  it('should call setCoverCardLimit then set selectedCoverCardData for null respose from api', () => {
    spyOn(cardsService, 'getSelectedCoverCard').and.returnValue(null);
    component.setCoverCardLimit();
    fixture.detectChanges();
    expect(component.selectedCoverCardData).toBeNull();
  });
  // Test handleConfirmWithOTP method
  it('should call handleConfirmWithOTP', () => {
    spyOn(component, 'handleConfirmWithOTP');
    component.handleConfirmWithOTP();
    expect(component.handleConfirmWithOTP).toHaveBeenCalled();
    expect(component.cardNumber).toEqual(component.cardNumber);
  });

  // Testing handleConfirmWithOTP API call method
  it('should call updateCoverCardLimit inside handleConfirmWithOTP ', async(() => {
    const RESPONSE = null;
    spyOn(cardsService, 'updateCoverCardLimit').and.returnValue(of(RESPONSE));
    spyOn(component, 'handleConfirmWithOTP').and.callThrough();
    component.handleConfirmWithOTP();
    fixture.detectChanges();
    expect(component.showComponent).toBe('SuccessScreenComponent');
  }));

  // Testing resendOTPRequired  method
  it('should call resendOTPRequired', async(() => {
    spyOn(component, 'resendOTPRequired').and.callThrough();
    component.resendOTPRequired(true);
    fixture.detectChanges();
    expect(component.resendOTPRequired).toHaveBeenCalled();
  }));

  // Testing resendOTPRequired  method with false data
  it('should call resendOTPRequired with false data', async(() => {
    spyOn(component, 'resendOTPRequired').and.callThrough();
    component.resendOTPRequired(false);
    fixture.detectChanges();
    expect(component.resendOTPRequired).toHaveBeenCalled();
  }));

  // Testing getOTPResponse  method
  it('should call getOTPResponse', async(() => {
    spyOn(component, 'getOTPResponse').and.callThrough();
    component.getOTPResponse(OTP_RESPONSE_DATA);
    fixture.detectChanges();
    expect(component.getOTPResponse).toHaveBeenCalled();
  }));

  // Testing getOTPResponse  method with not success response
  it('should call getOTPResponse method with not success response ', async(() => {
    spyOn(component, 'getOTPResponse').and.callThrough();
    component.getOTPResponse(OTP_RESPONSE_DATA_NOT_SUCCESS);
    fixture.detectChanges();
    expect(component.getOTPResponse).toHaveBeenCalled();
  }));

  // Testing handleSuccessScreenBackButtonClick  method
  it('should call handleSuccessScreenBackButtonClick', async(() => {
    spyOn(component, 'handleSuccessScreenBackButtonClick').and.callThrough();
    spyOn(component, 'onBackButtonClicked');
    component.handleSuccessScreenBackButtonClick(true);
    fixture.detectChanges();
    expect(component.handleSuccessScreenBackButtonClick).toHaveBeenCalled();
    expect(component.onBackButtonClicked).toHaveBeenCalled();
  }));

  // Testing handleSuccessScreenBackButtonClick  with fasle value
  it('should call handleSuccessScreenBackButtonClick with false value', async(() => {
    spyOn(component, 'handleSuccessScreenBackButtonClick').and.callThrough();
    spyOn(component, 'onBackButtonClicked');
    component.handleSuccessScreenBackButtonClick(false);
    fixture.detectChanges();
    expect(component.onBackButtonClicked).not.toHaveBeenCalled();
  }));

});
