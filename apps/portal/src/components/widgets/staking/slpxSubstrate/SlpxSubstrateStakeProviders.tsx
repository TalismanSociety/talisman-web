import { ChainProvider } from '../../../../domains/chains'
import { slpxSubstratePairsState } from '../../../../domains/staking/slpxSubstrate/recoils'
import StakeProvider from '../../../recipes/StakeProvider'
import { useAtomValue } from 'jotai'

const SlpxSubstrateStakeProviders = () => {
  const slpxSubstratePairs = useAtomValue(slpxSubstratePairsState)
  const provider = 'Bifrost SLPx'
  return (
    <>
      {slpxSubstratePairs.map(({ nativeToken, substrateChainGenesisHash }, index) => {
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
              apr={'123%'}
              type="Liquid staking"
              provider={provider}
              unbondingPeriod={'123'}
              availableBalance={'123'}
              availableFiatBalance={'123'}
              stakePercentage={'123'}
              stakeButton={
                <StakeProvider.StakeButton
                  // as={Link}
                  // to={`?action=stake&type=slpx&contract-address=${slpxPair.splx}`}
                  to={`?action=stake&type=slpx&contract-address=${'123'}`}
                />
              }

              // unbondingPeriod={<UnlockDuration slpxPair={slpxPair} />}
              // availableBalance={<AvailableBalance slpxPair={slpxPair} />}
              // availableFiatBalance={<AvailableFiatBalance slpxPair={slpxPair} />}
              // stakePercentage={<StakePercentage slpxPair={slpxPair} />}
              // stakeButton={
              //   <StakeProvider.StakeButton
              //     as={Link}
              //     to={`?action=stake&type=slpx&contract-address=${slpxPair.splx}`}
              //   />
              // }
            />
          </ChainProvider>
        )
      })}
    </>
  )
}

export default SlpxSubstrateStakeProviders
