import React from 'react'

import Firebase from 'containers/Firebase'

import { Headline, Introduction } from 'styles/typography'
import { Wrapper, StyledAuthButtons } from './Styles'

export class LoginPage extends React.PureComponent {
  render() {
    return (
      <Wrapper>
        <Headline>Login Page</Headline>
        <Introduction>Please sign in to use this app.</Introduction>
        <StyledAuthButtons
          uiConfig={Firebase.uiConfig}
          firebaseAuth={Firebase.auth()} />
      </Wrapper>
    )
  }
}

export default LoginPage