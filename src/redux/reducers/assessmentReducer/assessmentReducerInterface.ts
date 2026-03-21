import { AssessmentFramework, FrameworkMetadata } from "../../actions/assessmentAction/assessmentActionInterface";

export interface AssessmentState {
  assessmentId?: string;
  framework?: AssessmentFramework;
  metadata?: FrameworkMetadata;
  isLoading: boolean;
  error?: string;
}


