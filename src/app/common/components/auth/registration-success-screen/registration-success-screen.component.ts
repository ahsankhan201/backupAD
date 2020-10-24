import { Component, Input } from '@angular/core';
import { ICON, REGISTRATION_CONFIG } from 'src/app/common/global-constants';
import { RegistrationService } from 'src/app/modules/registration/services/registration.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { COMPONENT_LIST } from 'src/app/modules/auth/auth-module.constants';

@Component({
  selector: 'app-registration-success-screen',
  templateUrl: './registration-success-screen.component.html',
  styleUrls: ['./registration-success-screen.component.scss']
})
export class RegistrationSuccessScreenComponent {
  securityIcon = ICON.securityIcon;
  loginRouterLink = REGISTRATION_CONFIG.loginRouterLink;
  @Input() title: string;
  @Input() subTitle: string;
  @Input() message: string;

  constructor(private registrationService: RegistrationService, private authService: AuthService) { }

  /**
   * @methodName handleSecurityTipClick
   * @description used to update BehaviorSubject on security tips click
   * @parameters none
   * @return none
   */
  handleSecurityTipClick(): void {
    this.registrationService.updateSecurityTipsClick(true);
  }

  /**
   * @methodName handleLoginRedirect
   * @description used to handle login url redirection / show login component
   * @parameters none
   * @return none
   */
  handleLoginRedirect(): void {
    this.authService.showComponent$.next(COMPONENT_LIST.LOGIN);
  }
}
