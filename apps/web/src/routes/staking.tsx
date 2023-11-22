import AccountConnectionGuard from '@components/widgets/AccountConnectionGuard'
import StakeProviders from '@components/widgets/staking/StakeProviders'
import Stakes from '@components/widgets/staking/Stakes'
import { Layers, Zap } from '@talismn/icons'
import { SegmentedButton, Surface, Text } from '@talismn/ui'
import { useState } from 'react'

const Staking = () => {
  const sections = ['stakeable-assets', 'positions'] as const
  const [selectedSection, setSelectedSection] = useState<(typeof sections)[number]>('stakeable-assets')
  return (
    <AccountConnectionGuard>
      <div>
        <header>
          <Text.H2>Staking</Text.H2>
        </header>
        <Surface css={{ borderRadius: '1.6rem', padding: '1.6rem' }}>
          <SegmentedButton value={selectedSection} onChange={setSelectedSection} css={{ marginBottom: '2.4rem' }}>
            <SegmentedButton.ButtonSegment value="stakeable-assets" leadingIcon={<Zap />}>
              Stake
            </SegmentedButton.ButtonSegment>
            <SegmentedButton.ButtonSegment value="positions" leadingIcon={<Layers />}>
              My positions
            </SegmentedButton.ButtonSegment>
          </SegmentedButton>
          {selectedSection === 'positions' ? <Stakes hideHeader /> : <StakeProviders />}
        </Surface>
      </div>
    </AccountConnectionGuard>
  )
}

export default Staking
