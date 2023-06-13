import Cryptoticon from '@components/recipes/Cryptoticon'
import { useTheme } from '@emotion/react'
import { ArrowDown, Repeat } from '@talismn/icons'
import {
  Button,
  ContainedTextInput,
  IconButton,
  Select,
  TextInput,
  type ButtonProps,
  CircularProgressIndicator,
} from '@talismn/ui'
import { LayoutGroup, motion } from 'framer-motion'
import { useId, useState, type ReactNode } from 'react'

export type TransportFormProps = {
  accountSelector: ReactNode
  fromChains: Array<{ name: string; logoSrc: string }>
  selectedFromChainInitializing?: boolean
  selectedFromChainIndex: number
  onSelectFromChainIndex: (value: number | undefined) => unknown
  toChains: Array<{ name: string; logoSrc: string }>
  selectedToChainIndex: number
  onSelectToChainIndex: (value: number | undefined) => unknown
  canReverseChainRoute?: boolean
  onReverseChainRoute: () => unknown
  tokenSelector: ReactNode
  transferableAmount?: ReactNode
  amount: string
  onChangeAmount: (amount: string) => unknown
  originFee?: ReactNode
  destinationFee?: ReactNode
  inputError?: string
}

const TransportFormNetworkButton = (props: Pick<ButtonProps<'button'>, 'onClick' | 'disabled'>) => {
  const theme = useTheme()
  return (
    <IconButton
      {...props}
      contentColor={theme.color.primary}
      disabledContentColor={theme.color.onSurface}
      css={{ '@media(min-width: 600px)': { rotate: '-90deg' } }}
    >
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
    </IconButton>
  )
}

const TransportForm = Object.assign(
  (props: TransportFormProps) => {
    const theme = useTheme()

    const [chainSwapped, setChainSwapped] = useState(false)

    return (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2.4rem',
          borderRadius: '1.6rem',
        }}
      >
        {props.accountSelector}
        <ContainedTextInput
          width="100%"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={props.amount}
          onChange={event => props.onChangeAmount(event.target.value)}
          leadingIcon={props.tokenSelector}
          hasSupportingText
          trailingSupportingText={props.transferableAmount && <>Transferable: {props.transferableAmount}</>}
          leadingSupportingText={props.inputError && <TextInput.ErrorLabel>{props.inputError}</TextInput.ErrorLabel>}
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
                  css={{ width: '100%' }}
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
                      leadingIcon={
                        props.selectedFromChainInitializing ? (
                          <CircularProgressIndicator size="2rem" />
                        ) : (
                          <Cryptoticon src={network.logoSrc} alt={network.name} size="2rem" />
                        )
                      }
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
                  css={{ width: '100%' }}
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
      </div>
    )
  },
  {
    SubmitButton: (props: ButtonProps<'button'>) => (
      <Button {...props} css={{ width: '100%' }}>
        Transport
      </Button>
    ),
  }
)

export default TransportForm
