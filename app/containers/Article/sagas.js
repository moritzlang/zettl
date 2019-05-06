import { put, takeLatest } from 'redux-saga/effects'
import Firebase from 'containers/Firebase'
import uuid from 'uuid/v4'

import { articlesLoaded, articlesLoadingError, articlesToggled, articlesTogglingError, articleAdded, articleAddedError } from './actions'
import { LOAD_ARTICLES, TOGGLE_ARTICLE, ADD_ARTICLE } from './constants'


export function* loadArticles() {
  try {
    const articles = yield Firebase.articles
    yield put(articlesLoaded(articles))
  } catch (err) {
    yield put(articlesLoadingError(err))
  }
}

export function* toggleArticle(payload) {
  try {
    const { id, value } = payload.data
    Firebase.updateArticle(id, { checked: value })
    yield put(articlesToggled(payload.data))
  } catch (err) {
    yield put(articlesTogglingError(err))
  }
}

export function* addArticle(payload) {
  try {
    const newArticle = {
      id: uuid(),
      value: payload.data,
      checked: false,
    }
    Firebase.addArticle(newArticle)
    yield put(articleAdded(newArticle))
  } catch (err) {
    yield put(articleAddedError(err))
  }
}

export default function* articleSaga() {
  yield takeLatest(LOAD_ARTICLES, loadArticles)
  yield takeLatest(TOGGLE_ARTICLE, toggleArticle)
  yield takeLatest(ADD_ARTICLE, addArticle)
}