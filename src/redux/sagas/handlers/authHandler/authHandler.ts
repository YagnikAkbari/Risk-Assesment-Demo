import { call, put } from "redux-saga/effects";
import { responseInterface } from "../masterHandlerInterface";
import {
  SignupResponse,
  VerifyOtpResponse,
  SigninResponse,
} from "./authHandlerInterface";
import {
  userSignupApi,
  userVerifyOtpApi,
  userSigninApi,
} from "../../requests/authRequest";
import { UserSigninAction, UserSignupAction, UserVerifyOtpAction } from "../../../actions/authAction/authActionInterface";
import { SET_AUTH_USER } from "../../../actions/authAction/authAction";

export function* handleUserSignup(action: UserSignupAction) {
  try {
    const response: responseInterface<SignupResponse> = yield call(
      userSignupApi,
      action.payload,
    );

    if (response.status === 200 || response.status === 201) {
      action.payload.onSuccess?.(response.data);
    }
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || err?.message || "Signup failed";
    action.payload.onError?.(errorMessage);
  }
}

export function* handleUserVerifyOtp(action: UserVerifyOtpAction) {
  try {
    const response: responseInterface<VerifyOtpResponse> = yield call(
      userVerifyOtpApi,
      action.payload,
    );

    if (response.status === 200 || response.status === 201) {
      action.payload.onSuccess?.(response.data);
    }
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || err?.message || "OTP verification failed";
    action.payload.onError?.(errorMessage);
  }
}

export function* handleUserSignin(action: UserSigninAction) {
  try {
    const response: responseInterface<SigninResponse> = yield call(
      userSigninApi,
      action.payload,
    );

    if (response.status === 200 || response.status === 201) {
      const data = response.data as unknown as SigninResponse;
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("company_name", data.company_name);

      yield put({
        type: SET_AUTH_USER,
        payload: {
          company_name: data.company_name,
          access_token: data.access_token,
        },
      });

      action.payload.onSuccess?.(data);
    }
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || err?.message || "Sign in failed";
    action.payload.onError?.(errorMessage);
  }
}
