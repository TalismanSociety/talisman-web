import { useTheme } from '@emotion/react'
import { Maybe } from '@util/monads'
import Color from 'colorjs.io'
import { motion } from 'framer-motion'
import { ReactNode, useCallback, useMemo, useState } from 'react'

import { ArrowRight, ChevronRight, Repeat } from '@talismn/icons'
import { Button, ButtonProps, CircularProgressIndicator, Select, Skeleton, TextInput } from '@talismn/ui'
import Cryptoticon from '../Cryptoticon'

export type TransferFormProps = {
  loading?: boolean
  accountSelector: ReactNode
  fromNetworks: Array<{ name: string; logoSrc: string }>
  selectedFromNetworkIndex: number
  onSelectFromNetworkIndex: (value: number | undefined) => unknown
  toNetworks: Array<{ name: string; logoSrc: string }>
  selectedToNetworkIndex: number
  onSelectToNetworkIndex: (value: number | undefined) => unknown
  canReverseNetworkRoute?: boolean
  onReverseNetworkRoute: () => unknown
  token?: { name: string; logoSrc: string }
  onRequestTokenChange: () => unknown
  selectedTokenBalance?: string
  amount: string
  onChangeAmount: (amount: string) => unknown
  onConfirmTransfer: () => unknown
  confirmTransferState?: 'disabled' | 'pending'
  inputError?: string
}

const TransferFormNetworksButton = (props: Pick<ButtonProps<'button'>, 'onClick' | 'disabled'>) => {
  return (
    <Button variant="noop" {...props}>
      <motion.div
        initial="false"
        whileHover={props.disabled ? 'false' : 'true'}
        variants={{ false: { rotate: 0 }, true: { rotate: 90 } }}
        css={{ position: 'relative', width: '3.2rem', height: '3.2rem' }}
      >
        <motion.div
          variants={{ false: { display: 'none' }, true: { display: 'unset' } }}
          css={{ position: 'absolute', inset: 0 }}
        >
          <Repeat size="3.2rem" css={{ transform: 'rotate(90deg)' }} />
        </motion.div>
        <motion.div
          variants={{ false: { display: 'unset' }, true: { display: 'none' } }}
          css={{ position: 'absolute', inset: 0 }}
        >
          <ArrowRight size="3.2rem" />
        </motion.div>
      </motion.div>
    </Button>
  )
}

const TransferForm = (props: TransferFormProps) => {
  const theme = useTheme()
  const [networksSwapped, setNetworkSwapped] = useState(false)

  const errorProps = useMemo(() => {
    if (props.inputError !== undefined) {
      return {
        isError: true,
        leadingSupportingText: props.inputError,
      }
    }

    return {}
  }, [props.inputError])

  const fromNetworkSelect = useMemo(
    () =>
      props.loading ? (
        <Skeleton.Foreground css={{ width: '16rem', height: '3.9rem' }} animate />
      ) : (
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
      ),
    [props.fromNetworks, props.loading, props.onSelectFromNetworkIndex, props.selectedFromNetworkIndex]
  )

  const toNetworkSelect = useMemo(
    () =>
      props.loading ? (
        <Skeleton.Foreground css={{ width: '16rem', height: '3.9rem' }} animate />
      ) : (
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
      ),
    [props.loading, props.onSelectToNetworkIndex, props.selectedToNetworkIndex, props.toNetworks]
  )

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
        {props.accountSelector}
        <TextInput
          type="number"
          placeholder="0.00"
          value={props.amount}
          onChange={event => props.onChangeAmount(event.target.value)}
          trailingIcon={
            props.token === undefined ? (
              <Button
                onClick={props.onRequestTokenChange}
                disabled={props.loading}
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
                <div css={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div>Choose token</div>
                  {props.loading ? <CircularProgressIndicator size="1.5em" /> : <ChevronRight size="1.5em" />}
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
                  <Cryptoticon src={props.token.logoSrc} alt={props.token.name} size="2rem" />
                  <div>{props.token.name}</div>
                </div>
              </Button>
            )
          }
          trailingSupportingText={Maybe.of(props.selectedTokenBalance).mapOrUndefined(x => `Balance: ${x}`)}
          {...errorProps}
        />
        <div
          style={{ flexDirection: networksSwapped ? 'row-reverse' : 'row' }}
          css={{ display: 'flex', alignItems: 'center' }}
        >
          <motion.div layout>{networksSwapped ? toNetworkSelect : fromNetworkSelect}</motion.div>
          <div css={{ margin: '0 3rem', color: theme.color.primary }}>
            <TransferFormNetworksButton
              onClick={useCallback(() => {
                props.onReverseNetworkRoute()
                setNetworkSwapped(x => !x)
              }, [props])}
              disabled={!props.canReverseNetworkRoute}
            />
          </div>
          <motion.div layout>{networksSwapped ? fromNetworkSelect : toNetworkSelect}</motion.div>
        </div>
      </div>
      <Button
        onClick={props.onConfirmTransfer}
        css={{ width: '100%', marginTop: '2.4rem' }}
        loading={props.confirmTransferState === 'pending'}
        disabled={props.confirmTransferState === 'disabled'}
      >
        Teleport
      </Button>
    </div>
  )
}

export default TransferForm
