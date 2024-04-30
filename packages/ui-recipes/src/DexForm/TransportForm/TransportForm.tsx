import {
  DescriptionList,
  Details,
  IconButton,
  SurfaceChip,
  Text,
  TextInput,
  TonalIconButton,
  type ButtonProps,
} from '@talismn/ui'
import { ArrowDown, HelpCircle, Repeat, X } from '@talismn/web-icons'
import { motion } from 'framer-motion'
import { Suspense, useState, type ReactNode } from 'react'
import DexForm, { DEX_FORM_WIDE_MEDIA_SELECTOR, TokenSelect } from '../components'

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

export type TransportFormSummaryProps = {
  originFee: ReactNode
  destinationFee: ReactNode
}

const Summary = (props: TransportFormSummaryProps) => (
  <DescriptionList emphasis="details">
    <DescriptionList.Description>
      <DescriptionList.Term>Origin fee</DescriptionList.Term>
      <DescriptionList.Details>{props.originFee}</DescriptionList.Details>
    </DescriptionList.Description>
    <DescriptionList.Description>
      <DescriptionList.Term>Destination fee</DescriptionList.Term>
      <DescriptionList.Details>{props.destinationFee}</DescriptionList.Details>
    </DescriptionList.Description>
  </DescriptionList>
)

export type TransportFormInfoProps = {
  summary: ReactNode
  footer: ReactNode
  faq: ReactNode
}

const Info = Object.assign(
  (props: TransportFormInfoProps) => {
    const [_faqVisible, setFaqVisible] = useState(false)
    const faqVisible = props.summary === undefined || _faqVisible

    return (
      <DexForm.Info>
        <div css={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
          <header css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text.H4>{faqVisible ? 'FAQ' : 'Details'}</Text.H4>
            {props.summary === undefined ? (
              <div css={{ height: '4rem' }} />
            ) : faqVisible ? (
              <IconButton onClick={() => setFaqVisible(false)}>
                <X />
              </IconButton>
            ) : (
              <div css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '4rem' }}>
                <SurfaceChip leadingContent={<HelpCircle />} onClick={() => setFaqVisible(true)}>
                  F.A.Q
                </SurfaceChip>
              </div>
            )}
          </header>
          {faqVisible ? props.faq : props.summary}
          {props.footer}
        </div>
      </DexForm.Info>
    )
  },
  {
    DescriptionList: DexForm.Info.DescriptionList,
    Faq: DexForm.Info.Faq,
    Footer: DexForm.Info.Footer,
    Summary,
  }
)

export type TransportFormProps = {
  accountSelect: ReactNode
  amount: string
  onChangeAmount: (value: string) => unknown
  onRequestMaxAmount: () => unknown
  fiatAmount?: ReactNode
  availableAmount?: ReactNode
  amountError?: string
  tokenSelect?: ReactNode
  destTokenSelect?: ReactNode
  reversible?: boolean
  onRequestReverse: () => unknown
  destAccountSelect?: ReactNode
  info?: ReactNode
  onRequestTransport: () => unknown
  canTransport?: boolean
  transportInProgress?: boolean
}

const TransportForm = Object.assign(
  (props: TransportFormProps) => {
    const tokenSelect = <Suspense fallback={<TokenSelect.Skeleton />}>{props.tokenSelect}</Suspense>
    const destTokenSelect = <Suspense fallback={<TokenSelect.Skeleton />}>{props.destTokenSelect}</Suspense>

    return (
      <DexForm info={props.info}>
        <DexForm.Section header="Select account">
          <label>
            <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
              Origin account
            </Text.BodySmall>
            {props.accountSelect}
          </label>
        </DexForm.Section>
        <DexForm.Section header="Select asset">
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              [DEX_FORM_WIDE_MEDIA_SELECTOR]: { flexDirection: 'row', alignItems: 'end' },
            }}
          >
            <label css={{ flex: 1 }}>
              <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
                From
              </Text.BodySmall>
              {tokenSelect}
            </label>
            <div css={{ alignSelf: 'center', [DEX_FORM_WIDE_MEDIA_SELECTOR]: { alignSelf: 'end' } }}>
              <TransportFormNetworkButton disabled={props.reversible === false} onClick={props.onRequestReverse} />
            </div>
            <label css={{ flex: 1 }}>
              <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
                To
              </Text.BodySmall>
              {destTokenSelect}
            </label>
          </div>
        </DexForm.Section>
        <DexForm.Section header="Select amount">
          <TextInput
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            leadingLabel={
              props.availableAmount !== undefined && (
                <>
                  Available balance: <Text.BodySmall alpha="high">{props.availableAmount}</Text.BodySmall>
                </>
              )
            }
            trailingLabel={
              props.fiatAmount !== undefined && (
                <>
                  Value: <Text.BodySmall alpha="high">{props.fiatAmount}</Text.BodySmall>
                </>
              )
            }
            leadingSupportingText={
              props.amountError && <TextInput.ErrorLabel>{props.amountError}</TextInput.ErrorLabel>
            }
            value={props.amount}
            onChangeText={props.onChangeAmount}
            trailingIcon={<TextInput.LabelButton onClick={props.onRequestMaxAmount}>Max</TextInput.LabelButton>}
          />
        </DexForm.Section>
        <DexForm.CollapsibleSection header="Select destination" open disabled>
          <Details.Content>
            <label>
              <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
                Destination account
              </Text.BodySmall>
              {props.destAccountSelect}
            </label>
          </Details.Content>
        </DexForm.CollapsibleSection>
        <DexForm.ConfirmButton
          disabled={!props.canTransport}
          loading={props.transportInProgress}
          onClick={props.onRequestTransport}
          css={{ width: '100%' }}
        >
          Transport
        </DexForm.ConfirmButton>
      </DexForm>
    )
  },
  { TokenSelect, Info }
)

export default TransportForm
