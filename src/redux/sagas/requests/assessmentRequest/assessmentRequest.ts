import { get } from "../../../apiWrapper";
import { GetAssessmentFrameworkPayload, GetFrameworkMetadataPayload } from "../../../actions/assessmentAction/assessmentActionInterface";

export const getAssessmentFrameworkApi = (data: GetAssessmentFrameworkPayload) => {
  return get(`/frameworks/${data.slug}/step/${data.step}`);
};

export const getFrameworkMetadataApi = (data: GetFrameworkMetadataPayload) => {
  return get(`/frameworks/${data.slug}/metadata`);
};

