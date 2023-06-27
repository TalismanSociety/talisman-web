import { useTheme } from '@emotion/react'
import type React from 'react'

export type TextAlpha = 'disabled' | 'medium' | 'high'

type PolymorphicTextProps<T extends React.ElementType> = {
  as?: T
  alpha?: TextAlpha | ((props: { hover: boolean }) => TextAlpha)
}

export type TextProps<T extends React.ElementType> = PolymorphicTextProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PolymorphicTextProps<T>>

const useAlpha = (alpha: TextAlpha) => {
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
  return <Component {...props} />
}

const BaseText = <T extends React.ElementType = 'span'>({ as, alpha = 'medium', ...props }: TextProps<T>) => {
  const theme = useTheme()
  const Component = as ?? 'span'

  return (
    <div
      className={props['className']}
      css={{ display: 'contents !important', color: theme.color.onBackground, fontSize: 'revert !important' }}
    >
      <Component
        {...props}
        css={{
          'color': useAlpha(typeof alpha === 'function' ? alpha({ hover: false }) : alpha),
          'fontFamily': "'Surt', sans-serif",
          ':hover': {
            color: useAlpha(typeof alpha === 'function' ? alpha({ hover: true }) : alpha),
          },
        }}
      />
    </div>
  )
}

const BaseHeaderText = <T extends React.ElementType = 'h1'>({ as, alpha = 'high', ...props }: TextProps<T>) => {
  const theme = useTheme()
  const Component = as ?? 'span'

  return (
    <div
      className={props['className']}
      css={{ display: 'contents !important', color: theme.color.onBackground, fontSize: 'revert !important' }}
    >
      <Component
        {...props}
        css={{
          'color': useAlpha(typeof alpha === 'function' ? alpha({ hover: false }) : alpha),
          'fontFamily': "'SurtExpanded', sans-serif",
          ':hover': {
            color: useAlpha(typeof alpha === 'function' ? alpha({ hover: true }) : alpha),
          },
        }}
      />
    </div>
  )
}

// TODO: the default props handling & component decoration can be improved

const defaultProps = <T extends React.ElementType>(props: TextProps<T>) =>
  ({
    H1: { as: props.as ?? 'h1', css: { fontSize: 56 } },
    H2: { as: props.as ?? 'h2', css: { fontSize: 32 } },
    H3: { as: props.as ?? 'h3', css: { fontSize: 24 } },
    H4: { as: props.as ?? 'h2', css: { fontSize: 18 } },
    BodyLarge: { as: props.as ?? 'span', css: { fontSize: 16, fontWeight: 'normal', margin: 0 } },
    Body: { as: props.as ?? 'span', css: { fontSize: 14, fontWeight: 'normal', margin: 0 } },
    BodySmall: { as: props.as ?? 'span', css: { fontSize: 12, fontWeight: 'normal', margin: 0 } },
    Noop: { as: undefined, css: {} },
  } as const)

const decorateText = <T extends object>(tag: keyof ReturnType<typeof defaultProps>, element: T) =>
  Object.assign(element, {
    A: <T extends React.ElementType = 'a'>(props: TextProps<T>) => (
      <BaseText
        {...defaultProps(props)[tag]}
        as="a"
        alpha="high"
        {...props}
        css={[defaultProps(props)[tag].css, { textDecoration: 'underline' }]}
      />
    ),
    Redacted: <T extends React.ElementType = 'del'>(props: TextProps<T>) => (
      <BaseText
        {...defaultProps(props)[tag]}
        as="del"
        alpha="disabled"
        {...props}
        css={[
          defaultProps(props)[tag].css,
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
  H1: decorateText('H1', <T extends React.ElementType = 'h1'>(props: TextProps<T>) => (
    <BaseHeaderText {...props} {...defaultProps(props).H1} />
  )),
  H2: decorateText('H2', <T extends React.ElementType = 'h2'>(props: TextProps<T>) => (
    <BaseHeaderText {...props} {...defaultProps(props).H2} />
  )),
  H3: decorateText('H3', <T extends React.ElementType = 'h3'>(props: TextProps<T>) => (
    <BaseHeaderText {...props} {...defaultProps(props).H3} />
  )),
  H4: decorateText('H4', <T extends React.ElementType = 'h4'>(props: TextProps<T>) => (
    <BaseHeaderText {...props} {...defaultProps(props).H4} />
  )),
  BodyLarge: decorateText('BodyLarge', <T extends React.ElementType = 'span'>(props: TextProps<T>) => (
    <BaseText {...props} {...defaultProps(props).BodyLarge} />
  )),
  Body: decorateText('Body', <T extends React.ElementType = 'span'>(props: TextProps<T>) => (
    <BaseText {...props} {...defaultProps(props).Body} />
  )),
  BodySmall: decorateText('BodySmall', <T extends React.ElementType = 'span'>(props: TextProps<T>) => (
    <BaseText {...props} {...defaultProps(props).BodySmall} />
  )),
  Noop: decorateText('Noop', NoopText),
})

export default Text
