import { Zap } from '@talismn/icons'
import { AlertDialog, Button, Surface, Text } from '@talismn/ui'
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
      <Button leadingIcon={<Zap />} onClick={props.onSelect}>
        Stake
      </Button>
    </div>
    <Text.Body as="div">{props.description}</Text.Body>
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
        width="48rem"
        onRequestDismiss={props.onRequestDismiss}
      >
        <div css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>{props.children}</div>
      </AlertDialog>
    )
  },
  { Option: StakeProviderOption }
)

export default StakeProviderDialog