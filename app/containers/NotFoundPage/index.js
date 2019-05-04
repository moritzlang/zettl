/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */

import React from 'react'

import { Wrapper, Text } from './Styles'

export default function NotFound() {
  return (
    <Wrapper>
      <Text>
        Sorry, page not found 🐿.
      </Text>
    </Wrapper>
  )
}
