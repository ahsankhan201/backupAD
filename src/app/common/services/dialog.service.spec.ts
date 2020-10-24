import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { DialogService } from './dialog.service';

describe('DialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ MatDialogModule ],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MatDialogRef, useValue: {} }
  ]
  }));

  it('should be created', () => {
    const service: DialogService = TestBed.get(DialogService);
    expect(service).toBeTruthy();
  });
});
