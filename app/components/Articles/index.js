import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Grow from '@material-ui/core/Grow'

import * as Color from 'styles/colors'
import { CheckboxIcon, CheckboxCheckedIcon, CloseIcon } from 'images/icons'
import { StyledList, StyledListItem, ListItemWrapper, StyledListItemText } from './Styles'

export class Articles extends React.PureComponent {

  handleToggle = (id, value) => {
    this.props.onToggle(id, value)
  }

  render() {
    const { articles } = this.props

    return (
      <Grow
        in
        style={{ transformOrigin: '50% 0 0' }}
        timeout={500}>
        <StyledList>
          {articles.map(a => (
            <ListItemWrapper key={a.get('id')}>
              <StyledListItem role={undefined} dense button onClick={() => this.handleToggle(a.get('id'), !a.get('checked'))}>
                <Checkbox
                  checked={a.get('checked')}
                  tabIndex={-1}
                  icon={<CheckboxIcon />}
                  checkedIcon={<CheckboxCheckedIcon colors={{ primary: Color.GREEN_300 }} />}
                  disableRipple />
                <StyledListItemText primary={a.get('value')} />
                <ListItemSecondaryAction>
                  <Tooltip title='Delete' placement='left'>
                    <IconButton
                      aria-label='Delete'>
                      <CloseIcon colors={{ primary: Color.GRAY_200 }} />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </StyledListItem>
            </ListItemWrapper>
          ))}      
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
}

export default Articles