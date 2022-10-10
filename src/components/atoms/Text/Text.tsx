import React from 'react'

type PolymorphicTextProps<T extends React.ElementType> = { as?: T }
type TextProps<T extends React.ElementType> = PolymorphicTextProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicTextProps<T>>

const BaseText = <T extends React.ElementType = 'span'>(props: TextProps<T>) => {
  const Component = props.as ?? 'span'

  return (
    <Component
      {...props}
      css={theme => ({
        fontFamily: 'Surt',
        opacity: theme.contentAlpha.medium,
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
        fontFamily: 'SurtExpanded',
        opacity: theme.contentAlpha.high,
      })}
    />
  )
}

const Text = Object.assign(BaseText, {
  H1: <T extends React.ElementType = 'h1'>(props: TextProps<T>) => (
    <BaseHeaderText {...props} as="h1" css={{ fontsize: 56 }} />
  ),
  H2: <T extends React.ElementType = 'h2'>(props: TextProps<T>) => (
    <BaseHeaderText {...props} as="h2" css={{ fontsize: 32 }} />
  ),
  H3: <T extends React.ElementType = 'h3'>(props: TextProps<T>) => (
    <BaseHeaderText {...props} as="h3" css={{ fontsize: 24 }} />
  ),
  H4: <T extends React.ElementType = 'h4'>(props: TextProps<T>) => (
    <BaseHeaderText {...props} as="h4" css={{ fontsize: 18 }} />
  ),
  Body: <T extends React.ElementType = 'span'>(props: TextProps<T>) => (
    <BaseText {...props} as="span" css={{ fontsize: 16 }} />
  ),
})

export default Text
