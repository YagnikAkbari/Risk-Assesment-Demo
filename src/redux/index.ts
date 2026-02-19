import { Action, Reducer, combineReducers } from "redux";
import authReducer from "./reducers/authReducer/authReducer";
import assessmentReducer from "./reducers/assessmentReducer/assessmentReducer";
import { AuthState } from "./reducers/authReducer/authReducerInterface";
import { AssessmentState } from "./reducers/assessmentReducer/assessmentReducerInterface";

export interface RootState {
  auth: AuthState;
  assessment: AssessmentState;
}

const appReducers = combineReducers({
  auth: authReducer,
  assessment: assessmentReducer,
});

const rootReducer: Reducer<RootState, Action> | any = (
  state: RootState | any,
  action: Action | any,
): RootState => {
  return appReducers(state, action);
};

export default rootReducer;
