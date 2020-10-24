import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderLoginAndRegistrationComponent } from './header-login-and-registration.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderLoginAndRegistrationComponent', () => {
  let component: HeaderLoginAndRegistrationComponent;
  let fixture: ComponentFixture<HeaderLoginAndRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [HeaderLoginAndRegistrationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderLoginAndRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
