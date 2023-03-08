import { useTheme } from '@emotion/react'
import Color from 'colorjs.io'
import React, { ElementType, useMemo } from 'react'

type PolymorphicTextProps<T extends React.ElementType> = {
  as?: T
  color?: string
  alpha?: 'disabled' | 'medium' | 'high'
}
export type TextProps<T extends React.ElementType> = PolymorphicTextProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicTextProps<T>>

const decorateText = <T extends Object>(element: T) =>
  Object.assign(element, {
    A: <T extends React.ElementType = 'a'>(props: TextProps<T>) => (
      <BaseText as="a" alpha="high" {...props} css={{ textDecoration: 'underline' }} />
    ),
  })

const BaseText = <T extends React.ElementType = 'span'>({ as, color, alpha = 'medium', ...props }: TextProps<T>) => {
  const theme = useTheme()
  const Component = as ?? 'span'

  const transformedColor = useMemo(() => {
    const textColor = new Color(color ?? theme.color.onBackground)
    textColor.alpha = theme.contentAlpha[alpha ?? 'medium']

    return textColor.display().toString()
  }, [color, alpha, theme.color.onBackground])

  return (
    <Component
      {...props}
      css={{
        color: transformedColor,
        fontFamily: 'Surt',
      }}
    />
  )
}

const BaseHeaderText = <T extends React.ElementType = 'h1'>({ as, color, alpha, ...props }: TextProps<T>) => {
  const theme = useTheme()
  const Component = as ?? 'span'

  const transformedColor = useMemo(() => {
    const textColor = new Color(color ?? theme.color.onBackground)
    textColor.alpha = theme.contentAlpha[alpha ?? 'medium']

    return textColor.display().toString()
  }, [color, alpha, theme.color.onBackground])

  return (
    <Component
      {...props}
      css={{
        color: transformedColor,
        fontFamily: 'SurtExpanded',
      }}
    />
  )
}

const Text = Object.assign(BaseText, {
  H1: <T extends React.ElementType = 'h1'>(props: TextProps<T>) => (
    <BaseHeaderText {...props} as={props.as ?? 'h1'} css={{ fontSize: 56 }} />
  ),
  H2: <T extends React.ElementType = 'h2'>(props: TextProps<T>) => (
    <BaseHeaderText {...props} as={props.as ?? 'h2'} css={{ fontSize: 32 }} />
  ),
  H3: <T extends React.ElementType = 'h3'>(props: TextProps<T>) => (
    <BaseHeaderText {...props} as={props.as ?? 'h3'} css={{ fontSize: 24 }} />
  ),
  H4: <T extends React.ElementType = 'h4'>(props: TextProps<T>) => (
    <BaseHeaderText {...props} as={props.as ?? 'h4'} css={{ fontSize: 18 }} />
  ),
  BodyLarge: decorateText(<T extends React.ElementType = 'span'>(props: TextProps<T>) => (
    <BaseText {...props} as={props.as ?? 'span'} css={{ fontSize: 16 }} />
  )),
  Body: decorateText(<T extends React.ElementType = 'span'>(props: TextProps<T>) => (
    <BaseText {...props} as={props.as ?? 'span'} css={{ fontSize: 14 }} />
  )),
  BodySmall: decorateText(<T extends React.ElementType = 'span'>(props: TextProps<T>) => (
    <BaseText {...props} as={props.as ?? 'span'} css={{ fontSize: 12 }} />
  )),
})

export default Text
