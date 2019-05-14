import styled from 'styled-components'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import * as Color from 'styles/colors'
import * as Shadow from 'styles/shadows'
import * as Dimension from 'styles/dimensions'
import { TextSmall } from 'styles/typography'

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
  height: ${props => props.status ? '70px' : '60px'};
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding-bottom: ${props => props.status ? '26px' : '8px'};
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

export const Status = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0;
  padding: 0 16px 8px 19px;
`

export const StatusInfo = styled(TextSmall)`
  margin: 0;
  color: ${Color.RED_400};
`