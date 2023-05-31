import { useTheme } from '@emotion/react'
import Color from 'colorjs.io'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { type ReactNode, useId, useState } from 'react'

import { ArrowDown, Repeat } from '@talismn/icons'
import { Button, type ButtonProps, Select, Text, TextInput } from '@talismn/ui'
import Cryptoticon from '../Cryptoticon'
import TransportFormSkeleton from './TransportForm.skeleton'

export type TransportFormProps = {
  accountSelector: ReactNode
  fromChains: Array<{ name: string; logoSrc: string }>
  selectedFromChainIndex: number
  onSelectFromChainIndex: (value: number | undefined) => unknown
  toChains: Array<{ name: string; logoSrc: string }>
  selectedToChainIndex: number
  onSelectToChainIndex: (value: number | undefined) => unknown
  canReverseChainRoute?: boolean
  onReverseChainRoute: () => unknown
  token?: { name: string; logoSrc: string }
  onRequestTokenChange: () => unknown
  transferableAmount?: ReactNode
  amount: string
  onChangeAmount: (amount: string) => unknown
  originFee?: ReactNode
  destinationFee?: ReactNode
  onConfirmTransfer: () => unknown
  confirmTransferState?: 'disabled' | 'pending'
  inputError?: string
}

const TransportFormNetworkButton = (props: Pick<ButtonProps<'button'>, 'onClick' | 'disabled'>) => {
  return (
    <Button variant="noop" {...props} css={{ '@media(min-width: 600px)': { rotate: '-90deg' } }}>
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
          <Repeat size="3.2rem" />
        </motion.div>
        <motion.div
          variants={{ false: { display: 'unset' }, true: { display: 'none' } }}
          css={{ position: 'absolute', inset: 0 }}
        >
          <ArrowDown size="3.2rem" />
        </motion.div>
      </motion.div>
    </Button>
  )
}

const TransportForm = Object.assign(
  (props: TransportFormProps) => {
    const theme = useTheme()

    const [chainSwapped, setChainSwapped] = useState(false)

    return (
      <div>
        <motion.div layout css={{ borderRadius: '1.6rem', padding: 1, backgroundColor: theme.color.foreground }}>
          <motion.div
            layout
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
              inputMode="decimal"
              placeholder="0.00"
              value={props.amount}
              onChange={event => props.onChangeAmount(event.target.value)}
              width="10rem"
              trailingIcon={
                props.token === undefined ? (
                  <Button
                    onClick={props.onRequestTokenChange}
                    css={{
                      padding: '1rem',
                      backgroundColor: (() => {
                        const color = new Color(theme.color.primary)
                        color.alpha = 0.1
                        return color.display().toString()
                      })(),
                    }}
                  >
                    <Text.BodySmall
                      color={theme.color.primary}
                      css={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      Choose token
                    </Text.BodySmall>
                  </Button>
                ) : (
                  <Button
                    onClick={props.onRequestTokenChange}
                    css={{
                      padding: '1rem',
                      backgroundColor: theme.color.foregroundVariant,
                      color: (() => {
                        const color = new Color(theme.color.onForegroundVariant)
                        color.alpha = theme.contentAlpha.medium
                        return color.display().toString()
                      })(),
                    }}
                  >
                    <Text.BodySmall as="div" css={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                      <Cryptoticon src={props.token.logoSrc} alt={props.token.name} size="2rem" />
                      <div>{props.token.name}</div>
                    </Text.BodySmall>
                  </Button>
                )
              }
              trailingSupportingText={props.transferableAmount && <>Transferable: {props.transferableAmount}</>}
              leadingSupportingText={
                props.inputError && <TextInput.ErrorLabel>{props.inputError}</TextInput.ErrorLabel>
              }
              css={{ fontSize: '3rem' }}
            />
            <div
              css={[
                { display: 'flex', alignItems: 'center', gap: '1rem' },
                {
                  'flexDirection': 'column',
                  '@media(min-width: 600px)': {
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  },
                },
              ]}
            >
              <LayoutGroup id={useId()}>
                <motion.div
                  key={chainSwapped ? 'a' : 'b'}
                  layoutId={chainSwapped ? 'a' : 'b'}
                  css={{ alignSelf: 'stretch' }}
                >
                  <div css={{ '@media(min-width: 600px)': { width: '16rem' } }}>
                    <Select
                      placeholder="From network"
                      value={props.selectedFromChainIndex}
                      onChange={props.onSelectFromChainIndex}
                      clearRequired
                    >
                      {props.fromChains.map((network, index) => (
                        <Select.Option
                          key={index}
                          value={index}
                          headlineText={network.name}
                          leadingIcon={<Cryptoticon src={network.logoSrc} alt={network.name} size="2rem" />}
                        />
                      ))}
                    </Select>
                  </div>
                </motion.div>
                <div css={{ color: theme.color.primary }}>
                  <TransportFormNetworkButton
                    onClick={() => {
                      props.onReverseChainRoute()
                      setChainSwapped(x => !x)
                    }}
                    disabled={!props.canReverseChainRoute}
                  />
                </div>
                <motion.div
                  key={chainSwapped ? 'b' : 'a'}
                  layoutId={chainSwapped ? 'b' : 'a'}
                  css={{ alignSelf: 'stretch' }}
                >
                  <div css={{ '@media(min-width: 600px)': { width: '16rem' } }}>
                    <Select
                      placeholder="To network"
                      value={props.selectedToChainIndex}
                      onChange={props.onSelectToChainIndex}
                      clearRequired
                    >
                      {props.toChains.map((network, index) => (
                        <Select.Option
                          key={index}
                          value={index}
                          headlineText={network.name}
                          leadingIcon={<Cryptoticon src={network.logoSrc} alt={network.name} size="2rem" />}
                        />
                      ))}
                    </Select>
                  </div>
                </motion.div>
              </LayoutGroup>
            </div>
          </motion.div>
          <AnimatePresence>
            {(props.originFee || props.destinationFee) && (
              <div css={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2.4rem' }}>
                <Text.BodySmall>Origin fee: {props.originFee}</Text.BodySmall>
                <Text.BodySmall>Destination fee: {props.destinationFee}</Text.BodySmall>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
        <Button
          onClick={props.onConfirmTransfer}
          css={{ width: '100%', marginTop: '2.4rem' }}
          loading={props.confirmTransferState === 'pending'}
          disabled={props.confirmTransferState === 'disabled'}
        >
          Transport
        </Button>
      </div>
    )
  },
  { Skeleton: TransportFormSkeleton }
)

export default TransportForm
