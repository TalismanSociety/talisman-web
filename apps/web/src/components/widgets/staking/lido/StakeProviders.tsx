import StakeProvider from '@components/recipes/StakeProvider'
import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import RedactableBalance from '@components/widgets/RedactableBalance'
import { selectedBalancesState, selectedCurrencyState } from '@domains/balances'
import { type LidoSuite } from '@domains/staking/lido'
import { lidoAprState, lidoSuitesState } from '@domains/staking/lido/recoils'
import { githubChainLogoUrl } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { CircularProgressIndicator } from '@talismn/ui'
import BigNumber from 'bignumber.js'
import { Suspense, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue, waitForAll } from 'recoil'
import { useToken } from 'wagmi'

const Apr = (props: { lidoSuite: LidoSuite }) => (
  <>
    {useRecoilValue(lidoAprState(props.lidoSuite.apiEndpoint)).toLocaleString(undefined, {
      style: 'percent',
      maximumFractionDigits: 2,
    })}
  </>
)

const useAvailableBalance = (lidoSuite: LidoSuite) => {
  const [balances, currency] = useRecoilValue(waitForAll([selectedBalancesState, selectedCurrencyState]))
  const nativeBalance = balances.find(
    x => x.token?.symbol.toLowerCase() === lidoSuite.chain.nativeCurrency.symbol.toLowerCase()
  )
  return useMemo(
    () => ({
      amount: Decimal.fromPlanck(
        nativeBalance.sum.planck.transferable ?? 0n,
        nativeBalance.each.at(0)?.decimals ?? 0,
        lidoSuite.chain.nativeCurrency.symbol
      ).toHuman(),
      fiatAmount: nativeBalance.sum.fiat(currency).total,
    }),
    [currency, lidoSuite.chain.nativeCurrency.symbol, nativeBalance.each, nativeBalance.sum]
  )
}

const AvailableBalance = (props: { lidoSuite: LidoSuite }) => (
  <RedactableBalance>{useAvailableBalance(props.lidoSuite).amount}</RedactableBalance>
)

const AvailableFiatBalance = (props: { lidoSuite: LidoSuite }) => (
  <AnimatedFiatNumber end={useAvailableBalance(props.lidoSuite).fiatAmount} />
)

const StakePercentage = (props: { lidoSuite: LidoSuite }) => {
  const balances = useRecoilValue(selectedBalancesState)
  const liquidToken = useToken({
    chainId: props.lidoSuite.chain.id,
    address: props.lidoSuite.token.address,
    suspense: true,
  })
  const nativeBalance = useMemo(
    () =>
      balances.find(x => x.token?.symbol.toLowerCase() === props.lidoSuite.chain.nativeCurrency.symbol.toLowerCase()),
    [balances, props.lidoSuite.chain.nativeCurrency.symbol]
  )
  const liquidBalance = useMemo(
    () => balances.find(x => x.token?.symbol.toLowerCase() === liquidToken.data?.symbol.toLowerCase()),
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
  const lidoSuites = useRecoilValue(lidoSuitesState)
  return (
    <>
      {lidoSuites.map((lidoSuite, index) => (
        <StakeProvider
          key={index}
          symbol={lidoSuite.chain.nativeCurrency.symbol}
          logo={githubChainLogoUrl('1')}
          chain={lidoSuite.chain.name}
          apr={
            <Suspense fallback={<CircularProgressIndicator size="1em" />}>
              <Apr lidoSuite={lidoSuite} />
            </Suspense>
          }
          type="Liquid staking"
          provider="Lido"
          unbondingPeriod="1-5 day(s)"
          availableBalance={
            <Suspense fallback={<CircularProgressIndicator size="1em" />}>
              <AvailableBalance lidoSuite={lidoSuite} />
            </Suspense>
          }
          availableFiatBalance={
            <Suspense>
              <AvailableFiatBalance lidoSuite={lidoSuite} />
            </Suspense>
          }
          stakePercentage={
            <Suspense fallback={<StakeProvider.StakePercentage loading />}>
              <StakePercentage lidoSuite={lidoSuite} />
            </Suspense>
          }
          stakeButton={
            <StakeProvider.StakeButton
              as={Link}
              to={`?action=stake&type=lido&token-address=${lidoSuite.token.address}`}
            />
          }
        />
      ))}
    </>
  )
}

export default StakeProviders
