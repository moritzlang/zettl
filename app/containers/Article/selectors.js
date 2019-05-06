import { createSelector } from 'reselect'


const selectArticles = (state) => state.articles

const makeSelectArticles = () => createSelector(
  selectArticles, 
  (articles) => articles
)

export {
  selectArticles,
  makeSelectArticles,
}