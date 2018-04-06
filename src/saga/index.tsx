import { fork } from "redux-saga/effects";
import counterSaga from "./navSaga";

const sagas = [...counterSaga];

export default function* root() {
  yield sagas.map(saga => fork(saga));
}
