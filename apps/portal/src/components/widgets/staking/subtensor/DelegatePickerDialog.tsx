import type { Account } from '../../../../domains/accounts'
import { useNativeTokenAmountState } from '../../../../domains/chains'
import { useDelegates } from '../../../../domains/staking/subtensor/hooks/useDelegates'
import { useStake } from '../../../../domains/staking/subtensor/hooks/useStake'
import { shortenAddress } from '../../../../util/format'
import { AlertDialog, CircularProgressIndicator, Clickable, Surface, Text } from '@talismn/ui'
import { useState, useTransition, type ReactNode } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

type DelegatePickerDialogProps = {
  title: ReactNode
  account: Account
  onSelect: (delegate: string) => void
  onRequestDismiss: () => void
}

const DelegatePickerDialog = (props: DelegatePickerDialogProps) => {
  const stake = useStake(props.account)
  const delegates = useDelegates()
  const [tokenAmount] = useRecoilValue(waitForAll([useNativeTokenAmountState()]))

  const [delegateInTransition, setDelegateInTransition] = useState<string>()
  const [inTransition, startTransition] = useTransition()

  const selectDelegate = (delegate: string) => {
    setDelegateInTransition(delegate)
    startTransition(() => props.onSelect(delegate))
  }

  return (
    <AlertDialog title={props.title} onRequestDismiss={props.onRequestDismiss} targetWidth="45rem">
      <div css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {(stake.stakes ?? []).map(stake => {
          const delegate = delegates[stake.hotkey]
          const total = tokenAmount.fromPlanck(stake.stake ?? 0n)

          return (
            <Clickable.WithFeedback key={stake.hotkey} onClick={() => selectDelegate(stake.hotkey)}>
              <Surface
                css={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: '1.6rem',
                  padding: '1rem 1.6rem',
                }}
              >
                <div css={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  {inTransition && delegateInTransition === stake.hotkey ? (
                    <CircularProgressIndicator size="2rem" />
                  ) : null}
                  <Text.BodyLarge as="div" alpha="high" css={{ fontWeight: 'bold' }}>
                    {delegate?.name ?? shortenAddress(stake.hotkey)}{' '}
                  </Text.BodyLarge>
                </div>
                <div>
                  <Text.Body as="div" alpha="high">
                    {total.decimalAmount.toLocaleString()}
                  </Text.Body>
                  <Text.BodySmall as="div">{total.localizedFiatAmount}</Text.BodySmall>
                </div>
              </Surface>
            </Clickable.WithFeedback>
          )
        })}
      </div>
    </AlertDialog>
  )
}

export default DelegatePickerDialog
