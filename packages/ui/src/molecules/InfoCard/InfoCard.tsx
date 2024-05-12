import { Text, useSurfaceColor } from '../../atoms'
import { useTheme } from '@emotion/react'
import { type ReactNode } from 'react'

export type InfoCardProps = {
  className?: string
  overlineContent: ReactNode
  headlineContent: ReactNode
  supportingContent?: ReactNode
}

const InfoCard = (props: InfoCardProps) => {
  const theme = useTheme()
  return (
    <article
      className={props.className}
      css={{ borderRadius: theme.shape.small, padding: '1.6rem', background: useSurfaceColor() }}
    >
      <Text.Body as="h4" css={{ fontSize: '1.2rem', margin: 0, marginBottom: '1.6rem' }}>
        {props.overlineContent}
      </Text.Body>
      <Text.Body as="div" alpha="high" css={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>
        {props.headlineContent}
      </Text.Body>
      <Text.Body as="div" css={{ fontSize: '1.2rem' }}>
        {props.supportingContent}
      </Text.Body>
    </article>
  )
}

export default InfoCard
