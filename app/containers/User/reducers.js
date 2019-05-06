import { fromJS, Map } from 'immutable'

import {
  SIGN_IN_USER,
  SIGN_IN_USER_SUCCESS,
  SIGN_IN_USER_ERROR,
  SIGN_OUT_USER,
} from './constants'

export const initialState = fromJS({
  authError: false,
  authLoading: false,
  details: Map(),
})

function userReducer(state = initialState, action) {
  const response = action.user
  
  switch (action.type) {
    case SIGN_IN_USER:
      return state
        .set('authLoading', true)
        .set('authError', null)
    case SIGN_IN_USER_SUCCESS:
      return state
        .set('authLoading', false)
        .set('details', Map(response))
    case SIGN_IN_USER_ERROR:
      return state
        .set('authLoading', false)
        .set('authError', action.error)
        .set('details', fromJS(response))
    case SIGN_OUT_USER: 
      return Map()
    default:
      return state
  }
}

export default userReducer