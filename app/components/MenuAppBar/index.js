import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import injectSaga from 'utils/injectSaga'
import injectReducer from 'utils/injectReducer'
import { createStructuredSelector } from 'reselect'


import Firebase from 'containers/Firebase'
import { DEBUG, URL } from 'utils/config'

import { makeSelectUser, makeSelectAuthStatus } from 'services/User/selectors'
import { signOutUser, saveCurrentList, changeNotificationStatus } from 'services/User/actions'
import userSaga from 'services/User/sagas'

import { makeSelectListsOverview } from 'services/List/selectors'
import { addList } from 'services/List/actions'
import listSaga from 'services/List/sagas'
import listReducer from 'services/List/reducers'

import uuid from 'uuid/v4'
import copy from 'copy-to-clipboard'
import { components } from 'react-select'

import { withStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import {
  ZettlIcon,
  MenuIcon,
  InstallIcon,
  NotificationIcon,
  LogoutIcon,
  GroupIcon,
  LinkIcon,
} from 'images/icons'
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
      showNotificationSwitch: !!Firebase.messaging,
      notificationsBlocked: ('Notification' in window) ? (Notification.permission === 'denied') : false,
      openSnackbar: false,
    }
  }

  handleInstall = () => {
    this.props.installApp()
  }

  componentDidMount() {
    this.initCurrentList()

    // Only works if app is focused
    // TODO: Display toast or badge in UI
    if(Firebase.messaging) {
      Firebase.messaging.onMessage(payload => {
        if(DEBUG) {
          console.log('onMessage: ', payload)
        }
      })
    }
  }

  initCurrentList = () => {
    const { user, listsOverview } = this.props

    // User has no current list set
    // Try to set a current list
    if(!user.get('currentList')) {
      const listId = listsOverview.length ? listsOverview[listsOverview.length - 1].value : null
      // Set current list of user
      if(listId) {
        this.props.onSaveCurrentList({ value: listId })
      }
    }
  }

  toggleDrawer = (open) => {
    this.setState({ drawerOpen: open })
  }

  subscribeUser = () => {
    this.props.onChangeNotificationStatus({ value: true })

    if(Firebase.messaging) {
      Firebase.messaging
        .requestPermission()
        .then(async () => {
          const token = await Firebase.messaging.getToken()
          // Subscribe to all lists
          const lists = this.props.listsOverview.map(list => list.value)
          Firebase.subscribeUserToLists(token, lists)
            .catch(err => {
              this.props.onChangeNotificationStatus({ value: false })
              if(DEBUG) {
                console.log('Unable to subscribe to lists', err)
              }
            })

          Firebase.subscribeUserToLists(token, [this.props.user.getIn(['details', 'uid'])])
            .catch(err => {
              if(DEBUG) {
                console.log('Unable to subscribe to personal topic', err)
              }
            })
        })
        .catch(err => {
          this.props.onChangeNotificationStatus({ value: false })
          if(DEBUG) {
            console.log('Unable to get permission for notifications', err)
          }
        })
    }
  }

  unsubscribeUser = () => {
    this.props.onChangeNotificationStatus({ value: false })

    if(Firebase.messaging) {
      Firebase.messaging
        .requestPermission()
        .then(async () => {
          const token = await Firebase.messaging.getToken()

          // Unsubscribe from all lists
          const lists = this.props.listsOverview.map(list => list.value)
          Firebase.unsubscribeUserFromLists(token, lists)
            .catch(err => {
              this.props.onChangeNotificationStatus({ value: true })
              if(DEBUG) {
                console.log('Unable to unsubscribe from lists', err)
              }
            })    
        })
        .catch(err => {
          this.props.onChangeNotificationStatus({ value: true })

          if(DEBUG) {
            console.log('Unable to get permission for notifications', err)
          }
        })
    }
  }

  toggleNotifications = () => {
    if(this.props.user.get('notificationStatus')) {
      this.unsubscribeUser()
    } else {
      this.subscribeUser()
    }
  }

  handleListChange = (newValue) => {
    this.props.onSaveCurrentList({ value: newValue.value })
  }

  handleListCreate = (inputValue) => {
    const { user } = this.props
    const userId = user.getIn(['details', 'uid'])
    const list = {
      id: uuid(),
      title: inputValue,
      owner: userId,
    }

    this.props.onAddList({ userId, list })
    // Set newly created list to current list
    this.props.onSaveCurrentList({ value: list.id })

    if(user.get('notificationStatus')) {
    // User enabled notifications
    // Subscribe to notifications of new list
      if(Firebase.messaging) {
        Firebase.messaging
          .requestPermission()
          .then(async () => {
            const token = await Firebase.messaging.getToken()

            Firebase.subscribeUserToLists(token, [list.id])
              .catch(err => {
                if(DEBUG) {
                  console.log('Unable to subscribe to list', err)
                }
              })    
          })
          .catch(err => {
            if(DEBUG) {
              console.log('Unable to get permission for notifications', err)
            }
          })
      }
    }
  }

  share = (key) => {
    const firstName = this.props.user.getIn(['details', 'displayName']).split(' ')[0]
    if(navigator.share) {
      navigator.share({
        title: 'zettl',
        text: `${firstName} wants to share a list with you`,
        url: `${URL}/join/${key}`,
      })
        .then(() => {
          if(DEBUG) {
            console.log('Successfuly shared data')
          }
        })
        .catch(err => console.error('Error sharing', err))
    }
  }

  copyLink = (key) => {    
    if(copy(`${URL}/join/${key}`)) {
      this.setState({ openSnackbar: true })
    }
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({ openSnackbar: false })
  }

  render() {
    const {
      classes,
      authStatus,
      user,
      listsOverview,
      showInstall,
    } = this.props

    const {
      showNotificationSwitch,
      notificationsBlocked,
    } = this.state

    const currentList = listsOverview.find(list => list.value === user.get('currentList'))
    const lastList = listsOverview.length ? listsOverview[listsOverview.length - 1] : null
    const actualList = currentList || lastList

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

        {showNotificationSwitch &&
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
              checked={user.get('notificationStatus')}
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
        </StyledListItem>}

        {(actualList && navigator.share) &&
        <StyledListItem
          button
          onClick={() => this.share(actualList.value)} >
          <ListItemIcon>
            <LinkIcon />
          </ListItemIcon>
          <ListItemText primary='Share this list' />
        </StyledListItem>}

        {(actualList && !navigator.share) &&
        <StyledListItem
          button
          onClick={() => this.copyLink(actualList.value)} >
          <ListItemIcon>
            <LinkIcon />
          </ListItemIcon>
          <ListItemText primary='Copy invite link' />
        </StyledListItem>}
      
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.openSnackbar}
          onClose={this.handleSnackbarClose}
          autoHideDuration={3000}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Copied invite Link</span>}/>

        {showInstall &&
        <StyledListItem
          button
          onClick={() => this.handleInstall()} >
          <ListItemIcon>
            <InstallIcon />
          </ListItemIcon>
          <ListItemText primary='Install' />
        </StyledListItem>}

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
      const isCreateOption = props.data && (props.data.label.indexOf('Create "') === 0)
      return (
        <StyledOption {...props}>
          {props.data.label}
          {(!isOwner && !isCreateOption) ? <GroupIcon style={{ height: 20 }} /> : null}
        </StyledOption>
      )
    }

    const NoOptionsMessage = (props) => {
      if (props.options.length) return null
      return <components.NoOptionsMessage {...props}>You have no lists</components.NoOptionsMessage>
    }

    return (
      <div>
        <StyledAppBar>
          <Toolbar>
            <div className={classes.logo}>
              <Link to='/'>
                <ZettlIcon />
              </Link>
            </div>

            {authStatus.get('isAuthed') && (window.location.pathname === '/') ? 
              <SelectWrapper>
                <StyledSelect
                  onChange={this.handleListChange}
                  onCreateOption={this.handleListCreate}
                  options={listsOverview}
                  value={actualList}
                  defaultValue={actualList}
                  placeholder='Tap for new list'
                  components={{
                    SingleValue,
                    Option,
                    NoOptionsMessage,
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
            {authStatus.get('isAuthed') && (window.location.pathname === '/') ? loggedInList : loggedOutList}
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
  onChangeNotificationStatus: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  authStatus: ImmutablePropTypes.map,
  user: ImmutablePropTypes.map,
  listsOverview: PropTypes.array,
  installApp: PropTypes.func.isRequired,
  showInstall: PropTypes.bool,
}

MenuAppBar.defaultProps = {
  user: Map(),
  authStatus: Map(),
  listsOverview: [],
  showInstall: false,
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
    onChangeNotificationStatus: data => dispatch(changeNotificationStatus(data)),
  }
}

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
  withUserSaga,
  withConnect,
  withStyles(styles),
)(MenuAppBar)