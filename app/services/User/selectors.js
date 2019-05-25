import { createSelector } from 'reselect'


const selectUser = (state) => state.user

const makeSelectUser = () => createSelector(
  selectUser, 
  (user) => user
)

const makeSelectAuthStatus = () => createSelector(
  selectUser, 
  (user) =>
    user.delete('details')
      .set('isAuthed', user.get('details') ? !!user.get('details').size : false)
)

export {
  selectUser,
  makeSelectUser,
  makeSelectAuthStatus,
}