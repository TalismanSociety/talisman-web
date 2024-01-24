import { useNativeTokenAmountState } from '@domains/chains'
import type { Stake } from '@domains/staking/dappStaking'
import { useRegisteredDappsState } from '@domains/staking/dappStaking/recoils'
import type { AstarPrimitivesDappStakingSmartContract } from '@polkadot/types/lookup'
import { AlertDialog, CircularProgressIndicator, Clickable, Surface, Text } from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { useState, useTransition } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

type DappPickerDialogProps = {
  stake: Stake
  onSelect: (dapp: AstarPrimitivesDappStakingSmartContract) => void
  onRequestDismiss: () => void
}

const DappPickerDialog = (props: DappPickerDialogProps) => {
  const [registeredDapps, tokenAmount] = useRecoilValue(
    waitForAll([useRegisteredDappsState(), useNativeTokenAmountState()])
  )

  const [dappInTransition, setDappInTransition] = useState<AstarPrimitivesDappStakingSmartContract>()
  const [inTransition, startTransition] = useTransition()

  const selectDapp = (dapp: AstarPrimitivesDappStakingSmartContract) =>
    startTransition(() => {
      setDappInTransition(dapp)
      props.onSelect(dapp)
    })

  return (
    <AlertDialog title="Select a DApp" onRequestDismiss={props.onRequestDismiss} width="45rem">
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
                return dapp.asWasm.toUtf8()
            }
          })()

          const registeredDapp = registeredDapps.find(x => x.address.toLowerCase() === address)

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
                  <img src={registeredDapp?.iconUrl} css={{ width: '4rem', aspectRatio: '1 / 1' }} />
                  <Text.BodyLarge as="div" alpha="high" css={{ fontWeight: 'bold' }}>
                    {registeredDapp?.name ?? shortenAddress(address)}{' '}
                    {inTransition && dappInTransition === dapp && <CircularProgressIndicator size="1em" />}
                  </Text.BodyLarge>
                </div>
                <div>
                  <Text.Body as="div" alpha="high">
                    {total.decimalAmount.toHuman()}
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
