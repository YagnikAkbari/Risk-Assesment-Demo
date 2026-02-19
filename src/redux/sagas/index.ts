import { all, takeLatest } from "redux-saga/effects";
import {
  USER_SIGNUP,
  USER_VERIFY_OTP,
  USER_SIGNIN,
} from "../actions/authAction/authAction";
import {
  GET_ASSESSMENT_FRAMEWORK,
  GET_FRAMEWORK_METADATA,
} from "../actions/assessmentAction/assessmentAction";
import {
  handleUserSignup,
  handleUserVerifyOtp,
  handleUserSignin,
} from "./handlers/authHandler/authHandler";
import {
  handleGetAssessmentFramework,
  handleGetFrameworkMetadata,
} from "./handlers/assessmentHandler/assessmentHandler";

export function* watcherSaga(): Generator<unknown, void, unknown> {
  yield all([
    // auth
    yield takeLatest(USER_SIGNUP, handleUserSignup),
    yield takeLatest(USER_VERIFY_OTP, handleUserVerifyOtp),
    yield takeLatest(USER_SIGNIN, handleUserSignin),

    // assessment
    yield takeLatest(GET_ASSESSMENT_FRAMEWORK, handleGetAssessmentFramework),
    yield takeLatest(GET_FRAMEWORK_METADATA, handleGetFrameworkMetadata),
  ]);
}

