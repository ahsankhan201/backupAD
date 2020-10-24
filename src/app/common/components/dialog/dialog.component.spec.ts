import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogComponent } from './dialog.component';
import { ShowErrorComponent } from '../show-form-errors/show-form-errors.component';
import { TermsAndConditionComponent } from '../terms-and-condition/terms-and-condition.component';
import { SharedDirectiveModule } from '../../modules/shared-directives-module';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  const dialogMock = {
    close: () => { }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        HttpClientTestingModule,
        SharedDirectiveModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [DialogComponent, ShowErrorComponent, TermsAndConditionComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testing cancelDialog method
  it('should call cancelDialog', () => {
    spyOn(component, 'cancelDialog').and.callThrough();
    component.cancelDialog();
    fixture.detectChanges();
    component.closeDialog(false);
    expect(component.cancelDialog).toHaveBeenCalled();
  });

  // Testing closeDialog method
  it('dialog should call closeDialog', () => {
    const SPY = spyOn(component.dialogRef, 'close').and.callThrough();
    component.closeDialog(true);
    expect(SPY).toHaveBeenCalled();
  });

  // Testing confirmDialog method
  it('should call confirmDialog', () => {
    spyOn(component, 'confirmDialog').and.callThrough();
    component.confirmDialog();
    fixture.detectChanges();
    expect(component.confirmDialog).toHaveBeenCalled();
  });

  // Testing createDialogForm method
  it('should call createDialogForm', () => {
    spyOn(component, 'createDialogForm').and.callThrough();
    component.createDialogForm();
    fixture.detectChanges();
    expect(component.createDialogForm).toHaveBeenCalled();
  });

  // Test onEsc method
  it('dialog should be closed after onEsc()', () => {
    const SPY = spyOn(component.dialogRef, 'close').and.callThrough();
    component.onEsc();
    expect(SPY).toHaveBeenCalled();
  });

});
