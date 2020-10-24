import { TestBed } from '@angular/core/testing';

import { CryptionService } from './cryption.service';

const SAMPLE = 'sample';
const ENCRYPTED_SAMPLE_DATA = 'ZaM3aoui9dmB5JNaZnFtuZrT/qrRIrhXpga7SrQSEh0=';
describe('CryptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CryptionService = TestBed.get(CryptionService);
    expect(service).toBeTruthy();
  });
  xit('should do encyrption', () => {
    const service: CryptionService = TestBed.get(CryptionService);
    const encryptedData  = service.encrypt(SAMPLE);
    expect(encryptedData).toBe(ENCRYPTED_SAMPLE_DATA);
  });
  xit('should do decyption', () => {
    const service: CryptionService = TestBed.get(CryptionService);
    const decryptedData  = service.decrypt(ENCRYPTED_SAMPLE_DATA);
    expect(decryptedData).toBe(SAMPLE);
  });
});
