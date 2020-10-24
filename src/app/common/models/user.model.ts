export class User {
    name: string;
    totalAvailableFunds: {
        amount: number;
        currency: string;
    };
}

export class AuthTokenModel {
    'access_token': string;
    'refresh_token': string;
    rimid: string;
    scope: string;
    'token_type': string;
    'expires_in': string;
}
