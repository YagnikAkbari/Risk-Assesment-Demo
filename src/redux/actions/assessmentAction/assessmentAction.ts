import {
  AssessmentFramework,
  GetAssessmentFrameworkAction,
  GetAssessmentFrameworkPayload,
  SetAssessmentFrameworkAction,
  FrameworkMetadata,
  GetFrameworkMetadataAction,
  GetFrameworkMetadataPayload,
  SetFrameworkMetadataAction,
} from "./assessmentActionInterface";

export const GET_ASSESSMENT_FRAMEWORK = "GET_ASSESSMENT_FRAMEWORK";
export const SET_ASSESSMENT_FRAMEWORK = "SET_ASSESSMENT_FRAMEWORK";
export const GET_FRAMEWORK_METADATA = "GET_FRAMEWORK_METADATA";
export const SET_FRAMEWORK_METADATA = "SET_FRAMEWORK_METADATA";

export const getAssessmentFramework = (
  data: GetAssessmentFrameworkPayload,
): GetAssessmentFrameworkAction => ({
  type: GET_ASSESSMENT_FRAMEWORK,
  payload: data,
});

export const setAssessmentFramework = (
  data?: AssessmentFramework,
): SetAssessmentFrameworkAction => ({
  type: SET_ASSESSMENT_FRAMEWORK,
  payload: data,
});

export const getFrameworkMetadata = (
  data: GetFrameworkMetadataPayload,
): GetFrameworkMetadataAction => ({
  type: GET_FRAMEWORK_METADATA,
  payload: data,
});

export const setFrameworkMetadata = (
  data?: FrameworkMetadata,
): SetFrameworkMetadataAction => ({
  type: SET_FRAMEWORK_METADATA,
  payload: data,
});

