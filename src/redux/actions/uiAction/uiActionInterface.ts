export interface OpenSignInModalPayload {
  redirectTo?: string;
}

export interface OpenSignInModalAction {
  type: "OPEN_SIGN_IN_MODAL";
  payload?: OpenSignInModalPayload;
  [key: string]: unknown;
}

export interface StartAssessmentPayload {
  assessmentId: string;
}

export interface StartAssessmentAction {
  type: "START_ASSESSMENT";
  payload: StartAssessmentPayload;
  [key: string]: unknown;
}

export interface CloseSignInModalAction {
  type: "CLOSE_SIGN_IN_MODAL";
  [key: string]: unknown;
}


export type UIActions = OpenSignInModalAction | CloseSignInModalAction;
