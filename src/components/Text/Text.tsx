import { jsx } from '@emotion/react'
import React from 'react'

type PolymorphicTextProps<T extends React.ElementType> = { as?: T }
type TextProps<T extends React.ElementType> = PolymorphicTextProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicTextProps<T>>

const BaseText = <T extends React.ElementType = 'span'>(props: TextProps<T>) =>
  jsx(props.as ?? 'span', { ...props, css: { fontFamily: 'Surt' } })

const Text = Object.assign(BaseText, {
  H1: <T extends React.ElementType = 'h1'>(props: TextProps<T>) =>
    jsx(props.as ?? 'h1', { ...props, css: { fontFamily: 'SurtExpanded', fontSize: 56 } }),
  H2: <T extends React.ElementType = 'h2'>(props: TextProps<T>) =>
    jsx(props.as ?? 'h2', { ...props, css: { fontFamily: 'SurtExpanded', fontSize: 32 } }),
  H3: <T extends React.ElementType = 'h3'>(props: TextProps<T>) =>
    jsx(props.as ?? 'h3', { ...props, css: { fontFamily: 'SurtExpanded', fontSize: 24 } }),
  H4: <T extends React.ElementType = 'h4'>(props: TextProps<T>) =>
    jsx(props.as ?? 'h4', { ...props, css: { fontFamily: 'SurtExpanded', fontSize: 18 } }),
  Body: <T extends React.ElementType = 'span'>(props: TextProps<T>) =>
    jsx(props.as ?? 'span', { ...props, css: { fontFamily: 'SurtExpanded', fontSize: 16 } }),
})

export default Text
