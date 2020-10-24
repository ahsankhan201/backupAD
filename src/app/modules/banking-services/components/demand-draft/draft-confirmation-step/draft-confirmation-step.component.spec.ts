import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SuccessScreenComponent } from 'src/app/common/components/success-screen/success-screen.component';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';

import { DraftConfirmationStepComponent } from './draft-confirmation-step.component';

describe('DraftConfirmationStepComponent', () => {
  let component: DraftConfirmationStepComponent;
  let fixture: ComponentFixture<DraftConfirmationStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DraftConfirmationStepComponent, SuccessScreenComponent],
      imports: [TranslateModule.forRoot(), SharedDirectiveModule, HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftConfirmationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
