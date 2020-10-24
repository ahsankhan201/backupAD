import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuccessScreenComponent } from './success-screen.component';
import { SUCCESS_SCREEN_TEXT, PAYEE_SUCCESS_SCREEN_TEXT } from '../../global-constants';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';

describe('SuccessScreenComponent', () => {
  let component: SuccessScreenComponent;
  let fixture: ComponentFixture<SuccessScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule, SharedDirectiveModule],
      declarations: [SuccessScreenComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessScreenComponent);
    component = fixture.componentInstance;
    component.successScreenTextBeneficiary = SUCCESS_SCREEN_TEXT;
    component.linkAccountDetails = { accountNumber: '12312', debitCardNumber: '231567823', componentTitle: 'Link Account' };
    fixture.detectChanges();
  });

  // Checking component creation method
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('Testing ngOnInit Method', () => {
    component.showPayeeSuccessScreen = true;
    component.successScreenTextPayee = PAYEE_SUCCESS_SCREEN_TEXT;
    expect(component.showPayeeSuccessScreen).toBeTruthy();
    component.ngOnInit();
  });

});
