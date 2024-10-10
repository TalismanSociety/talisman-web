import { ChainProvider } from '../../../../domains/chains'
import { slpxSubstratePairsState } from '../../../../domains/staking/slpxSubstrate/recoils'
import StakeProvider from '../../../recipes/StakeProvider'
import Apr from '../slpx/Apr'
import { AvailableBalance, AvailableFiatBalance } from '../slpx/AvailableBalances'
import StakePercentage from './StakePercentage'
import UnlockDuration from './UnlockDuration'
import { useAtomValue } from 'jotai'
import { Link } from 'react-router-dom'

const SlpxSubstrateStakeProviders = () => {
  const slpxSubstratePairs = useAtomValue(slpxSubstratePairsState)
  const provider = 'Bifrost SLPx'
  return (
    <>
      {slpxSubstratePairs.map((slpxPair, index) => {
        const { nativeToken, substrateChainGenesisHash } = slpxPair
        const { symbol, logo } = nativeToken
        return (
          <ChainProvider
            key={index}
            chain={{
              genesisHash: substrateChainGenesisHash,
            }}
          >
            <StakeProvider
              symbol={symbol}
              logo={logo}
              chain={'Bifrost'}
              chainId={slpxPair.chainId}
              apr={<Apr slpxPair={slpxPair} />}
              type="Liquid staking"
              provider={provider}
              unbondingPeriod={<UnlockDuration slpxPair={slpxPair} />}
              availableBalance={<AvailableBalance slpxPair={slpxPair} isSubstrate />}
              availableFiatBalance={<AvailableFiatBalance slpxPair={slpxPair} isSubstrate />}
              stakePercentage={<StakePercentage slpxPair={slpxPair} />}
              stakeButton={
                <StakeProvider.StakeButton
                  as={Link}
                  to={`?action=stake&type=slpx-substrate&native-token=${slpxPair.nativeToken.symbol}`}
                />
              }
            />
          </ChainProvider>
        )
      })}
    </>
  )
}

export default SlpxSubstrateStakeProviders
