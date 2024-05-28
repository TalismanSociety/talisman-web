import { ActivityList, type ActivityListProps } from '../Activities'
import DexForm, {
  DEX_FORM_WIDE_MEDIA_SELECTOR,
  DexFormInfoNotice,
  DexFormInfoProgressIndicator,
  TokenSelect,
  type DexFormInfoNoticeProps,
} from '../components'
import ErrorIllustration from '../components/ErrorIllustration'
import {
  CircularProgressIndicator,
  DescriptionList,
  Details,
  Hr,
  SegmentedButton,
  Text,
  TextInput,
  TonalIconButton,
} from '@talismn/ui'
import { Activity, ArrowDown, ArrowRight, FileSearch, HelpCircle, Repeat } from '@talismn/web-icons'
import { motion } from 'framer-motion'
import { Fragment, Suspense, useState, type ReactNode } from 'react'

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
      <Hr css={{ marginTop: '2.4rem', marginBottom: '2.4rem' }} />
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

type SwapFormInfoSection = 'details' | 'faq' | 'activities'

type BaseSwapFormInfoProps = {
  summary: ReactNode
  activities: ReactNode
  footer: ReactNode
  faq: ReactNode
}

export type SwapFormInfoProps =
  | BaseSwapFormInfoProps
  | (BaseSwapFormInfoProps & {
      focusedSection: SwapFormInfoSection
      onChangeFocusedSection: (section: SwapFormInfoSection) => unknown
    })

const Info = Object.assign(
  (props: SwapFormInfoProps) => {
    const [_activeSection, _setFocusedSection] = useState<'details' | 'faq' | 'activities'>('details')
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
                <SegmentedButton.ButtonSegment value="activities" leadingIcon={<Activity />} css={{ fontSize: '1rem' }}>
                  Activities
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
              return (
                props.summary ?? (
                  <DexFormInfoNotice
                    illustration={
                      <svg width="97" height="96" viewBox="0 0 97 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="48.5" cy="48" r="48" fill="url(#paint0_linear_3285_23038)" fillOpacity="0.04" />
                        <path
                          d="M26 38L34 30M34 30L42 38M34 30V58C34 60.1217 34.8429 62.1566 36.3431 63.6569C37.8434 65.1571 39.8783 66 42 66H46M70 58L62 66M62 66L54 58M62 66V38C62 35.8783 61.1571 33.8434 59.6569 32.3431C58.1566 30.8429 56.1217 30 54 30H50"
                          stroke="url(#paint1_linear_3285_23038)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_3285_23038"
                            x1="82.3182"
                            y1="-10.6667"
                            x2="0.418275"
                            y2="80.193"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#FF519F" />
                            <stop offset="1" stopColor="#47DC94" />
                          </linearGradient>
                          <linearGradient
                            id="paint1_linear_3285_23038"
                            x1="63.5"
                            y1="26"
                            x2="34"
                            y2="66"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#FF519F" />
                            <stop offset="1" stopColor="#47DC94" />
                          </linearGradient>
                        </defs>
                      </svg>
                    }
                    title="Seamless native cross-chain swaps"
                    text="Swap assets effortlessly across different chains and enjoy the convenience of fire-and-forget transactions."
                  />
                )
              )
            case 'activities':
              return props.activities
            case 'faq':
              return props.faq
          }
        })()}
      </DexForm.Info>
    )
  },
  {
    Summary,
    Activities: Object.assign(
      (props: Omit<ActivityListProps, 'placeholder'>) => (
        <ActivityList
          {...props}
          placeholder={
            <ActivityList.Placeholder title="No recent activity" text="Perform swaps to see recent activities." />
          }
        />
      ),
      { Item: ActivityList.Item }
    ),
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
