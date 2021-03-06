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

export const signInUser = data => ({
  data,
  type: SIGN_IN_USER,
})

export const userSignedIn = data => ({
  data,
  type: SIGN_IN_USER_SUCCESS,
})

export const userSignInError = error => ({
  error,
  type: SIGN_IN_USER_ERROR,
})

export const signOutUser = () => ({
  type: SIGN_OUT_USER,
})

export const saveCurrentList = data => ({
  data,
  type: SAVE_CURRENT_LIST,
})

export const currentListSaved = data => ({
  data,
  type: SAVE_CURRENT_LIST_SUCCESS,
})

export const currentListSavingError = error => ({
  error,
  type: SAVE_CURRENT_LIST_ERROR,
})

export const changeNotificationStatus = data => ({
  data,
  type: CHANGE_NOTIFICATION_STATUS,
})

export const notificationStatusChanged = data => ({
  data,
  type: CHANGE_NOTIFICATION_STATUS_SUCCESS,
})

export const notificationStatusChangingError = error => ({
  error,
  type: CHANGE_NOTIFICATION_STATUS_ERROR,
})