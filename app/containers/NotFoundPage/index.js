import React from 'react'

import { Wrapper, Text } from './Styles'


export class NotFoundPage extends React.PureComponent {
  
  getRandomAnimalEmoji = () => {
    const animals = ['🐿', '🐢', '🐶', '🐱', ' 🦆', '🦄']
    return animals[Math.floor(Math.random() * animals.length)]
  }

  render() {
    return (
      <Wrapper>
        <Text>
          Sorry, page not found {this.getRandomAnimalEmoji()}.
        </Text>
      </Wrapper>
    )
  }
}

export default NotFoundPage