import { put, takeLatest } from 'redux-saga/effects'
import Firebase from 'containers/Firebase'

import { toggleArticle, addArticle, deleteArticle, processArticle } from 'services/Article/sagas'
import { TOGGLE_ARTICLE, ADD_ARTICLE, DELETE_ARTICLE, PROCESS_ARTICLE } from 'services/Article/constants'

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
    const { userId, list } = payload.data
    Firebase.addList(userId, list)
    yield put(listAdded(list))
  } catch (err) {
    yield put(listAddedError(err))
  }
}

export default function* listSaga() {
  yield takeLatest(LOAD_LISTS, loadLists)
  yield takeLatest(ADD_LIST, addList)
  yield takeLatest(DELETE_ARTICLE, deleteArticle)
  yield takeLatest(TOGGLE_ARTICLE, toggleArticle)
  yield takeLatest(ADD_ARTICLE, addArticle)
  yield takeLatest(PROCESS_ARTICLE, processArticle)
}