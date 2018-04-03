import React from 'react';
import { StackNavigator } from 'react-navigation';
import { AppNavigator } from './navigator/AppNavigator';

export default class App extends React.Component {
  render() {
    return (
      <AppNavigator />
    );
  }
}
