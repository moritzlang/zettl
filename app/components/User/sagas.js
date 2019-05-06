import { put, takeLatest } from 'redux-saga/effects'
import { userSignedIn, userSignInError } from './actions'


import { SIGN_IN_USER } from './constants'

export function* signInSaga(payload) {
  try {
    yield put(userSignedIn(payload.user))
  } catch (err) {
    yield put(userSignInError(err))
  }
}

export default function* watchUserAuth() {
  // watches for action and calls function, it only 'takes the latest' action
  yield takeLatest(SIGN_IN_USER, signInSaga)
}