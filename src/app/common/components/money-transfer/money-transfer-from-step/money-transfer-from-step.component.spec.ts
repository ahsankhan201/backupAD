import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MoneyTransferFromStepComponent } from './money-transfer-from-step.component';
import { CheckboxGenericComponent } from '../../checkbox-generic/checkbox-generic.component';
import { AccountCheckBoxComponent } from '../../account-checkbox/account-checkbox.component';
import { CheckboxCardComponent } from '../../checkbox-card/checkbox-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';

describe('MoneyTransferFromStepComponent', () => {
  let component: MoneyTransferFromStepComponent;
  let fixture: ComponentFixture<MoneyTransferFromStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedDirectiveModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [ MoneyTransferFromStepComponent, CheckboxGenericComponent, AccountCheckBoxComponent, CheckboxCardComponent  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyTransferFromStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
