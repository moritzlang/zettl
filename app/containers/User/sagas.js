import { put, takeLatest } from 'redux-saga/effects'

import Firebase from 'containers/Firebase'

import { userSignedIn, userSignInError, currentListSaved, currentListSavingError } from './actions'
import { SIGN_IN_USER, SAVE_CURRENT_LIST } from './constants'


export function* signInSaga(payload) {
  try {
    const user = yield Firebase.getUser(payload.data.uid)
    yield put(userSignedIn({ details: payload.data, ...user }))
  } catch (err) {
    yield put(userSignInError(err))
  }
}

export function* saveCurrentList(payload) {
  try {
    const { userId, value } = payload.data
    Firebase.updateUser( userId, { currentList: value })
    yield put(currentListSaved(payload))
  } catch (err) {
    yield put(currentListSavingError(err))
  }
}

export default function* userSaga() {
  yield takeLatest(SIGN_IN_USER, signInSaga)
  yield takeLatest(SAVE_CURRENT_LIST, saveCurrentList)
}