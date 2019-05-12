import { fromJS, OrderedMap, List, Map } from 'immutable'

import {
  ADD_ARTICLE,
  ADD_ARTICLE_SUCCESS,
  ADD_ARTICLE_ERROR,
  TOGGLE_ARTICLE,
  TOGGLE_ARTICLE_SUCCESS,
  TOGGLE_ARTICLE_ERROR,
} from 'containers/Article/constants'

import {
  LOAD_LISTS,
  LOAD_LISTS_SUCCESS,
  LOAD_LISTS_ERROR,
  ADD_LIST,
  ADD_LIST_SUCCESS,
  ADD_LIST_ERROR,
} from './constants'


export const initialState = fromJS({
  listsError: false,
  listsLoading: false,
  addListError: false,
  addListLoading: false,
  lists: OrderedMap(),
})

function listReducer(state = initialState, action) {
  const response = action.data

  const getArticleIndex = (listId, articleId) => 
    state.getIn(['lists', listId, 'articles']).findIndex(a => a.get('id') === articleId)

  switch (action.type) {
    case LOAD_LISTS:
      return state
        .set('listsLoading', true)
        .set('listsError', null)
    case LOAD_LISTS_SUCCESS:
      return state
        .set('listsLoading', false)
        .set('lists', response)
    case LOAD_LISTS_ERROR:
      return state
        .set('listsLoading', false)
        .set('listsError', action.error)
    case ADD_LIST:
      return state
        .set('addListLoading', true)
        .set('addListError', null)
    case ADD_LIST_SUCCESS:
      return state
        .set('addListLoading', false)
        .update('lists', lists => lists.set(response.id, Map({
          ...response,
          articles: List(),
        })))
    case ADD_LIST_ERROR:
      return state
        .set('addListLoading', false)
        .set('addListError', action.error)
    case ADD_ARTICLE:
      return state
        .set('addArticleLoading', true)
        .set('addArticleError', null)
    case ADD_ARTICLE_SUCCESS:
      return state
        .set('addArticleLoading', false)
        .updateIn(['lists', response.listId, 'articles'], articles => articles.push(fromJS(response)))
    case ADD_ARTICLE_ERROR:
      return state
        .set('addArticleLoading', false)
        .set('addArticleError', action.error)
    case TOGGLE_ARTICLE:
      return state
        .set('articleToggling', true)
        .set('articleToggleError', null)
    case TOGGLE_ARTICLE_SUCCESS: {
      const { listId, articleId, value } = response
      return state
        .set('articleToggling', false)
        .setIn(['lists', listId, 'articles', getArticleIndex(listId, articleId), 'checked'], value)
    }
    case TOGGLE_ARTICLE_ERROR:
      return state
        .set('articleToggling', false)
        .set('articleToggleError', action.error)
    default:
      return state
  }
}

export default listReducer