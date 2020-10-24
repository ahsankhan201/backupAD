import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MenuOptionComponent } from '../../menu-option/menu-option.component';
import { MaterialModule } from 'src/app/common/modules/material.module';
import { LogoutService } from 'src/app/modules/logout/services/logout.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent, MenuOptionComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule,
        TranslateModule.forRoot()],
        providers: [LogoutService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Testing sidebar component methods', () => {
    component.closeMenu({ target: { classList: { contains() { return true; } } } });
  });
});
