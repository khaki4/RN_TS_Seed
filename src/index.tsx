import React, { Component } from "react";
import { View, Text } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Provider } from "react-redux";
import { registerScreens } from './screens';

import Counter from "./containers/Counter";
import store from "./store/index";
import { Animated } from "react-native";
import View1 = Animated.View;

registerScreens(store, Provider);

const navigatorStyle = {
  navBarTranslucent: true,
  drawUnderNavBar: true,
  navBarTextColor: 'white',
  navBarButtonColor: 'white',
  statusBarTextColorScheme: 'light',
  drawUnderTabBar: true
};

// export default function AppContainer() {
//   return (
//     <Provider store={store}>
//       <Counter />
//     </Provider>
//   );
// }

export default class App extends Component {
  constructor(props) {
    super(props);
    this.startApp();
  }

  startApp() {
    Navigation.startTabBasedApp({
      tabs: [
        {
          label: 'TestScreen',
          screen: 'testApp.TestScreen',
          title: 'Test',
          navigatorStyle
        }
      ]
    });
    console.log('test app');
  }
  render() {
    return(
      <View>
        <Text>12312312</Text>
      </View>
    );
  }
}
