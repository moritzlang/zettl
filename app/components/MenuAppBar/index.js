import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import { ZettlIcon, MenuIcon, InstallIcon, NotificationIcon, LogoutIcon } from 'images/icons'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Switch from '@material-ui/core/Switch'
import Divider from '@material-ui/core/Divider'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'

import { styles, StyledSwipeableDrawer, StyledAppBar, StyledListItem, StyledListItemText } from './Styles'

class MenuAppBar extends React.Component {
  state = {
    isAuthenticated: false,
    drawerOpen: false,
    allowNotifications: false,
  };

  toggleDrawer = (open) => () => {
    this.setState({ drawerOpen: open })
  }

  toggleNotifications = () => () => {
    this.setState((prevState) => ({ allowNotifications: !prevState.allowNotifications }))
  }

  render() {
    const { classes } = this.props
    const { allowNotifications, isAuthenticated } = this.state

    const loggedInList = (
      <List className={classes.root}>
        <StyledListItem button>
          <ListItemAvatar>
            <Avatar
              alt='Avatar'
              src='https://material-ui.com/static/images/avatar/2.jpg' />
          </ListItemAvatar>
          <StyledListItemText
            primary='Moritz Lang'
            secondary='moritzlang@outlook.com' />
        </StyledListItem>

        <Divider />

        <StyledListItem
          button
          onClick={this.toggleNotifications()} >
          <ListItemIcon>
            <NotificationIcon />
          </ListItemIcon>
          <ListItemText primary='Notifications' />
          <ListItemSecondaryAction>
            <Switch
              onClick={this.toggleNotifications()}
              checked={allowNotifications}
              disableRipple
              classes={{
                switchBase: classes.switchBase,
                bar: classes.switchBar,
                icon: classes.switchIcon,
                iconChecked: classes.switchIconChecked,
                checked: classes.switchChecked,
              }} />
          </ListItemSecondaryAction>
        </StyledListItem>

        <StyledListItem button>
          <ListItemIcon>
            <InstallIcon />
          </ListItemIcon>
          <ListItemText primary='Install' />
        </StyledListItem>

        <StyledListItem button>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </StyledListItem>
      </List>
    )

    const loggedOutList = (
      <List className={classes.root}>
        <StyledListItem>
          <ListItemText
            primary='Login'
            secondary='Lorem ispum dolor set emit'
          />
        </StyledListItem>
      </List>
    )

    return (
      <div>
        <StyledAppBar>
          <Toolbar>
            <div className={classes.grow}>
              <ZettlIcon />
            </div>

            <IconButton
              className={classes.menuButton}
              aria-label='Menu'
              color='inherit'
              onClick={this.toggleDrawer(true)} >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </StyledAppBar>
        <StyledSwipeableDrawer
          anchor='right'
          open={this.state.drawerOpen}
          onClose={this.toggleDrawer(false)}
          onOpen={this.toggleDrawer(true)} >
          <div
            tabIndex={0}
            role='button'
            onKeyDown={this.toggleDrawer(false)} >
            {isAuthenticated ? loggedInList : loggedOutList}
          </div>
        </StyledSwipeableDrawer>
      </div>
    )
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MenuAppBar)