import {
  CLOSE_SIGN_IN_MODAL,
  OPEN_SIGN_IN_MODAL,
} from "../../actions/uiAction/uiAction";
import { UIActions } from "../../actions/uiAction/uiActionInterface";
import { UIState } from "./uiReducerInterface";

const initialState: UIState = {
  isSignInModalOpen: false,
  redirectPath: undefined,
};

const uiReducer = (state = initialState, action: UIActions): UIState => {
  switch (action.type) {
    case OPEN_SIGN_IN_MODAL:
      return {
        ...state,
        isSignInModalOpen: true,
        redirectPath: action.payload?.redirectTo,
      };
    case CLOSE_SIGN_IN_MODAL:
      return {
        ...state,
        isSignInModalOpen: false,
        redirectPath: undefined,
      };
    default:
      return state;
  }
};

export default uiReducer;
