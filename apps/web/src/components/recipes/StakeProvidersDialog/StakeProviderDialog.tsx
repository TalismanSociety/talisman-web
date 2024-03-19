import { Zap } from '@talismn/web-icons'
import { AlertDialog, Button, Hr, Surface, Text } from '@talismn/ui'
import type { PropsWithChildren, ReactNode } from 'react'

export type StakeProviderOptionProps = {
  name: ReactNode
  description: ReactNode
  onSelect: () => unknown
}

const StakeProviderOption = (props: StakeProviderOptionProps) => (
  <Surface as="div" css={{ borderRadius: '0.8rem', padding: '1.1rem 1.6rem' }}>
    <div css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
      <Text.BodyLarge as="div" alpha="high">
        {props.name}
      </Text.BodyLarge>
      <Button leadingIcon={<Zap />} onClick={props.onSelect} css={{ paddingTop: '0.8rem', paddingBottom: '0.8rem' }}>
        Stake
      </Button>
    </div>
    <Hr />
    <Text.BodySmall as="div">{props.description}</Text.BodySmall>
  </Surface>
)

export type StakeProviderDialogProps = PropsWithChildren<{
  title?: ReactNode
  onRequestDismiss: () => unknown
}>

const StakeProviderDialog = Object.assign(
  (props: StakeProviderDialogProps) => {
    return (
      <AlertDialog
        title={
          <div css={{ display: 'flex', alignItems: 'center', gap: '0.25em' }}>
            <Zap />
            {props.title}
          </div>
        }
        targetWidth="48rem"
        onRequestDismiss={props.onRequestDismiss}
      >
        <div css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>{props.children}</div>
      </AlertDialog>
    )
  },
  { Option: StakeProviderOption }
)

export default StakeProviderDialog
