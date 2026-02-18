import {
  UserSignupPayload,
  UserVerifyOtpPayload,
  UserSigninPayload,
} from "../../actions/authAction/authActionInterface";
import { post } from "../../apiWrapper";

export const userSignupApi = (data: UserSignupPayload) => {
  const { onSuccess, onError, ...payload } = data;
  return post("/auth/signup", payload);
};

export const userVerifyOtpApi = (data: UserVerifyOtpPayload) => {
  const { onSuccess, onError, ...payload } = data;
  return post("/auth/verify/otp", payload);
};

export const userSigninApi = (data: UserSigninPayload) => {
  const { onSuccess, onError, ...payload } = data;
  return post("/auth/signin", payload);
};
