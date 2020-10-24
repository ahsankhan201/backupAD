// Registration Module constants
export const STEPPER_TEXT = {
    cardDetails: 'tr_registrationComponent_cardDetailsStepperText',
    otp: 'tr_common_otpText',
    chooseUsername: 'tr_registrationComponent_usernameStepperText',
    choosePassword: 'tr_registrationComponent_passwordStepperText',
    inValidPasswordError: 'tr_registrationComponent_passwordInValidError',
    confirmPasswordError: 'tr_registrationComponent_passwordConfirmError',
    emailError: 'tr_registrationComponent_emailError',
    userNameError: 'tr_registrationComponent_userNameError',
    userExistError: 'tr_registrationComponent_userAlreadyExist',
    successTitle: 'tr_common_welcomeText',
    successSubTitle: 'tr_registrationComponent_welcomeSubTitle',
    registrationSuccessTitle: 'tr_loginComponent_welcomeText',
    successMessage: 'tr_registrationComponent_welcomeUserInfoText',
    forgotUsernameStepperText: 'tr_forgot_username_stepper_text',
    unlockUsernameStepperText: 'tr_unlock_username_stepper_title',
    verifyUsernameStepperText: 'tr_verify_username_stepper_title',
    resetPasswordStepperText: 'tr_reset_password_stepper_title'
};

export const SECURITY_TIPS_COMP = 'SecurityTipsComponent';
export const REGISTRATION_COMP = 'RegistrationComponent';
export const LOGIN_COMP = 'LoginComponent';
export const STEPPER_CONST = {
    visible: '/assets/icons/visibility.svg',
    invisible: '/assets/icons/visibility-off.svg',
    minLength: 8,
    maxLength: 20
};

export const PATTERN_PASSWORD = '(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,20}';
export const PATTERN_DIGIT = /\d/;
export const PATTERN_UPPERCASE = /(?=.*[a-z])(?=.*[A-Z])/;
export const PATTERN_SPECIAL_CHAR = /\W/;
export const PATTERN_NO_SPECIAL_CHAR = /^\w+$/;
export const LARGE_DEVICE_BREAKPOINT = 1024;

