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

export type DexFormInfoNoticeProps = {
  illustration: ReactNode
  title: ReactNode
  text: ReactNode
}

export const DexFormInfoNotice = (props: DexFormInfoNoticeProps) => {
  const theme = useTheme()
  return (
    <article
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.8rem',
        border: `1px solid color-mix(in srgb, ${theme.color.outlineVariant}, transparent 60%)`,
        borderRadius: '0.8rem',
        padding: '1.6rem',
        textAlign: 'center',
      }}
    >
      {props.illustration}
      <Text.BodyLarge as="header" alpha="high">
        {props.title}
      </Text.BodyLarge>
      <Text.Body>{props.text}</Text.Body>
    </article>
  )
}

export type DexFormInfoProgressIndicatorProps = {
  title: ReactNode
  text: ReactNode
}

export const DexFormInfoProgressIndicator = (props: DexFormInfoProgressIndicatorProps) => (
  <article
    css={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.8rem',
      borderRadius: '0.8rem',
      padding: '7.2rem 1.6rem',
      textAlign: 'center',
    }}
  >
    <CircularProgressIndicator size="3.2rem" />
    <Text.BodyLarge as="header" alpha="high">
      {props.title}
    </Text.BodyLarge>
    <Text.Body alpha="disabled">{props.text}</Text.Body>
  </article>
)

export type DexFormInfoProps = PropsWithChildren<{ header: ReactNode; footer?: ReactNode }>

const Info = Object.assign(
  (props: DexFormInfoProps) => {
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
            width: '40rem',
            borderLeft: `64px solid transparent`,
            borderRadius: '0 1.2rem 1.2rem 0',
            '> div': {
              marginLeft: '-64px',
            },
          },
        }}
      >
        <div css={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
          {props.header}
          <div
            css={{
              display: 'contents',
              flex: 1,
              overflow: 'auto',
              [DEX_FORM_WIDE_MEDIA_SELECTOR]: { display: 'revert' },
            }}
          >
            <div
              css={{
                display: 'contents',
                height: 0,
                minHeight: '100%',
                [DEX_FORM_WIDE_MEDIA_SELECTOR]: { display: 'revert' },
              }}
            >
              {props.children}
            </div>
          </div>
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
      (props: PropsWithChildren & { footer?: ReactNode }) => (
        <section css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {props.children}
          {props.footer}
        </section>
      ),
      {
        Question: (props: { question: ReactNode; answer: ReactNode }) => (
          <Details>
            <Details.Summary>{props.question}</Details.Summary>
            <Details.Content>{props.answer}</Details.Content>
          </Details>
        ),
        Footer: (props: { discordUrl: string }) => (
          <Text.Body alpha="disabled" css={{ textAlign: 'center', marginTop: '2.4rem' }}>
            Still need help? Reach out to us on our{' '}
            <Text
              as="a"
              alpha="high"
              href={props.discordUrl}
              target="_blank"
              css={theme => ({ color: theme.color.primary, whiteSpace: 'nowrap' })}
            >
              Discord channel
            </Text>
            .
          </Text.Body>
        ),
      }
    ),
    Header: (props: { actions: ReactNode }) => (
      <header css={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>{props.actions}</header>
    ),
    Footer: (props: PropsWithChildren) => <Text.BodySmall alpha="disabled" {...props} css={{ textAlign: 'center' }} />,
  }
)

export type DexFormProps = PropsWithChildren<{ info: ReactNode }>

const DexForm = Object.assign(
  (props: DexFormProps) => {
    return (
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.6rem',
          width: 'min(50rem, 100%)',
          [DEX_FORM_WIDE_MEDIA_SELECTOR]: {
            flexDirection: 'row',
            gap: 0,
            width: 'revert',
          },
        }}
      >
        <section
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            [DEX_FORM_WIDE_MEDIA_SELECTOR]: { width: '50rem' },
          }}
        >
          {props.children}
        </section>
        {props.info}
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
    Info,
  }
)

export default DexForm
