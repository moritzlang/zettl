/* eslint-disable react/prop-types */
import React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'

import * as Color from 'styles/colors'

export const ZettlIcon = props => {
  const color = props.colors && props.colors.primary ? props.colors.primary : 'black'
  return (
    <SvgIcon {...props}>
      <rect stroke={color} strokeWidth="2" fill="transparent" x="0" y="0" width="23" height="23"></rect>
      <path stroke={color} strokeWidth="2" d="M4.5,5.5 L18.5,5.5" strokeLinecap="square"></path>
      <path stroke={color} strokeWidth="2" d="M4.5,17.5 L12,17.5" strokeLinecap="square"></path>
      <path stroke={color} strokeWidth="2" d="M16,17.5 L18.5,17.5" strokeLinecap="square"></path>
      <path stroke={color} strokeWidth="2" d="M7,13.5 L12,13.5" strokeLinecap="square"></path>
      <path stroke={color} strokeWidth="2" d="M9,9.5 L15,9.5" strokeLinecap="square"></path>
    </SvgIcon>
  )
}

export const MenuIcon = props => (
  <SvgIcon {...props}>
    <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
  </SvgIcon>
)

export const InstallIcon = props => {
  const colorPrimary = props.colors && props.colors.primary ? props.colors.primary : Color.ICON_PRIMARY
  const colorSecondary = props.colors && props.colors.secondary ? props.colors.secondary : Color.ICON_SECONDARY
  return (
    <SvgIcon {...props}>
      <path style={{fill: colorPrimary}} d="M15 15v-3a3 3 0 0 0-6 0v3H6a4 4 0 0 1-.99-7.88 5.5 5.5 0 0 1 10.86-.82A4.49 4.49 0 0 1 22 10.5a4.5 4.5 0 0 1-4.5 4.5H15z"/>
      <path style={{fill: colorSecondary}} d="M11 18.59V12a1 1 0 0 1 2 0v6.59l1.3-1.3a1 1 0 0 1 1.4 1.42l-3 3a1 1 0 0 1-1.4 0l-3-3a1 1 0 0 1 1.4-1.42l1.3 1.3z"/>
    </SvgIcon>
  )
}

export const NotificationIcon = props => {
  const colorPrimary = props.colors && props.colors.primary ? props.colors.primary : Color.ICON_PRIMARY
  const colorSecondary = props.colors && props.colors.secondary ? props.colors.secondary : Color.ICON_SECONDARY
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="19" r="3" style={{fill: colorSecondary}}/>
      <path style={{fill: colorPrimary}} d="M10.02 4.28L10 4a2 2 0 1 1 3.98.28A7 7 0 0 1 19 11v5a1 1 0 0 0 1 1 1 1 0 0 1 0 2H4a1 1 0 0 1 0-2 1 1 0 0 0 1-1v-5a7 7 0 0 1 5.02-6.72z"/>
    </SvgIcon>
  )
}

export const LogoutIcon = props => {
  const colorPrimary = props.colors && props.colors.primary ? props.colors.primary : Color.ICON_PRIMARY
  const colorSecondary = props.colors && props.colors.secondary ? props.colors.secondary : Color.ICON_SECONDARY

  return (
    <SvgIcon {...props}>
      <path style={{fill: colorPrimary}} d="M11 4h3a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0V6h-2v12h2v-2a1 1 0 0 1 2 0v3a1 1 0 0 1-1 1h-3v1a1 1 0 0 1-1.27.96l-6.98-2A1 1 0 0 1 2 19V5a1 1 0 0 1 .75-.97l6.98-2A1 1 0 0 1 11 3v1z"/>
      <path style={{fill: colorSecondary}} d="M18.59 11l-1.3-1.3c-.94-.94.47-2.35 1.42-1.4l3 3a1 1 0 0 1 0 1.4l-3 3c-.95.95-2.36-.46-1.42-1.4l1.3-1.3H14a1 1 0 0 1 0-2h4.59z"/>
    </SvgIcon>
  )
}

export const CheckboxCheckedIcon = props => {
  const colorPrimary = props.colors && props.colors.primary ? props.colors.primary : Color.TEAL_PRIMARY
  return(
    <SvgIcon {...props}>
      <defs>
        <path d="M9.15745446,13.8875405 L15.7962225,7.24877246 C16.2168315,6.89347692 16.8400665,6.92187598 17.22662,7.31395163 C17.6131734,7.70602729 17.6327298,8.32960235 17.2715043,8.7451297 L9.89509536,16.1215386 C9.48534268,16.5231766 8.82956625,16.5231766 8.41981357,16.1215386 L5.25849547,12.9602205 C4.89726988,12.5446932 4.91682631,11.9211181 5.30337978,11.5290424 C5.68993324,11.1369668 6.31316819,11.1085677 6.73377725,11.4638633 L9.15745446,13.8875405 Z" id="path-checkboxchecked"></path>
        <filter x="-27.9%" y="-26.5%" width="155.9%" height="174.3%" filterUnits="objectBoundingBox" id="filter-checkboxchecked">
          <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
          <feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
          <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.299337636 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        </filter>
      </defs>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g>
          <rect id="Check-Background" fill={colorPrimary} x="0" y="0" width="23" height="23" rx="11.5"></rect>
          <g fillRule="nonzero">
            <use fill="black" fillOpacity="1" filter="url(#filter-checkboxchecked)" href="#path-checkboxchecked"></use>
            <use fill="#FFFFFF" fillRule="evenodd" href="#path-checkboxchecked"></use>
          </g>
        </g>
      </g>
    </SvgIcon>
  )
}

