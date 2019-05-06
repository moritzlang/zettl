import React from 'react'

import MainInput from 'components/MainInput'
import Articles from 'components/Articles'

import { Wrapper } from './Styles'

export class HomePage extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      articles: [
        {
          id: 1,
          value: 'Gemüse',
          checked: true,
        },
        {
          id: 2,
          value: 'Obst',
          checked: false,
        },
        {
          id: 3,
          value: 'Brot',
          checked: true,
        },
        {
          id: 4,
          value: 'Unbekannter Artikel mit einem sehr langen Namen das kann kritisch werden',
          checked: false,
        }, 
      ],
    }
  }

  handleSubmit = (value) => {
    // TODO: Get id for article from backend
    const newArticle = {
      id: 5,
      value,
      checked: false,
    }

    this.setState(prevState => ({
      articles: [newArticle, ...prevState.articles],
    }))
  }

  send = () => {
    const { inputValue } = this.state

    if(inputValue) {
      // Save new article to DB

      this.setState({
        inputValue: '',
      })
    }
  }

  render() {
    const { articles } = this.state

    return (
      <Wrapper>
        <MainInput
          name='add-article'
          placeholder='Add article'
          autoComplete='off'
          onSubmit={this.handleSubmit}
        />
        <Articles articles={articles} />
      </Wrapper>
    )
  }
}

export default HomePage