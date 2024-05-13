import DexForm, {
  DEX_FORM_WIDE_MEDIA_SELECTOR,
  DexFormInfoNotice,
  DexFormInfoProgressIndicator,
  TokenSelect,
  type DexFormInfoNoticeProps,
} from '../components'
import ErrorIllustration from '../components/ErrorIllustration'
import {
  DescriptionList,
  Details,
  SegmentedButton,
  Text,
  TextInput,
  TonalIconButton,
  type ButtonProps,
} from '@talismn/ui'
import { ArrowDown, FileSearch, HelpCircle, Repeat } from '@talismn/web-icons'
import { motion } from 'framer-motion'
import { Suspense, useState, type ReactNode } from 'react'

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

const Summary = Object.assign(
  (props: TransportFormSummaryProps) => (
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
  ),
  {
    ProgressIndicator: () => (
      <DexFormInfoProgressIndicator
        title="Processing transport..."
        text={
          <>
            We are processing this transport.
            <br /> It shouldn't take too long...
          </>
        }
      />
    ),
    ErrorMessage: (props: Omit<DexFormInfoNoticeProps, 'illustration'>) => (
      <DexFormInfoNotice {...props} illustration={<ErrorIllustration />} />
    ),
  }
)

type TransportFormInfoSection = 'details' | 'faq'

type BaseTransportFormInfoProps = {
  summary: ReactNode
  footer: ReactNode
  faq: ReactNode
}

export type TransportFormInfoProps =
  | BaseTransportFormInfoProps
  | (BaseTransportFormInfoProps & {
      focusedSection: TransportFormInfoSection
      onChangeFocusedSection: (section: TransportFormInfoSection) => unknown
    })

const Info = Object.assign(
  (props: TransportFormInfoProps) => {
    const [_activeSection, _setFocusedSection] = useState<'details' | 'faq'>('details')
    const focusedSection = 'focusedSection' in props ? props.focusedSection : _activeSection
    const onChangeFocusedSection = 'onChangeFocusedSection' in props ? props.onChangeFocusedSection : _setFocusedSection

    return (
      <DexForm.Info
        header={
          <DexForm.Info.Header
            actions={
              <SegmentedButton value={focusedSection} onChange={onChangeFocusedSection}>
                <SegmentedButton.ButtonSegment value="details" leadingIcon={<FileSearch />} css={{ fontSize: '1rem' }}>
                  Details
                </SegmentedButton.ButtonSegment>
                <SegmentedButton.ButtonSegment value="faq" leadingIcon={<HelpCircle />} css={{ fontSize: '1rem' }}>
                  FAQ
                </SegmentedButton.ButtonSegment>
              </SegmentedButton>
            }
          />
        }
        footer={props.footer}
      >
        {(() => {
          switch (focusedSection) {
            case 'details':
              return props.summary
            case 'faq':
              return props.faq
          }
        })()}
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
