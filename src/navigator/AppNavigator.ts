import { StackNavigator } from 'react-navigation';
import Home from '../screens/Home';
import Details from '../screens/Details';

const AppNavigator = StackNavigator(
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

export { AppNavigator };
