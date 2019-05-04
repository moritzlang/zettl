/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react'
import { Switch, Route } from 'react-router-dom'

// import firebase from 'firebase'
// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'

import MenuAppBar from 'components/MenuAppBar'

import HomePage from 'containers/HomePage/Loadable'
import LoginPage from 'containers/LoginPage/Loadable'
import NotFoundPage from 'containers/NotFoundPage/Loadable'
import PrivateRoute from './PrivateRoute'
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

export default function App() {
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <MuiThemeProvider theme={theme}>
        <MenuAppBar />
        <Wrapper>
          <Switch>
            <PrivateRoute exact path='/' component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Wrapper>
        <GlobalStyle />
      </MuiThemeProvider>
    </JssProvider>
  )
}
