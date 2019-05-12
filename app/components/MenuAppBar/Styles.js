import styled from 'styled-components'

import { components } from 'react-select'
import AppBar from '@material-ui/core/AppBar'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import CreatableSelect from 'react-select/lib/Creatable'

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

export const StyledInfoListItemText = styled(ListItemText)`
  && {
    padding: 0 14px;
    padding-top: 10px;

    > span {
      font-size: 22px;
      margin-bottom: 0.5em;
    }

    > p {
      font-size: 16px;
    }
  }
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

export const SelectWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  width: 150px;
`

export const StyledSelect = styled(CreatableSelect)`
  width: 100%;

  > div:first-child {
    background-color: transparent;
    border-color: transparent;

    &:hover {
      background-color: ${Color.GRAY_100};
    }
  }
`

export const MenuButtonWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
`

export const StyledSingleValue = styled(components.SingleValue)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const StyledOption = styled(components.Option)`
  && {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

export const styles = theme => ({
  root: {
    minWidth: 240,
    maxWidth: 250,
  },
  logo: {
    flexGrow: 1,
    marginRight: '14px',
  },
  menuButton: {
    marginLeft: 0,
    marginRight: -12,
  },
  switchBase: {
    '&$switchChecked': {
      color: theme.palette.common.white,
      '& + $switchBar': {
        backgroundColor: Color.TEAL_PRIMARY,
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