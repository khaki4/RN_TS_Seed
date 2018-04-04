import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reducers from "../reducers/rootReducer";
import { middleware } from '../util/redux';

import createSagaMiddleware from "redux-saga";
import rootSaga from "../saga/index";

const sagaMiddleware = createSagaMiddleware({});

export default createStore(
  reducers,
  composeWithDevTools(applyMiddleware(middleware, sagaMiddleware))
);

sagaMiddleware.run(rootSaga);
