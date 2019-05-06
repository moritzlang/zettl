import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import injectSaga from 'utils/injectSaga'
import injectReducer from 'utils/injectReducer'
import { createStructuredSelector } from 'reselect'
import { Switch, Route } from 'react-router-dom'

import Firebase from 'components/Firebase'

import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'

import MenuAppBar from 'components/MenuAppBar'

import HomePage from 'containers/HomePage/Loadable'
import LoginPage from 'containers/LoginPage/Loadable'
import NotFoundPage from 'containers/NotFoundPage/Loadable'
import { signInUser } from 'components/User/actions'
import watchUserAuth from 'components/User/sagas'
import userAuthReducer from 'components/User/reducers'
import { makeSelectSuccessfulAuth } from 'components/User/selectors'
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
    }
  }

  componentWillMount() {
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
    // TODO: unsubscribe the observer
    // this.unregisterAuthObserver()
  }

  render() {
    const { isAuthenticating } = this.state
    const { isAuthed } = this.props

    if(isAuthenticating) return null

    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme}>
          <MenuAppBar />
          <Wrapper>
            <Switch>
              <RedirectRoute condition={isAuthed} redirectPath='/login' exact path='/' component={HomePage} />
              <RedirectRoute condition={!isAuthed} redirectPath='/' path='/login' component={LoginPage} />
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
  isAuthed: PropTypes.bool,
  onSignInUser: PropTypes.func.isRequired,
}

App.defaultProps = {
  isAuthed: false,
}

const mapStateToProps = createStructuredSelector({
  isAuthed: makeSelectSuccessfulAuth(),
})

export function mapDispatchToProps(dispatch) {
  return {
    onSignInUser: data => dispatch(signInUser(data)),
  }
}

const withReducer = injectReducer({key: 'user', reducer: userAuthReducer})
const withSaga = injectSaga({key: 'user', saga: watchUserAuth})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)

export default compose(
  withReducer,
  withSaga,
  withConnect
)(App)