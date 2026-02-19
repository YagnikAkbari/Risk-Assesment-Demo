import { call, put } from "redux-saga/effects";
import { responseInterface } from "../masterHandlerInterface";
import {
  AssessmentFramework,
  GetAssessmentFrameworkAction,
  FrameworkMetadata,
  GetFrameworkMetadataAction,
} from "../../../actions/assessmentAction/assessmentActionInterface";
import { getAssessmentFrameworkApi, getFrameworkMetadataApi } from "../../requests/assessmentRequest/assessmentRequest";
import {
  SET_ASSESSMENT_FRAMEWORK,
  SET_FRAMEWORK_METADATA,
} from "../../../actions/assessmentAction/assessmentAction";

export function* handleGetAssessmentFramework(action: GetAssessmentFrameworkAction) {
  try {
    const response: responseInterface<AssessmentFramework> = yield call(
      getAssessmentFrameworkApi,
      action.payload,
    );

    if (response.status === 200 || response.status === 201) {
      yield put({
        type: SET_ASSESSMENT_FRAMEWORK,
        payload: response.data,
      });
      action.payload.onSuccess?.(response.data);
    }
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || err?.message || "Failed to fetch assessment framework";
    action.payload.onError?.(errorMessage);
    yield put({
      type: SET_ASSESSMENT_FRAMEWORK,
      payload: undefined,
    });
  }
}

export function* handleGetFrameworkMetadata(action: GetFrameworkMetadataAction) {
  try {
    const response: responseInterface<FrameworkMetadata> = yield call(
      getFrameworkMetadataApi,
      action.payload,
    );

    if (response.status === 200 || response.status === 201) {
      yield put({
        type: SET_FRAMEWORK_METADATA,
        payload: response.data,
      });
      action.payload.onSuccess?.(response.data);
    }
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || err?.message || "Failed to fetch framework metadata";
    action.payload.onError?.(errorMessage);
    yield put({
      type: SET_FRAMEWORK_METADATA,
      payload: undefined,
    });
  }
}

