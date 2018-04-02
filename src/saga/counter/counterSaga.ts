import { all, fork, call, put, take } from "redux-saga/effects";
import * as fromCounter from "../../reducers/counter";

export function* workIncrease() {
  try {
    yield put(fromCounter.increment());
  } catch (error) {
    console.log("errored at increase");
  }
}

export function* watchRequestIncrease() {
  while (true) {
    console.log("saga requestIncrement");
    const action = yield take(fromCounter.REQUEST_INCREMENT);
    yield call(workIncrease, action);
  }
}

export default [watchRequestIncrease];
