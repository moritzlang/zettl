import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import injectSaga from 'utils/injectSaga'
import injectReducer from 'utils/injectReducer'
import { createStructuredSelector } from 'reselect'

import Firebase from 'containers/Firebase'

import { makeSelectUser, makeSelectAuthStatus } from 'containers/User/selectors'
import { signOutUser, saveCurrentList } from 'containers/User/actions'
import userSaga from 'containers/User/sagas'
import userReducer from 'containers/User/reducers'

import { makeSelectListsOverview } from 'containers/List/selectors'
import { addList } from 'containers/List/actions'
import listSaga from 'containers/List/sagas'
import listReducer from 'containers/List/reducers'

import uuid from 'uuid/v4'

import { withStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import { ZettlIcon, MenuIcon, InstallIcon, NotificationIcon, LogoutIcon, GroupIcon } from 'images/icons'
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

import * as Color from 'styles/colors'

import {
  styles,
  StyledSwipeableDrawer,
  StyledAppBar,
  StyledListItem,
  StyledListItemText,
  StyledInfoListItemText,
  SelectWrapper,
  StyledSelect,
  MenuButtonWrapper,
  StyledOption,
  StyledSingleValue,
} from './Styles'


export class MenuAppBar extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      drawerOpen: false,
      showNotificationSwitch: false,
      allowNotifications: false,
      notificationsBlocked: Notification.permission === 'denied',
      deferredPrompt: null,
    }
  }

  // Cancel add-to-homescreen prompt
  deferPrompt = e => {
    e.preventDefault()
    this.setState({ deferredPrompt: e })
  }

  installApp = () => {
    const { deferredPrompt } = this.state
    if(deferredPrompt !== null) {
      // Show the prompt
      deferredPrompt.prompt()

      // Follow what the user has done with the prompt.
      // eslint-disable-next-line no-unused-vars
      deferredPrompt.userChoice.then(choiceResult => {
        // Remove prompt
        this.setState({ deferredPrompt: null })
      })
    }
  }

  componentDidMount() {
    window.addEventListener('beforeinstallprompt', this.deferPrompt)
    this.initPushNotifications()

    // Only works if app is focused
    // TODO: display toast or badge in UI
    Firebase.messaging.onMessage(payload => {
      console.log('onMessage: ', payload)
    })
  }

  componentWillUnmount() {
    window.removeEventListener('beforeinstallprompt', this.deferPrompt)
  }

  toggleDrawer = (open) => {
    this.setState({ drawerOpen: open })
  }

  initNotificationSwitch = () => {
    console.log("init switch")
    if(Notification.permission !== 'granted') {
      console.log('user is NOT subscribed')
      // User is not subscribed to notifications
      this.setState({ allowNotifications: false })
    } else {
      console.log('user is subscribed')
      // User is subscribed to notifications
      this.setState({ allowNotifications: true })

      // Update token in database in case there is a new one
      Firebase.messaging
        .requestPermission()
        .then(async () => {
          const token = await Firebase.messaging.getToken()
          console.log(token)
          // save token in db
          // this.updateSubscriptionOnServer(token)
        })
    }
  }

  initPushNotifications = () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // Service Worker and Push is supported
      this.setState({ showNotificationSwitch: true })
      navigator.serviceWorker.register('sw.js')
        .then((registration) => {
          Firebase.messaging.useServiceWorker(registration)
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
    console.log("subscribe")
    Firebase.messaging
      .requestPermission()
      .then(async () => {
        const token = await Firebase.messaging.getToken()
        console.log(token)
        // save token in db
        console.log(Firebase.auth().currentUser)
        // this.updateSubscriptionOnServer(subscription)
        this.setState({ allowNotifications: true })
      })
      .catch((err) => {
        this.setState({ allowNotifications: false })
        console.log('Unable to get permission to notify.', err)
      })
  }

  unsubscribeUser = () => {
    console.log("unsubscribe")
    
    // TODO: How to unsubscribe
    console.log(Firebase.auth().currentUser)

    // User is unsubscribed
    // delete token in db
    console.log(Firebase.deleteToken())
    // this.updateSubscriptionOnServer(null)
    this.setState({ allowNotifications: false })
  }

  toggleNotifications = () => {
    if(this.state.allowNotifications) {
      this.unsubscribeUser()
    } else {
      this.subscribeUser()
    }
  }

  handleListChange = (newValue) => {
    const userId = this.props.user.getIn(['details', 'uid'])
    this.props.onSaveCurrentList({ userId, value: newValue.value })
  }

  handleListCreate = (inputValue) => {
    const userId = this.props.user.getIn(['details', 'uid'])
    const list = {
      id: uuid(),
      title: inputValue,
      owner: userId,
    }

    this.props.onAddList({ userId, list })
    // Set newly created list to current list
    this.props.onSaveCurrentList({ userId, value: list.id })
  };

  render() {
    const {
      classes,
      authStatus,
      user,
      listsOverview,
    } = this.props

    const {
      allowNotifications,
      deferredPrompt,
      showNotificationSwitch,
      notificationsBlocked,
    } = this.state
    
    const currentList = listsOverview.find(list => list.value === user.get('currentList'))
    const lastList = listsOverview.length ? listsOverview[listsOverview.length - 1] : null

    const loggedInList = (
      <List className={classes.root}>
        <StyledListItem button>
          <ListItemAvatar>
            <Avatar
              alt='Avatar'
              onError={(e) => { e.target.src = defaultImage }}
              src={user.getIn(['details', 'photoURL'])} />
          </ListItemAvatar>
          <StyledListItemText
            primary={user.getIn(['details', 'displayName'])}
            secondary={user.getIn(['details', 'email'])} />
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

    const SingleValue = ({ children, ...props }) => {
      const isOwner = props.data.owner === user.getIn(['details', 'uid'])
      return (
        <StyledSingleValue {...props}>
          {children}
          {!isOwner && <GroupIcon style={{ height: 20 }}  />}
        </StyledSingleValue>
      )
    }

    const Option = (props) => {
      const isOwner = props.data.owner === user.getIn(['details', 'uid'])
      return (
        <StyledOption {...props}>
          {props.data.label}
          {!isOwner && <GroupIcon style={{ height: 20 }}  />}
        </StyledOption>
      )
    }

    return (
      <div>
        <StyledAppBar>
          <Toolbar>
            <div className={classes.logo}>
              <ZettlIcon />
            </div>

            {authStatus.get('isAuthed') ? 
              <SelectWrapper>
                <StyledSelect
                  onChange={this.handleListChange}
                  onCreateOption={this.handleListCreate}
                  options={listsOverview}
                  value={currentList || lastList}
                  defaultValue={currentList || lastList}
                  placeholder="Tap for new list"
                  components={{
                    SingleValue,
                    Option,
                  }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 3,
                    colors: {
                      ...theme.colors,
                      primary25: Color.GRAY_050,
                      primary: Color.GRAY_100,
                    },
                  })}
                  styles={{
                    indicatorSeparator: () => ({display:'none'}),
                    control: (base, state) => ({
                      ...base,
                      border: state.isFocused ? 0 : 0,
                      boxShadow: state.isFocused ? 0 : 0,
                      backgroundColor: state.isFocused ? Color.GRAY_100 : Color.GRAY_100,
                    }),
                    option: base => ({
                      ...base,
                      height: 50,
                      lineHeight: 2,
                      color: Color.BLACK,
                    }),
                  }}
                />
              </SelectWrapper>
              : null}

            <MenuButtonWrapper>
              <IconButton
                className={classes.menuButton}
                aria-label='Menu'
                color='inherit'
                onClick={() => this.toggleDrawer(true)} >
                <MenuIcon />
              </IconButton>
            </MenuButtonWrapper>
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
  onSignOutUser: PropTypes.func.isRequired,
  onSaveCurrentList: PropTypes.func.isRequired,
  onAddList: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  authStatus: ImmutablePropTypes.map,
  user: ImmutablePropTypes.map,
  listsOverview: PropTypes.array,
}

MenuAppBar.defaultProps = {
  user: Map(),
  authStatus: Map(),
  listsOverview: [],
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  authStatus: makeSelectAuthStatus(),
  listsOverview: makeSelectListsOverview(),
})

export function mapDispatchToProps(dispatch) {
  return {
    onSignOutUser: () => dispatch(signOutUser()),
    onSaveCurrentList: data => dispatch(saveCurrentList(data)),
    onAddList: data => dispatch(addList(data)),
  }
}

const withUserReducer = injectReducer({key: 'user', reducer: userReducer})
const withUserSaga = injectSaga({key: 'user', saga: userSaga})
const withListReducer = injectReducer({key: 'lists', reducer: listReducer})
const withListSaga = injectSaga({key: 'lists', saga: listSaga})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default compose(
  withListReducer,
  withListSaga,
  withUserReducer,
  withUserSaga,
  withConnect,
  withStyles(styles),
)(MenuAppBar)