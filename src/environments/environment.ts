export const environment = {
  encryptionCertPath : './assets/cer.cer',
  production: false,
  API_CONNECT_URL: 'https://apisitgateway.adib.co.ae',
  ADIB: '/adib/sb',
  APP: '/app',
  DELIVERY_MECH_VALUE: 'ibotp',
  retryCount: 0,
  IBM_CLIENT_ID: '8ee90755-df76-477d-ac8c-1071f1dfcf77', // for SIT
  // IBM_CLIENT_ID: '9284c1a1-d999-47b1-88cf-7943b18f3559', // for dev
  SESSION_IDLE_TIMEOUT: 300,
  SESSION_LOGOUT_INDICATION_TIME: 60,
  APPLICATION_SUB_DOMAIN: '.adib.co.ae',
  GOOGLE_PLAY_DOWNLOAD_LINK: 'https://play.google.com/store/apps/details?id=com.adib.mobile',
  APP_STORE_DOWNLOAD_LINK: 'https://apps.apple.com/ae/app/adib-mobile-banking-app/id1128180440',
  ADIB_WEBSITE_URL: 'www.adib.ae',
  ADIB_CUSTOMER_CARE_CONTACT_NUMBER: '600543216',
  CAPTCHA: {
    URL: 'https://www.google.com/recaptcha/api.js',
    SITEKEY: '6LdLTM0ZAAAAAGyrPpkurQB1LC7GuZHOzZK7_K8V',
  },
  CIAM: {
    CLIENT_ID: 'AuthenticatorIBClient',
    SCOPE: 'read',
    GRANT_TYPE: 'password',
    REFRESH_TOKEN_GRANT_TYPE: 'refresh_token',
    MODE_CARD_NUM_PIN: 'cardnumpin',
    MODE: 'mode',
    USERNAME: 'username',
    PASSWORD: 'password',
    CONTENT_TYPE: 'application/x-www-form-urlencoded',
    ENDPOINTS: {
      VALIDATE_CARD_PIN: '/mga/sps/oauth/oauth20/token',
      NEW_USER_REGISTRATION: '/mga/sps/apiauthsvc/policy/newuserregistration',
      FORGET_PASSWORD: '/mga/sps/apiauthsvc/policy/forgetpassword',
      UNLOCK_USERNAME: '/mga/sps/apiauthsvc/policy/unlockusername',
      FORGET_USERNAME: '/mga/sps/apiauthsvc/policy/forgetusername',
      DE_REGISTRATION: '/mga/sps/apiauthsvc/policy/deRegisterIBUser',
      LOGIN: '/mga/sps/oauth/oauth20/token',
      DEVICE_SESSION_REG: '/mga/sps/ac',
      LOGOUT: '/mga/sps/oauth/oauth20/revoke',
      CHANGE_PASSWORD: '/mga/sps/apiauthsvc/policy/changepassword'
    },
    LOGIN: {
      MODE: 'uidpass'
    }
  }
};
