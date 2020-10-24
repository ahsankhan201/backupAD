import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { LogoutComponent } from './logout.component';

import { LayoutModule } from 'src/app/common/modules/layout.module';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LogoutService } from '../services/logout.service';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        CommonAppModule,
        HttpClientTestingModule
      ],
      declarations: [
        LogoutComponent
      ],
      providers: [LogoutService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
