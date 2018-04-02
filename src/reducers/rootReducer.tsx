import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import counter from "./counter";

const rootReducer = combineReducers({
  form: formReducer,
  counter
});

export default rootReducer;
