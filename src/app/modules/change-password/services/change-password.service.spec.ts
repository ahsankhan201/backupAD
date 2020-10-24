import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangePasswordService } from './change-password.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChangePasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const service: ChangePasswordService = TestBed.get(ChangePasswordService);
    expect(service).toBeTruthy();
  });
});
