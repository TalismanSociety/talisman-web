import { selectedBalancesState } from '../../../../domains/balances'
import { ChainProvider } from '../../../../domains/chains'
import { slpxPairsState, type SlpxPair } from '../../../../domains/staking/slpx'
import StakeProvider from '../../../recipes/StakeProvider'
import AnimatedFiatNumber from '../../AnimatedFiatNumber'
import ErrorBoundary from '../../ErrorBoundary'
import ErrorBoundaryFallback from '../ErrorBoundaryFallback'
import Apr from './Apr'
import { AvailableBalance, useAvailableBalance } from './AvailableBalances'
import UnlockDuration from './UnlockDuration'
import { useSuspenseQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { useConfig } from 'wagmi'
import { getTokenQueryOptions } from 'wagmi/query'

const AvailableFiatBalance = (props: { slpxPair: SlpxPair }) => (
  <AnimatedFiatNumber end={useAvailableBalance(props.slpxPair).fiatAmount} />
)

export const StakePercentage = (props: { slpxPair: SlpxPair }) => {
  const balances = useRecoilValue(selectedBalancesState)

  const config = useConfig()
  const liquidToken = useSuspenseQuery(
    getTokenQueryOptions(config, {
      chainId: props.slpxPair.chain.id,
      address: props.slpxPair.vToken.address,
    })
  )

  const nativeBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === props.slpxPair.nativeToken.symbol.toLowerCase()),
    [balances, props.slpxPair.nativeToken.symbol]
  )
  const liquidBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === liquidToken.data?.symbol?.toLowerCase()),
    [balances, liquidToken.data?.symbol]
  )

  return (
    <StakeProvider.StakePercentage
      percentage={useMemo(
        () =>
          liquidBalance.sum.planck.total === 0n
            ? 0
            : new BigNumber(liquidBalance.sum.planck.total.toString())
                .div((nativeBalance.sum.planck.total + liquidBalance.sum.planck.total).toString())
                .toNumber(),
        [liquidBalance.sum.planck.total, nativeBalance.sum.planck.total]
      )}
    />
  )
}

const StakeProviders = () => {
  const slpxPairs = useRecoilValue(slpxPairsState)

  return (
    <>
      {slpxPairs.map((slpxPair, index) => {
        const { symbol, logo } = slpxPair.nativeToken
        const provider = 'Bifrost SLPx'
        return (
          <ChainProvider
            key={index}
            chain={{
              genesisHash: slpxPair.substrateChainGenesisHash,
            }}
          >
            <ErrorBoundary
              orientation="horizontal"
              renderFallback={() => <ErrorBoundaryFallback logo={logo} symbol={symbol} provider={provider} />}
            >
              <StakeProvider
                symbol={symbol}
                logo={logo}
                chain={slpxPair.chain.name}
                chainId={slpxPair.chain.id}
                apr={<Apr slpxPair={slpxPair} />}
                type="Liquid staking"
                provider={provider}
                unbondingPeriod={<UnlockDuration slpxPair={slpxPair} />}
                availableBalance={<AvailableBalance slpxPair={slpxPair} />}
                availableFiatBalance={<AvailableFiatBalance slpxPair={slpxPair} />}
                stakePercentage={<StakePercentage slpxPair={slpxPair} />}
                stakeButton={
                  <StakeProvider.StakeButton
                    as={Link}
                    to={`?action=stake&type=slpx&contract-address=${slpxPair.splx}`}
                  />
                }
              />
            </ErrorBoundary>
          </ChainProvider>
        )
      })}
    </>
  )
}

export default StakeProviders
