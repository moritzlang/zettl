import { put } from 'redux-saga/effects'
import Firebase from 'containers/Firebase'
// import axios from 'axios'
import uuid from 'uuid/v4'

import { articlesLoaded, articlesLoadingError, articlesToggled, articlesTogglingError, articleAdded, articleAddedError } from './actions'


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
    const { articleId, value } = payload.data
    Firebase.updateArticle(articleId, { checked: value })
    yield put(articlesToggled(payload.data))
  } catch (err) {
    yield put(articlesTogglingError(err))
  }
}

export function* addArticle(payload) {
  try {
    const newArticle = {
      id: uuid(),
      ...payload.data,
      checked: false,
      updated_at: new Date(),
    }
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

    Firebase.addArticle(newArticle)
    yield put(articleAdded(newArticle))
  } catch (err) {
    yield put(articleAddedError(err))
  }
}