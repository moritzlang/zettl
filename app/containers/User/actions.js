import {
  SIGN_IN_USER,
  SIGN_IN_USER_SUCCESS,
  SIGN_IN_USER_ERROR,
  SIGN_OUT_USER,
} from './constants'

export const signInUser = user => ({
  user,
  type: SIGN_IN_USER,
})

export const userSignedIn = user => ({
  user,
  type: SIGN_IN_USER_SUCCESS,
})

export const userSignInError = error => ({
  error,
  type: SIGN_IN_USER_ERROR,
})

export const signOutUser = () => ({
  type: SIGN_OUT_USER,
})