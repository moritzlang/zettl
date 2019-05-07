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

import toUint8Array from 'urlb64touint8array'

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

const applicationServerPublicKey = 'BJTrL5xVK7gaOnuFQyu2ZqA3P0QUxX8FlUKSeu1vpYei1qiXfNBzZyNk_MGoVPWASRwR_3HZfgVhTRKIR-GBeu4'


export class MenuAppBar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      drawerOpen: false,
      showNotificationSwitch: false,
      allowNotifications: false,
      notificationsBlocked: Notification.permission === 'denied',
      deferredPrompt: null,
      swRegistration: null,
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

  initNotificationSwitch = () => {
    this.state.swRegistration.pushManager.getSubscription()
      .then((subscription) => {
        if(!(subscription === null)) {
          // User is subscribed to notifications
          this.setState({ allowNotifications: true })
        } else {
          this.setState({ allowNotifications: false })
        }
      })
  }

  componentDidMount() {
    window.addEventListener('beforeinstallprompt', this.deferPrompt)
    this.initPushNotifications()
  }

  componentWillUnmount() {
    window.removeEventListener('beforeinstallprompt', this.deferPrompt)
  }

  toggleDrawer = (open) => {
    this.setState({ drawerOpen: open })
  }

  initPushNotifications = () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // Service Worker and Push is supported
      this.setState({ showNotificationSwitch: true })
      navigator.serviceWorker.register('sw.js')
        .then((swReg) => {
          this.setState({ swRegistration: swReg })
          this.initNotificationSwitch()
        })
        .catch((err) => {
          console.error('Service Worker Error', err)
        })
    } else {
      // Push messaging is not supported
      this.setState({ showNotificationSwitch: false })
    }
  }

  subscribeUser = () => {
    const applicationServerKey = toUint8Array(applicationServerPublicKey)
    this.state.swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })
      .then(subscription => {
        // User is subscribed
        this.updateSubscriptionOnServer(subscription)
        this.setState({ allowNotifications: true })
      })
      .catch(() => {
        // Failed to subscribe the user
        this.setState({ allowNotifications: false })
      })
  }

  unsubscribeUser = () => {
    this.state.swRegistration.pushManager.getSubscription()
      .then(subscription => {
        if (subscription) {
          return subscription.unsubscribe()
        }
        return null
      })
      .catch(err => {
        console.log('Error unsubscribing', err)
      })
      .then(() => {
        // User is unsubscribed
        this.updateSubscriptionOnServer(null)
        this.setState({ allowNotifications: false })
      })
  }

  // TODO: Send subscription to application server
  updateSubscriptionOnServer = (subscription) => {
    if(subscription) {
      console.log(subscription)
      console.log(JSON.stringify(subscription))
    }
  }

  toggleNotifications = () => {
    if(this.state.allowNotifications) {
      this.unsubscribeUser()
    } else {
      this.subscribeUser()
    }
  }

  render() {
    const { classes, authStatus } = this.props
    const {
      allowNotifications,
      deferredPrompt,
      showNotificationSwitch,
      notificationsBlocked,
    } = this.state

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
                disabled={notificationsBlocked}
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