import PoolClaimPermissionFormComponent, {
  PoolClaimPermissionDialog as PoolClaimPermissionDialogComponent,
} from '../../../recipes/PoolClaimPermissionForm'
import type { Account } from '../../../../domains/accounts'
import { assertChain, useChainState } from '../../../../domains/chains'
import { useExtrinsic, useExtrinsicInBlockOrErrorEffect } from '../../../../domains/common'
import { useQueryMultiState } from '@talismn/react-polkadot-api'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'

type PoolClaimPermissionDialogProps = {
  account: Account
  onRequestDismiss: () => unknown
}

type PoolClaimPermission = 'Permissioned' | 'PermissionlessCompound' | 'PermissionlessWithdraw' | 'PermissionlessAll'

export const toUiPermission = (
  permission: 'Permissioned' | 'PermissionlessCompound' | 'PermissionlessWithdraw' | 'PermissionlessAll'
) => {
  switch (permission) {
    case 'Permissioned':
      return undefined
    case 'PermissionlessCompound':
      return 'compound' as const
    case 'PermissionlessWithdraw':
      return 'withdraw' as const
    case 'PermissionlessAll':
      return 'all' as const
  }
}

const toSubstratePermission = (permission: 'compound' | 'withdraw' | 'all' | undefined) => {
  switch (permission) {
    case undefined:
      return 'Permissioned'
    case 'compound':
      return 'PermissionlessCompound' as const
    case 'withdraw':
      return 'PermissionlessWithdraw' as const
    case 'all':
      return 'PermissionlessAll' as const
  }
}

const PoolClaimPermissionForm = (props: { account: Account; onRequestDismiss: () => unknown }) => {
  const chain = useRecoilValue(useChainState())

  assertChain(chain, { hasNominationPools: true })

  const [poolMember, claimPermission] = useRecoilValue(
    useQueryMultiState([
      ['nominationPools.poolMembers', props.account.address],
      ['nominationPools.claimPermissions', props.account.address],
    ])
  )

  const [permission, setPermission] = useState<PoolClaimPermission>(claimPermission.type)

  const extrinsic = useExtrinsic('nominationPools', 'setClaimPermission', [permission])

  useExtrinsicInBlockOrErrorEffect(() => {
    props.onRequestDismiss()
  }, extrinsic)

  return (
    <PoolClaimPermissionFormComponent
      permission={toUiPermission(permission)}
      onChangePermission={x => setPermission(toSubstratePermission(x))}
      onSubmit={() => {
        void extrinsic.signAndSend(props.account.address)
      }}
      submitPending={extrinsic.state === 'loading'}
      isTalismanPool={
        poolMember.isSome && (chain.talismanPools?.includes(poolMember.unwrapOrDefault().poolId.toNumber()) ?? false)
      }
    />
  )
}

const PoolClaimPermissionDialog = (props: PoolClaimPermissionDialogProps) => (
  <PoolClaimPermissionDialogComponent onRequestDismiss={props.onRequestDismiss}>
    <PoolClaimPermissionForm account={props.account} onRequestDismiss={props.onRequestDismiss} />
  </PoolClaimPermissionDialogComponent>
)

type PoolClaimPermissionControlledDialogProps = {
  permission: PoolClaimPermission
  onChangePermission: (permission: PoolClaimPermission) => unknown
  poolId?: number
  onRequestDismiss: () => unknown
}

export const PoolClaimPermissionControlledDialog = (props: PoolClaimPermissionControlledDialogProps) => {
  const chain = useRecoilValue(useChainState())

  assertChain(chain, { hasNominationPools: true })

  const [permission, setPermission] = useState<PoolClaimPermission>(props.permission)

  return (
    <PoolClaimPermissionDialogComponent onRequestDismiss={props.onRequestDismiss}>
      <PoolClaimPermissionFormComponent
        permission={toUiPermission(permission)}
        onChangePermission={x => setPermission(toSubstratePermission(x))}
        onSubmit={() => {
          props.onChangePermission(permission)
          props.onRequestDismiss()
        }}
        isTalismanPool={props.poolId !== undefined && (chain.talismanPools?.includes(props.poolId) ?? false)}
      />
    </PoolClaimPermissionDialogComponent>
  )
}

export default PoolClaimPermissionDialog
