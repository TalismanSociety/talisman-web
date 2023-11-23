import AccountConnectionGuard from '@components/widgets/AccountConnectionGuard'
import StakeProviders from '@components/widgets/staking/StakeProviders'
import Stakes from '@components/widgets/staking/Stakes'
import { Layers, Zap } from '@talismn/icons'
import { CircularProgressIndicator, SegmentedButton, Surface, Text } from '@talismn/ui'
import { Suspense, useState } from 'react'
import { HeaderWidgetPortal, TitlePortal } from './layout'
import { useTotalStaked } from '@domains/staking'
import { useRecoilValue } from 'recoil'
import { selectedCurrencyState } from '@domains/balances'

const TotalStaked = () => (
  <>
    {useTotalStaked().toLocaleString(undefined, { style: 'currency', currency: useRecoilValue(selectedCurrencyState) })}
  </>
)

const Staking = () => {
  const sections = ['stakeable-assets', 'positions'] as const
  const [selectedSection, setSelectedSection] = useState<(typeof sections)[number]>('stakeable-assets')
  return (
    <AccountConnectionGuard>
      <TitlePortal>Staking</TitlePortal>
      <HeaderWidgetPortal>
        <div css={{ marginTop: '1.25em' }}>
          <Text.BodyLarge as="div">Staking balance</Text.BodyLarge>
          <Text.H3 as="div" css={{ marginTop: '0.125em' }}>
            <Suspense fallback={<CircularProgressIndicator size="1em" />}>
              <TotalStaked />
            </Suspense>
          </Text.H3>
        </div>
      </HeaderWidgetPortal>
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
    </AccountConnectionGuard>
  )
}

export default Staking
