import {
  AuthUser,
  SetAuthUserAction,
  UserSigninAction,
  UserSigninPayload,
  UserSignupAction,
  UserSignupPayload,
  UserVerifyOtpAction,
  UserVerifyOtpPayload,
} from "./authActionInterface";

export const USER_SIGNUP = "USER_SIGNUP";
export const USER_VERIFY_OTP = "USER_VERIFY_OTP";
export const USER_SIGNIN = "USER_SIGNIN";
export const SET_AUTH_USER = "SET_AUTH_USER";

export const userSignup = (data: UserSignupPayload): UserSignupAction => ({
  type: USER_SIGNUP,
  payload: data,
});

export const userVerifyOtp = (
  data: UserVerifyOtpPayload,
): UserVerifyOtpAction => ({
  type: USER_VERIFY_OTP,
  payload: data,
});

export const userSignin = (data: UserSigninPayload): UserSigninAction => ({
  type: USER_SIGNIN,
  payload: data,
});

export const setAuthUser = (data?: AuthUser): SetAuthUserAction => ({
  type: SET_AUTH_USER,
  payload: data,
});
