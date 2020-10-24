import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { UaeOtherAccountComponent } from './uae-other-account.component';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { AccountSelectionFormComponent } from '../account-selection-form/account-selection-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { CdkStepper } from '@angular/cdk/stepper';
import { RouterTestingModule } from '@angular/router/testing';

describe('UaeOtherAccountComponent', () => {
  let component: UaeOtherAccountComponent;
  let fixture: ComponentFixture<UaeOtherAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonAppModule, FormsModule, ReactiveFormsModule, MaterialModule,
        HttpClientTestingModule, SharedDirectiveModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [UaeOtherAccountComponent, AccountSelectionFormComponent],
      providers: [{
        TranslateService,
        provide: CdkStepper,
        useValue: {}
      }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UaeOtherAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
