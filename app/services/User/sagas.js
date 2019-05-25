import { put, takeLatest, call, fork } from 'redux-saga/effects'

import Firebase from 'containers/Firebase'

import {
  userSignedIn,
  userSignInError,
  currentListSaved,
  currentListSavingError,
  notificationStatusChanged,
  notificationStatusChangingError,
} from './actions'

import {
  SIGN_IN_USER,
  SAVE_CURRENT_LIST,
  CHANGE_NOTIFICATION_STATUS,
} from './constants'


export function* signInSaga(payload) {
  try {
    let user = yield call(Firebase.getCurrentUser)

    // User never signed in before
    // Create an account
    if(!user) {
      user = yield call(Firebase.addUser)
    }
    yield put(userSignedIn({ details: payload.data, ...user }))
  } catch (err) {
    yield put(userSignInError(err))
  }
}

export function* saveCurrentList(payload) {
  try {
    const { value } = payload.data
    yield fork(Firebase.updateCurrentUser, { currentList: value })
    yield put(currentListSaved(payload))
  } catch (err) {
    yield put(currentListSavingError(err))
  }
}

export function* changeNotificationStatus(payload) {
  try {
    const { value } = payload.data
    yield fork(Firebase.updateCurrentUser, { notificationStatus: value })
    yield put(notificationStatusChanged(payload))
  } catch (err) {
    yield put(notificationStatusChangingError(err))
  }
}

export default function* userSaga() {
  yield takeLatest(SIGN_IN_USER, signInSaga)
  yield takeLatest(SAVE_CURRENT_LIST, saveCurrentList)
  yield takeLatest(CHANGE_NOTIFICATION_STATUS, changeNotificationStatus)
}