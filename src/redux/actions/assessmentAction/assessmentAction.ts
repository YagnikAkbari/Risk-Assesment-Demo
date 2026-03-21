import {
  AssessmentFramework,
  GetAssessmentFrameworkAction,
  GetAssessmentFrameworkPayload,
  SetAssessmentFrameworkAction,
  FrameworkMetadata,
  GetFrameworkMetadataAction,
  GetFrameworkMetadataPayload,
  SetFrameworkMetadataAction,
  SaveAssessmentDraftAction,
  SaveAssessmentDraftPayload,
} from "./assessmentActionInterface";

export const GET_ASSESSMENT_FRAMEWORK = "GET_ASSESSMENT_FRAMEWORK";
export const SET_ASSESSMENT_FRAMEWORK = "SET_ASSESSMENT_FRAMEWORK";
export const GET_FRAMEWORK_METADATA = "GET_FRAMEWORK_METADATA";
export const SET_FRAMEWORK_METADATA = "SET_FRAMEWORK_METADATA";
export const START_ASSESSMENT = "START_ASSESSMENT";
export const SAVE_ASSESSMENT_DRAFT = "SAVE_ASSESSMENT_DRAFT";

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

export const startAssessment = (
  data: GetAssessmentFrameworkPayload | any,
): any => ({
  type: START_ASSESSMENT,
  payload: data,
});

export const saveAssessmentDraft = (
  data: SaveAssessmentDraftPayload,
): SaveAssessmentDraftAction => ({
  type: SAVE_ASSESSMENT_DRAFT,
  payload: data,
});



