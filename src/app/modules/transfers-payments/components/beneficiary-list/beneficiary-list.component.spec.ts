import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BenificiaryListComponent } from './beneficiary-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonAppModule } from 'src/app/common/modules/common-app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('BenificiaryListComponent', () => {
  let component: BenificiaryListComponent;
  let fixture: ComponentFixture<BenificiaryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, CommonAppModule, HttpClientTestingModule,
        TranslateModule.forRoot()],
      declarations: [BenificiaryListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenificiaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
