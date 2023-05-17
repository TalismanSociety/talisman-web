import { Text } from '@talismn/ui'
import { type ReactNode } from 'react'

export type SectionHeaderProps = {
  className?: string
  headlineText: ReactNode
  supportingText?: ReactNode
}

const SectionHeader = (props: SectionHeaderProps) => (
  <header
    className={props.className}
    css={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: '1.6rem',
      marginBottom: '2.4rem',
    }}
  >
    <Text.H3 css={{ margin: 0 }}>{props.headlineText}</Text.H3>
    <Text.BodyLarge css={{ fontSize: '2.4rem' }}>{props.supportingText}</Text.BodyLarge>
  </header>
)

export default SectionHeader
