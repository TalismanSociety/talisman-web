import {
  Button,
  CircularProgressIndicator,
  DescriptionList,
  Details,
  Surface,
  SurfaceButton,
  Text,
  useTheme,
  type ButtonProps,
} from '@talismn/ui'
import { type PropsWithChildren, type ReactNode } from 'react'

export const DEX_FORM_WIDE_MEDIA_SELECTOR = `@media(min-width: 76rem)`

export type DexFormTokenSelectProps = {
  name: ReactNode
  chain: ReactNode

  onClick: () => unknown
} & ({ iconSrc: string } | { icon: ReactNode })

export const TokenSelect = Object.assign(
  (props: DexFormTokenSelectProps) => (
    <div css={{ minWidth: '11rem' }}>
      <SurfaceButton
        leadingIcon={
          'icon' in props ? props.icon : <img src={props.iconSrc} css={{ width: '2.4rem', height: '2.4rem' }} />
        }
        onClick={props.onClick}
        css={{ width: '100%', padding: '0.5rem 0.8rem' }}
      >
        <div css={{ textAlign: 'start' }}>
          <Text.BodySmall as="div" alpha="high">
            {props.name}
          </Text.BodySmall>
          <Text.BodySmall as="div">{props.chain}</Text.BodySmall>
        </div>
      </SurfaceButton>
    </div>
  ),
  {
    Skeleton: () => (
      <TokenSelect name="..." chain="..." icon={<CircularProgressIndicator size="2.4rem" />} onClick={() => {}} />
    ),
  }
)

export type DexFormSummaryProps = PropsWithChildren

const Summary = Object.assign(
  (props: DexFormSummaryProps) => {
    const theme = useTheme()

    return (
      <section
        css={{
          display: 'flex',
          flexDirection: 'column',
          border: `2px solid ${theme.color.outlineVariant}`,
          borderRadius: '1.2rem',
          padding: '1.6rem',
          [DEX_FORM_WIDE_MEDIA_SELECTOR]: {
            width: '36rem',
            borderLeft: `64px solid transparent`,
            borderRadius: '0 1.2rem 1.2rem 0',
            '> div': {
              marginLeft: '-64px',
            },
          },
        }}
      >
        {props.children}
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

export type DexFormProps = PropsWithChildren<{ summary: ReactNode }>

const DexForm = Object.assign(
  (props: DexFormProps) => {
    return (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.6rem',
          [DEX_FORM_WIDE_MEDIA_SELECTOR]: {
            flexDirection: 'row',
            gap: 0,
          },
        }}
      >
        <section css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>{props.children}</section>
        {props.summary}
      </div>
    )
  },
  {
    Section: (props: PropsWithChildren<{ header: ReactNode }>) => (
      <Surface css={{ borderRadius: '1.6rem', padding: '1.6rem' }}>
        <header css={{ marginBottom: '0.8rem' }}>
          <Text.H4>{props.header}</Text.H4>
        </header>
        {props.children}
      </Surface>
    ),
    CollapsibleSection: (props: PropsWithChildren<{ header: ReactNode; open?: boolean; disabled?: boolean }>) => (
      <Details css={{ padding: '1.6rem' }} open={props.open} disabled={props.disabled}>
        <Details.Summary>
          <Text.H4>{props.header}</Text.H4>
        </Details.Summary>
        <Details.Content>{props.children}</Details.Content>
      </Details>
    ),
    ConfirmButton: (props: ButtonProps) => <Button {...props} css={{ width: '100%' }} />,
    Summary,
  }
)

export default DexForm
