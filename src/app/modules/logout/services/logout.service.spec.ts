import { TestBed } from '@angular/core/testing';

import { LogoutService } from './logout.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/common/modules/material.module';

describe('LogoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [LogoutService],
    imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule]
  }));

  it('should be created', () => {
    const service: LogoutService = TestBed.get(LogoutService);
    expect(service).toBeTruthy();
  });
});
