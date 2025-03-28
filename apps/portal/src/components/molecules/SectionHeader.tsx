import { Text } from '@talismn/ui/atoms/Text'
import { type ReactNode } from 'react'

export type SectionHeaderProps = {
  className?: string
  headlineContent: ReactNode
  supportingContent?: ReactNode
  supportingContentIcon?: ReactNode
}

export const SectionHeader = (props: SectionHeaderProps) => (
  <header
    className={props.className}
    css={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1.6rem',
      marginBottom: '2.4rem',
    }}
  >
    <Text.H3 css={{ margin: 0 }}>{props.headlineContent}</Text.H3>
    <Text.BodyLarge css={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '2.4rem' }}>
      {props.supportingContent}
      <span>{props.supportingContentIcon}</span>
    </Text.BodyLarge>
  </header>
)
