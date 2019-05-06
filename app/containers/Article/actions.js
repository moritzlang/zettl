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

export const loadArticles = data => ({
  data,
  type: LOAD_ARTICLES,
})

export const articlesLoaded = data => ({
  data,
  type: LOAD_ARTICLES_SUCCESS,
})

export const articlesLoadingError = error => ({
  error,
  type: LOAD_ARTICLES_ERROR,
})

export const addArticle = data => ({
  data,
  type: ADD_ARTICLE,
})

export const articleAdded = data => ({
  data,
  type: ADD_ARTICLE_SUCCESS,
})

export const articleAddedError = data => ({
  data,
  type: ADD_ARTICLE_ERROR,
})

export const toggleArticle = data => ({
  data,
  type: TOGGLE_ARTICLE,
})

export const articlesToggled = data => ({
  data,
  type: TOGGLE_ARTICLE_SUCCESS,
})

export const articlesTogglingError = error => ({
  error,
  type: TOGGLE_ARTICLE_ERROR,
})