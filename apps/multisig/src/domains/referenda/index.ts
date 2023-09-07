import { useCallback, useEffect, useMemo, useState } from 'react'
import { Chain } from '../chains'
import { useRecoilValueLoadable } from 'recoil'
import { pjsApiSelector } from '../chains/pjs-api'

export enum Vote {
  Aye,
  Nay,
}

export type StandardVote = {
  vote: Vote.Aye | Vote.Nay
  lockAmount: string
  conviction: number
}

export type VoteDetails = {
  referendumId?: number
  // TODO: Add AbstainVote and SplitVote
  accountVote: StandardVote
}

export interface ReferendumBasicInfo {
  index: number
  isOngoing: boolean
  isApproved: boolean
}

export const useReferenda = (chain: Chain) => {
  // TODO: use proper type for `referendum` if more complex use case is needed
  const [referendums, setReferendums] = useState<ReferendumBasicInfo[] | undefined>()
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpcs))

  const isPalletSupported = useMemo(() => {
    if (apiLoadable.state !== 'hasValue') return undefined
    return !!apiLoadable.contents.query.referenda?.referendumInfoFor && !!apiLoadable.contents.tx.convictionVoting?.vote
  }, [apiLoadable])

  const getReferendums = useCallback(async () => {
    if (apiLoadable.state !== 'hasValue') return

    // treat it as 0 referendum created if required pallets are not supported
    if (!isPalletSupported) {
      console.error(`referenda or conviction_voting pallets not supported on this chain ${chain.chainName}`)
      setReferendums([])
    } else {
      const referendumCount = await apiLoadable.contents.query.referenda.referendumCount()
      const ids = Array.from(Array(referendumCount.toNumber()).keys())
      const rawReferendums = await apiLoadable.contents.query.referenda.referendumInfoFor.multi(ids)
      setReferendums(
        rawReferendums.map((raw, index) => ({
          index,
          isApproved: raw.value.isApproved,
          isOngoing: raw.value.isOngoing,
        }))
      )
    }
  }, [apiLoadable, chain.chainName, isPalletSupported])

  // reset list of referenda data if chain is changed
  useEffect(() => {
    setReferendums(undefined)
  }, [chain.chainName])

  useEffect(() => {
    getReferendums()
  }, [getReferendums])

  return { referendums, isPalletSupported }
}
