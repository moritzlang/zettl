import React from 'react'
import { List } from 'immutable'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import Grow from '@material-ui/core/Grow'

import Article from 'components/Article'

import { StyledList } from './Styles'

export class Articles extends React.PureComponent {

  handleCheckToggle = (id, value) => {
    this.props.onToggle(id, value)
  }

  render() {
    const { articles } = this.props
    return (
      <Grow
        in
        style={{ transformOrigin: '50% 0 0' }} >
        <StyledList>
          {articles.size ? articles.map(a => (
            <Article
              key={a.get('id')}
              id={a.get('id')}
              value={a.get('value')}
              checked={a.get('checked')}
              onToggle={this.handleCheckToggle} />
          )).reverse()
            // TODO: style empty state
            : (
              <div>
                <h3>Your list is empty</h3>
                <p>Start adding new items to the list and share it with other people.</p>
              </div>
            )}
        </StyledList>
      </Grow>
    )
  }
}

Articles.propTypes = {
  articles: ImmutablePropTypes.listOf(
    ImmutablePropTypes.mapContains({
      id: PropTypes.string,
      value: PropTypes.string,
      checked: PropTypes.bool,
    })
  ),
  onToggle: PropTypes.func,
}

Articles.defaultProps = {
  articles: List(),
}

export default Articles