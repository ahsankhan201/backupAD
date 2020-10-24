import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { UaeAdibBeneficiaryComponent } from './uae-adib-beneficiary.component';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkStepper } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

describe('UaeAdibBeneficiaryComponent', () => {
  let component: UaeAdibBeneficiaryComponent;
  let fixture: ComponentFixture<UaeAdibBeneficiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonAppModule, FormsModule, ReactiveFormsModule, MaterialModule,
        SharedDirectiveModule, HttpClientTestingModule, BrowserAnimationsModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [UaeAdibBeneficiaryComponent],
      providers: [{ TranslateService, provide: MatStepper, useValue: {} }, { provide: CdkStepper, useValue: {} }],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UaeAdibBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
