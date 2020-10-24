import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SnackBar } from '../models/snackBar.model';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {

    public snackBarSubject = new Subject<SnackBar>();
    constructor() { }

    /**
     * @methodName showSnackBar
     * @description used to set the snackbar information
     * @parameters none
     * @return string
     */
    showSnackBar(value) {
        this.snackBarSubject.next(value);
    }

    /**
     * @methodName getSnackBarInfo
     * @description used to broadcast the snackbar info
     * @parameters none
     * @return string
     */
    getSnackBarInfo(): Observable<any> {
        return this.snackBarSubject.asObservable();
    }
}
