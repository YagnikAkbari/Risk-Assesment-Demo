import {
  GET_ASSESSMENT_FRAMEWORK,
  SET_ASSESSMENT_FRAMEWORK,
  GET_FRAMEWORK_METADATA,
  SET_FRAMEWORK_METADATA,
} from "../../actions/assessmentAction/assessmentAction";
import { AssessmentActions } from "../../actions/assessmentAction/assessmentActionInterface";
import { AssessmentState } from "./assessmentReducerInterface";

const initialState: AssessmentState = {
  isLoading: false,
};

const assessmentReducer = (
  state: AssessmentState = initialState,
  action: AssessmentActions,
): AssessmentState => {
  switch (action.type) {
    case GET_ASSESSMENT_FRAMEWORK:
    case GET_FRAMEWORK_METADATA:
      return {
        ...state,
        isLoading: true,
        error: undefined,
      };
    case SET_ASSESSMENT_FRAMEWORK:
      return {
        ...state,
        isLoading: false,
        framework: action.payload,
      };
    case SET_FRAMEWORK_METADATA:
      return {
        ...state,
        isLoading: false,
        metadata: action.payload,
      };
    default:
      return state;
  }
};


export default assessmentReducer;

