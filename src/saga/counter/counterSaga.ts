import { all, fork, call, put, take } from "redux-saga/effects";
import * as fromCounter from "../../reducers/counter";
import { NavigationActions } from 'react-navigation';

function* goDetail(action) {
  console.log('work goDetail');
  console.log(NavigationActions.navigate);
  yield put(NavigationActions.navigate({ routeName: 'Detail' }));
}

export function* workIncrease() {
  try {
    yield put(fromCounter.increment());
  } catch (error) {
    console.log("errored at increase");
  }
}

export function* watchGoDetail() {
  while (true) {
    console.log("saga watch GoDetail");
    const action = yield take(fromCounter.GO_DETAIL);
    yield call(goDetail, action);
  }
}

export function* watchRequestIncrease() {
  while (true) {
    console.log("saga requestIncrement");
    const action = yield take(fromCounter.REQUEST_INCREMENT);
    yield call(workIncrease, action);
  }
}

export default [watchRequestIncrease, watchGoDetail];
