import { put, takeLatest } from 'redux-saga/effects'
import Firebase from 'containers/Firebase'
import uuid from 'uuid/v4'

import { toggleArticle, addArticle } from 'containers/Article/sagas'
import { TOGGLE_ARTICLE, ADD_ARTICLE } from 'containers/Article/constants'

import { listsLoaded, listsLoadingError, listAdded, listAddedError } from './actions'
import { LOAD_LISTS, ADD_LIST } from './constants'


export function* loadLists() {
  try {
    const lists = yield Firebase.getLists()
    yield put(listsLoaded(lists))
  } catch (err) {
    yield put(listsLoadingError(err))
  }
}

export function* addList(payload) {
  try {
    const newList = {
      id: uuid(),
      title: payload.data,
    }

    Firebase.addList(newList)
    yield put(listAdded(newList))
  } catch (err) {
    yield put(listAddedError(err))
  }
}

export default function* listSaga() {
  yield takeLatest(LOAD_LISTS, loadLists)
  yield takeLatest(ADD_LIST, addList)
  yield takeLatest(TOGGLE_ARTICLE, toggleArticle)
  yield takeLatest(ADD_ARTICLE, addArticle)
}