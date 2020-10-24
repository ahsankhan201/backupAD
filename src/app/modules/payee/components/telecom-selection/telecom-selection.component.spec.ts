import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TelecomSelectionComponent } from './telecom-selection.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('TelecomSelectionComponent', () => {
  let component: TelecomSelectionComponent;
  let fixture: ComponentFixture<TelecomSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonAppModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [
        TelecomSelectionComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelecomSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
