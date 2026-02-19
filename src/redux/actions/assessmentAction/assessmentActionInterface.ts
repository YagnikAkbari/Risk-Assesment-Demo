export interface AssessmentOption {
  id: string;
  optionText: string;
  scoreValue: string | null;
}

export interface AssessmentQuestion {
  id: string;
  controlReference: string;
  orderIndex: number;
  stepIndex: number;
  questionText: string;
  weightage: string;
  maxScore: string;
  options: AssessmentOption[];
}

export interface AssessmentFramework {
  id: string;
  name: string;
  slug: string;
  version: string;
  standardCode: string | null;
  publishedYear: string | null;
  description: string;
  questions: AssessmentQuestion[];
}

export interface GetAssessmentFrameworkPayload {
  slug: string;
  step: number;
  onSuccess?: (data: AssessmentFramework) => void;
  onError?: (error: any) => void;
}

export interface FrameworkMetadata {
  name: string;
  description: string;
  totalSteps: number;
  version: string;
}

export interface GetFrameworkMetadataPayload {
  slug: string;
  onSuccess?: (data: FrameworkMetadata) => void;
  onError?: (error: any) => void;
}

export interface GetAssessmentFrameworkAction {
  type: "GET_ASSESSMENT_FRAMEWORK";
  payload: GetAssessmentFrameworkPayload;
}

export interface SetAssessmentFrameworkAction {
  type: "SET_ASSESSMENT_FRAMEWORK";
  payload?: AssessmentFramework;
}

export interface GetFrameworkMetadataAction {
  type: "GET_FRAMEWORK_METADATA";
  payload: GetFrameworkMetadataPayload;
}

export interface SetFrameworkMetadataAction {
  type: "SET_FRAMEWORK_METADATA";
  payload?: FrameworkMetadata;
}


export type AssessmentActions =
  | GetAssessmentFrameworkAction
  | SetAssessmentFrameworkAction
  | GetFrameworkMetadataAction
  | SetFrameworkMetadataAction;

