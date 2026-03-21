import { Action, Reducer, combineReducers } from "redux";
import authReducer from "./reducers/authReducer/authReducer";
import assessmentReducer from "./reducers/assessmentReducer/assessmentReducer";
import uiReducer from "./reducers/uiReducer/uiReducer";
import { AuthState } from "./reducers/authReducer/authReducerInterface";
import { AssessmentState } from "./reducers/assessmentReducer/assessmentReducerInterface";
import { UIState } from "./reducers/uiReducer/uiReducerInterface";

export interface RootState {
  auth: AuthState;
  assessment: AssessmentState;
  ui: UIState;
}

const appReducers = combineReducers({
  auth: authReducer,
  assessment: assessmentReducer,
  ui: uiReducer,
});

const rootReducer: Reducer<RootState, Action> | any = (
  state: RootState | any,
  action: Action | any,
): RootState => {
  return appReducers(state, action);
};

export default rootReducer;
