import React from 'react'
import PropTypes from 'prop-types'
import { Input, Wrapper } from './Styles'

export class MainInput extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
    } 
  }

  handleOnChange = (e) => {
    this.setState({ value: e.target.value })
  }

  handleKeyPress = (e) => {
    const { value } = this.state
    if(e.key === 'Enter' && value) {
      this.props.onSubmit(value)
    }
  }

  render() {
    return (
      <Wrapper>
        <Input 
          type='text'
          {...this.props}
          value={this.state.value}
          onChange={this.handleOnChange}
          onKeyPress={this.handleKeyPress}
        />
      </Wrapper>
    )
  }
}

MainInput.propTypes = {
  onSubmit: PropTypes.func,
}

MainInput.defaultProps = {
}

export default MainInput