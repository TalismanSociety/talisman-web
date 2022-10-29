import Button from '@components/atoms/Button'
import Text from '@components/atoms/Text'
import HiddenDetails from '@components/molecules/HiddenDetails'
import PoolStake, { PoolStakeList } from '@components/recipes/PoolStake/PoolStake'
import { chainIdState } from '@domains/chains/recoils'
import { useCountDownToNomsPool } from '@domains/nominationPools/hooks'
import { Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import Stakings from './Stakings'
import Unstakings from './Unstakings'

const OwnPools = () => {
  const currentChainId = useRecoilValue(chainIdState)

  // TODO: remove
  const nomsPoolCountdown = useCountDownToNomsPool()

  if (
    currentChainId === 'polkadot' &&
    nomsPoolCountdown !== undefined &&
    nomsPoolCountdown.blocksRemaining !== undefined
  ) {
    return (
      <div>
        <header>
          <Text.H4 css={{ marginBottom: '2.4rem' }}>Staking</Text.H4>
        </header>
        <HiddenDetails
          overlay={
            <div
              css={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '3.2rem',
              }}
            >
              <Text.Body>This door will open soon...</Text.Body>
              <Button as={Link} variant="outlined" to="/staking">
                Sneak peek
              </Button>
            </div>
          }
          hidden
        >
          <PoolStakeList>
            <PoolStake.Skeleton animate={false} />
            <PoolStake.Skeleton animate={false} />
            <PoolStake.Skeleton animate={false} />
          </PoolStakeList>
        </HiddenDetails>
      </div>
    )
  }

  return (
    <div id="staking">
      <Suspense
        fallback={
          <div>
            <header>
              <Text.H4 css={{ marginBottom: '2.4rem' }}>Staking</Text.H4>
            </header>
            <PoolStakeList>
              <PoolStake.Skeleton />
              <PoolStake.Skeleton />
              <PoolStake.Skeleton />
            </PoolStakeList>
          </div>
        }
      >
        <Stakings />
        <Unstakings />
      </Suspense>
    </div>
  )
}

export default OwnPools
