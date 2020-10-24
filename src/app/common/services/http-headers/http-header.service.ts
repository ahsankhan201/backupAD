import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SharedService } from '../shared.service';

import { TEXT_PLAIN, API_HEADERS, APPLICATION_JSON_TEXT, IS_REGISTERED_TEXT, CAPTCHA_TEXT } from '../../global-constants';
import { HeadersOTP } from '../../models/headers.model';

@Injectable({
  providedIn: 'root'
})
export class HttpHeaderService {
  requestHeaders: HttpHeaders = new HttpHeaders();
  reCaptchaValue: string;
  requestURL: string;
  xUniqueId: string;

  customHeaderFunction = this.generateCommonHeaders;  // Used to assign custom header method created
  constructor(private sharedService: SharedService) { }

  /**
   * @methodName generateHttpHeaders
   * @description used to generate headers at interceptor level
   * @parameters requestHeaders<HttpHeaders>
   * @return HttpHeaders
   */
  generateHttpHeaders(request: HttpRequest<any>): HttpHeaders {
    this.requestURL = request.url;
    this.requestHeaders = request.headers;
    if (typeof this.customHeaderFunction === 'function') {
      this.requestHeaders = this.customHeaderFunction();
    }
    this.customHeaderFunction = this.generateCommonHeaders; // Reset http Header to default - generateCommonHeaders
    return this.requestHeaders;
  }

  /**
   * @methodName generateCommonHeaders
   * @description used to generate common headers
   * @parameters requestHeaders<HttpHeaders>
   * @return HttpHeaders
   */
  generateCommonHeaders(): HttpHeaders {
     const requestHeaders = this.requestHeaders.set('Authorization', 'Bearer ' + this.sharedService.accessToken)
      .set('Content-Type', TEXT_PLAIN)
      .set('x-rim', API_HEADERS.xRim)
      .set('x-channel-id', API_HEADERS.xChannelId)
      .set('x-application-name', 'ANY')
      .set('x-language', this.sharedService.xLanguage)
      .set('placeholders', '[]')
      .set('action_type', 'COMMON_TEMPLATE')
      .set('x-delivermech', environment.DELIVERY_MECH_VALUE)
      .set('x-product-id', 'ANY')
      .set('x-service-name', 'ANY')
      .set('x-unique-id', this.generateUniqueID())
      .set('Access-Control-Expose-Headers', ['Location', 'Content-Disposition', 'cooling-period']);
     return requestHeaders;

  }

  /**
   * @methodName generateCiamOTPHeaders
   * @description used to generate Header for registration OTP
   * @parameters none
   * @return HttpHeaders
   */
  generateCiamOTPHeaders(): HttpHeaders {
    const headersData = {} as HeadersOTP;
    headersData['Content-Type'] = API_HEADERS.ContentType;
    headersData['x-channel-id'] = API_HEADERS.xChannelId;
    headersData['x-application-name'] = 'ANY';
    headersData['x-language'] = this.sharedService.xLanguage;
    headersData.placeholders = '[]';
    headersData.action_type = 'COMMON_TEMPLATE';
    headersData['x-product-id'] = 'ANY';
    headersData['x-service-name'] = 'ANY';
    headersData['x-delivermech'] = environment.DELIVERY_MECH_VALUE;
    headersData['Authorization'] = `Bearer ${this.sharedService.accessToken}`;
    headersData[API_HEADERS.xUniqueId] = this.generateUniqueID();
    return this.sharedService.generateHTTPHeaders(headersData);
  }

  /**
   * @methodName generateCiamValidateCardHeaders
   * @description used to generate Header to validate card+pin Headers
   * @parameters none
   * @return HttpHeaders
   */
  generateCiamValidateCardHeaders(): HttpHeaders {
    const HEADERS = new HttpHeaders().set('Content-Type', environment.CIAM.CONTENT_TYPE);
    return HEADERS;
  }

