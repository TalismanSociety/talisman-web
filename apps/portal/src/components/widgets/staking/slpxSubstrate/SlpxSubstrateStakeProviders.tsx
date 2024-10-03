import { ChainProvider } from '../../../../domains/chains'
import { slpxSubstratePairsState } from '../../../../domains/staking/slpxSubstrate/recoils'
import StakeProvider from '../../../recipes/StakeProvider'
import Apr from '../slpx/Apr'
import { AvailableBalance, AvailableFiatBalance } from '../slpx/AvailableBalances'
import StakePercentage from './StakePercentage'
// import UnlockDuration from '../slpx/UnlockDuration'
import { useAtomValue } from 'jotai'

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
              apr={<Apr slpxPair={slpxPair} />}
              type="Liquid staking"
              provider={provider}
              unbondingPeriod={'123'}
              // unbondingPeriod={<UnlockDuration slpxPair={slpxPair} />}
              availableBalance={<AvailableBalance slpxPair={slpxPair} />}
              availableFiatBalance={<AvailableFiatBalance slpxPair={slpxPair} />}
              stakePercentage={<StakePercentage slpxPair={slpxPair} />}
              stakeButton={
                <StakeProvider.StakeButton
                  // as={Link}
                  // to={`?action=stake&type=slpx&contract-address=${slpxPair.splx}`}
                  to={`?action=stake&type=slpx&contract-address=${'123'}`}
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
