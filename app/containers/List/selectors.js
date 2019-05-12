import { createSelector } from 'reselect'


const selectLists = (state) => state.lists

const makeSelectLists = () => createSelector(
  selectLists, 
  (lists) => lists
)

const makeSelectListsOverview = () => createSelector(
  selectLists, 
  (lists) => {
    if(lists) {
      const arr = lists.get('lists').valueSeq().toArray().map((list) => (
        {
          value: list.get('id'),
          label: list.get('title'),
          owner: list.get('owner'),
        }
      ))
      return arr
    }
    return lists
  }
)

export {
  selectLists,
  makeSelectLists,
  makeSelectListsOverview,
}