import {
  CircularProgressIndicator,
  DescriptionList,
  Details,
  IconButton,
  SurfaceChip,
  Text,
  TextInput,
  TonalIconButton,
} from '@talismn/ui'
import { ArrowDown, ArrowRight, HelpCircle, Repeat, X } from '@talismn/web-icons'
import { motion } from 'framer-motion'
import { Fragment, Suspense, useState, type ReactNode } from 'react'
import DexForm, {
  DEX_FORM_WIDE_MEDIA_SELECTOR,
  DexFormInfoNotice,
  DexFormInfoProgressIndicator,
  TokenSelect,
  type DexFormInfoNoticeProps,
} from '../components'
import ErrorIllustration from '../components/ErrorIllustration'

export type SwapFormSummaryProps = {
  route: Array<{ iconSrc: string }>
  descriptions: ReactNode
}

const Summary = Object.assign(
  (props: SwapFormSummaryProps) => (
    <>
      <DescriptionList emphasis="details">
        <DescriptionList.Description>
          <DescriptionList.Term>Route</DescriptionList.Term>
          <DescriptionList.Details>
            <span css={{ fontSize: '1.8rem' }}>
              {props.route?.map((vertex, index) => (
                <Fragment key={index}>
                  <img src={vertex.iconSrc} css={{ width: '1em', height: '1em' }} />
                  {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
                  {index < props.route.length - 1 && (
                    <span>
                      {' '}
                      <ArrowRight size="1em" />{' '}
                    </span>
                  )}
                </Fragment>
              ))}
            </span>
          </DescriptionList.Details>
        </DescriptionList.Description>
      </DescriptionList>
      {props.descriptions}
    </>
  ),
  {
    DescriptionList: DexForm.Info.DescriptionList,
    ProgressIndicator: () => (
      <DexFormInfoProgressIndicator
        title="Obtaining quote..."
        text={
          <>
            We are processing this swap.
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

export type SwapFormInfoProps = {
  summary?: ReactNode
  footer: ReactNode
  faq: ReactNode
}

const Info = Object.assign(
  (props: SwapFormInfoProps) => {
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
    Summary,
    Faq: DexForm.Info.Faq,
    Footer: DexForm.Info.Footer,
  }
)

export type SwapFormProps = {
  accountSelect: ReactNode
  amount: string
  onChangeAmount: (value: string) => unknown
  onRequestMaxAmount: () => unknown
  availableAmount?: ReactNode
  amountError?: string
  tokenSelect?: ReactNode
  destAmount: string
  destTokenSelect?: ReactNode
  reversible?: boolean
  onRequestReverse: () => unknown
  destAccountSelect?: ReactNode
  info?: ReactNode
  onRequestSwap: () => unknown
  canSwap?: boolean
  swapInProgress?: boolean
}

const SwapForm = Object.assign(
  (props: SwapFormProps) => {
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
          <div css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div css={{ display: 'flex', '> *': { flex: 1 }, [DEX_FORM_WIDE_MEDIA_SELECTOR]: { display: 'none' } }}>
              {tokenSelect}
            </div>
            <TextInput
              type="number"
              inputMode="decimal"
              leadingLabel="Available balance"
              trailingLabel={
                <Suspense fallback={<CircularProgressIndicator size="1em" />}>{props.availableAmount}</Suspense>
              }
              placeholder="0.00"
              trailingIcon={
                <div css={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <TextInput.LabelButton onClick={props.onRequestMaxAmount}>Max</TextInput.LabelButton>
                  <div css={{ display: 'none', [DEX_FORM_WIDE_MEDIA_SELECTOR]: { display: 'revert' } }}>
                    {tokenSelect}
                  </div>
                </div>
              }
              hasSupportingText
              leadingSupportingText={
                props.amountError && <TextInput.ErrorLabel>{props.amountError}</TextInput.ErrorLabel>
              }
              value={props.amount}
              onChangeText={props.onChangeAmount}
              css={{ fontSize: '1.8rem' }}
            />
            <div css={{ display: 'flex', justifyContent: 'center' }}>
              <motion.div initial="false" whileHover={'true'}>
                <TonalIconButton size="4.8rem" onClick={props.onRequestReverse} css={{ marginTop: '-2.2rem' }}>
                  <motion.div variants={{ false: { rotate: 0 }, true: { rotate: 90 } }} css={{ display: 'flex' }}>
                    {/* Display transition doesn't work properly https://github.com/framer/motion/issues/2563 */}
                    <motion.div
                      variants={{
                        false: { transitionEnd: { display: 'none' } },
                        true: { transitionEnd: { display: 'flex' } },
                      }}
                    >
                      <Repeat />
                    </motion.div>
                    <motion.div
                      variants={{
                        false: { transitionEnd: { display: 'flex' } },
                        true: { transitionEnd: { display: 'none' } },
                      }}
                    >
                      <ArrowDown />
                    </motion.div>
                  </motion.div>
                </TonalIconButton>
              </motion.div>
            </div>
            <div css={{ display: 'flex', '> *': { flex: 1 }, [DEX_FORM_WIDE_MEDIA_SELECTOR]: { display: 'none' } }}>
              {destTokenSelect}
            </div>
            <TextInput
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              trailingIcon={
                <div css={{ display: 'none', [DEX_FORM_WIDE_MEDIA_SELECTOR]: { display: 'revert' } }}>
                  {destTokenSelect}
                </div>
              }
              value={props.destAmount}
              css={{ fontSize: '1.8rem' }}
              disabled
            />
          </div>
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
          disabled={!props.canSwap}
          loading={props.swapInProgress}
          onClick={props.onRequestSwap}
          css={{ width: '100%' }}
        >
          Swap
        </DexForm.ConfirmButton>
      </DexForm>
    )
  },
  { TokenSelect, Info }
)

export default SwapForm
