import React from 'react'
import PropTypes from 'prop-types'
import { Map } from 'immutable'
import { compose } from 'redux'
import { connect } from 'react-redux'
import injectSaga from 'utils/injectSaga'
import { createStructuredSelector } from 'reselect'
import { Switch, Route } from 'react-router-dom'

import Firebase from 'containers/Firebase'

import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'

import MenuAppBar from 'components/MenuAppBar'

import HomePage from 'containers/HomePage/Loadable'
import LoginPage from 'containers/LoginPage/Loadable'
import JoinPage from 'containers/JoinPage/Loadable'
import NotFoundPage from 'containers/NotFoundPage/Loadable'
import { signInUser } from 'services/User/actions'
import userSaga from 'services/User/sagas'
import { makeSelectAuthStatus } from 'services/User/selectors'
import RedirectRoute from './RedirectRoute'

import theme from './theme'
import { Wrapper } from './Styles'
import GlobalStyle from '../../global-styles'

// This is for overriding material-ui styles with styled-components
const generateClassName = createGenerateClassName()
const jss = create({
  ...jssPreset(),
  // Define a custom insertion for injecting the JSS styles in the DOM
  insertionPoint: document.getElementById('jss-insertion-point'),
})


export class App extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticating: true,
      deferredPrompt: null,
    }
  }

  componentDidMount() {
    window.addEventListener('beforeinstallprompt', this.deferPrompt)

    Firebase.authUser()
      .then(user => {
        this.props.onSignInUser(user)
        this.setState({ isAuthenticating: false })
      })
      .catch(() => {
        this.setState({ isAuthenticating: false })
      })
  }

  componentWillUnmount() {
    window.removeEventListener('beforeinstallprompt', this.deferPrompt)

    // TODO: Unsubscribe the observer
    // this.unregisterAuthObserver()
  }

  // Cancel add-to-homescreen prompt and store it
  deferPrompt = e => {
    e.preventDefault()
    this.setState({ deferredPrompt: e })
  }

  installApp = () => {
    const { deferredPrompt } = this.state
    if(deferredPrompt !== null) {
      // Show the prompt
      deferredPrompt.prompt()

      // Follow what the user has done with the prompt
      // eslint-disable-next-line no-unused-vars
      deferredPrompt.userChoice.then(choiceResult => {
        // Remove prompt
        this.setState({ deferredPrompt: null })
      })
    }
  }

  render() {
    const { isAuthenticating, deferredPrompt } = this.state
    const { authStatus } = this.props

    if(isAuthenticating || authStatus.get('authLoading')) return null

    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme}>
          <MenuAppBar installApp={this.installApp} showInstall={!!deferredPrompt} />
          <Wrapper>
            <Switch>
              <RedirectRoute condition={authStatus.get('isAuthed')} redirectPath='/login' exact path='/' component={HomePage} />
              <RedirectRoute condition={!authStatus.get('isAuthed')} redirectPath='/' path='/login' component={LoginPage} />
              <RedirectRoute condition={authStatus.get('isAuthed')} redirectPath='/login' path='/join/:key' component={JoinPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Wrapper>
          <GlobalStyle />
        </MuiThemeProvider>
      </JssProvider>
    )
  }
}

App.propTypes = {
  authStatus: PropTypes.instanceOf(Map),
  onSignInUser: PropTypes.func.isRequired,
}

App.defaultProps = {
  authStatus: Map(),
}

const mapStateToProps = createStructuredSelector({
  authStatus: makeSelectAuthStatus(),
})

export function mapDispatchToProps(dispatch) {
  return {
    onSignInUser: data => dispatch(signInUser(data)),
  }
}

const withSaga = injectSaga({key: 'user', saga: userSaga})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default compose(
  withSaga,
  withConnect
)(App)