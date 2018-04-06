import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import nav from "./nav";

const rootReducer = combineReducers({
  form: formReducer,
  nav
});

export default rootReducer;
