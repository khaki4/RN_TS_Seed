import { all, fork, call, put, take } from "redux-saga/effects";
import * as fromNavi from "../reducers/navigation";
import { NavigationActions } from "react-navigation";
import { AppNavigator } from "../navigator/AppNavigator";
function* goBack(action) {
  console.log("work Back");
  yield put(NavigationActions.back(action));
}
function* goDetail(action) {
  console.log("work goDetail");
  yield put(NavigationActions.navigate({ routeName: "Details" }));
}
function* goLogin(action) {
  console.log("work goLogin");
  yield put(NavigationActions.navigate({ routeName: "Login" }));
}
function* goSelectCountry(action) {
  console.log("work goSelectCountry", action);
  yield put(
    NavigationActions.navigate({
      routeName: "SelectCountry",
      params: action.params
    })
  );
}

export function* workIncrease() {
  try {
    yield put(fromNavi.increment());
  } catch (error) {
    console.log("errored at increase");
  }
}

export function* watchGoLogin() {
  while (true) {
    console.log("saga watch watchGoLogin");
    const action = yield take(fromNavi.GO_LOGIN);
    yield call(goLogin, action);
  }
}
export function* watchGoSelectCountry() {
  while (true) {
    console.log("saga watch watchGoSelectCountry");
    const action = yield take(fromNavi.GO_SELECT_COUNTRY);
    yield call(goSelectCountry, action);
  }
}
export function* watchGoDetail() {
  while (true) {
    console.log("saga watch GoDetail");
    const action = yield take(fromNavi.GO_DETAIL);
    yield call(goDetail, action);
  }
}

export function* watchGoBack() {
  while (true) {
    console.log("saga watch watchGoBack");
    const action = yield take(fromNavi.GO_BACK);
    yield call(goBack, action);
  }
}

export function* watchRequestIncrease() {
  while (true) {
    console.log("saga requestIncrement");
    const action = yield take(fromNavi.REQUEST_INCREMENT);
    yield call(workIncrease, action);
  }
}

export default [
  watchRequestIncrease,
  watchGoDetail,
  watchGoBack,
  watchGoLogin,
  watchGoSelectCountry
];
