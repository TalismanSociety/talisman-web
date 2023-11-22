import StakeProvider from '@components/recipes/StakeProvider'
import { selectedBalancesState } from '@domains/balances'
import { lidoMainnet, type LidoSuite } from '@domains/staking/lido'
import { githubChainLogoUrl } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { CircularProgressIndicator } from '@talismn/ui'
import BigNumber from 'bignumber.js'
import { Suspense, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { useToken } from 'wagmi'

const AvailableBalance = (props: { lidoSuite: LidoSuite }) => {
  const balances = useRecoilValue(selectedBalancesState)
  const nativeBalance = balances.find(
    x => x.token?.symbol.toLowerCase() === props.lidoSuite.chain.nativeCurrency.symbol.toLowerCase()
  )
  return (
    <>
      {useMemo(
        () =>
          Decimal.fromPlanck(
            nativeBalance.sum.planck.transferable ?? 0n,
            nativeBalance.each.at(0)?.decimals ?? 0,
            props.lidoSuite.chain.nativeCurrency.symbol
          ).toHuman(),
        [nativeBalance.each, nativeBalance.sum.planck.transferable, props.lidoSuite.chain.nativeCurrency.symbol]
      )}
    </>
  )
}

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
      symbol={lidoMainnet.chain.nativeCurrency.symbol}
      logo={githubChainLogoUrl('1')}
      chain={lidoMainnet.chain.name}
      apr="3.7%"
      type="Liquid staking"
      provider="Lido"
      availableBalance={
        <Suspense fallback={<CircularProgressIndicator size="1em" />}>
          <AvailableBalance lidoSuite={lidoMainnet} />
        </Suspense>
      }
      stakePercentage={
        <Suspense fallback={<StakeProvider.StakePercentage loading />}>
          <StakePercentage lidoSuite={lidoMainnet} />
        </Suspense>
      }
      stakeButton={<StakeProvider.StakeButton as={Link} to="?action=stake&type=lido" />}
    />
  )
}

export default StakeProviders
