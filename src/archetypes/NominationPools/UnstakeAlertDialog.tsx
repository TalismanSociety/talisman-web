import BaseUnstakeAlertDialog from '@components/recipes/UnstakeAlertDialog'
import { nativeTokenDecimalState, nativeTokenPriceState } from '@domains/chains/recoils'
import useChainState from '@domains/common/hooks/useChainState'
import useExtrinsic from '@domains/common/hooks/useExtrinsic'
import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

type UnstakeAlertDialogProps = {
  account: string
  onDismiss: () => unknown
}

const UnstakeAlertDialog = (props: UnstakeAlertDialogProps) => {
  const withdrawExtrinsic = useExtrinsic('nominationPools', 'withdrawUnbonded')

  const poolMemberLoadable = useChainState('query', 'nominationPools', 'poolMembers', [props.account])
  const tokenDecimal = useRecoilValue(nativeTokenDecimalState)
  const tokenPrice = useRecoilValue(nativeTokenPriceState('usd'))

  const amount = useMemo(
    () =>
      poolMemberLoadable.state !== 'hasValue'
        ? '...'
        : tokenDecimal(poolMemberLoadable.contents.unwrapOrDefault().points).toHuman(),
    [poolMemberLoadable.contents, poolMemberLoadable.state, tokenDecimal]
  )

  const fiatAmount = useMemo(
    () =>
      poolMemberLoadable.state !== 'hasValue'
        ? '...'
        : (
            tokenDecimal(poolMemberLoadable.contents.unwrapOrDefault().points).toFloatApproximation() * tokenPrice
          ).toLocaleString(undefined, { style: 'currency', currency: 'usd' }),
    [poolMemberLoadable.contents, poolMemberLoadable.state, tokenDecimal, tokenPrice]
  )

  return (
    <BaseUnstakeAlertDialog
      open
      amount={amount}
      fiatAmount={fiatAmount}
      lockDuration="28 days"
      onDismiss={props.onDismiss}
      onConfirm={useCallback(() => {
        withdrawExtrinsic.signAndSend(props.account, props.account, poolMemberLoadable.contents)
        props.onDismiss()
      }, [poolMemberLoadable.contents, props, withdrawExtrinsic])}
    />
  )
}
