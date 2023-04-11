import { useTheme } from '@emotion/react'
import { type ReactNode } from 'react'

import { Text } from '../../atoms'

export type InfoCardProps = {
  className?: string
  headlineText: ReactNode
  text: ReactNode
  supportingText?: ReactNode
  minWidth?: string
}

const InfoCard = (props: InfoCardProps) => {
  const theme = useTheme()
  return (
    <article
      className={props.className}
      css={{ borderRadius: '0.8rem', padding: '1.6rem', background: theme.color.surface, minWidth: props?.minWidth }}
    >
      <Text.Body as="h4" css={{ fontSize: '1.2rem', margin: 0, marginBottom: '1.6rem' }}>
        {props.headlineText}
      </Text.Body>
      <Text.Body as="div" alpha="high" css={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>
        {props.text}
      </Text.Body>
      <Text.Body as="div" css={{ fontSize: '1.2rem' }}>
        {props.supportingText}
      </Text.Body>
    </article>
  )
}

export default InfoCard
