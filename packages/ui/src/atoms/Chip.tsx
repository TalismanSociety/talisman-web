import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'
import { useTheme } from '@emotion/react'
import { IconContext } from '@talismn/web-icons/utils'
import { useMemo } from 'react'

import { type ContentAlpha } from '../theme'
import { CircularProgressIndicator } from './CircularProgressIndicator'
import { useSurfaceColor } from './Surface'
import { Text } from './Text'

export type ChipProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  size?: 'sm' | 'md' | 'lg'
  containerColor?: string
  contentColor?: string
  contentAlpha?: ContentAlpha
  leadingContent?: ReactNode
  loading?: boolean
}

export const Chip = ({ size = 'md', containerColor, contentColor, leadingContent, loading, ...props }: ChipProps) => {
  const theme = useTheme()

  containerColor = containerColor ?? theme.color.primaryContainer
  contentColor = contentColor ?? theme.color.onPrimaryContainer

  const Container = useMemo(() => {
    switch (size) {
      case 'sm':
        return Text.BodySmall
      case 'md':
        return Text.Body
      case 'lg':
        return Text.BodyLarge
    }
  }, [size])

  const functionallyDisabled = Boolean(props.disabled) || Boolean(loading)

  const hasLeadingContent = Boolean(loading) || Boolean(leadingContent)

  return (
    <Container
      as="button"
      alpha={props.contentAlpha}
      {...props}
      disabled={functionallyDisabled}
      css={[
        {
          color: contentColor,
          lineHeight: '1em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25em',
          border: 'none',
          borderRadius: theme.shape.full,
          padding: '0.2em 0.8em',
          background: containerColor,
        },
        props.onClick && {
          cursor: 'pointer',
          transition: 'ease',
          ':hover': { opacity: 0.8 },
        },
        loading && { cursor: 'progress' },
        props.disabled && {
          opacity: theme.contentAlpha.disabled,
          cursor: 'not-allowed',
          ':hover': { opacity: theme.contentAlpha.disabled },
        },
        hasLeadingContent && {
          paddingLeft: '0.7em',
        },
      ]}
    >
      <IconContext.Provider value={{ size: '1em' }}>
        {loading ? <CircularProgressIndicator /> : leadingContent}
      </IconContext.Provider>
      {props.children}
    </Container>
  )
}

export const TonalChip = (props: ChipProps) => {
  const theme = useTheme()
  const contentColor = props.contentColor ?? theme.color.primary
  return (
    <Chip
      containerColor={`color-mix(in srgb, ${contentColor}, transparent 88%)`}
      contentColor={contentColor}
      {...props}
    />
  )
}

export const SurfaceChip = (props: ChipProps) => {
  const theme = useTheme()
  return <Chip containerColor={useSurfaceColor()} contentColor={theme.color.onSurface} {...props} />
}
