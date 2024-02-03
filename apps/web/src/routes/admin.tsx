import { useAccountSelector } from '@components/widgets/AccountSelector'
import { writeableSubstrateAccountsState } from '@domains/accounts'
import { ChainProvider, chainsState, useChainState } from '@domains/chains'
import { useExtrinsic, useSubstrateApiState } from '@domains/common'
import type { ApiPromise } from '@polkadot/api'
import { Button, Surface, Text, TextInput, toast } from '@talismn/ui'
import { useCallback, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

const _NominationPoolsRewardsClaim = () => {
  const chain = useRecoilValue(useChainState())
  const [[account], accountSelector] = useAccountSelector(useRecoilValue(writeableSubstrateAccountsState), 0)

  const [poolIdsInput, setPoolIdsInput] = useState(chain.talismanPools?.join(',') ?? '')

  const poolIds = useMemo(
    () =>
      poolIdsInput
        .split(',')
        .map(x => x.trim())
        .filter(x => x !== '')
        .map(x => Number(x))
        .filter(x => !Number.isNaN(x)),
    [poolIdsInput]
  )

  const extrinsic = useExtrinsic(
    useCallback(
      async (api: ApiPromise) => {
        const poolMembers = await api.query.nominationPools.poolMembers.entries()
        const poolMembersToClaim =
          poolIds.length === 0
            ? poolMembers
            : poolMembers.filter(x => x[1].isSome && poolIds.includes(x[1].unwrap().poolId.toNumber()))

        toast(`Found ${poolMembersToClaim.length} members in selected pools`)

        const claimPermissions = await api.query.nominationPools.claimPermissions.multi(
          poolMembersToClaim.map(x => x[0].args[0])
        )

        const rewards = await Promise.all(
          poolMembersToClaim.map(async x => await api.call.nominationPoolsApi.pendingRewards(x[0].args[0]))
        )

        const exs = poolMembersToClaim
          .map((x, index) => {
            const claimable = rewards[index]
            if (claimable === undefined || claimable.lten(0)) {
              return undefined
            }

            switch (claimPermissions.at(index)?.type) {
              case undefined:
              case 'Permissioned':
                return undefined
              case 'PermissionlessWithdraw':
                return api.tx.nominationPools.claimPayoutOther(x[0].args[0])
              case 'PermissionlessCompound':
              case 'PermissionlessAll':
              default:
                return api.tx.nominationPools.bondExtraOther(x[0].args[0], { Rewards: true })
            }
          })
          .filter((x): x is NonNullable<typeof x> => x !== undefined)

        toast(`Found ${exs.length} members to claim on behalf of`)

        return api.tx.utility.forceBatch(exs.slice(0, api.consts.utility.batchedCallsLimit.toNumber()))
      },
      [poolIds]
    )
  )

  return (
    <Surface
      css={{ display: 'flex', flexDirection: 'column', gap: ' 1.6rem', borderRadius: '1.6rem', padding: '1.6rem' }}
    >
      <header>Claim pool members rewards</header>
      <label>
        <Text.BodySmall as="div" css={{ marginBottom: '0.8rem' }}>
          Signer
        </Text.BodySmall>
        {accountSelector}
      </label>
      <TextInput
        leadingLabel="Pool ids to claim"
        placeholder="Pool ids separated by comma"
        value={poolIdsInput}
        onChangeText={setPoolIdsInput}
      />
      <Button
        disabled={account === undefined}
        loading={extrinsic.state === 'loading'}
        onClick={() => {
          if (account !== undefined) {
            void extrinsic.signAndSend(account.address)
          }
        }}
        css={{ width: 'auto' }}
      >
        Claim members rewards
      </Button>
    </Surface>
  )
}

const NominationPoolsRewardsClaim = () => {
  const api = useRecoilValue(useSubstrateApiState())

  if ('claimPermissions' in api.query.nominationPools) {
    return <_NominationPoolsRewardsClaim />
  }

  return null
}

const ChainAdmin = () => {
  const chain = useRecoilValue(useChainState())
  return (
    <div>
      <header css={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
        <img src={chain.logo} css={{ width: '2.4rem', aspectRatio: '1 / 1' }} />
        <Text.H3>{chain.name}</Text.H3>
      </header>
      <NominationPoolsRewardsClaim />
    </div>
  )
}

const Admin = () => {
  const chains = useRecoilValue(chainsState)
  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: '4.6rem', maxWidth: 768, margin: 'auto' }}>
      {chains.map(chain => (
        <ChainProvider key={chain.genesisHash} chain={chain}>
          <ChainAdmin />
        </ChainProvider>
      ))}
    </div>
  )
}

export default Admin
