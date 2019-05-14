import styled from 'styled-components'
import * as Color from 'styles/colors'
import { maxWidth } from 'utils/device'

export const PRIMARY_FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif"
export const SECONDARY_FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif"

export const MEDIUM = '400'
export const SEMI_BOLD = '500'
export const BOLD = '600'

export const Headline = styled.h1`
  font-family: ${PRIMARY_FONT};
  font-weight: bold;
  line-height: 46px;
  font-size: 42px;
  color: ${Color.BLACK};
  white-space: pre-wrap;
  margin-top: 0;

  @media ${maxWidth.tablet} {
    font-size: 32px;
    line-height: 36px;
  }
`

export const Introduction = styled.p`
  font-family: ${PRIMARY_FONT};
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
  font-size: 20px;
  color: ${Color.GRAY_600};
  white-space: pre-wrap;
`

export const TextSmall = styled.p`
  font-family: ${SECONDARY_FONT};
  font-size: 12px;
  color: ${Color.BLACK};
  line-height: 19px;
  word-break: break-all;
  hyphens: auto;
`