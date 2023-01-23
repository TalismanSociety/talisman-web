import Button from '@components/atoms/Button'
import { ArrowRight, ChevronRight } from '@components/atoms/Icon'
import Identicon from '@components/atoms/Identicon'
import Select from '@components/molecules/Select'
import TextInput from '@components/molecules/TextInput'
import { useTheme } from '@emotion/react'
import { Maybe } from '@util/monads'
import Color from 'colorjs.io'
import { useMemo } from 'react'

import Cryptoticon from '../Cryptoticon'

export type SwapProps = {
  accounts: Array<{ name: string; address: string; balance: string }>
  selectedAccountIndex: number
  onSelectAccountIndex: (value: number | undefined) => unknown
  fromNetworks: Array<{ name: string; logoSrc: string }>
  selectedFromNetworkIndex: number
  onSelectFromNetworkIndex: (value: number | undefined) => unknown
  toNetworks: Array<{ name: string; logoSrc: string }>
  selectedToNetworkIndex: number
  onSelectToNetworkIndex: (value: number | undefined) => unknown
  token?: { name: string; logoSrc: string }
  onRequestTokenChange: () => unknown
  selectedTokenBalance?: string
  amount: string
  onChangeAmount: (amount: string) => unknown
  onConfirmTransfer: () => unknown
  confirmTransferState?: 'disabled' | 'pending'
  inputError?: string
}

const Swap = (props: SwapProps) => {
  const theme = useTheme()

  const errorProps = useMemo(() => {
    if (props.inputError !== undefined) {
      return {
        isError: true,
        leadingSupportingText: props.inputError,
      }
    }

    return {}
  }, [props.inputError])

  return (
    <div>
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2.4rem',
          borderRadius: '1.6rem',
          padding: '2.4rem',
          backgroundColor: theme.color.surface,
        }}
      >
        <Select
          width="100%"
          placeholder="Select account"
          value={props.selectedAccountIndex}
          onChange={props.onSelectAccountIndex}
        >
          {props.accounts.map((account, index) => (
            <Select.Item
              value={index}
              leadingIcon={<Identicon value={account.address} size={40} />}
              headlineText={account.name}
              supportingText={account.balance}
            />
          ))}
        </Select>
        <div css={{ display: 'flex', alignItems: 'center' }}>
          <Select
            width="16rem"
            placeholder="From network"
            value={props.selectedFromNetworkIndex}
            onChange={props.onSelectFromNetworkIndex}
            clearRequired
          >
            {props.fromNetworks.map((network, index) => (
              <Select.Item
                key={index}
                value={index}
                headlineText={network.name}
                leadingIcon={<Cryptoticon src={network.logoSrc} alt={network.name} size="2rem" />}
              />
            ))}
          </Select>
          <div css={{ margin: '0 3rem', color: theme.color.primary }}>
            <ArrowRight width="3.2rem" height="3.2rem" />
          </div>
          <Select
            width="16rem"
            placeholder="To network"
            value={props.selectedToNetworkIndex}
            onChange={props.onSelectToNetworkIndex}
            clearRequired
          >
            {props.toNetworks.map((network, index) => (
              <Select.Item
                key={index}
                value={index}
                headlineText={network.name}
                leadingIcon={<Cryptoticon src={network.logoSrc} alt={network.name} size="2rem" />}
              />
            ))}
          </Select>
        </div>
        <TextInput
          type="number"
          placeholder="0.00"
          value={props.amount}
          onChange={event => props.onChangeAmount(event.target.value)}
          trailingIcon={
            props.token === undefined ? (
              <Button
                onClick={props.onRequestTokenChange}
                css={{
                  padding: '1.1rem 0.8rem',
                  color: theme.color.primary,
                  backgroundColor: (() => {
                    const color = new Color(theme.color.primary)
                    color.alpha = 0.1
                    return color.display().toString()
                  })(),
                }}
              >
                <div css={{ display: 'flex', alignItems: 'center' }}>
                  <div>Choose token</div>
                  <ChevronRight />
                </div>
              </Button>
            ) : (
              <Button
                onClick={props.onRequestTokenChange}
                css={{
                  backgroundColor: theme.color.foregroundVariant,
                  color: (() => {
                    const color = new Color(theme.color.onForegroundVariant)
                    color.alpha = theme.contentAlpha.medium
                    return color.display().toString()
                  })(),
                }}
              >
                <div css={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <Cryptoticon src={props.token.logoSrc} alt={props.token.name} size="2.5rem" />
                  <div>{props.token.name}</div>
                </div>
              </Button>
            )
          }
          trailingSupportingText={Maybe.of(props.selectedTokenBalance).mapOrUndefined(x => `Balance: ${x}`)}
          {...errorProps}
        />
      </div>
      <Button
        onClick={props.onConfirmTransfer}
        css={{ width: '100%', marginTop: '2.4rem' }}
        loading={props.confirmTransferState === 'pending'}
        disabled={props.confirmTransferState === 'disabled'}
      >
        Transfer
      </Button>
    </div>
  )
}

export default Swap
