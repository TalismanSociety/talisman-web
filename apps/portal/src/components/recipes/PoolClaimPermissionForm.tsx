import type { PropsWithChildren } from 'react'
import { useTheme } from '@emotion/react'
import { Button } from '@talismn/ui/atoms/Button'
import { RadioButton } from '@talismn/ui/atoms/RadioButton'
import { Surface } from '@talismn/ui/atoms/Surface'
import { Switch } from '@talismn/ui/atoms/Switch'
import { Text } from '@talismn/ui/atoms/Text'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'
import { HiddenDetails } from '@talismn/ui/molecules/HiddenDetails'
import { Calculate, Info } from '@talismn/web-icons'
import { createContext, Suspense, useContext } from 'react'

import { TalismanHandLoader } from '@/components/legacy/TalismanHandLoader'

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
        !props.checked && {
          opacity: theme.contentAlpha.disabled / 2,
          ':hover': { opacity: theme.contentAlpha.medium },
        },
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
  isTalismanPool: boolean
  loading?: boolean
}

export const PoolClaimPermissionForm = (props: PoolClaimPermissionFormProps) => {
  const context = useContext(Context)
  const onRequestDismiss = props.onRequestDismiss ?? context.onRequestDismiss

  return (
    <div>
      <div className="flex items-center gap-2" css={{ marginBottom: '1.6rem' }}>
        <label className="flex items-center gap-2">
          <Switch
            checked={props.permission !== undefined}
            onChange={event => props.onChangePermission(event.target.checked ? 'compound' : undefined)}
          />
          {props.isTalismanPool ? 'Enable auto claiming' : 'Enable permissionless claiming'}
        </label>
        <Tooltip
          content={
            <>
              Allow others to re-stake on your behalf, powering your stake with auto-compounding.
              <br />
              Permissionless claiming is only guaranteed for members of Talisman pools that opt-in.
            </>
          }
        >
          <Info size="1em" css={{ verticalAlign: 'middle' }} />
        </Tooltip>
      </div>
      <Surface
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.6rem',
          borderRadius: '1.6rem',
          padding: '1.6rem',
          '@media(min-width: 768px)': {
            flexDirection: 'row',
          },
        }}
      >
        <PermissionOption
          name={props.isTalismanPool ? 'Auto compound' : 'Allow compound'}
          description={
            props.isTalismanPool
              ? 'Your rewards will be re-staked for you daily'
              : 'Allow anyone to compound rewards on your behalf'
          }
          checked={props.permission === 'compound'}
          onCheck={() => props.onChangePermission('compound')}
        />
        <PermissionOption
          name={props.isTalismanPool ? 'Auto withdraw' : 'Allow withdraw'}
          description={
            props.isTalismanPool
              ? 'Your rewards will be paid to your account daily'
              : 'Allow anyone to withdraw rewards on your behalf'
          }
          checked={props.permission === 'withdraw'}
          onCheck={() => props.onChangePermission('withdraw')}
        />
        <PermissionOption
          name={props.isTalismanPool ? 'Let Talisman decide' : 'Allow all'}
          description={
            props.isTalismanPool
              ? 'Right now this is the same as the "Auto compound" option'
              : 'Allow anyone to withdraw rewards on your behalf'
          }
          checked={props.permission === 'all'}
          onCheck={() => props.onChangePermission('all')}
        />
      </Surface>
      <div css={{ display: 'flex', gap: '1.6rem', marginTop: '4.6rem', '> *': { flex: 1 } }}>
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
      <div className="flex items-center gap-2">
        <Calculate />
        Claim method
      </div>
    }
    targetWidth="77rem"
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
              isTalismanPool={false}
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
