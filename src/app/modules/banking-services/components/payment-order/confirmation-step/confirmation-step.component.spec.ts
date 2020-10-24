import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { SuccessScreenComponent } from 'src/app/common/components/success-screen/success-screen.component';
import { ConfirmationStepComponent } from './confirmation-step.component';

describe('ConfirmationStepComponent', () => {
  let component: ConfirmationStepComponent;
  let fixture: ComponentFixture<ConfirmationStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationStepComponent, SuccessScreenComponent ],
      imports: [TranslateModule.forRoot(), SharedDirectiveModule, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
