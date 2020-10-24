import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionComponent } from './terms-and-condition.component';
import { TranslateModule } from '@ngx-translate/core';

describe('TermsAndConditionComponent', () => {
  let component: TermsAndConditionComponent;
  let fixture: ComponentFixture<TermsAndConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsAndConditionComponent ],
      imports: [TranslateModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
