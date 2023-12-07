import { useTheme, type Theme } from '@emotion/react'
import type React from 'react'

export type TextAlpha = 'disabled' | 'medium' | 'high'

type PolymorphicTextProps<T extends React.ElementType> = {
  as?: T
  color?: string | ((theme: Theme) => string)
  alpha?: TextAlpha | ((props: { hover: boolean }) => TextAlpha)
}

export type TextProps<T extends React.ElementType> = PolymorphicTextProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicTextProps<T>>

const useAlpha = (color: string | ((theme: Theme) => string), alpha: TextAlpha) => {
  const theme = useTheme()

  const parsedColor = typeof color === 'string' ? color : color(theme)
  const alphaValue = theme.contentAlpha[alpha ?? 'medium']

  return `color-mix(in srgb, ${parsedColor}, transparent ${Math.round((1 - alphaValue) * 100)}%)`
}

const NoopText = <T extends React.ElementType = 'span'>({
  as,
  color: _color,
  alpha: _alpha,
  ...props
}: TextProps<T>) => {
  const Component = as ?? 'span'
  return <Component {...props} />
}

const BaseText = <T extends React.ElementType = 'span'>({
  as,
  color: _color,
  alpha = 'medium',
  ...props
}: TextProps<T>) => {
  const theme = useTheme()
  const Component = as ?? 'span'
  const color = _color ?? theme.color.onBackground

  return (
    <Component
      {...props}
      css={{
        'color': useAlpha(color, typeof alpha === 'function' ? alpha({ hover: false }) : alpha),
        'fontFamily': "'Surt', sans-serif",
        ':hover': {
          color: useAlpha(color, typeof alpha === 'function' ? alpha({ hover: true }) : alpha),
        },
      }}
    />
  )
}

const decorateText = <T extends object>(typographyClass: keyof Theme['typography'] | undefined, element: T) =>
  Object.assign(element, {
    A: <T extends React.ElementType = 'a'>(props: TextProps<T>) => (
      <BaseText
        as="a"
        alpha="high"
        {...props}
        css={theme => [
          typographyClass === undefined ? {} : theme.typography[typographyClass],
          { textDecoration: 'underline' },
        ]}
      />
    ),
    Redacted: <T extends React.ElementType = 'del'>(props: TextProps<T>) => (
      <BaseText
        as="del"
        alpha="disabled"
        {...props}
        css={theme => [
          typographyClass === undefined ? {} : theme.typography[typographyClass],
          {
            'color': 'transparent',
            'borderRadius': '0.5em',
            'background': 'radial-gradient(rgba(200, 200, 200, 0.1), rgba(0, 0, 0, 0.1))',
            'filter': 'contrast(0.5) brightness(1.5)',
            ':hover': {
              color: 'transparent',
            },
          },
        ]}
      />
    ),
  })

const Text = Object.assign(BaseText, {
  H1: decorateText('h1', <T extends React.ElementType = 'h1'>(props: TextProps<T>) => (
    <BaseText as="h1" alpha="high" {...props} css={useTheme().typography.h1} />
  )),
  H2: decorateText('h2', <T extends React.ElementType = 'h2'>(props: TextProps<T>) => (
    <BaseText as="h2" alpha="high" {...props} css={useTheme().typography.h2} />
  )),
  H3: decorateText('h3', <T extends React.ElementType = 'h3'>(props: TextProps<T>) => (
    <BaseText as="h3" alpha="high" {...props} css={useTheme().typography.h3} />
  )),
  H4: decorateText('h4', <T extends React.ElementType = 'h4'>(props: TextProps<T>) => (
    <BaseText as="h4" alpha="high" {...props} css={useTheme().typography.h4} />
  )),
  BodyLarge: decorateText('bodyLarge', <T extends React.ElementType = 'span'>(props: TextProps<T>) => (
    <BaseText {...props} css={useTheme().typography.bodyLarge} />
  )),
  Body: decorateText('body', <T extends React.ElementType = 'span'>(props: TextProps<T>) => (
    <BaseText {...props} css={useTheme().typography.body} />
  )),
  BodySmall: decorateText('bodySmall', <T extends React.ElementType = 'span'>(props: TextProps<T>) => (
    <BaseText {...props} css={useTheme().typography.bodySmall} />
  )),
  Noop: decorateText(undefined, NoopText),
})

export default Text
