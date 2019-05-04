import React from 'react'
import PropTypes from 'prop-types'

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Grow from '@material-ui/core/Grow'

import * as Color from 'styles/colors'
import { CheckboxIcon, CheckboxCheckedIcon, CloseIcon } from 'images/icons'
import { StyledList, StyledListItem, ListItemWrapper, StyledListItemText } from './Styles'

export class Articles extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      checked: this.getCheckedArticles(),
    }
  }

  getCheckedArticles = () => (
    this.props.articles.reduce((checked, a) => {
      if(a.checked)
        checked.push(a.id)
      return checked
    }, [])
  )

  handleToggle = value => () => {
    const { checked } = this.state
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    this.setState({
      checked: newChecked,
    })
  }

  render() {
    const { checked } = this.state
    const { articles } = this.props

    return (
      <Grow
        in
        style={{ transformOrigin: '50% 0 0' }}
        timeout={500}>
        <StyledList>
          {articles.map(a => (
            <ListItemWrapper key={a.id}>
              <StyledListItem role={undefined} dense button onClick={this.handleToggle(a.id)}>
                <Checkbox
                  checked={checked.indexOf(a.id) !== -1}
                  tabIndex={-1}
                  icon={<CheckboxIcon />}
                  checkedIcon={<CheckboxCheckedIcon colors={{ primary: Color.GREEN_300 }} />}
                  disableRipple />
                <StyledListItemText primary={a.value} />
                <ListItemSecondaryAction>
                  <Tooltip title='Delete' placement='left'>
                    <IconButton
                      aria-label='Delete'>
                      <CloseIcon colors={{ primary: Color.GRAY_200 }} />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </StyledListItem>
            </ListItemWrapper>
          ))}
        </StyledList>
      </Grow>
    )
  }
}

Articles.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
  })).isRequired,
}

Articles.defaultProps = {
}

export default Articles