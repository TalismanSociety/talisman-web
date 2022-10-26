import React from 'react'

type PolymorphicTextProps<T extends React.ElementType> = { as?: T; alpha?: 'disabled' | 'medium' | 'high' }
export type TextProps<T extends React.ElementType> = PolymorphicTextProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicTextProps<T>>

const BaseText = <T extends React.ElementType = 'span'>(props: TextProps<T>) => {
  const Component = props.as ?? 'span'

  return (
    <Component
      {...props}
      css={theme => ({
        color: `rgba(255,255,255,${theme.contentAlpha[props.alpha ?? 'medium']})`,
        fontFamily: 'Surt',
      })}
    />
  )
}

const BaseHeaderText = <T extends React.ElementType = 'h1'>(props: TextProps<T>) => {
  const Component = props.as ?? 'h1'

  return (
    <Component
      {...props}
      css={theme => ({
        color: `rgba(255,255,255,${theme.contentAlpha[props.alpha ?? 'high']})`,
        fontFamily: 'SurtExpanded',
      })}
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
  Body: <T extends React.ElementType = 'span'>(props: TextProps<T>) => (
    <BaseText {...props} as={props.as ?? 'span'} css={{ fontSize: 14 }} />
  ),
})

export default Text
