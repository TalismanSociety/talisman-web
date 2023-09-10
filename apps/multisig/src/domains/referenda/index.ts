import { useCallback, useEffect, useMemo, useState } from 'react'
import { Chain } from '../chains'
import { useRecoilValueLoadable } from 'recoil'
import { pjsApiSelector } from '../chains/pjs-api'
import { ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

export type StandardVoteParams = {
  balance: BN
  vote: {
    aye: boolean
    conviction: number
  }
}

export type SplitVoteParams = {
  aye: BN
  nay: BN
}

export type SplitAbstainVoteParams = {
  abstain: BN
} & SplitVoteParams

export type VoteDetails = {
  referendumId?: number
  details: {
    Standard?: StandardVoteParams
    Split?: SplitVoteParams
    SplitAbstain?: SplitAbstainVoteParams
  }
}

type ReferendumBasicInfo = {
  index: number
  isOngoing: boolean
  isApproved: boolean
}

export const defaultVoteDetails: Required<VoteDetails['details']> = {
  Standard: {
    balance: new BN(0),
    vote: {
      aye: true,
      conviction: 1,
    },
  },
  Split: {
    aye: new BN(0),
    nay: new BN(0),
  },
  SplitAbstain: {
    aye: new BN(0),
    nay: new BN(0),
    abstain: new BN(0),
  },
}

export const isVoteFeatureSupported = (api: ApiPromise) =>
  !!api.query.referenda?.referendumInfoFor && !!api.tx.convictionVoting?.vote

export const useReferenda = (chain: Chain) => {
  const [referendums, setReferendums] = useState<ReferendumBasicInfo[] | undefined>()
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(chain.rpcs))

  const isPalletSupported = useMemo(() => {
    if (apiLoadable.state !== 'hasValue') return undefined
    return isVoteFeatureSupported(apiLoadable.contents)
  }, [apiLoadable])

  const getReferendums = useCallback(async () => {
    if (apiLoadable.state !== 'hasValue' || isPalletSupported === undefined) return

    if (!isPalletSupported) {
      console.error(`referenda or conviction_voting pallets not supported on this chain ${chain.chainName}`)
      // treat it as 0 referendum created if required pallets are not supported
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

  // reset list of referendums if chain is changed
  useEffect(() => {
    setReferendums(undefined)
  }, [chain.chainName])

  useEffect(() => {
    getReferendums()
  }, [getReferendums])

  return { referendums, isPalletSupported }
}

export const isVoteDetailsComplete = (voteDetails: VoteDetails) => {
  if (voteDetails.referendumId === undefined) return false

  if (voteDetails.details.Standard) {
    const { balance } = voteDetails.details.Standard
    return balance.gt(new BN(0))
  }
  return !!voteDetails.details.Split || !!voteDetails.details.SplitAbstain
}

/** Expects conviction string (e.g. Locked1x, Locked2x, ..., or None) */
export const mapConvictionToIndex = (conviction: string): number => {
  const convictionValue = parseInt(conviction.replace('Locked', '').replace('x', ''))
  return isNaN(convictionValue) ? 0 : convictionValue
}
