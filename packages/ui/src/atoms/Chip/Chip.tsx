import { useTheme } from '@emotion/react'
import { IconContext } from '@talismn/icons/utils'
import { type ButtonHTMLAttributes, type DetailedHTMLProps, type ReactNode, useMemo } from 'react'

import CircularProgressIndicator from '../CircularProgressIndicator'
import Text from '../Text'
import { useSurfaceColor } from '..'

export type ChipProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  size?: 'sm' | 'md' | 'lg'
  containerColor?: string
  contentColor?: string
  leadingContent?: ReactNode
  loading?: boolean
}

const Chip = ({ size = 'md', containerColor, contentColor, leadingContent, loading, ...props }: ChipProps) => {
  const theme = useTheme()

  containerColor = containerColor ?? theme.color.primary
  contentColor = contentColor ?? theme.color.onPrimary

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

  return (
    <Container
      as="button"
      color={contentColor}
      {...props}
      disabled={functionallyDisabled}
      css={[
        {
          lineHeight: '1em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25em',
          border: 'none',
          borderRadius: '2em',
          padding: '0.2em 0.8em',
          backgroundColor: containerColor,
        },
        props.onClick && {
          'cursor': 'pointer',
          'transition': 'ease',
          ':hover': { opacity: 0.8 },
        },
        loading && { cursor: 'progress' },
        props.disabled && {
          'opacity': theme.contentAlpha.disabled,
          'cursor': 'not-allowed',
          ':hover': { opacity: theme.contentAlpha.disabled },
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

export default Chip
