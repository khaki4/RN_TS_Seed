/* eslint-disable import/prefer-default-export */
import { Navigation } from 'react-native-navigation';

import TestScreen from './TestScreen';

export function registerScreens(store, Provider) {
  Navigation.registerComponent('testApp.TestScreen', () => TestScreen);
}
