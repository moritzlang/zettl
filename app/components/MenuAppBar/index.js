import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import injectSaga from 'utils/injectSaga'
import injectReducer from 'utils/injectReducer'
import { createStructuredSelector } from 'reselect'

import Firebase from 'containers/Firebase'
import { makeSelectAuthResponse, makeSelectSuccessfulAuth } from 'containers/User/selectors'
import { signOutUser } from 'containers/User/actions'
import userSaga from 'containers/User/sagas'
import userReducer from 'containers/User/reducers'

import { withStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import { ZettlIcon, MenuIcon, InstallIcon, NotificationIcon, LogoutIcon } from 'images/icons'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Switch from '@material-ui/core/Switch'
import Divider from '@material-ui/core/Divider'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'

import { styles, StyledSwipeableDrawer, StyledAppBar, StyledListItem, StyledListItemText, StyledInfoListItemText } from './Styles'

export class MenuAppBar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      drawerOpen: false,
      allowNotifications: false,
    }
  }

  toggleDrawer = (open) => {
    this.setState({ drawerOpen: open })
  }

  toggleNotifications = () => {
    this.setState((prevState) => ({ allowNotifications: !prevState.allowNotifications }))
  }

  render() {
    const { classes, isAuthed } = this.props
    const { allowNotifications } = this.state

    const loggedInList = (
      <List className={classes.root}>
        <StyledListItem button>
          <ListItemAvatar>
            <Avatar
              alt='Avatar'
              src={this.props.user.getIn(['details', 'photoURL'])} />
          </ListItemAvatar>
          <StyledListItemText
            primary={this.props.user.getIn(['details', 'displayName'])}
            secondary={this.props.user.getIn(['details', 'email'])} />
        </StyledListItem>

        <Divider />

        <StyledListItem
          button
          onClick={() => this.toggleNotifications()} >
          <ListItemIcon>
            <NotificationIcon />
          </ListItemIcon>
          <ListItemText primary='Notifications' />
          <ListItemSecondaryAction>
            <Switch
              onClick={() => this.toggleNotifications()}
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

        <StyledListItem
          button
          onClick={() => {
            Firebase.signOut()
              .then(() => this.props.onSignOutUser())
              .then(() => this.toggleDrawer(false))
          }}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </StyledListItem>
      </List>
    )

    const loggedOutList = (
      <List className={classes.root}>
        <ListItem>
          <StyledInfoListItemText
            primary='About'
            secondary='zettl is a fully offline shopping list app. Like a real piece of paper but on your phone.'
          />
        </ListItem>
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
              onClick={() => this.toggleDrawer(true)} >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </StyledAppBar>
        <StyledSwipeableDrawer
          anchor='right'
          open={this.state.drawerOpen}
          onClose={() => this.toggleDrawer(false)}
          onOpen={() => this.toggleDrawer(true)} >
          <div
            tabIndex={0}
            role='button'
            onKeyDown={() => this.toggleDrawer(false)} >
            {isAuthed ? loggedInList : loggedOutList}
          </div>
        </StyledSwipeableDrawer>
      </div>
    )
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
}


MenuAppBar.propTypes = {
  isAuthed: PropTypes.bool,
  user: PropTypes.instanceOf(Map),
  onSignOutUser: PropTypes.func.isRequired,
}

MenuAppBar.defaultProps = {
  user: Map(),
  isAuthed: false,
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectAuthResponse(),
  isAuthed: makeSelectSuccessfulAuth(),
})

export function mapDispatchToProps(dispatch) {
  return {
    onSignOutUser: () => dispatch(signOutUser()),
  }
}

const withReducer = injectReducer({key: 'user', reducer: userReducer})
const withSaga = injectSaga({key: 'user', saga: userSaga})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles),
)(MenuAppBar)