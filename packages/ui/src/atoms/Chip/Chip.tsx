import { useTheme } from '@emotion/react'
import { IconContext } from '@talismn/icons'
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode, useMemo } from 'react'

import CircularProgressIndicator from '../CircularProgressIndicator'
import Text from '../Text'

export type ChipProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  size?: 'sm' | 'md' | 'lg'
  containerColor?: string
  contentColor?: string
  leadingContent?: ReactNode
  loading?: boolean
}

const Chip = ({ size = 'md', containerColor, contentColor, leadingContent, loading, ...props }: ChipProps) => {
  const theme = useTheme()

  containerColor = containerColor ?? theme.color.foregroundVariant
  contentColor = contentColor ?? theme.color.onForegroundVariant

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

  const functionallyDisabled = props.disabled || loading

  return (
    <Container
      as="button"
      color={contentColor}
      {...props}
      disabled={functionallyDisabled}
      css={[
        {
          'display': 'flex',
          'alignItems': 'center',
          'gap': '0.25em',
          'border': 'none',
          'borderRadius': '1em',
          'padding': '0.2rem 0.8rem',
          'backgroundColor': containerColor,
          'cursor': 'pointer',
          ':hover': { opacity: 0.9 },
        },
        loading && { cursor: 'progress' },
      ]}
    >
      <IconContext.Provider value={{ size: '1em' }}>
        {loading ? <CircularProgressIndicator /> : leadingContent}
      </IconContext.Provider>
      {props.children}
    </Container>
  )
}

export default Chip
