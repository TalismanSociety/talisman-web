import {
  Button,
  DescriptionList,
  Details,
  IconButton,
  Surface,
  SurfaceButton,
  SurfaceChip,
  Text,
  TextInput,
  TonalIconButton,
  useTheme,
} from '@talismn/ui'
import { ArrowDown, HelpCircle, X } from '@talismn/web-icons'
import { useState, type PropsWithChildren, type ReactNode } from 'react'

export type SwapFormTokenSelectProps = {
  name: ReactNode
  chain: ReactNode
  iconSrc: string
  onClick: () => unknown
}

const TokenSelect = (props: SwapFormTokenSelectProps) => (
  <SurfaceButton
    leadingIcon={<img src={props.iconSrc} css={{ width: '2.4rem', height: '2.4rem' }} />}
    onClick={props.onClick}
    css={{ padding: '0.5rem 0.8rem' }}
  >
    <div css={{ textAlign: 'start' }}>
      <Text.BodySmall as="div" alpha="high">
        {props.name}
      </Text.BodySmall>
      <Text.BodySmall as="div">{props.chain}</Text.BodySmall>
    </div>
  </SurfaceButton>
)

export type SwapFormSummaryProps = {
  descriptions?: ReactNode
  footer: ReactNode
  faq: ReactNode
}

const Summary = Object.assign(
  (props: SwapFormSummaryProps) => {
    const theme = useTheme()

    const [_faqVisible, setFaqVisible] = useState(false)
    const faqVisible = props.descriptions === undefined || _faqVisible

    return (
      <section
        css={{
          display: 'flex',
          flexDirection: 'column',
          border: `2px solid ${theme.color.outlineVariant}`,
          borderRadius: '1.2rem',
          padding: '1.6rem',
          [WIDE_MEDIA_SELECTOR]: {
            width: '36rem',
            borderLeft: `64px solid transparent`,
            borderRadius: '0 1.2rem 1.2rem 0',
            '> div': {
              marginLeft: '-64px',
            },
          },
        }}
      >
        <div css={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
          <header css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text.H4>{faqVisible ? 'FAQ' : 'Details'}</Text.H4>
            {props.descriptions === undefined ? (
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
          {faqVisible ? props.faq : props.descriptions}
          {props.footer}
        </div>
      </section>
    )
  },
  {
    DescriptionList: Object.assign(
      (props: PropsWithChildren) => <DescriptionList emphasis="details">{props.children}</DescriptionList>,
      {
        Description: (props: { term: ReactNode; details: ReactNode }) => (
          <DescriptionList.Description>
            <DescriptionList.Term>{props.term}</DescriptionList.Term>
            <DescriptionList.Details>{props.details}</DescriptionList.Details>
          </DescriptionList.Description>
        ),
      }
    ),
    Faq: Object.assign(
      (props: PropsWithChildren) => (
        <section css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>{props.children}</section>
      ),
      {
        Question: (props: { question: ReactNode; answer: ReactNode }) => (
          <Details>
            <Details.Summary>{props.question}</Details.Summary>
            <Details.Content>{props.answer}</Details.Content>
          </Details>
        ),
      }
    ),
    Footer: (props: PropsWithChildren) => <div {...props} css={{ alignSelf: 'center', marginTop: 'auto' }} />,
  }
)

const WIDE_MEDIA_SELECTOR = `@media(min-width: 76rem)`

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
  onChangeDestAmount: (value: string) => unknown
  reversible?: boolean
  onRequestReverse: () => unknown
  destAccountSelect?: ReactNode
  summary?: ReactNode
}

const SwapForm = Object.assign(
  (props: SwapFormProps) => {
    return (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.6rem',
          [WIDE_MEDIA_SELECTOR]: {
            flexDirection: 'row',
            gap: 0,
          },
        }}
      >
        <section css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <Surface css={{ borderRadius: '1.6rem', padding: '1.6rem' }}>
            <header css={{ marginBottom: '0.8rem' }}>
              <Text.H4>Select account</Text.H4>
            </header>
            <label>
              <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
                Origin account
              </Text.BodySmall>
              {props.accountSelect}
            </label>
          </Surface>
          <Surface css={{ borderRadius: '1.6rem', padding: '1.6rem' }}>
            <header css={{ marginBottom: '0.8rem' }}>
              <Text.H4>Select asset</Text.H4>
            </header>
            <div css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div css={{ display: 'flex', '> *': { flex: 1 }, [WIDE_MEDIA_SELECTOR]: { display: 'none' } }}>
                {props.tokenSelect}
              </div>
              <TextInput
                type="number"
                inputMode="decimal"
                leadingLabel="Available balance"
                trailingLabel={props.availableAmount}
                placeholder="0.00"
                trailingIcon={
                  <div css={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <TextInput.LabelButton onClick={props.onRequestMaxAmount}>Max</TextInput.LabelButton>
                    <div css={{ display: 'none', [WIDE_MEDIA_SELECTOR]: { display: 'revert' } }}>
                      {props.tokenSelect}
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
                <TonalIconButton size="4.8rem">
                  <ArrowDown />
                </TonalIconButton>
              </div>
              <div css={{ display: 'flex', '> *': { flex: 1 }, [WIDE_MEDIA_SELECTOR]: { display: 'none' } }}>
                {props.destTokenSelect}
              </div>
              <TextInput
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                trailingIcon={
                  <div css={{ display: 'none', [WIDE_MEDIA_SELECTOR]: { display: 'revert' } }}>
                    {props.destTokenSelect}
                  </div>
                }
                value={props.destAmount}
                onChangeText={props.onChangeDestAmount}
                css={{ fontSize: '1.8rem' }}
                disabled
              />
            </div>
          </Surface>
          <Details css={{ padding: '1.6rem' }}>
            <Details.Summary>
              <Text.H4>Select destination</Text.H4>
            </Details.Summary>
            <Details.Content>
              <label>
                <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
                  Destination account
                </Text.BodySmall>
                {props.destAccountSelect}
              </label>
            </Details.Content>
          </Details>
          <Button css={{ width: '100%' }}>Swap</Button>
        </section>
        {props.summary}
      </div>
    )
  },
  { TokenSelect, Summary }
)

export default SwapForm
