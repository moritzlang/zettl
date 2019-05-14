import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { List, Map } from 'immutable'
import injectSaga from 'utils/injectSaga'
import injectReducer from 'utils/injectReducer'
import { createStructuredSelector } from 'reselect'

import uuid from 'uuid/v4'

import MainInput from 'components/MainInput'
import Articles from 'components/Articles'

import { toggleArticle, addArticle, articleProcessed } from 'containers/Article/actions'
import { loadLists } from 'containers/List/actions'
import { makeSelectLists } from 'containers/List/selectors'
import listSaga from 'containers/List/sagas'
import listReducer from 'containers/List/reducers'
import { makeSelectUser } from 'containers/User/selectors'

import { Wrapper } from './Styles'

export class HomePage extends React.PureComponent {

  componentDidMount() {
    this.props.onLoadLists()
  }

  handleSubmit = (value) => {
    const newArticle = {
      id: uuid(),
      listId: this.props.user.get('currentList'),
      value,
      checked: false,
      updated_at: new Date(),
      processing: true,
      success: false,
    }

    this.props.onAddArticle(newArticle)

    /*
      After 3 seconds we mark the article as 'processed'.
      If the article was not successfully added to the
      database at this point, there will be a error message
      in the UI
    */
    setTimeout(() => {
      this.props.onArticleProcessed({
        listId: newArticle.listId,
        articleId: newArticle.id,
      })
    }, 3000)
  }

  handleCheckToggle = (id, value) => {
    this.props.onToggleArticle({
      listId: this.props.user.get('currentList'),
      articleId: id,
      value,
    })
  }

  render() {
    const { lists, user } = this.props
    const currentList = user ? user.get('currentList') : null
    const allLists = lists && lists.size ? lists.get('lists') : List()
    const list = currentList ? allLists.get(currentList) : allLists.last()
    const articles = list && list.size ? list.get('articles') : List()

    return (
      <Wrapper>
        {list ?
          <div>
            <MainInput
              name='add-article'
              placeholder='Add article'
              autoComplete='off'
              onSubmit={this.handleSubmit}
            />
            {!lists.get('listsLoading') &&
            <Articles onToggle={this.handleCheckToggle} articles={articles} />}
          </div>
          :
          <div>
            {!lists.get('listsLoading') &&
            <div>
              <h3>You don&apos;t have a list yet</h3>
              <p>Tap in the input field above to create a list.
                After that you can start adding articles.
              </p>
            </div>}
          </div>
        }
      </Wrapper>
    )
  }
}

HomePage.propTypes = {
  onLoadLists: PropTypes.func.isRequired,
  onToggleArticle: PropTypes.func.isRequired,
  onAddArticle: PropTypes.func.isRequired,
  onArticleProcessed: PropTypes.func.isRequired,
  user: ImmutablePropTypes.map,
  lists: ImmutablePropTypes.mapContains({
    lists: ImmutablePropTypes.orderedMapOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.string,
        owner: PropTypes.string,
        title: PropTypes.string,
        articles: ImmutablePropTypes.listOf(
          ImmutablePropTypes.mapContains({
            id: PropTypes.string,
            value: PropTypes.string,
            checked: PropTypes.bool,
          })
        ),
      }),
    ),
  }),
}

HomePage.defaultProps = {
  lists: Map(),
  user: Map(),
}

const mapStateToProps = createStructuredSelector({
  lists: makeSelectLists(),
  user: makeSelectUser(),
})

export function mapDispatchToProps(dispatch) {
  return {
    onLoadLists: () => dispatch(loadLists()),
    onToggleArticle: data => dispatch(toggleArticle(data)),
    onAddArticle: data => dispatch(addArticle(data)),
    onArticleProcessed: data => dispatch(articleProcessed(data)),
  }
}

const withReducer = injectReducer({key: 'lists', reducer: listReducer})
const withSaga = injectSaga({key: 'lists', saga: listSaga})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default compose(
  withReducer,
  withSaga,
  withConnect
)(HomePage)