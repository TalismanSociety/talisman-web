import type { Account } from '../../../accounts'
import { useNativeTokenAmountState } from '../../../chains'
import { useSubstrateApiState } from '../../../common'
import { accountStakeAtom } from '../atoms/accountStake'
import { delegateInfosAtomFamily } from '../atoms/delegateInfo'
import { useAtomValue } from 'jotai'
import uniq from 'lodash/uniq'
import { useMemo } from 'react'
import { useRecoilValue_TRANSITION_SUPPORT_UNSTABLE as useRecoilValue } from 'recoil'

export type Stake = ReturnType<typeof useStake>

export const useStake = (account: Account) => {
  const api = useRecoilValue(useSubstrateApiState())
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

  const stakes = useAtomValue(accountStakeAtom({ api, address: account.address }))

  const totalStaked = useMemo(
    () => nativeTokenAmount.fromPlanckOrUndefined(stakes?.reduce((acc, stake) => acc + stake.stake, 0n)),
    [nativeTokenAmount, stakes]
  )

  const delegateAddresses = useMemo(() => uniq((stakes ?? []).map(stake => stake.hotkey)), [stakes])
  const delegateInfos = useAtomValue(delegateInfosAtomFamily({ api, delegateAddresses }))

  return { account, stakes, totalStaked, delegateInfos }
}
