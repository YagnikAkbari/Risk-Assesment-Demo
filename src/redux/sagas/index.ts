import { all, takeLatest } from "redux-saga/effects";
import {
  USER_SIGNUP,
  USER_VERIFY_OTP,
  USER_SIGNIN,
} from "../actions/authAction/authAction";
import {
  handleUserSignup,
  handleUserVerifyOtp,
  handleUserSignin,
} from "./handlers/authHandler/authHandler";

export function* watcherSaga(): Generator<unknown, void, unknown> {
  yield all([
    // auth
    yield takeLatest(USER_SIGNUP, handleUserSignup),
    yield takeLatest(USER_VERIFY_OTP, handleUserVerifyOtp),
    yield takeLatest(USER_SIGNIN, handleUserSignin),
  ]);
}
