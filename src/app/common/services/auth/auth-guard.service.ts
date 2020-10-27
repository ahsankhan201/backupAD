import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private sharedService: SharedService, private router: Router) { }
  /**
   * @methodName canActivate
   * @description It will return boolean value based on access token validity to router
   * @parameters none
   * @return boolean
   */
  canActivate(): boolean {
    if (this.isAuthorizedUser()) {
      return true;
    } else {
      // if user not authenticated redirect to login page
      this.router.navigateByUrl('/');
    }
  }

  /**
   * @methodName isAuthorizedUser
   * @description check the access token if its' present return true else false
   * @parameters none
   * @return boolean
   */
  isAuthorizedUser(): boolean {
    return (this.sharedService.accessToken && this.sharedService.refreshToken && this.sharedService.isUserLoggedIn) ? true : false;
  }
}
