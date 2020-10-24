import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityTipsComponent } from './security-tips.component';
import { LottieAnimationViewModule } from 'ng-lottie';
import { TranslateModule } from '@ngx-translate/core';

xdescribe('SecurityTipsComponent', () => {
  let component: SecurityTipsComponent;
  let fixture: ComponentFixture<SecurityTipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LottieAnimationViewModule.forRoot(), TranslateModule.forRoot()],
      declarations: [ SecurityTipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
