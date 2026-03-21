import { get, post } from "../../../apiWrapper";
import { GetAssessmentFrameworkPayload, GetFrameworkMetadataPayload, SaveAssessmentDraftPayload } from "../../../actions/assessmentAction/assessmentActionInterface";

export const getAssessmentFrameworkApi = (data: GetAssessmentFrameworkPayload) => {
  return get(`/frameworks/${data.slug}/step/${data.step}`);
};

export const getFrameworkMetadataApi = (data: GetFrameworkMetadataPayload) => {
  return get(`/frameworks/${data.slug}/metadata`);
};

export const saveAssessmentDraftApi = (data: SaveAssessmentDraftPayload) => {
  return post(`/assessments/save-draft`, {
    assessmentId: data.assessmentId,
    answers: data.answers,
  });
};


