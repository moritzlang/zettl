import React from 'react'
import PropTypes from 'prop-types'

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import * as Color from 'styles/colors'
import { CheckboxIcon, CheckboxCheckedIcon, CloseIcon, ImportantIcon } from 'images/icons'
import { StyledListItem, ListItemWrapper, StyledListItemText, Status, StatusInfo } from './Styles'

export class Articles extends React.PureComponent {

  handleCheckToggle = (id, value) => {
    this.props.onToggle(id, value)
  }

  render() {
    const { id, value, checked, status } = this.props

    return (
      <ListItemWrapper>
        <StyledListItem
          status={!status ? 1 : 0}
          role={undefined}
          dense
          button
          onClick={() => this.handleCheckToggle(id, !checked)}>

          {!status &&
            <ImportantIcon
              colors={{
                primary: Color.RED_100,
                secondary: Color.RED_600,
              }}
            />}
          <Checkbox
            checked={checked}
            tabIndex={-1}
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon colors={{ primary: Color.TEAL_500 }} />}
            disableRipple />
          <StyledListItemText primary={value} />
          {!status &&
            <Status>
              <StatusInfo>No connection, could not save article.</StatusInfo>
            </Status>}
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
  onToggle: PropTypes.func,
  status: PropTypes.bool,
}

Articles.defaultProps = {
  checked: false,
  status: true,
}

export default Articles