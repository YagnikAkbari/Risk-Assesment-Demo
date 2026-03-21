import {
  OpenSignInModalAction,
  OpenSignInModalPayload,
  CloseSignInModalAction,
} from "./uiActionInterface";

export const OPEN_SIGN_IN_MODAL = "OPEN_SIGN_IN_MODAL";
export const CLOSE_SIGN_IN_MODAL = "CLOSE_SIGN_IN_MODAL";

export const openSignInModal = (
  payload?: OpenSignInModalPayload,
): OpenSignInModalAction => ({
  type: OPEN_SIGN_IN_MODAL,
  payload,
});

export const closeSignInModal = (): CloseSignInModalAction => ({
  type: CLOSE_SIGN_IN_MODAL,
});
