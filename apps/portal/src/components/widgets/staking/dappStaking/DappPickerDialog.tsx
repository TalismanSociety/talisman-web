import type { AstarPrimitivesDappStakingSmartContract } from '@polkadot/types/lookup'
import type { ReactNode } from 'react'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { Clickable } from '@talismn/ui/atoms/Clickable'
import { Surface } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'
import { useState, useTransition } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { StakeLoadable } from '@/domains/staking/dappStaking/hooks/useStakeLoadable'
import { useRegisteredDappsState } from '@/domains/staking/dappStaking/recoils'
import { truncateAddress } from '@/util/truncateAddress'

type DappPickerDialogProps = {
  title: ReactNode
  stake: StakeLoadable['data']
  onSelect: (dapp: AstarPrimitivesDappStakingSmartContract) => void
  onRequestDismiss: () => void
}

const DappPickerDialog = (props: DappPickerDialogProps) => {
  const [registeredDapps, tokenAmount] = useRecoilValue(
    waitForAll([useRegisteredDappsState(), useNativeTokenAmountState()])
  )

  const [dappInTransition, setDappInTransition] = useState<AstarPrimitivesDappStakingSmartContract>()
  const [inTransition, startTransition] = useTransition()

  const selectDapp = (dapp: AstarPrimitivesDappStakingSmartContract) => {
    setDappInTransition(dapp)
    startTransition(() => props.onSelect(dapp))
  }

  return (
    <AlertDialog title={props.title} onRequestDismiss={props.onRequestDismiss} targetWidth="45rem">
      <div css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {props.stake.dapps.map(([dapp, info]) => {
          const total = tokenAmount.fromPlanck(
            info.staked.voting.unwrap().toBigInt() + info.staked.buildAndEarn.unwrap().toBigInt()
          )

          const address = (() => {
            switch (dapp.type) {
              case 'Evm':
                return dapp.asEvm.toHex()
              case 'Wasm':
                return dapp.asWasm.toString()
            }
          })()

          const registeredDapp = registeredDapps.find(x => x.address.toLowerCase() === address.toLowerCase())

          return (
            <Clickable.WithFeedback key={dapp.toString()} onClick={() => selectDapp(dapp)}>
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
                  {inTransition && dappInTransition === dapp ? (
                    <CircularProgressIndicator size="4rem" />
                  ) : (
                    <img
                      src={registeredDapp?.iconUrl}
                      css={{ borderRadius: '2rem', width: '4rem', aspectRatio: '1 / 1' }}
                    />
                  )}
                  <Text.BodyLarge as="div" alpha="high" css={{ fontWeight: 'bold' }}>
                    {registeredDapp?.name ?? truncateAddress(address)}{' '}
                  </Text.BodyLarge>
                </div>
                <div>
                  <Text.Body as="div" alpha="high">
                    {total.decimalAmount?.toLocaleString()}
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

export default DappPickerDialog
