import { Navigation } from 'react-native-navigation';

import FirstScreen from './FirstScreen';

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('FirstTabScreen', () => FirstScreen);
}
