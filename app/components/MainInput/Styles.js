import styled from 'styled-components'

import * as Dimension from 'styles/dimensions'


export const Wrapper = styled.div`
  position: relative;
  text-align: left;
  margin-bottom: 1em;
  width: 100%;

  &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    background-color: black;
    width: 100%;
    height: 3px;
    animation: expand .3s ease-in-out;
  }

  @keyframes expand {
    0% {
      width: 0%;
    }

    100% {
      width: 100%;
    }
  }
`

export const Input = styled.input`
  width: 100%;
  padding: 1em;
  font-size: 18px;
  border-top-left-radius: ${Dimension.RADIUS};
  border-top-right-radius: ${Dimension.RADIUS};
  border: none;
  transition: background-color .15s ease-in-out;

  &:focus {
    outline: none;
    background-color: #E9E9E9;
  }
`