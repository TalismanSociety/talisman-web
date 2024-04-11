import Cryptoticon from '@components/recipes/Cryptoticon'
import { useTheme } from '@emotion/react'
import { ArrowDown, Repeat } from '@talismn/web-icons'
import {
  Button,
  CircularProgressIndicator,
  Select,
  Text,
  TextInput,
  TonalIconButton,
  type ButtonProps,
} from '@talismn/ui'
import { LayoutGroup, motion } from 'framer-motion'
import { useId, useState, type ReactNode } from 'react'

export type TransportFormProps = {
  accountSelector: ReactNode
  destAccountSelector: ReactNode
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
  transferableFiatAmount?: ReactNode
  amount: string
  onChangeAmount: (amount: string) => unknown
  onRequestMaxAmount: () => unknown
  originFee?: ReactNode
  destinationFee?: ReactNode
  inputError?: string
}

const TransportFormNetworkButton = (props: Pick<ButtonProps<'button'>, 'onClick' | 'disabled'>) => (
  <TonalIconButton {...props} css={{ '@media(min-width: 600px)': { rotate: '-90deg' } }}>
    <motion.div
      initial="false"
      whileHover={props.disabled ? 'false' : 'true'}
      variants={{ false: { rotate: 0 }, true: { rotate: 90 } }}
      css={{ display: 'flex' }}
    >
      {/* Display transition doesn't work properly
      https://github.com/framer/motion/issues/2563 */}
      <motion.div
        variants={{ false: { transitionEnd: { display: 'none' } }, true: { transitionEnd: { display: 'flex' } } }}
      >
        <Repeat />
      </motion.div>
      <motion.div
        variants={{ false: { transitionEnd: { display: 'flex' } }, true: { transitionEnd: { display: 'none' } } }}
      >
        <ArrowDown />
      </motion.div>
    </motion.div>
  </TonalIconButton>
)

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
        <TextInput
          width="100%"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={props.amount}
          onChange={event => props.onChangeAmount(event.target.value)}
          leadingIcon={props.tokenSelector}
          hasLabel
          leadingLabel={props.transferableAmount !== undefined && 'Available balance'}
          trailingLabel={props.transferableAmount}
          hasSupportingText
          leadingSupportingText={props.inputError && <TextInput.ErrorLabel>{props.inputError}</TextInput.ErrorLabel>}
          trailingSupportingText={
            props.transferableFiatAmount && (
              <>
                <Text.BodySmall alpha="disabled">Value:</Text.BodySmall>{' '}
                <Text.BodySmall alpha="medium">{props.transferableFiatAmount}</Text.BodySmall>
              </>
            )
          }
          trailingIcon={<TextInput.LabelButton onClick={props.onRequestMaxAmount}>Max</TextInput.LabelButton>}
          css={{ fontSize: '3rem', textAlign: 'end' }}
        />
        <div
          css={[
            { display: 'flex', alignItems: 'center', gap: '1rem' },
            {
              flexDirection: 'column',
              '@media(min-width: 600px)': {
                justifyContent: 'space-between',
                flexDirection: 'row',
                gap: '3.2rem',
              },
            },
          ]}
        >
          <LayoutGroup id={useId()}>
            <motion.div
              key={chainSwapped ? 'a' : 'b'}
              layoutId={chainSwapped ? 'a' : 'b'}
              css={{ alignSelf: 'stretch', flex: 1 }}
            >
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
                    headlineContent={network.name}
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
              css={{ alignSelf: 'stretch', flex: 1 }}
            >
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
                    headlineContent={network.name}
                    leadingIcon={<Cryptoticon src={network.logoSrc} alt={network.name} size="2rem" />}
                  />
                ))}
              </Select>
            </motion.div>
          </LayoutGroup>
        </div>
        <Text.BodySmall as="label">
          <div css={{ padding: '0 1.6rem 0.8rem 1.6rem' }}>Destination address</div>
          {props.destAccountSelector}
        </Text.BodySmall>
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
