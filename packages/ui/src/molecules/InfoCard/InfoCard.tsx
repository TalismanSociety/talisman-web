import { type ReactNode } from 'react'

import { Text, useSurfaceColor } from '../../atoms'

export type InfoCardProps = {
  className?: string
  overlineContent: ReactNode
  headlineContent: ReactNode
  supportingContent?: ReactNode
}

const InfoCard = (props: InfoCardProps) => (
  <article
    className={props.className}
    css={{ borderRadius: '0.8rem', padding: '1.6rem', background: useSurfaceColor() }}
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

export default InfoCard
