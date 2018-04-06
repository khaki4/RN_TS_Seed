import { all, fork, call, put, take } from "redux-saga/effects";
import * as fromCounter from "../../reducers/counter";
import { NavigationActions } from "react-navigation";
import { AppNavigator } from "../../navigator/AppNavigator";

function* goDetail(action) {
  console.log("work goDetail");
  yield put(NavigationActions.navigate({ routeName: "Details" }));
}

function* goHome(action) {
  console.log("work goHome");
  yield put(NavigationActions.back());
}

function* goLogin(action) {
  console.log("work goLogin");
  yield put(NavigationActions.navigate({ routeName: "Login" }));
}

export function* workIncrease() {
  try {
    yield put(fromCounter.increment());
  } catch (error) {
    console.log("errored at increase");
  }
}

export function* watchGoLogin() {
  while (true) {
    console.log("saga watch watchGoLogin");
    const action = yield take(fromCounter.GO_LOGIN);
    yield call(goLogin, action);
  }
}

export function* watchGoDetail() {
  while (true) {
    console.log("saga watch GoDetail");
    const action = yield take(fromCounter.GO_DETAIL);
    yield call(goDetail, action);
  }
}

export function* watchGoHome() {
  while (true) {
    console.log("saga watch watchGoHome");
    const action = yield take(fromCounter.GO_HOME);
    yield call(goHome, action);
  }
}

export function* watchRequestIncrease() {
  while (true) {
    console.log("saga requestIncrement");
    const action = yield take(fromCounter.REQUEST_INCREMENT);
    yield call(workIncrease, action);
  }
}

export default [watchRequestIncrease, watchGoDetail, watchGoHome, watchGoLogin];
