import styled from 'styled-components'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import * as Color from 'styles/colors'
import * as Shadow from 'styles/shadows'
import * as Dimension from 'styles/dimensions'


export const StyledList = styled(List)`
  width: 100%;
  max-width: 360px;
  padding: 0;
`

export const ListItemWrapper = styled.div`
  border-radius: ${Dimension.RADIUS};
  background-color: ${Color.WHITE};
  box-shadow: ${Shadow.BOX_SHADOW_DEFAULT};
`

export const StyledListItem = styled(ListItem)`
  width: 100%;
  height: 60px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
`

export const StyledListItemText = styled(ListItemText)`
  && {
      > span {
      color: ${Color.GRAY_800};
      font-size: 16px;
      line-height: normal;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
`