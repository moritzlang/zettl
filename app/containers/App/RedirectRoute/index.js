import React from 'react'
import PropTypes from 'prop-types'

import { Redirect, Route } from 'react-router-dom'


export class RedirectRoute extends React.PureComponent {
  render() {
    const { component: Component, condition, redirectPath, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={(props) => condition
          ? <Component {...props} />
          : <Redirect to={{pathname: redirectPath, state: {from: props.location}}} />}
      />
    )
  }
}

RedirectRoute.propTypes = {
  condition: PropTypes.bool.isRequired,
  redirectPath: PropTypes.string.isRequired,
  component: PropTypes.elementType.isRequired,
  location: PropTypes.object,
}

export default RedirectRoute