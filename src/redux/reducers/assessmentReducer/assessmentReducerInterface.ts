import { AssessmentFramework, FrameworkMetadata } from "../../actions/assessmentAction/assessmentActionInterface";

export interface AssessmentState {
  framework?: AssessmentFramework;
  metadata?: FrameworkMetadata;
  isLoading: boolean;
  error?: string;
}

