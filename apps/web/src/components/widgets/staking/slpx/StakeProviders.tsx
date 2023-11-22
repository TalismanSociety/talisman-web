import StakeProvider from '@components/recipes/StakeProvider'
import { selectedBalancesState } from '@domains/balances'
import { glmrSlpxPair, type SlpxPair } from '@domains/staking/slpx'
import { githubChainLogoUrl } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { CircularProgressIndicator } from '@talismn/ui'
import BigNumber from 'bignumber.js'
import { Suspense, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { useToken } from 'wagmi'

const AvailableBalance = (props: { slpxPair: SlpxPair }) => {
  const balances = useRecoilValue(selectedBalancesState)
  const nativeBalance = balances.find(
    x => x.token?.symbol.toLowerCase() === props.slpxPair.nativeToken.symbol.toLowerCase()
  )
  return (
    <>
      {useMemo(
        () =>
          Decimal.fromPlanck(
            nativeBalance.sum.planck.transferable ?? 0n,
            nativeBalance.each.at(0)?.decimals ?? 0,
            props.slpxPair.nativeToken.symbol
          ).toHuman(),
        [nativeBalance.each, nativeBalance.sum.planck.transferable, props.slpxPair.nativeToken.symbol]
      )}
    </>
  )
}

const StakePercentage = (props: { slpxPair: SlpxPair }) => {
  const balances = useRecoilValue(selectedBalancesState)
  const liquidToken = useToken({
    chainId: props.slpxPair.chain.id,
    address: props.slpxPair.vToken.address,
    suspense: true,
  })
  const nativeBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === props.slpxPair.nativeToken.symbol.toLowerCase()),
    [balances, props.slpxPair.nativeToken.symbol]
  )
  const liquidBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === liquidToken.data?.symbol.toLowerCase()),
    [balances, liquidToken.data?.symbol]
  )

  return (
    <StakeProvider.StakePercentage
      percentage={useMemo(
        () =>
          new BigNumber(liquidBalance.sum.planck.total.toString())
            .div((nativeBalance.sum.planck.total + liquidBalance.sum.planck.total).toString())
            .toNumber(),
        [liquidBalance.sum.planck.total, nativeBalance.sum.planck.total]
      )}
    />
  )
}

const StakeProviders = () => {
  return (
    <StakeProvider
      symbol={glmrSlpxPair.nativeToken.symbol}
      logo={githubChainLogoUrl('moonbeam')}
      chain={glmrSlpxPair.chain.name}
      apr="6.6%"
      type="Liquid staking"
      provider="Bifrost SLPX"
      availableBalance={
        <Suspense fallback={<CircularProgressIndicator size="1em" />}>
          <AvailableBalance slpxPair={glmrSlpxPair} />
        </Suspense>
      }
      stakePercentage={
        <Suspense fallback={<StakeProvider.StakePercentage loading />}>
          <StakePercentage slpxPair={glmrSlpxPair} />
        </Suspense>
      }
      stakeButton={<StakeProvider.StakeButton as={Link} to="?action=stake&type=slpx" />}
    />
  )
}

export default StakeProviders
