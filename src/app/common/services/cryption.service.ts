import * as crypto from 'crypto';
import * as CryptoJs from 'crypto-js';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BASE64, PADDING, HEX, CRYPTO_ALGORITHM, UTF8, DUMMY_STRING } from '../global-constants';
import { Observable } from 'rxjs';
import { APISyncService } from './sync.service';
@Injectable({
    providedIn: 'root'
})
export class CryptionService {
    public BASE64: BufferEncoding = BASE64;
    public PADDING = PADDING;
    public HEX: BufferEncoding = HEX;
    public UTF8 = UTF8;
    public ALOGRITHM = CRYPTO_ALGORITHM;
    public encyrptionPublicKey: string;
    constructor(private httpService: APISyncService) {
    }

    /**
     * @methodName decrypt
     * @description decrypt the encrypted string with given key and initial vector
     * @param response<string>
     * @return string
     */
    public decrypt(response: string, key: string): string {
        const decodedResponse = Buffer.from(response, this.BASE64);
        const actualIV = decodedResponse.slice(0, this.PADDING);
        const actualPayload = decodedResponse.slice(this.PADDING);
        try {
            const decipheredData = crypto.createDecipheriv(this.ALOGRITHM, Buffer.from(key, this.HEX), actualIV);
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
    public encrypt(rawData: any, key: string): string {
        const bufferData = (typeof (rawData) !== 'string') ? (JSON.stringify(rawData)) : rawData;
        const actualIV = crypto.randomBytes(this.PADDING);
        try {
            const cipheredDataObject = crypto.createCipheriv(this.ALOGRITHM, Buffer.from(key, this.HEX), actualIV);
            const encryptedData = Buffer.concat([cipheredDataObject.update(bufferData), cipheredDataObject.final()]);
            return Buffer.concat([actualIV, encryptedData]).toString(this.BASE64);
        } catch (e) {
        }
    }
    /**
     * @methodName encryptPublicKey
     * @description encrypt the raw string with given key and initial vector
     * @parameter none
     * @return string<any>
     */
    public encryptPublicKey(): any {
        const initialVector = CryptoJs.lib.WordArray.random(128 / 6);
        const binaryKey = CryptoJs.PBKDF2(DUMMY_STRING, initialVector, { keySize: 256 / 32, iterations: 1000 });
        const stringyfiedHexaKey = binaryKey.toString(CryptoJs.enc.Hex);
        try {
            const encryptedKey = crypto.publicEncrypt({
                key: this.encyrptionPublicKey,
                padding: crypto.constants.RSA_PKCS1_PADDING
            },
                Buffer.from(stringyfiedHexaKey, this.HEX));
            return { key: stringyfiedHexaKey, enceryptedKey: Buffer.from(encryptedKey).toString(this.BASE64) };
        } catch (e) {
        }
    }
    async load(): Promise<any> {
        return this.httpService
            .getWithNoIntercept(environment.encryptionCertPath)
            .toPromise()
            .then((data: any) => this.encyrptionPublicKey = data)
            .catch((err: any) => Promise.resolve());
    }
}
