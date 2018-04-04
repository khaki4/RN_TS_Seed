import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import nav from "./nav";
import counter from "./counter";

const rootReducer = combineReducers({
  form: formReducer,
  nav,
  counter,
});

export default rootReducer;
