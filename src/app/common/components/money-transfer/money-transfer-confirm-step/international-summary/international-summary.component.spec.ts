import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectiveModule } from 'src/app/common/modules/shared-directives-module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InternationalTransferSummaryComponent } from './international-summary.component';
import { SuccessScreenComponent } from '../../../success-screen/success-screen.component';
import { MaterialModule } from 'src/app/common/modules/material.module';

describe('InternationalTransferSummaryComponent', () => {
  let component: InternationalTransferSummaryComponent;
  let fixture: ComponentFixture<InternationalTransferSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedDirectiveModule, HttpClientTestingModule, MaterialModule, RouterTestingModule],
      declarations: [InternationalTransferSummaryComponent, SuccessScreenComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternationalTransferSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
