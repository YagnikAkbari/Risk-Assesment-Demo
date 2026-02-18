import { SET_AUTH_USER } from "../../actions/authAction/authAction";
import { AuthActions } from "../../actions/authAction/authActionInterface";
import { AuthState } from "./authReducerInterface";

const initialState: AuthState = {};

const authReducer = (
  state: AuthState = initialState,
  action: AuthActions,
): AuthState => {
  switch (action.type) {
    case SET_AUTH_USER:
      return {
        ...state,
        companyName: action.payload?.company_name,
        accessToken: action.payload?.access_token,
      };
    default:
      return state;
  }
};

export default authReducer;
