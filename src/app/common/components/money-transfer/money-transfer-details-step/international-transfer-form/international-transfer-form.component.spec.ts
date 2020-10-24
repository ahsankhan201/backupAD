import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CdkStepper } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { InternationalTransferFormComponent } from './international-transfer-form.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { CheckboxGenericComponent } from '../../../checkbox-generic/checkbox-generic.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { ShowErrorComponent } from '../../../show-form-errors/show-form-errors.component';

xdescribe('TransferDetailsComponent', () => {
  let component: InternationalTransferFormComponent;
  let fixture: ComponentFixture<InternationalTransferFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, SharedDirectiveModule, FormsModule, ReactiveFormsModule,
        MaterialModule, TranslateModule.forRoot(), BrowserAnimationsModule, RouterTestingModule],
      declarations: [
        InternationalTransferFormComponent, CheckboxGenericComponent, ShowErrorComponent
      ],
      providers: [{ provide: MatStepper, useValue: {} }, { provide: CdkStepper, useValue: {} }],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternationalTransferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
