import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { createStructuredSelector } from 'reselect'

import { makeSelectUser } from 'services/User/selectors'

import Firebase from 'containers/Firebase'

import Button from '@material-ui/core/Button'

import * as Color from 'styles/colors'
import * as Dimension from 'styles/dimensions'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Headline, Introduction } from 'styles/typography'
import { Wrapper } from './Styles'

export class JoinPage extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      message: null,
      isLoading: true,
    }
  }

  componentDidMount () {
    const { user } = this.props
    const { key } = this.props.match.params
    const userId = user.getIn(['details', 'uid'])

    this.setState({ isLoading: true })


    Firebase.joinList(userId, key)
      .then(res => {
        // User enabled notifications
        if(user.get('notificationStatus')) {
          // Subscribe to notifications of joined list
          if(Firebase.messaging) {
            return Firebase.messaging
              .requestPermission()
              .then(async () => {
                const token = await Firebase.messaging.getToken()
                return Firebase.subscribeUserToLists(token, [key])
                  .then(() => {
                    this.setState({ message: res })
                    this.setState({ isLoading: false })            
                  })
              })
              .catch(() => {
                throw new Error('Unable to get permission for notifications')
              })
          }
        }

        this.setState({ message: res })
        this.setState({ isLoading: false })
        return null
      })
      .catch(err => {
        this.setState({ message: err.message })
        this.setState({ isLoading: false })
      })
  }

  render() {
    const { message, isLoading } = this.state

    const result = (
      <div>
        {message && <Introduction>{message}.</Introduction>}
        <Link
          to='/'
          style={{ textDecoration: 'none'}}>
          <Button
            style={{
              borderRadius: Dimension.RADIUS_NUMBER,
              backgroundColor: Color.TEAL_PRIMARY,
              color: Color.WHITE,
            }}
            variant='contained'>
            See your lists
          </Button>
        </Link>
      </div>
    )

    return (
      <Wrapper>
        <Headline>Join</Headline>
        {!isLoading ? result
          : <CircularProgress style={{ color: Color.TEAL_PRIMARY }} />}
      </Wrapper>
    )
  }
}

JoinPage.propTypes = {
  user: ImmutablePropTypes.map,
  match: PropTypes.shape({
    params: PropTypes.shape({
      key: PropTypes.string,
    }),
  }),
}

JoinPage.defaultProps = {
  user: Map(),
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
})

const withConnect = connect(
  mapStateToProps
)

export default compose(
  withConnect
)(JoinPage)