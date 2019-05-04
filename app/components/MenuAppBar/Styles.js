import styled from 'styled-components'

import AppBar from '@material-ui/core/AppBar'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'

import * as Color from 'styles/colors'
import * as Dimension from 'styles/dimensions'

export const StyledAppBar = styled(AppBar)`
  height: ${Dimension.APP_BAR_HEIGHT};
  box-shadow: none;
  border-bottom: 2px solid #000000DE;
`

export const StyledListItem = styled(ListItem)`
  height: 70px;
`

export const StyledListItemText = styled(ListItemText)`
  > * {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const StyledSwipeableDrawer = styled(SwipeableDrawer)`
  > div:last-child {
    background-color: ${Color.BACKGROUND_COLOR};
  }
`

export const styles = theme => ({
  root: {
    width: 'auto',
    maxWidth: 250,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: 20,
    marginRight: -12,
  },
  switchBase: {
    '&$switchChecked': {
      color: theme.palette.common.white,
      '& + $switchBar': {
        backgroundColor: Color.GREEN_300,
      },
    },
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.sharp,
    }),
  },
  switchChecked: {
    transform: 'translateX(22px)',
    '& + $switchBar': {
      opacity: 1,
      border: 'none',
    },
  },
  switchBar: {
    borderRadius: 13,
    width: 42,
    height: 20,
    marginTop: -12,
    border: 'solid 1px',
    borderColor: '#E1E1E1',
    backgroundColor: '#E1E1E1',
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  switchIcon: {
    width: 18,
    height: 18,
    marginTop: -4,
  },
  switchIconChecked: {
    boxShadow: theme.shadows[1],
  },
})