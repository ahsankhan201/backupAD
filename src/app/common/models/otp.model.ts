export class OTP {
    'otp.user.otp': number;
    operation: string;
    Submit: string;
}

export class OTPResponse {
    success: boolean;
    message: string;
}

export class OTPLocation {
    exceptionMsg: string;
    location: string;
    state: string;
    message: string;
    mechanism: string;
    accountNumber?: string;
}


export class CIAMOTPResponse {
    mechanism: string;
    stateId: string;
    location: string;
    'otp.user.otp-hint': string;
    'otp.user.sentTo': string;
    mappingRuleData?: string;
    retryCounter?: string;
    userState?: string;
}
