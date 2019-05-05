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

import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'

import MenuAppBar from 'components/MenuAppBar'

import HomePage from 'containers/HomePage/Loadable'
import LoginPage from 'containers/LoginPage/Loadable'
import NotFoundPage from 'containers/NotFoundPage/Loadable'
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
      isAuthed: false,
    }
  }

  render() {
    const { isAuthed } = this.state

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

export default App