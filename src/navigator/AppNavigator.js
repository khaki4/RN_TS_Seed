import { StackNavigator, NavigationActions } from 'react-navigation';
import Home from '../screens/Home';
import Details from '../screens/Details';

export const AppNavigator = StackNavigator(
  {
    Home: {
      screen: Home,
    },
    Details: {
      screen: Details,
    },
  },
  {
    initialRouteName: 'Home',
  }
);

