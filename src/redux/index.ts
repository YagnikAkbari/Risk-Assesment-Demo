import { Action, Reducer, combineReducers } from "redux";
import authReducer from "./reducers/authReducer/authReducer";
import { AuthState } from "./reducers/authReducer/authReducerInterface";

export interface RootState {
  auth: AuthState;
}

const appReducers = combineReducers({
  auth: authReducer,
});

const rootReducer: Reducer<RootState, Action> | any = (
  state: RootState | any,
  action: Action | any,
): RootState => {
  return appReducers(state, action);
};

export default rootReducer;
