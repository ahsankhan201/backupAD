import * as crypto from 'crypto';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BASE64, PADDING, HEX, CRYPTO_ALGORITHM, UTF8} from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class CryptionService {
    public key = environment.SYMMETRIC_KEY;
    public BASE64: BufferEncoding = BASE64;
    public PADDING = PADDING;
    public HEX: BufferEncoding = HEX;
    public UTF8 = UTF8;
    public ALOGRITHM = CRYPTO_ALGORITHM;
    constructor() {}

    /**
     * @methodName decrypt
     * @description decrypt the encrypted string with given key and initial vector
     * @param response<string>
     * @return string
     */
    public decrypt(response: string): string {
        const decodedResponse = Buffer.from(response, this.BASE64);
        const actualIV = decodedResponse.slice(0, this.PADDING);
        const actualPayload = decodedResponse.slice(this.PADDING);
        try {
            const decipheredData = crypto.createDecipheriv(this.ALOGRITHM, Buffer.from(this.key, this.HEX), actualIV);
            return decipheredData.update(actualPayload) + decipheredData.final(this.UTF8);
        } catch (e) {
        }
    }
    /**
     * @methodName encrypt
     * @description encrypt the raw string with given key and initial vector
     * @param rawData<any>
     * @return string
     */
    public encrypt(rawData: any): string {
        const bufferData = JSON.stringify(rawData);
        const actualIV = crypto.randomBytes(this.PADDING);
        try {
            const cipheredDataObject = crypto.createCipheriv(this.ALOGRITHM, Buffer.from(this.key, this.HEX), actualIV);
            const encryptedData = Buffer.concat([cipheredDataObject.update(bufferData), cipheredDataObject.final()]);
            return Buffer.concat([actualIV, encryptedData]).toString(this.BASE64);
        } catch (e) {
        }
    }

}
