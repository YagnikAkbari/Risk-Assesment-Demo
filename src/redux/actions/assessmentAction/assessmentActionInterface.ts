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

export interface AssessmentAnswer {
  questionVersionId: string;
  selectedOptionVersionIds?: string[];
  subjectiveAnswerText?: string;
  isApplicable?: boolean;
  justification?: string;
  status: "DRAFT" | "SUBMITTED";
}

export interface SaveAssessmentDraftPayload {
  assessmentId: string;
  answers: AssessmentAnswer[];
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}



export interface StartAssessmentPayload {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}


export interface GetAssessmentFrameworkAction {
  type: "GET_ASSESSMENT_FRAMEWORK";
  payload: GetAssessmentFrameworkPayload;
  [key: string]: unknown;
}


export interface SetAssessmentFrameworkAction {
  type: "SET_ASSESSMENT_FRAMEWORK";
  payload?: AssessmentFramework;
  [key: string]: unknown;
}


export interface GetFrameworkMetadataAction {
  type: "GET_FRAMEWORK_METADATA";
  payload: GetFrameworkMetadataPayload;
  [key: string]: unknown;
}


export interface SetFrameworkMetadataAction {
  type: "SET_FRAMEWORK_METADATA";
  payload?: FrameworkMetadata;
  [key: string]: unknown;
}

export interface SaveAssessmentDraftAction {
  type: "SAVE_ASSESSMENT_DRAFT";
  payload: SaveAssessmentDraftPayload;
  [key: string]: unknown;
}



export interface StartAssessmentAction {
  type: "START_ASSESSMENT";
  payload: StartAssessmentPayload;
}



export type AssessmentActions =
  | GetAssessmentFrameworkAction
  | SetAssessmentFrameworkAction
  | GetFrameworkMetadataAction
  | SetFrameworkMetadataAction
  | StartAssessmentAction
  | SaveAssessmentDraftAction;



