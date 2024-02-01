import { TalismanHandLoader } from '@components/TalismanHandLoader'
import { useTheme } from '@emotion/react'
import { Calculate, Info } from '@talismn/icons'
import { AlertDialog, Button, HiddenDetails, RadioButton, Surface, Switch, Text, Tooltip } from '@talismn/ui'
import { Suspense, type PropsWithChildren, createContext, useContext } from 'react'

const Context = createContext({ isSkeleton: false, onRequestDismiss: undefined as (() => unknown) | undefined })

type PermissionOptionProps = {
  checked?: boolean
  name: string
  description: string
  onCheck: () => unknown
}

const PermissionOption = (props: PermissionOptionProps) => {
  const theme = useTheme()
  return (
    <div
      onClick={props.onCheck}
      css={[
        {
          flex: 1,
          border: `1.4px solid ${theme.color.onBackground}`,
          borderRadius: '1.2rem',
          padding: '1.6rem',
          cursor: 'pointer',
        },
        !props.checked && { opacity: theme.contentAlpha.disabled / 2 },
      ]}
    >
      <header css={{ marginBottom: '1.6rem' }}>
        <Text.BodyLarge alpha="high" as="div" css={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>{props.name}</div>
          <RadioButton checked={props.checked === true} />
        </Text.BodyLarge>
      </header>
      <Text.BodySmall as="div">{props.description}</Text.BodySmall>
    </div>
  )
}

export type PoolClaimPermission = 'compound' | 'withdraw' | 'all' | undefined

type PoolClaimPermissionFormProps = {
  permission: PoolClaimPermission
  onChangePermission: (permission: PoolClaimPermission) => unknown
  onSubmit: () => unknown
  submitPending?: boolean
  onRequestDismiss?: () => unknown
  loading?: boolean
}

const PoolClaimPermissionForm = (props: PoolClaimPermissionFormProps) => {
  const context = useContext(Context)
  const onRequestDismiss = props.onRequestDismiss ?? context.onRequestDismiss

  return (
    <div>
      <div css={{ marginBottom: '1.6rem' }}>
        <label>
          <Switch
            checked={props.permission !== undefined}
            onChange={event => props.onChangePermission(event.target.checked ? 'compound' : undefined)}
          />{' '}
          Enable permissionless claiming
        </label>{' '}
        <Tooltip content="foo">
          <Info size="1em" />
        </Tooltip>
      </div>
      <Surface
        css={{
          'display': 'flex',
          'flexDirection': 'column',
          'gap': '1.6rem',
          'borderRadius': '1.6rem',
          'padding': '1.6rem',
          '@media(min-width: 768px)': {
            flexDirection: 'row',
          },
        }}
      >
        <PermissionOption
          name="Allow compound"
          description="Allow anyone to compound rewards on your behalf"
          checked={props.permission === 'compound'}
          onCheck={() => props.onChangePermission('compound')}
        />
        <PermissionOption
          name="Allow withdraw"
          description="Allow anyone to withdraw rewards on your behalf"
          checked={props.permission === 'withdraw'}
          onCheck={() => props.onChangePermission('withdraw')}
        />
        <PermissionOption
          name="Allow all"
          description="Allow anyone to compound or withdraw rewards on your behalf"
          checked={props.permission === 'all'}
          onCheck={() => props.onChangePermission('all')}
        />
      </Surface>
      <div css={{ 'display': 'flex', 'gap': '1.6rem', 'marginTop': '4.6rem', '> *': { flex: 1 } }}>
        {onRequestDismiss && (
          <Button disabled={context.isSkeleton} variant="outlined" onClick={onRequestDismiss}>
            Cancel
          </Button>
        )}
        <Button disabled={context.isSkeleton} loading={props.submitPending} onClick={props.onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  )
}

type PoolClaimPermissionDialogProps = PropsWithChildren<{
  onRequestDismiss: () => unknown
}>

export const PoolClaimPermissionDialog = (props: PoolClaimPermissionDialogProps) => (
  <AlertDialog
    title={
      <>
        <Calculate /> Claim method
      </>
    }
    width="77rem"
    {...props}
  >
    <Suspense
      fallback={
        <Context.Provider value={{ isSkeleton: true, onRequestDismiss: props.onRequestDismiss }}>
          <HiddenDetails hidden overlay={<TalismanHandLoader />}>
            <PoolClaimPermissionForm
              permission={undefined}
              onChangePermission={() => {}}
              onSubmit={() => {}}
              onRequestDismiss={props.onRequestDismiss}
            />
          </HiddenDetails>
        </Context.Provider>
      }
    >
      <Context.Provider value={{ isSkeleton: false, onRequestDismiss: props.onRequestDismiss }}>
        {props.children}
      </Context.Provider>
    </Suspense>
  </AlertDialog>
)

export default PoolClaimPermissionForm
