import { useTheme } from '@emotion/react'
import Color from 'colorjs.io'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useCallback, useMemo, useState } from 'react'

import { ArrowDown, Repeat } from '@talismn/icons'
import { Button, ButtonProps, Select, Text, TextInput } from '@talismn/ui'
import Cryptoticon from '../Cryptoticon'
import TeleportFormSkeleton from './TeleportForm.skeleton'

export type TeleportFormProps = {
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
  transferableAmount?: ReactNode
  amount: string
  onChangeAmount: (amount: string) => unknown
  originFee?: ReactNode
  destinationFee?: ReactNode
  onConfirmTransfer: () => unknown
  confirmTransferState?: 'disabled' | 'pending'
  inputError?: string
}

const TeleportFormNetworkButton = (props: Pick<ButtonProps<'button'>, 'onClick' | 'disabled'>) => {
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

const TeleportForm = Object.assign(
  (props: TeleportFormProps) => {
    const theme = useTheme()
    const [networksSwapped, setNetworkSwapped] = useState(false)

    const fromNetworkSelect = useMemo(
      () => (
        <div css={{ '@media(min-width: 600px)': { width: '16rem' } }}>
          <Select
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
        </div>
      ),
      [props.fromNetworks, props.onSelectFromNetworkIndex, props.selectedFromNetworkIndex]
    )

    const toNetworkSelect = useMemo(
      () => (
        <div css={{ '@media(min-width: 600px)': { width: '16rem' } }}>
          <Select
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
      ),
      [props.onSelectToNetworkIndex, props.selectedToNetworkIndex, props.toNetworks]
    )

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
            />
            <div
              css={[
                { display: 'flex', alignItems: 'center', gap: '1rem' },
                {
                  'flexDirection': networksSwapped ? 'column' : 'column-reverse',
                  '@media(min-width: 600px)': {
                    justifyContent: 'space-between',
                    flexDirection: networksSwapped ? 'row' : 'row-reverse',
                  },
                },
              ]}
            >
              <motion.div layout css={{ alignSelf: 'stretch' }}>
                {networksSwapped ? toNetworkSelect : fromNetworkSelect}
              </motion.div>
              <div css={{ color: theme.color.primary }}>
                <TeleportFormNetworkButton
                  onClick={useCallback(() => {
                    props.onReverseNetworkRoute()
                    setNetworkSwapped(x => !x)
                  }, [props])}
                  disabled={!props.canReverseNetworkRoute}
                />
              </div>
              <motion.div layout css={{ alignSelf: 'stretch' }}>
                {networksSwapped ? fromNetworkSelect : toNetworkSelect}
              </motion.div>
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
          Teleport
        </Button>
      </div>
    )
  },
  { Skeleton: TeleportFormSkeleton }
)

export default TeleportForm
