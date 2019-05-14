import { eventChannel, END } from 'redux-saga'
import { put, cancelled, call, take, fork } from 'redux-saga/effects'
import Firebase from 'containers/Firebase'
// import axios from 'axios'

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
    // yield fork(Firebase.updateArticle, articleId, { checked: value })
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
    // const postData = {
    //   data: {
    //     title: 'Here is the test message',
    //     body: payload.data,
    //   },
    //   to: 'frEK0Ts7b6Y:APA91bH7CpLXZWmxZCliQ2sjskT1Ho0DiZbAw5I6Alw8cc6KjhyElWC5KlO12lfkDUeZuEVgGgUmkQbb3GjSOl5ZYdJtwrp65BcoFhioyTjHeALf4b2NbpyQt9Gc1d-FV-TY6mwOjY9_',
    // }
    
    // const axiosConfig = {
    //   headers: {
    //     'Content-Type': 'application/json;charset=UTF-8',
    //     'Authorization': 'key=AAAAMSspG5o:APA91bGu3UzX5czt1FX7-v0QP-QAqOlVnqq432iQ1kxpgv5zG_r2AuMT44VU1FOD-ReF9QzowBk4qZ5KE19DY7N736BG2NH7SEOaW0-Th4Z1neWHLEGGFLRBq3c7HWtzSGMpHTlnC2uW',
    //   },
    // }
    
    // axios.post('https://fcm.googleapis.com/fcm/send', postData, axiosConfig)
    //   .then((res) => {
    //     console.log('RESPONSE RECEIVED: ', res)
    //   })
    //   .catch((err) => {
    //     console.log('AXIOS ERROR: ', err)
    //   })

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