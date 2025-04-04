import type { ApiPromise } from '@polkadot/api'
import type { Option, StorageKey } from '@polkadot/types'
import type { AccountId32, Balance } from '@polkadot/types/interfaces'
import type { PalletNominationPoolsClaimPermission, PalletNominationPoolsPoolMember } from '@polkadot/types/lookup'
import { Button } from '@talismn/ui/atoms/Button'
import { Surface } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { TextInput } from '@talismn/ui/molecules/TextInput'
import { toast } from '@talismn/ui/molecules/Toaster'
import { chunk } from 'lodash'
import { Suspense, useCallback, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { TalismanHandLoader } from '@/components/legacy/TalismanHandLoader'
import { useAccountSelector } from '@/components/widgets/AccountSelector'
import { writeableSubstrateAccountsState } from '@/domains/accounts/recoils'
import { useChainState } from '@/domains/chains/hooks'
import { ChainProvider } from '@/domains/chains/provider'
import { nominationPoolsEnabledChainsState, useNativeTokenPriceState } from '@/domains/chains/recoils'
import { assertChain } from '@/domains/chains/utils'
import { AnalyticsContext } from '@/domains/common/analytics'
import { useExtrinsic } from '@/domains/common/hooks/useExtrinsic'
import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'
import { useTokenAmountState } from '@/domains/common/hooks/useTokenAmount'

const _NominationPoolsRewardsClaim = () => {
  const chain = useRecoilValue(useChainState())

  assertChain(chain, { hasNominationPools: true })

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

  const nativeTokenPrice = useRecoilValue(useNativeTokenPriceState('usd'))

  const [minClaim, setMinAmountToClaim] = useTokenAmountState(
    (1 / nativeTokenPrice).toFixed(chain.nativeToken?.decimals ?? 0)
  )

  const extrinsic = useExtrinsic(
    useCallback(
      async (api: ApiPromise) => {
        const batchSize =
          chain.genesisHash === '0xfe1b4c55fd4d668101126434206571a7838a8b6b93a6d1b95d607e78e6c53763' ? 32 : 500

        let startKey: string | undefined
        let poolMembers: Array<[StorageKey<[AccountId32]>, Option<PalletNominationPoolsPoolMember>]> = []

        while (true) {
          const page = await api.query.nominationPools.poolMembers.entriesPaged({
            args: [],
            pageSize: batchSize,
            startKey,
          })

          const last = page.at(-1)
          if (last === undefined) {
            break
          }

          startKey = api.query.nominationPools.poolMembers.key(...last[0].args)
          poolMembers = [...poolMembers, ...page]
        }

        const poolMembersToClaim =
          poolIds.length === 0
            ? poolMembers
            : poolMembers.filter(x => x[1].isSome && poolIds.includes(x[1].unwrap().poolId.toNumber()))

        toast(`Found ${poolMembersToClaim.length} members in selected pools`)

        const memberBatches = chunk(poolMembersToClaim, batchSize)

        let claimPermissions: PalletNominationPoolsClaimPermission[] = []
        for (const members of memberBatches) {
          claimPermissions = [
            ...claimPermissions,
            ...(await api.query.nominationPools.claimPermissions.multi(members.map(x => x[0].args[0]))),
          ]
        }

        // To avoid getting rate limited by Vara RPC
        // https://substrate.stackexchange.com/questions/7677/failed-to-instantiate-a-new-wasm-module-instance-limit-of-32-concurrent-instanc
        let rewards: Balance[] = []
        for (const members of memberBatches) {
          rewards = [
            ...rewards,
            ...(await Promise.all(
              members.map(async x => await api.call.nominationPoolsApi.pendingRewards(x[0].args[0]))
            )),
          ]
        }

        const exs = poolMembersToClaim
          .map((x, index) => {
            const claimable = rewards[index]
            if (
              claimable === undefined ||
              claimable.lten(0) ||
              (minClaim.decimalAmount !== undefined &&
                minClaim.decimalAmount.planck !== 0n &&
                claimable.toBigInt() < minClaim.decimalAmount.planck)
            ) {
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
      [chain.genesisHash, minClaim.decimalAmount, poolIds]
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
      <TextInput
        type="number"
        inputMode="decimal"
        leadingLabel="Minimum amount to claim"
        placeholder={`Amount in ${chain.nativeToken?.symbol ?? ''}`}
        value={minClaim.amount}
        onChangeText={setMinAmountToClaim}
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
  const chains = useRecoilValue(nominationPoolsEnabledChainsState)
  return (
    <AnalyticsContext.Provider value={{ enabled: false }}>
      <div css={{ display: 'flex', flexDirection: 'column', gap: '4.6rem', maxWidth: 768, margin: 'auto' }}>
        {chains.map(chain => (
          <ChainProvider key={chain.genesisHash} chain={chain}>
            <Suspense fallback={<TalismanHandLoader css={{ margin: 'auto' }} />}>
              <ChainAdmin />
            </Suspense>
          </ChainProvider>
        ))}
      </div>
    </AnalyticsContext.Provider>
  )
}

export default Admin
