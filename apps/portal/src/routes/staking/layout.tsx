import { Surface } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { SegmentedButton } from '@talismn/ui/molecules/SegmentedButton'
import { Layers, Zap } from '@talismn/web-icons'
import { useMemo } from 'react'
import { Link, Outlet, useMatch } from 'react-router-dom'

import { HeaderWidgetPortal, TitlePortal } from '@/components/molecules/PageHeader'
import { AccountConnectionGuard } from '@/components/widgets/AccountConnectionGuard'
import { AnimatedFiatNumber } from '@/components/widgets/AnimatedFiatNumber'
import { useTotalStaked } from '@/domains/staking/hooks'

const TotalStaked = () => <AnimatedFiatNumber end={useTotalStaked()} />

const Layout = () => {
  const positionsMatch = useMatch('/staking/positions')
  const providersMatch = useMatch('/staking/providers')

  const currentPath = useMemo(
    () => (positionsMatch?.pathname ?? providersMatch?.pathname)?.split('/').at(-1),
    [positionsMatch?.pathname, providersMatch?.pathname]
  )

  return (
    <AccountConnectionGuard>
      <TitlePortal>Staking</TitlePortal>
      <HeaderWidgetPortal>
        <div css={{ marginTop: '1.25em' }}>
          <Text.BodyLarge as="div">Staking balance</Text.BodyLarge>
          <Text.H3 as="div" css={{ marginTop: '0.125em' }}>
            <TotalStaked />
          </Text.H3>
        </div>
      </HeaderWidgetPortal>
      <Surface css={{ borderRadius: '1.6rem', padding: '1.6rem' }}>
        <SegmentedButton value={currentPath} css={{ marginBottom: '2.4rem' }}>
          <Link to="providers">
            <SegmentedButton.ButtonSegment value="providers" leadingIcon={<Zap />}>
              Stake
            </SegmentedButton.ButtonSegment>
          </Link>
          <Link to="positions">
            <SegmentedButton.ButtonSegment value="positions" leadingIcon={<Layers />}>
              Positions
            </SegmentedButton.ButtonSegment>
          </Link>
        </SegmentedButton>
        <Outlet />
      </Surface>
    </AccountConnectionGuard>
  )
}

export default Layout
