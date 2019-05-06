import { createSelector } from 'reselect'


const selectUserAuth = (state) => state.user

const makeSelectAuthResponse = () => createSelector(
  selectUserAuth, 
  (user) => user
)

const makeSelectSuccessfulAuth = () => createSelector(
  selectUserAuth, 
  (user) => user.get('details') ? !!user.get('details').size : false
)

export {
  selectUserAuth,
  makeSelectAuthResponse,
  makeSelectSuccessfulAuth,
}