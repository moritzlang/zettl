import { createSelector } from 'reselect'


const selectLists = (state) => state.lists

const makeSelectLists = () => createSelector(
  selectLists, 
  (lists) => lists
)

export {
  selectLists,
  makeSelectLists,
}