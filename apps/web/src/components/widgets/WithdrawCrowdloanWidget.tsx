import { WithdrawCrowdloanDialog } from '@components/recipes/WithdrawCrowdloanDialog'
import { type Account } from '@domains/accounts/recoils'
import { substrateApiState, useExtrinsic } from '@domains/common'
import type { Relaychain } from '@libs/talisman/util/_config'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRecoilValueLoadable } from 'recoil'

export type WithdrawCrowdloanWidgetProps = {
  account?: Account
  relayChain?: Relaychain
  paraId?: string
  amount?: string
  stakeAfterWithdrawn?: boolean
  goToStaking?: () => void
  children: (props: { onToggleOpen: () => unknown }) => ReactNode
}

export const WithdrawCrowdloanWidget = ({
  account,
  relayChain,
  paraId,
  amount,
  stakeAfterWithdrawn,
  goToStaking,
  children,
}: WithdrawCrowdloanWidgetProps) => {
  const [open, setOpen] = useState(false)

  const apiLoadable = useRecoilValueLoadable(substrateApiState(relayChain?.rpc))

  const tx = useExtrinsic(
    useMemo(() => {
      const api = apiLoadable.valueMaybe()

      if (!open) return
      if (api === undefined) return
      if (account === undefined) return
      if (paraId === undefined) return

      return api.tx.crowdloan.withdraw(account.address, paraId)
    }, [open, account, apiLoadable, paraId])
  )

  const onRequestWithdraw = useCallback(async () => account && (await tx?.signAndSend(account.address)), [account, tx])

  console.log('contents', tx?.contents)

  useEffect(() => {
    if (tx?.state === 'loading') {
      if (tx?.contents === undefined) return

      // only close modal if we're doing a `withdraw` without a follow-up `stake`
      if (!stakeAfterWithdrawn) setOpen(false)
    }
    if (tx?.state === 'hasValue') {
      if (tx?.contents === undefined) return

      setOpen(false)
      if (stakeAfterWithdrawn && goToStaking) goToStaking()
    }
    if (tx?.state === 'hasError') {
      setOpen(false)
    }
  }, [goToStaking, stakeAfterWithdrawn, tx?.contents, tx?.state])

  return (
    <>
      <WithdrawCrowdloanDialog
        open={open}
        loading={apiLoadable.state === 'loading'}
        submitting={tx?.state === 'loading'}
        relayChainName={relayChain?.name}
        tokenSymbol={relayChain?.tokenSymbol}
        amount={amount}
        onRequestDismiss={useCallback(() => setOpen(false), [])}
        onRequestWithdraw={onRequestWithdraw}
      />
      {children({
        onToggleOpen: useCallback(() => setOpen(x => !x), []),
      })}
    </>
  )
}
