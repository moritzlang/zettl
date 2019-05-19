import { eventChannel, END } from 'redux-saga'
import { put, cancelled, call, take, fork } from 'redux-saga/effects'
import Firebase from 'containers/Firebase'

import {
  articlesLoaded,
  articlesLoadingError,
  articlesToggled,
  articlesTogglingError,
  articleAdded,
  articleAddedError,
  articleProcessed,
  articlesProcessingError,
} from './actions'


export function* loadArticles() {
  try {
    const articles = yield call(Firebase.articles)
    yield put(articlesLoaded(articles))
  } catch (err) {
    yield put(articlesLoadingError(err))
  }
}

export function* toggleArticle(payload) {
  try {
    const { articleId, value } = payload.data
    yield fork(Firebase.updateArticle, articleId, { checked: value })
    yield put(articlesToggled(payload.data))
  } catch (err) {
    yield put(articlesTogglingError(err))
  }
}

export function* processArticle(payload) {
  try {
    yield put(articleProcessed(payload.data))
  } catch (err) {
    yield put(articlesProcessingError(err))
  }
}

function createAddArticleChannel(article) {
  return eventChannel(emit => {
    // eslint-disable-next-line no-unused-vars
    const channel =  Firebase.addArticle(article)
      .then(success => {
        // The article got added to the database
        if(success) {
          emit({ success })
        } else {
          emit(END)
        }
      })
    return () => {}
  })
}

export function* addArticle(payload) {
  const newArticle = payload.data
  const channel = yield call(createAddArticleChannel, newArticle)
  try {
    yield put(articleAdded(newArticle))

    // Wait for confirmation that article got
    // added to the database
    while(true) {
      const { success } = yield take(channel)
      if(success) {
        yield put(articleProcessed({
          listId: newArticle.listId,
          articleId: newArticle.id,
          success,
        }))
        return
      }
    }
  } catch (err) {
    yield put(articleAddedError(err))
  } finally {
    // Unregister listener if the saga was cancelled
    if(yield cancelled()) channel.close()
  }
}