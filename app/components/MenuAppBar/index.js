import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import injectSaga from 'utils/injectSaga'
import injectReducer from 'utils/injectReducer'
import { createStructuredSelector } from 'reselect'

import Firebase from 'containers/Firebase'
import { makeSelectAuthResponse, makeSelectAuthStatus } from 'containers/User/selectors'
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

import defaultImage from 'images/icon-user-circle.svg'

import { styles, StyledSwipeableDrawer, StyledAppBar, StyledListItem, StyledListItemText, StyledInfoListItemText } from './Styles'

export class MenuAppBar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      drawerOpen: false,
      showNotificationSwitch: false,
      allowNotifications: false,
      deferredPrompt: null,
    }
  }

  // Cancel add-to-homescreen prompt
  deferPrompt = e => {
    console.log('beforeinstallprompt Event fired')
    e.preventDefault()
    this.setState({ deferredPrompt: e })
  }

  installApp = () => {
    const { deferredPrompt } = this.state
    if(deferredPrompt !== null) {
      // Show the prompt
      deferredPrompt.prompt()

      // Follow what the user has done with the prompt.
      deferredPrompt.userChoice.then(choiceResult => {
        if(choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt')
        } else {
          console.log('User dismissed the A2HS prompt')
        }

        // Remove prompt
        this.setState({ deferredPrompt: null })
      })
    }
  }

  componentDidMount() {
    window.addEventListener('beforeinstallprompt', this.deferPrompt)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeinstallprompt', this.deferPrompt)
  }

  toggleDrawer = (open) => {
    this.setState({ drawerOpen: open })
  }

  subscribeUser = () => {

  }

  toggleNotifications = () => {
    if (this.state.allowNotifications) {
      // TODO: Unsubscribe user
    } else {
      this.subscribeUser()
    }
  }

  render() {
    const { classes, authStatus } = this.props
    const { allowNotifications, deferredPrompt, showNotificationSwitch } = this.state

    const loggedInList = (
      <List className={classes.root}>
        <StyledListItem button>
          <ListItemAvatar>
            <Avatar
              alt='Avatar'
              onError={(e) => { e.target.src = defaultImage }}
              src={this.props.user.getIn(['details', 'photoURL'])} />
          </ListItemAvatar>
          <StyledListItemText
            primary={this.props.user.getIn(['details', 'displayName'])}
            secondary={this.props.user.getIn(['details', 'email'])} />
        </StyledListItem>

        <Divider />

        {showNotificationSwitch ? (
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
        ) : null}

        {deferredPrompt ? (
          <StyledListItem
            button
            onClick={() => this.installApp()} >
            <ListItemIcon>
              <InstallIcon />
            </ListItemIcon>
            <ListItemText primary='Install' />
          </StyledListItem>
        ) : null}


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
            {authStatus.get('isAuthed') ? loggedInList : loggedOutList}
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
  authStatus: PropTypes.instanceOf(Map),
  user: PropTypes.instanceOf(Map),
  onSignOutUser: PropTypes.func.isRequired,
}

MenuAppBar.defaultProps = {
  user: Map(),
  authStatus: Map(),
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectAuthResponse(),
  authStatus: makeSelectAuthStatus(),
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