import { useTheme } from '@emotion/react'
import { IconContext } from '@talismn/icons'
import React, { useMemo } from 'react'
import { ElementType, PropsWithChildren, ReactNode } from 'react'

import Text from '../Text'

export type ChipProps = PropsWithChildren<{
  size?: 'sm' | 'md' | 'lg'
  containerColor?: string
  contentColor?: string
  leadingContent?: ReactNode
}>

const Chip = ({ size = 'md', containerColor, contentColor, leadingContent, ...props }: ChipProps) => {
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

  return (
    <Container
      as="button"
      color={contentColor}
      {...props}
      css={{
        'display': 'flex',
        'alignItems': 'center',
        'gap': '0.25em',
        'border': 'none',
        'borderRadius': '1em',
        'padding': '0.2rem 0.8rem',
        'backgroundColor': containerColor,
        'cursor': 'pointer',
        ':hover': { opacity: 0.9 },
      }}
    >
      <IconContext.Provider value={{ size: '1em' }}>{leadingContent}</IconContext.Provider>
      {props.children}
    </Container>
  )
}

export default Chip
