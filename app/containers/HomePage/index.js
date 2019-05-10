import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { List } from 'immutable'
import injectSaga from 'utils/injectSaga'
import injectReducer from 'utils/injectReducer'
import { createStructuredSelector } from 'reselect'

import MainInput from 'components/MainInput'
import Articles from 'components/Articles'

import { toggleArticle, addArticle } from 'containers/Article/actions'
import { loadLists } from 'containers/List/actions'
import { makeSelectLists } from 'containers/List/selectors'
import listSaga from 'containers/List/sagas'
import listReducer from 'containers/List/reducers'

import { Wrapper } from './Styles'

export class HomePage extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      currentList: 'dHvgmOh41LmRH1gmGlVY',
    }
  }

  componentDidMount() {
    this.props.onLoadLists()
  }

  handleSubmit = (value) => {
    this.props.onAddArticle({
      listId: this.state.currentList,
      value,
    })
  }

  handleCheckToggle = (id, value) => {
    this.props.onToggleArticle({
      listId: this.state.currentList,
      articleId: id,
      value,
    })
  }

  render() {
    // const { currentList } = this.state
    const { lists } = this.props

    const list = lists && lists.size ? lists.get('lists').last() : List()
    const articles = list && list.size ? list.get('articles') : List()

    return (
      <Wrapper>
        <MainInput
          name='add-article'
          placeholder='Add article'
          autoComplete='off'
          onSubmit={this.handleSubmit}
        />
        {!lists.get('listsLoading')
          ? <Articles onToggle={this.handleCheckToggle} articles={articles} />
          : null}
      </Wrapper>
    )
  }
}

HomePage.propTypes = {
  onLoadLists: PropTypes.func.isRequired,
  onToggleArticle: PropTypes.func.isRequired,
  onAddArticle: PropTypes.func.isRequired,
  lists: ImmutablePropTypes.mapContains({
    lists: ImmutablePropTypes.orderedMapOf(
      ImmutablePropTypes.mapContains({
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
  lists: Map,
}

const mapStateToProps = createStructuredSelector({
  lists: makeSelectLists(),
})

export function mapDispatchToProps(dispatch) {
  return {
    onLoadLists: () => dispatch(loadLists()),
    onToggleArticle: data => dispatch(toggleArticle(data)),
    onAddArticle: data => dispatch(addArticle(data)),
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