import { fromJS, Map } from 'immutable'

import {
  SIGN_IN_USER_SUCCESS,
  SIGN_IN_USER_ERROR,
  SIGN_OUT_USER,
} from './constants'

export const initialState = fromJS({
  details: Map(),
})

function userAuthReducer(state = initialState, action) {
  const response = action.user
  
  switch (action.type) {
    case SIGN_IN_USER_SUCCESS:
      return state
        .set('details', Map(response))
    case SIGN_IN_USER_ERROR:
      return state
        .set('details', fromJS(response))
    case SIGN_OUT_USER: 
      return Map()
    default:
      return state
  }
}

export default userAuthReducer