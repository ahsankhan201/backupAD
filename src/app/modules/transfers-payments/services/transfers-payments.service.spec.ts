import { TestBed } from '@angular/core/testing';

import { TransfersPaymentsService } from './transfers-payments.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

describe('TransfersPaymentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MatDialogRef, useValue: {} }
  ]
  }));

  it('should be created', () => {
    const service: TransfersPaymentsService = TestBed.get(TransfersPaymentsService);
    expect(service).toBeTruthy();
  });
});