export const CheckboxIcon = props => (
  <SvgIcon {...props}>
    <defs>
      <rect id="path-checkbox" x="0" y="0" width="23" height="23" rx="11.5"></rect>
    </defs>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g>
        <use fill="#FFFFFF" fillRule="evenodd" href="#path-checkbox"></use>
        <rect stroke="#B5C9DC" strokeWidth="2.5" x="1.25" y="1.25" width="20.5" height="20.5" rx="10.25"></rect>
      </g>
    </g>
  </SvgIcon>
)

export const CloseIcon = props => {
  const color = props.colors && props.colors.primary ? props.colors.primary : Color.ICON_SECONDARY
  
  return (
    <SvgIcon {...props}>
      <path fill={color} fillRule="evenodd" d="M15.78 14.36a1 1 0 0 1-1.42 1.42l-2.82-2.83-2.83 2.83a1 1 0 1 1-1.42-1.42l2.83-2.82L7.3 8.7a1 1 0 0 1 1.42-1.42l2.83 2.83 2.82-2.83a1 1 0 0 1 1.42 1.42l-2.83 2.83 2.83 2.82z"/>
    </SvgIcon>
  )
}

export const GroupIcon = props => {
  const colorPrimary = props.colors && props.colors.primary ? props.colors.primary : Color.ICON_PRIMARY
  const colorSecondary = props.colors && props.colors.secondary ? props.colors.secondary : Color.ICON_SECONDARY
  
  return (
    <SvgIcon {...props}>
      <path fill={colorPrimary} d="M12 13a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v3a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1 1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3zM7 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm10 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
      <path fill={colorSecondary} d="M12 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm-3 1h6a3 3 0 0 1 3 3v3a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-3a3 3 0 0 1 3-3z"/>
    </SvgIcon>
  )
}

export const LinkIcon = props => {
  const colorPrimary = props.colors && props.colors.primary ? props.colors.primary : Color.ICON_PRIMARY
  const colorSecondary = props.colors && props.colors.secondary ? props.colors.secondary : Color.ICON_SECONDARY
  
  return (
    <SvgIcon {...props}>
      <path fill={colorSecondary} d="M19.48 13.03l-.02-.03a1 1 0 1 1 1.75-.98A6 6 0 0 1 16 21h-4a6 6 0 1 1 0-12h1a1 1 0 0 1 0 2h-1a4 4 0 1 0 0 8h4a4 4 0 0 0 3.48-5.97z"/>
      <path fill={colorPrimary} d="M4.52 10.97l.02.03a1 1 0 1 1-1.75.98A6 6 0 0 1 8 3h4a6 6 0 1 1 0 12h-1a1 1 0 0 1 0-2h1a4 4 0 1 0 0-8H8a4 4 0 0 0-3.48 5.97z"/>
    </SvgIcon>
  )
}

export const ImportantIcon = props => {
  const colorPrimary = props.colors && props.colors.primary ? props.colors.primary : Color.ICON_PRIMARY
  const colorSecondary = props.colors && props.colors.secondary ? props.colors.secondary : Color.ICON_SECONDARY
  
  return (
    <SvgIcon {...props}>
      <path fill={colorPrimary} d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z"/>
      <path fill={colorSecondary} d="M12 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm1-5.9c-.13 1.2-1.88 1.2-2 0l-.5-5a1 1 0 0 1 1-1.1h1a1 1 0 0 1 1 1.1l-.5 5z"/>
    </SvgIcon>
  )
}

export const CopyIcon = props => {
  const colorPrimary = props.colors && props.colors.primary ? props.colors.primary : Color.ICON_PRIMARY
  const colorSecondary = props.colors && props.colors.secondary ? props.colors.secondary : Color.ICON_SECONDARY
  
  return (
    <SvgIcon {...props}>
      <rect fill={colorSecondary} width="14" height="14" x="3" y="3" rx="2"/>
      <rect fill={colorPrimary}  width="14" height="14" x="7" y="7" rx="2"/>
    </SvgIcon>
  )
}