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

import { makeSelectArticles } from 'containers/Article/selectors'
import { loadArticles, toggleArticle, addArticle } from 'containers/Article/actions'
import articleSaga from 'containers/Article/sagas'
import articleReducer from 'containers/Article/reducers'

import { Wrapper } from './Styles'

export class HomePage extends React.PureComponent {

  componentDidMount() {
    this.props.onLoadArticles()
  }

  handleSubmit = (value) => {
    this.props.onAddArticle(value)
  }

  handleCheckToggle = (id, value) => {
    this.props.onToggleArticle({ id, value })
  }

  render() {
    const { articles } = this.props

    return (
      <Wrapper>
        <MainInput
          name='add-article'
          placeholder='Add article'
          autoComplete='off'
          onSubmit={this.handleSubmit}
        />
        <Articles onToggle={this.handleCheckToggle} articles={articles.get('articles')} />
      </Wrapper>
    )
  }
}

HomePage.propTypes = {
  onLoadArticles: PropTypes.func.isRequired,
  onToggleArticle: PropTypes.func.isRequired,
  onAddArticle: PropTypes.func.isRequired,
  articles: ImmutablePropTypes.mapContains({
    articles: ImmutablePropTypes.listOf(
      ImmutablePropTypes.mapContains({
        id: PropTypes.string,
        value: PropTypes.string,
        checked: PropTypes.bool,
      })
    ),
  }),
}

HomePage.defaultProps = {
  articles: List(),
}

const mapStateToProps = createStructuredSelector({
  articles: makeSelectArticles(),
})

export function mapDispatchToProps(dispatch) {
  return {
    onLoadArticles: () => dispatch(loadArticles()),
    onToggleArticle: data => dispatch(toggleArticle(data)),
    onAddArticle: data => dispatch(addArticle(data)),
  }
}

const withReducer = injectReducer({key: 'articles', reducer: articleReducer})
const withSaga = injectSaga({key: 'articles', saga: articleSaga})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default compose(
  withReducer,
  withSaga,
  withConnect
)(HomePage)