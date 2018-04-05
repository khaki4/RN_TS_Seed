import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigator/AppNavigator';

const firstAction = AppNavigator.router.getActionForPathAndParams('Home');
const initialNavState = AppNavigator.router.getStateForAction(
  firstAction,
);

export default (state = initialNavState, action) => {
  console.log('state nav:', state);
  switch (action.type) {
    case 'Home':
      return {
        ...state,
        ...AppNavigator.router.getStateForAction(
          NavigationActions.navigate({ routeName: 'Home' }),
          state
        )
      };
    case 'Details':
      return {
        ...state,
        ...AppNavigator.router.getStateForAction(
          NavigationActions.navigate({ routeName: 'Detail' }),
          state
        )
      };
    case 'Back':
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
