import {
  LOAD_ARTICLES,
  LOAD_ARTICLES_SUCCESS,
  LOAD_ARTICLES_ERROR,
  ADD_ARTICLE,
  ADD_ARTICLE_SUCCESS,
  ADD_ARTICLE_ERROR,
  DELETE_ARTICLE,
  DELETE_ARTICLE_SUCCESS,
  DELETE_ARTICLE_ERROR,
  TOGGLE_ARTICLE,
  TOGGLE_ARTICLE_SUCCESS,
  TOGGLE_ARTICLE_ERROR,
  PROCESS_ARTICLE,
  PROCESS_ARTICLE_SUCCESS,
  PROCESS_ARTICLE_ERROR,
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

export const deleteArticle = data => ({
  data,
  type: DELETE_ARTICLE,
})

export const articleDeleted = data => ({
  data,
  type: DELETE_ARTICLE_SUCCESS,
})

export const articleDeletingError = data => ({
  data,
  type: DELETE_ARTICLE_ERROR,
})

export const toggleArticle = data => ({
  data,
  type: TOGGLE_ARTICLE,
})

export const articleToggled = data => ({
  data,
  type: TOGGLE_ARTICLE_SUCCESS,
})

export const articleTogglingError = error => ({
  error,
  type: TOGGLE_ARTICLE_ERROR,
})

export const processArticle = data => ({
  data,
  type: PROCESS_ARTICLE,
})

export const articleProcessed = data => ({
  data,
  type: PROCESS_ARTICLE_SUCCESS,
})

export const articlesProcessingError = error => ({
  error,
  type: PROCESS_ARTICLE_ERROR,
})