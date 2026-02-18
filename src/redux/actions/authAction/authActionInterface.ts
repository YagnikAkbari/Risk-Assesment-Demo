export interface UserSignupPayload {
  email: string;
  password: string;
  name: string;
  location: string;
  company_size: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface UserVerifyOtpPayload {
  email: string;
  otp: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface UserSigninPayload {
  email: string;
  password: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface AuthUser {
  company_name: string;
  access_token: string;
}

export interface UserSignupAction {
  type: "USER_SIGNUP";
  payload: UserSignupPayload;
  [key: string]: unknown;
}

export interface UserVerifyOtpAction {
  type: "USER_VERIFY_OTP";
  payload: UserVerifyOtpPayload;
  [key: string]: unknown;
}

export interface UserSigninAction {
  type: "USER_SIGNIN";
  payload: UserSigninPayload;
  [key: string]: unknown;
}

export interface SetAuthUserAction {
  type: "SET_AUTH_USER";
  payload?: AuthUser;
  [key: string]: unknown;
}

export type AuthActions =
  | UserSignupAction
  | UserVerifyOtpAction
  | UserSigninAction
  | SetAuthUserAction;
