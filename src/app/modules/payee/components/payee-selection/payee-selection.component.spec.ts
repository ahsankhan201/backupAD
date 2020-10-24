import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PayeeSelectionComponent } from './payee-selection.component';
import { CheckboxWithImageComponent } from 'src/app/common/components/checkbox-with-image/checkbox-with-image.component';
import { PAYEE_SELECTION_TEST_INFO, CHECK_BOX_SELECTOR } from '../../payee-module-test.data';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('PayeeSelectionComponent', () => {
  let component: PayeeSelectionComponent;
  let fixture: ComponentFixture<PayeeSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PayeeSelectionComponent,
        CheckboxWithImageComponent
      ],
      imports: [HttpClientTestingModule,
        TranslateModule.forRoot(), RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeSelectionComponent);
    component = fixture.componentInstance;
    component.payeeSelectionList = PAYEE_SELECTION_TEST_INFO;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // Testing ngDestroy method
  it('Checking ngDestroy method', () => {
    expect(component.enableNextBtn).toBeFalsy();
    component.ngOnDestroy();
  });
  // Testing selectedPayee method
  it('Checking selectedPayee method', () => {
    expect(component.enableNextBtn).toBeFalsy();
    const payeeOptionEle = fixture.debugElement.query(By.css(`.${CHECK_BOX_SELECTOR}`));
    payeeOptionEle.nativeElement.click();
    expect(component.enableNextBtn).toBeTruthy();
  });
});
