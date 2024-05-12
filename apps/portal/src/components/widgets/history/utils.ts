import { type Account } from '../../../domains/accounts'
import { encodeAnyAddress } from '@talismn/util'
import BigNumber from 'bignumber.js'
import type { ExtrinsicsQuery } from '../../../../generated/gql/extrinsicHistory/gql/graphql'

export type ExtrinsicNode = ExtrinsicsQuery['extrinsics']['edges'][number]['node']

export const getExtrinsicTotalAmount = (extrinsic: ExtrinsicNode, accounts: Account[]) => {
  const encodedAddresses = accounts.map(x => encodeAnyAddress(x.address)) ?? []
  return [...extrinsic.transfers.edges, ...extrinsic.rewards.edges]
    .map(x => x.node)
    .filter(
      x =>
        encodedAddresses.includes(encodeAnyAddress(x.debit)) ||
        (x.credit !== 'reserve' && encodedAddresses.includes(encodeAnyAddress(x.credit)))
    )
    .reduce((prev, curr) => prev.plus(curr.amount.value), new BigNumber(0))
}

export const getExtrinsicBalanceChangeAmount = (extrinsic: ExtrinsicNode, accounts: Account[]) => {
  const encodedAddresses = accounts.map(x => encodeAnyAddress(x.address)) ?? []
  return [...extrinsic.transfers.edges, ...extrinsic.rewards.edges]
    .map(x => x.node)
    .reduce(
      (prev, curr) =>
        encodedAddresses.includes(encodeAnyAddress(curr.debit))
          ? prev.plus(curr.amount.value)
          : encodedAddresses.includes(encodeAnyAddress(curr.credit))
          ? prev.minus(curr.amount.value)
          : prev,
      new BigNumber(0)
    )
}
