import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})

export class APISyncService {
    // retryCount: number = environment ? environment.retryCount : 2;
    constructor(private http: HttpClient) { }

    /**
     * @methodName get
     * @description used to fetch the data from sever
     * @param url<string>, payLoad<Object>
     * return observable object
     */
    get(url: string, type = 'text', headers?: HttpHeaders, paramsObject?: any): Observable<any> {
        return this.http.get(url, { headers, responseType: type as any, params: paramsObject });
    }

    /**
     * @methodName put
     * @description used to fetch the data from sever
     * @param url<string>, payLoad<Object>
     * return observable object
     */
    put(url: string, payLoad?: any, type = 'text', headers?: HttpHeaders, enableCredentials = false): Observable<any> {
        return this.http.put(encodeURI(url), payLoad,
            { headers, withCredentials: enableCredentials, observe: 'response', responseType: type as any });
    }
    /**
     * @methodName post
     * @description used to fetch the data from sever
     * @param url<string>, payLoad<Object>
     * return observable object
     */
    post(url: string, payLoad: any, type = 'text', headers?: HttpHeaders, enableCredentials = false): Observable<any> {
        return this.http.post(encodeURI(url), payLoad,
            { headers, withCredentials: enableCredentials, observe: 'response', responseType: type as any });
    }
    /**
     * @methodName patch
     * @description used to fetch the data from sever
     * @param url<string>, payLoad<Object>
     * return observable object
     */
    patch(url: string, payLoad?: any, type = 'text'): Observable<any> {
        return this.http.patch(url, payLoad, { responseType: type as any });
    }

    /**
     * @methodName delete
     * @description used to fetch the data from sever
     * @param url<string>, payLoad<Object>
     * return observable object
     */
    delete(url: string, payLoad?: any, type = 'text'): Observable<any> {
        return this.http.delete(url, { responseType: type as any });
    }
}
