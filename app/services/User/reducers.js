import { fromJS, Map } from 'immutable'

import {
  SIGN_IN_USER,
  SIGN_IN_USER_SUCCESS,
  SIGN_IN_USER_ERROR,
  SIGN_OUT_USER,
  SAVE_CURRENT_LIST,
  SAVE_CURRENT_LIST_SUCCESS,
  SAVE_CURRENT_LIST_ERROR,
  CHANGE_NOTIFICATION_STATUS,
  CHANGE_NOTIFICATION_STATUS_SUCCESS,
  CHANGE_NOTIFICATION_STATUS_ERROR,
} from './constants'

export const initialState = fromJS({
  authError: false,
  authLoading: false,
  details: Map(),
  currentList: null,
  saveCurrentListError: false,
  saveCurrentListLoading: false,
  notificationStatus: false,
  changeNotificationStatusError: false,
  changeNotificationStatusLoading: false,
})

function userReducer(state = initialState, action) {
  const response = action.data
  
  switch (action.type) {
    case SIGN_IN_USER:
      return state
        .set('authLoading', true)
        .set('authError', null)
    case SIGN_IN_USER_SUCCESS:
      return state
        .set('authLoading', false)
        .set('currentList', response.currentList)
        .set('notificationStatus', response.notificationStatus)
        .set('details', Map(response.details))
    case SIGN_IN_USER_ERROR:
      return state
        .set('authLoading', false)
        .set('authError', action.error)
    case SIGN_OUT_USER: 
      return Map()
    case SAVE_CURRENT_LIST:
      return state
        .set('saveCurrentListLoading', true)
        .set('saveCurrentListError', null)
    case SAVE_CURRENT_LIST_SUCCESS:
      return state
        .set('saveCurrentListLoading', false)
        .set('currentList', response.data.value)
    case SAVE_CURRENT_LIST_ERROR:
      return state
        .set('saveCurrentListLoading', false)
        .set('saveCurrentListError', action.error)
    case CHANGE_NOTIFICATION_STATUS:
      return state
        .set('changeNotificationStatusLoading', true)
        .set('changeNotificationStatusError', null)
    case CHANGE_NOTIFICATION_STATUS_SUCCESS:
      return state
        .set('changeNotificationStatusLoading', false)
        .set('notificationStatus', response.data.value)
    case CHANGE_NOTIFICATION_STATUS_ERROR:
      return state
        .set('changeNotificationStatusLoading', false)
        .set('changeNotificationStatusError', action.error)
    default:
      return state
  }
}

export default userReducer