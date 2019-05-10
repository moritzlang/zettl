import {
  LOAD_LISTS,
  LOAD_LISTS_SUCCESS,
  LOAD_LISTS_ERROR,
  ADD_LIST,
  ADD_LIST_SUCCESS,
  ADD_LIST_ERROR,
} from './constants'

export const loadLists = data => ({
  data,
  type: LOAD_LISTS,
})

export const listsLoaded = data => ({
  data,
  type: LOAD_LISTS_SUCCESS,
})

export const listsLoadingError = error => ({
  error,
  type: LOAD_LISTS_ERROR,
})

export const addList = data => ({
  data,
  type: ADD_LIST,
})

export const listAdded = data => ({
  data,
  type: ADD_LIST_SUCCESS,
})

export const listAddedError = data => ({
  data,
  type: ADD_LIST_ERROR,
})