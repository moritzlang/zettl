import React from 'react'
import PropTypes from 'prop-types'

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import * as Color from 'styles/colors'
import { CheckboxIcon, CheckboxCheckedIcon, CloseIcon } from 'images/icons'
import { StyledListItem, ListItemWrapper, StyledListItemText } from './Styles'

export class Articles extends React.PureComponent {

  render() {
    const { id, value, checked } = this.props

    return (
      <ListItemWrapper>
        <StyledListItem role={undefined} dense button onClick={() => this.handleToggle(id, !checked)}>
          <Checkbox
            checked={checked}
            tabIndex={-1}
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon colors={{ primary: Color.GREEN_300 }} />}
            disableRipple />
          <StyledListItemText primary={value} />
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
    )
  }
}

Articles.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool,
}

Articles.defaultProps = {
  checked: false,
}

export default Articles