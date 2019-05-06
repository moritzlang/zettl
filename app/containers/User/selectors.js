import { createSelector } from 'reselect'


const selectUserAuth = (state) => state.user

const makeSelectAuthResponse = () => createSelector(
  selectUserAuth, 
  (user) => user
)

const makeSelectAuthStatus = () => createSelector(
  selectUserAuth, 
  (user) =>
    user.delete('details')
      .set('isAuthed', user.get('details') ? !!user.get('details').size : false)
)

export {
  selectUserAuth,
  makeSelectAuthResponse,
  makeSelectAuthStatus,
}