  /**
   * @methodName generateCIAMUsernameHeaders
   * @description used to generate Header to validate username Headers
   * @parameters none
   * @return HttpHeaders
   */
  generateCIAMUsernameHeaders(): HttpHeaders {
    const HEADERS = new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedService.accessToken)
      .set('Content-Type', TEXT_PLAIN);
    return HEADERS;
  }

  /**
   * @methodName generateCIAMUsernameHeaders
   * @description used to generate Header to validate username Headers
   * @parameters none
   * @return HttpHeaders
   */
  generateCIAMPasswordHeaders(): HttpHeaders {
    const HEADERS = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.sharedService.accessToken)
      .set('Content-Type', TEXT_PLAIN)
      .set('action_type_sms', 'MOBN_EPIN_RESET')
      .set('placeholders', '[]')
      .set('x-application-name', 'CORE_APP')
      .set('x-channel-id', API_HEADERS.xChannelId)
      .set('x-service-name', 'CIAM')
      .set('x-language', this.sharedService.xLanguage)
      .set(API_HEADERS.xUniqueId, this.generateUniqueID());
    return HEADERS;
  }

  /** @methodName generateDeviceSessionRegHeaders
   * @description used to generate device session regestration headers
   * @parameters none
   * @return HttpHeaders
   */
  generateDeviceSessionRegHeaders(): HttpHeaders {
    return new HttpHeaders().set('Content-Type', TEXT_PLAIN)
      .set('Accept', APPLICATION_JSON_TEXT)
      .set('Authorization', 'Bearer ' + this.sharedService.accessToken);
  }

  /**
   * @methodName generateLoginHeaders
   * @description used to generate login headers
   * @parameters none
   * @return HttpHeaders
   */
  generateLoginHeaders(): HttpHeaders {
    let HEADERS: HttpHeaders = new HttpHeaders();
    HEADERS = HEADERS.append('Content-Type', environment.CIAM.CONTENT_TYPE);
    if (this.reCaptchaValue) {
      HEADERS = HEADERS.append(CAPTCHA_TEXT, this.reCaptchaValue);
    }
    return HEADERS;
  }

  /**
   * @methodName generateDeviceRegHeaders
   * @description used to generate device regestration headers
   * @parameters none
   * @return HttpHeaders
   */
  generateDeviceRegHeaders(): HttpHeaders {
    return new HttpHeaders().set('Content-Type', TEXT_PLAIN)
      .set('Accept', APPLICATION_JSON_TEXT)
      .set('x-delivermech', environment.DELIVERY_MECH_VALUE)
      .set('Authorization', 'Bearer ' + this.sharedService.accessToken)
      .set('x-channel-id', API_HEADERS.xChannelId)
      .set('Access-Control-Expose-Headers', IS_REGISTERED_TEXT)
      .set(API_HEADERS.xUniqueId, this.generateUniqueID())
      .set('x-service-name', 'ANY')
      .set('action_type', 'COMMON_TEMPLATE')
      .set('placeholders', '[]')
      .set('x-application-name', 'ANY')
      .set('x-language', this.sharedService.xLanguage);
  }

  /**
   * @methodName subscriptionHeaders
   * @description used to generate subscription Headers
   * @parameters none
   * @return HttpHeaders
   */
  subscriptionHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedService.accessToken)
      .set('x-application-name', 'ANY')
      .set('x-channel-id', API_HEADERS.xChannelId)
      .set('x-language', this.sharedService.xLanguage)
      .set('Content-Type', API_HEADERS.ContentType)
      .set('x-rim', API_HEADERS.xRim)
      .set(API_HEADERS.xUniqueId, this.generateUniqueID());
  }

  /**
   * @methodName ciamOtpWithCaptchaHeaders
   * @description used to generate Header to validate otp with captcha Headers
   * @parameters none
   * @return HttpHeaders
   */
  ciamOtpWithCaptchaHeaders(): HttpHeaders {
    const headersData = {} as HeadersOTP;
    headersData['Authorization'] = `Bearer ${this.sharedService.accessToken}`;
    headersData['Content-Type'] = API_HEADERS.ContentType;
    if (this.reCaptchaValue) {
      headersData['captcha'] = this.reCaptchaValue;
    }
    return this.sharedService.generateHTTPHeaders(headersData);
  }

  /**
   * @methodName onlyAuthorizationHeader
   * @description used to generate only authorization Header
   * @parameters none
   * @return HttpHeaders
   */
  onlyAuthorizationHeader(): HttpHeaders {
    const HEADERS = new HttpHeaders().set('Authorization', 'Bearer ' + this.sharedService.accessToken)
      .set('Content-Type', API_HEADERS.ContentType);
    return HEADERS;
  }

  /**
   * @methodName forgetUsernameHeaders
   * @description used to generate Header for foget username
   * @parameters none
   * @return HttpHeaders
   */
  forgetUsernameHeaders(): HttpHeaders {
    const HEADERS = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.sharedService.accessToken)
      .set('Content-Type', TEXT_PLAIN)
      .set('action_type_email', API_HEADERS.action_type_email)
      .set('x-application-name', API_HEADERS.any)
      .set('x-channel-id', API_HEADERS.xChannelId)
      .set('x-service-name', API_HEADERS.any)
      .set('x-language', this.sharedService.xLanguage)
      .set(API_HEADERS.xUniqueId, this.generateUniqueID());
    return HEADERS;
  }

  /**
   * @methodName refershTokenHeaders
   * @description used to generate refresh token headers
   * @parameters none
   * @return HttpHeaders
   */
  refershTokenHeaders(): HttpHeaders {
    return new HttpHeaders().set('Content-Type', environment.CIAM.CONTENT_TYPE);
  }

  /**
   * @methodName generateUniqueID
   * @description used to generate uniqueID for otp and other api calls
   * @parameters none
   * @return string
   */
  generateUniqueID(): string {
    if ( this.requestURL.includes(environment.APP)) {
      if (!this.xUniqueId) {
        this.xUniqueId = this.sharedService.generateUniqueID();
      }
      return this.xUniqueId ;
    } else {
      this.xUniqueId = undefined;
      return this.sharedService.generateUniqueID() ;
    }
  }
}
