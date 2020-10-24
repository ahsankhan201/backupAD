import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DecimalValuePipe } from '../../../pipes/decimal-value/decimal-value.pipe';
import { HeaderDashboardComponent } from './header-dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from 'src/app/common/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { NumberFormatPipe } from 'src/app/common/pipes/number-format/number-format.pipe';
import { MenuOptionComponent } from '../../menu-option/menu-option.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { LogoutService } from 'src/app/modules/logout/services/logout.service';

describe('HeaderDashboardComponent', () => {
  let component: HeaderDashboardComponent;
  let fixture: ComponentFixture<HeaderDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderDashboardComponent,
        DecimalValuePipe,
        NumberFormatPipe,
        MenuOptionComponent
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MaterialModule,
        RouterTestingModule
      ],
      providers: [
        UserService,
        TranslateService,
        LogoutService
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the header dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should have logo ', () => {
    const logo = fixture.debugElement.nativeElement.querySelector('.ibd-navbar-comp__logo');
    expect(logo.innerHTML).not.toBeNull();
  });

  xit('should have user image ', () => {
    const image = fixture.debugElement.nativeElement.querySelector('.ibd-header__wrapper__profile');
    expect(image.innerHTML).not.toBeNull();
  });
});
