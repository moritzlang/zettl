import { fromJS, List } from 'immutable'

import {
  LOAD_ARTICLES,
  LOAD_ARTICLES_SUCCESS,
  LOAD_ARTICLES_ERROR,
  ADD_ARTICLE,
  ADD_ARTICLE_SUCCESS,
  ADD_ARTICLE_ERROR,
  TOGGLE_ARTICLE,
  TOGGLE_ARTICLE_SUCCESS,
  TOGGLE_ARTICLE_ERROR,
} from './constants'

export const initialState = fromJS({
  articlesError: false,
  articlesLoading: false,
  addArticleError: false,
  addArticleLoading: false,
  articles: List(),
})

function articleReducer(state = initialState, action) {
  const response = action.data

  const getArticleIndex = id => 
    state.get('articles').findIndex(a => a.get('id') === id)

  switch (action.type) {
    case LOAD_ARTICLES:
      return state
        .set('articlesLoading', true)
        .set('articlesError', null)
    case LOAD_ARTICLES_SUCCESS:
      return state
        .set('articlesLoading', false)
        .set('articles', response)
    case LOAD_ARTICLES_ERROR:
      return state
        .set('articlesLoading', false)
        .set('articlesError', action.error)
    case ADD_ARTICLE:
      return state
        .set('addArticleLoading', true)
        .set('addArticleError', null)
    case ADD_ARTICLE_SUCCESS:
      return state
        .set('addArticleLoading', false)
        .update('articles', articles => articles.push(fromJS(response)))
    case ADD_ARTICLE_ERROR:
      return state
        .set('addArticleLoading', false)
        .set('addArticleError', action.error)
    case TOGGLE_ARTICLE:
      return state
        .set('articleToggling', true)
        .set('articleToggleError', null)
    case TOGGLE_ARTICLE_SUCCESS:
      return state
        .set('articleToggling', false)
        .setIn(['articles', getArticleIndex(response.id), 'checked'], response.value)
    case TOGGLE_ARTICLE_ERROR:
      return state
        .set('articleToggling', false)
        .set('articleToggleError', action.error)
    default:
      return state
  }
}

export default articleReducer