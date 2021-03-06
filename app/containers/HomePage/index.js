import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { List, Map } from 'immutable'
import injectSaga from 'utils/injectSaga'
import injectReducer from 'utils/injectReducer'
import { createStructuredSelector } from 'reselect'

import Firebase from 'containers/Firebase'
import uuid from 'uuid/v4'

import MainInput from 'components/MainInput'
import Articles from 'components/Articles'

import { toggleArticle, addArticle, articleProcessed, deleteArticle } from 'services/Article/actions'
import { loadLists } from 'services/List/actions'
import { makeSelectLists } from 'services/List/selectors'
import listSaga from 'services/List/sagas'
import listReducer from 'services/List/reducers'
import { makeSelectUser } from 'services/User/selectors'

import { Wrapper } from './Styles'

export class HomePage extends React.PureComponent {

  componentDidMount() {
    this.props.onLoadLists()
  }

  handleSubmit = (value) => {
    const { user } = this.props
    
    const newArticle = {
      id: uuid(),
      listId: user.get('currentList'),
      value,
      checked: false,
      updated_at: new Date(),
      processing: true,
      success: false,
      creator: {
        userId: Firebase.auth().currentUser.uid,
        displayName: Firebase.auth().currentUser.displayName,
      },
    }

    this.props.onAddArticle(newArticle)

    /*
      After 3 seconds we mark the article as 'processed'.
      If the article was not successfully added to the
      database at this point, there will be an error message
      in the UI
    */
    setTimeout(() => {
      this.props.onArticleProcessed({
        listId: newArticle.listId,
        articleId: newArticle.id,
      })
      Firebase.updateArticle(newArticle.id, { processing: false })
    }, 3000)
  }

  handleCheckToggle = (id, value) => {
    this.props.onToggleArticle({
      listId: this.props.user.get('currentList'),
      articleId: id,
      value,
    })
  }

  handleDelete = id => {
    this.props.onDeleteArticle({
      listId: this.props.user.get('currentList'),
      articleId: id,
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
            <Articles
              onToggle={this.handleCheckToggle}
              onDelete={this.handleDelete}
              articles={articles} />}
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
  onDeleteArticle: PropTypes.func.isRequired,
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
    onDeleteArticle: data => dispatch(deleteArticle(data)),
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