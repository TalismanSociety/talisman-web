import { css, useTheme, type Theme } from '@emotion/react'
import type React from 'react'
import { type ContentAlpha } from '../..'

type PolymorphicTextProps<T extends React.ElementType> = {
  as?: T
  alpha?: ContentAlpha | ((props: { hover: boolean }) => ContentAlpha)
}

export type TextProps<T extends React.ElementType> = PolymorphicTextProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicTextProps<T>>

const useAlpha = (alpha: ContentAlpha) => {
  const theme = useTheme()

  const alphaValue = theme.contentAlpha[alpha ?? 'medium']

  return `color-mix(in srgb, currentcolor, transparent ${Math.round((1 - alphaValue) * 100)}%) !important`
}

const NoopText = <T extends React.ElementType = 'span'>({
  as,
  color: _color,
  alpha: _alpha,
  ...props
}: TextProps<T>) => {
  const Component = as ?? 'span'
  return <Component {...props} css={{ color: 'inherit' }} />
}

const BaseText = <T extends React.ElementType = 'span'>({ as, alpha = 'medium', ...props }: TextProps<T>) => {
  const theme = useTheme()
  const Component = as ?? 'span'

  return (
    <div
      className={props['className']}
      style={props['style']}
      css={[
        {
          display: 'contents !important',
          color: theme.color.onBackground,
          fontSize: 'revert !important',
        },
        css`
          ::before {
            content: none !important;
          }
          ::after {
            content: none !important;
          }
          ::first-letter {
            content: none !important;
          }
          ::first-line {
            content: none !important;
          }
        `,
      ]}
    >
      <Component
        {...props}
        css={{
          color: useAlpha(typeof alpha === 'function' ? alpha({ hover: false }) : alpha),
          fontFamily: "'Surt', sans-serif",
          ':hover': {
            color: useAlpha(typeof alpha === 'function' ? alpha({ hover: true }) : alpha),
          },
        }}
      />
    </div>
  )
}

const decorateText = <T extends object>(typographyClass: keyof Theme['typography'] | 'noop' | undefined, element: T) =>
  Object.assign(element, {
    A: <T extends React.ElementType = 'a'>(props: TextProps<T>) => (
      <BaseText
        as="a"
        alpha="high"
        {...props}
        css={theme => [
          typographyClass === undefined
            ? {}
            : typographyClass === 'noop'
            ? { color: 'inherit', ':hover': { color: 'inherit' } }
            : theme.typography[typographyClass],
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
          typographyClass === undefined || typographyClass === 'noop' ? {} : theme.typography[typographyClass],
          {
            color: 'transparent',
            borderRadius: theme.shape.extraSmall,
            background: 'radial-gradient(rgba(200, 200, 200, 0.1), rgba(0, 0, 0, 0.1))',
            filter: 'contrast(0.5) brightness(1.5)',
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
  Noop: decorateText('noop', NoopText),
})

export default Text
