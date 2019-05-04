/* eslint-disable react/prop-types */
import React from 'react'
import { Redirect, Route } from 'react-router-dom'


const PrivateRoute = ({ component: Component, ...rest }) => {

  // TODO: Do authentication
  // const isAuthenticated = AuthService.isLoggedIn()
  const isAuthenticated = false

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}

export default PrivateRoute