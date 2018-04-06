import { NavigationActions } from "react-navigation";
import { AppNavigator } from "../navigator/AppNavigator";

const firstAction = AppNavigator.router.getActionForPathAndParams("Login");
const initialNavState = AppNavigator.router.getStateForAction(firstAction);

// Actions
export const GO_BACK: string = `GO_BACK`;

// Action Creators
export const goBack = () => ({ type: GO_BACK });

export default (state = initialNavState, action) => {
  console.log("state nav:", state);
  switch (action.type) {
    case GO_BACK:
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
