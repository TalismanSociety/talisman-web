import { Text } from '@talismn/ui'
import type { ReactNode } from 'react'

export type StakeDashboardProps = {
  banner: ReactNode
  chainSelector: ReactNode
  chainCount?: number
  accountSelector: ReactNode
  accountCount?: number
  details: ReactNode
}

const StakeDashboard = (props: StakeDashboardProps) => (
  <div css={{ containerType: 'inline-size' }}>
    <main
      css={{
        'display': 'grid',
        'gap': '3.2rem',
        'gridTemplateAreas': `
          'banner'
          'selector'
          'details'
        `,
        '@container (min-width: 76.8rem)': {
          gridTemplateAreas: `
          'banner   banner  banner'
          'selector details details'
          'selector details details'
        `,
          gridTemplateColumns: '1fr 2fr 2fr',
        },
      }}
    >
      <div css={{ gridArea: 'banner' }}>{props.banner}</div>
      <div css={{ gridArea: 'selector', display: 'flex', flexDirection: 'column', gap: '3.2rem' }}>
        <section>
          <header css={{ display: 'flex', flexDirection: 'column-reverse', gap: '0.8rem' }}>
            <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.4rem' }}>
              <Text.H3>Assets</Text.H3>
              <Text.BodyLarge>{props.chainCount && `(${props.chainCount})`}</Text.BodyLarge>
            </div>
            <Text.BodySmall>1. Select asset to stake</Text.BodySmall>
          </header>
          {props.chainSelector}
        </section>
        <section>
          <header css={{ display: 'flex', flexDirection: 'column-reverse', gap: '0.8rem' }}>
            <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.4rem' }}>
              <Text.H3>Accounts</Text.H3>
              <Text.BodyLarge>{props.accountCount && `(${props.accountCount})`}</Text.BodyLarge>
            </div>
            <Text.BodySmall>2. Select account</Text.BodySmall>
          </header>
          {props.accountSelector}
        </section>
      </div>
      <div css={{ gridArea: 'details' }}>{props.details}</div>
    </main>
  </div>
)

export default StakeDashboard
