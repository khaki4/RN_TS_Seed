import React, { Component } from "react";
import { Navigation } from 'react-native-navigation';
import { Provider } from "react-redux";

import App from "./App";
import store from "./store/index";

export default function AppContainer() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
