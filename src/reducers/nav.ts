import { NavigationActions } from "react-navigation";
import { AppNavigator } from "../navigator/AppNavigator";

const SCREENS = {
  INIT: "Login",
  LOGIN: "Login"
};

const firstAction = AppNavigator.router.getActionForPathAndParams(SCREENS.INIT);
const initialNavState = AppNavigator.router.getStateForAction(firstAction);

export default (state = initialNavState, action) => {
  console.log("state nav:", state);
  switch (action.type) {
    case "Back":
      return {
        ...state,
        ...AppNavigator.router.getStateForAction(
          NavigationActions.back(),
          state
        )
      };
    default:
      return AppNavigator.router.getStateForAction(action, state);
  }
};
