import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CountdownModule } from 'ngx-countdown';
import { RouterTestingModule } from '@angular/router/testing';
import { GhinaSummaryComponent } from './ghina-summary.component';
import { OTPComponent } from '../../../otp/otp.component';
import { SuccessScreenComponent } from '../../../success-screen/success-screen.component';
import { InputGenericComponent } from '../../../input-generic/input-generic.component';
import { RecaptchaComponent } from '../../../recaptcha/recaptcha.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { AlertMessageComponent } from '../../../alert-message/alert-message.component';
import { ShowErrorComponent } from '../../../show-form-errors/show-form-errors.component';

describe('GhinaSummaryComponent', () => {
  let component: GhinaSummaryComponent;
  let fixture: ComponentFixture<GhinaSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        CountdownModule,
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule,
        MaterialModule,
        SharedDirectiveModule
      ],
      declarations: [
        GhinaSummaryComponent,
        OTPComponent,
        SuccessScreenComponent,
        GhinaSummaryComponent,
        InputGenericComponent,
        RecaptchaComponent,
        AlertMessageComponent,
        ShowErrorComponent
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhinaSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
