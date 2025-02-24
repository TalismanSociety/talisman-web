import { Button } from '@talismn/ui/atoms/Button'
import { Text } from '@talismn/ui/atoms/Text'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'
import { ListItem } from '@talismn/ui/molecules/ListItem'
import { Select } from '@talismn/ui/molecules/Select'
import { TextInput } from '@talismn/ui/molecules/TextInput'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import type { Account } from '@/domains/accounts/recoils'
import { writeableSubstrateAccountsState } from '@/domains/accounts/recoils'
import { useZapForm } from '@/domains/staking/subtensor/hooks/forms'
import { type StakeItem } from '@/domains/staking/subtensor/hooks/useStake'
import { type SubnetData } from '@/domains/staking/subtensor/types'

import { useAccountSelector } from '../../AccountSelector'
import { SubnetSelectorDialog } from './SubnetSelectorDialog'

export type ZapDialogProps = {
  account: Account
  stake: StakeItem
  onRequestDismiss: () => void
  isOpen: boolean
}

export const ZapDialog = ({ stake, isOpen, onRequestDismiss }: ZapDialogProps) => {
  const [subnet, setSubnet] = useState<SubnetData | undefined>()
  const [subnetSelectorOpen, setSubnetSelectorOpen] = useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const [[account]] = useAccountSelector(
    useRecoilValue(writeableSubstrateAccountsState),
    searchParams.get('account') === null
      ? 0
      : accounts => accounts?.find(x => x.address === searchParams.get('account'))
  )

  const queryClient = useQueryClient()

  const handleStakeInfoRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ['stakeInfoForColdKey', account?.address] })
  }

  const { extrinsic, available, input, setInput, resultingZap, expectedAlphaAmount } = useZapForm(
    stake,
    stake.hotkey,
    account,
    subnet?.netuid ? Number(subnet.netuid) : 0
  )

  const onConfirm = () => {
    if (!account) {
      console.log('No account')
      return
    }
    void extrinsic.signAndSend(account.address).then(() => {
      handleStakeInfoRefetch()
      onRequestDismiss()
    })
  }

  const subnetName = subnet ? `${subnet?.netuid}: ${subnet.descriptionName} ${subnet?.symbol}` : undefined

  return (
    <>
      <AlertDialog
        open={isOpen}
        title="Zap dTao"
        targetWidth="44rem"
        content={
          <>
            <Text.Body as="p" css={{ marginBottom: '2.6rem' }}>
              How much would you like Zap?
            </Text.Body>
            <TextInput
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              // isError={props.isError}
              placeholder="0.00"
              leadingLabel="Available to Zap"
              trailingLabel={available?.decimalAmount?.toLocaleString() || `0 ${stake.symbol}`}
              // leadingSupportingText={props.fiatAmount}
              // trailingSupportingText={props.inputSupportingText}
              trailingIcon={
                <TextInput.LabelButton onClick={() => setInput(available?.decimalAmount?.toString() || '0')}>
                  Max
                </TextInput.LabelButton>
              }
              value={input}
              onChange={event => setInput(event.target.value)}
              css={{ fontSize: '3rem' }}
            />

            <div onClick={() => setSubnetSelectorOpen(true)}>
              <label css={{ pointerEvents: 'none' }}>
                <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
                  Select Subnet
                </Text.BodySmall>
                <Select
                  placeholder={
                    <ListItem headlineContent="Select a subnet" css={{ padding: '0.8rem', paddingLeft: 0 }} />
                  }
                  renderSelected={() => (
                    <ListItem
                      headlineContent={subnet ? subnetName : 'Select subnet'}
                      css={{ padding: '0.8rem', paddingLeft: 0 }}
                    />
                  )}
                  css={{ width: '100%' }}
                />
              </label>
            </div>

            <TextInput
              type="number"
              disabled
              leadingLabel={subnet ? `Expected ${subnet.netuid} | ${subnet.symbol}` : 'Expected dTao'}
              value={expectedAlphaAmount.decimalAmount?.toString()}
              // value={resultingZap.decimalAmount.toLocaleString() || '0'}
            />
            {/* {props.expectedTokenAmount && props.expectedTokenAmount} */}
            {/* <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.6rem' }}>
            <Text.Body alpha="high">New staked total</Text.Body>
          </div> */}
          </>
        }
        confirmButton={<Button onClick={onConfirm}>Zap</Button>}
        onRequestDismiss={onRequestDismiss}
      />
      {subnetSelectorOpen && (
        <SubnetSelectorDialog
          selected={subnet}
          onRequestDismiss={() => setSubnetSelectorOpen(false)}
          onConfirm={setSubnet}
        />
      )}
    </>
  )
}
