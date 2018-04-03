import { StackNavigator } from 'react-navigation';
import Home from './Home';
import Details from './Details';

export default StackNavigator(
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
