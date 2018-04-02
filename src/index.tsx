import React from "react";
import { Provider } from "react-redux";

import Counter from "./containers/Counter";
import store from "./store/index";

export default function AppContainer() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}
