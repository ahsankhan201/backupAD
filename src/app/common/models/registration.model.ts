export class NewUserRegistration {
    location: string;
    mappingRuleData: string;
    mechanism: string;
    'otp.user.otp-hint': string;
    'otp.user.sentTo': string;
    retryCounter: string;
    stateId: string;
    userState: string;
}

export class BrowserRegistrationDetails {
    browserPlugins: string;
    deviceFonts: string;
    timestamp?: string;
    deviceNickname: string;
    userAgent: string;
}
export class EstatementSubscription {
    emailId: string;
    isRegisteredForEstatement: boolean;
    isRegisteredForSMS: boolean;
    mobile: string;
}

export class PasswordModel {
    password: string;
    confirmPassword: string;
}
