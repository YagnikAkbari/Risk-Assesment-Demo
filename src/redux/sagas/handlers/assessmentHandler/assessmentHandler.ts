import { call, put, select } from "redux-saga/effects";
import { responseInterface } from "../masterHandlerInterface";
import {
  AssessmentFramework,
  GetAssessmentFrameworkAction,
  FrameworkMetadata,
  GetFrameworkMetadataAction,
  StartAssessmentAction,
} from "../../../actions/assessmentAction/assessmentActionInterface";
import {
  saveAssessmentDraftApi,
  getAssessmentFrameworkApi,
  getFrameworkMetadataApi,
} from "../../requests/assessmentRequest/assessmentRequest";
import {
  SET_ASSESSMENT_FRAMEWORK,
  SET_FRAMEWORK_METADATA,
} from "../../../actions/assessmentAction/assessmentAction";
import { OPEN_SIGN_IN_MODAL } from "../../../actions/uiAction/uiAction";
import { RootState } from "../../../index";
import { SaveAssessmentDraftAction } from "../../../actions/assessmentAction/assessmentActionInterface";

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

export function* handleStartAssessment(action: StartAssessmentAction) {
  try {
    const authState: RootState["auth"] = yield select((state: RootState) => state.auth);
    const token = authState.accessToken || localStorage.getItem("access_token");

    if (token) {
      action.payload.onSuccess?.();
    } else {
      yield put({
        type: OPEN_SIGN_IN_MODAL,
        payload: { redirectTo: "/assessment" },
      });
    }
  } catch (err: any) {
    action.payload.onError?.(err?.message || "Failed to start assessment");
  }
}

export function* handleSaveAssessmentDraft(action: SaveAssessmentDraftAction) {
  try {
    const response: responseInterface<any> = yield call(
      saveAssessmentDraftApi,
      action.payload,
    );

    if (response.status === 200 || response.status === 201) {
      action.payload.onSuccess?.(response.data);
    }
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message || err?.message || "Failed to save draft";
    action.payload.onError?.(errorMessage);
  }
}

