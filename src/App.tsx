import React from 'react';
import { StackNavigator } from 'react-navigation';
import AppWithNavigationState from './navigator/AppNavigator';

export default class App extends React.Component {
  render() {
    return (
      <AppWithNavigationState />
    );
  }
}
