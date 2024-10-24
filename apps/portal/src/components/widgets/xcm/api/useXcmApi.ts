import { ExtractAtomValue, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { loadable } from 'jotai/utils'
import { useMemo } from 'react'

import { destAssetAtom } from './atoms/destAssetAtom'
import { extrinsicAtom } from './atoms/extrinsicAtom'
import { feesAtom } from './atoms/feesAtom'
import { minMaxAmountsAtom } from './atoms/minMaxAmountsAtom'
import { requestMaxAtom } from './atoms/requestMaxAtom'
import { sourceAssetAtom } from './atoms/sourceAssetAtom'
import { xcmAutoselectEffect } from './atoms/xcmAutoselectEffect'
import { xcmBalancesAtom } from './atoms/xcmBalancesAtom'
import { xcmDestChainsAtom } from './atoms/xcmDestChainsAtom'
import {
  amountAtom,
  assetAtom,
  destChainAtom,
  recipientAtom,
  senderAtom,
  sourceChainAtom,
} from './atoms/xcmFieldsAtoms'
import { xcmReverseRouteAtom } from './atoms/xcmReverseRouteAtom'
import { xcmSourceChainsBySenderAtom } from './atoms/xcmSourceChainsAtom'
import { xcmTokenPickerDestAtom } from './atoms/xcmTokenPickerDestAtom'
import { xcmTokenPickerSourceBySenderAtom } from './atoms/xcmTokenPickerSourceAtom'

export const useXcmApi = () => {
  const allLoadables: Array<ExtractAtomValue<ReturnType<typeof loadable>>> = []

  const tokenPickerSourceBySenderLoadable = useAtomValue(loadable(xcmTokenPickerSourceBySenderAtom))
  const tokenPickerSourceBySender =
    tokenPickerSourceBySenderLoadable?.state === 'hasData' ? tokenPickerSourceBySenderLoadable.data : undefined
  const tokenPickerDestLoadable = useAtomValue(loadable(xcmTokenPickerDestAtom))
  const tokenPickerDest = tokenPickerDestLoadable?.state === 'hasData' ? tokenPickerDestLoadable.data : undefined
  allLoadables.push(...[tokenPickerSourceBySenderLoadable, tokenPickerDestLoadable])

  const sourceChainsBySenderLoadable = useAtomValue(loadable(xcmSourceChainsBySenderAtom))
  const sourceChainsBySender =
    sourceChainsBySenderLoadable?.state === 'hasData' ? sourceChainsBySenderLoadable.data : undefined
  const destChainsLoadable = useAtomValue(loadable(xcmDestChainsAtom))
  const destChains = destChainsLoadable?.state === 'hasData' ? destChainsLoadable.data : undefined
  allLoadables.push(...[sourceChainsBySenderLoadable, destChainsLoadable])

  const [sender, setSender] = useAtom(senderAtom)
  const [recipient, setRecipient] = useAtom(recipientAtom)
  const [sourceChain, setSourceChain] = useAtom(sourceChainAtom)
  const [destChain, setDestChain] = useAtom(destChainAtom)
  const [asset, setAsset] = useAtom(assetAtom)
  const [amount, setAmount] = useAtom(amountAtom)

  const sourceAssetLoadable = useAtomValue(loadable(sourceAssetAtom))
  const sourceAsset = sourceAssetLoadable.state === 'hasData' ? sourceAssetLoadable.data : undefined
  const destAssetLoadable = useAtomValue(loadable(destAssetAtom))
  const destAsset = destAssetLoadable.state === 'hasData' ? destAssetLoadable.data : undefined
  allLoadables.push(...[sourceAssetLoadable, destAssetLoadable])

  const [canReverse, reverseRoute] = useAtom(xcmReverseRouteAtom)

  const sourceBalance = useAtomValue(xcmBalancesAtom).get(asset?.key ?? '')
  const feesLoadable = useAtomValue(loadable(feesAtom))
  const fees = feesLoadable.state === 'hasData' ? feesLoadable.data : undefined
  allLoadables.push(feesLoadable)

  const minMaxAmountsLoadable = useAtomValue(loadable(minMaxAmountsAtom))
  const minMaxAmounts = minMaxAmountsLoadable.state === 'hasData' ? minMaxAmountsLoadable.data : undefined
  allLoadables.push(minMaxAmountsLoadable)

  const requestMax = useSetAtom(requestMaxAtom)

  const extrinsicLoadable = useAtomValue(loadable(extrinsicAtom))
  const extrinsic = extrinsicLoadable.state === 'hasData' ? extrinsicLoadable.data : undefined
  const extrinsicError = extrinsicLoadable.state === 'hasError' ? (extrinsicLoadable.error as Error) : undefined
  allLoadables.push(extrinsicLoadable)

  const loading = useMemo(
    () => allLoadables.some(loadable => loadable.state === 'loading'),
    allLoadables // eslint-disable-line react-hooks/exhaustive-deps
  )

  useAtom(xcmAutoselectEffect)

  return {
    sender,
    setSender,
    recipient,
    setRecipient,
    sourceChain,
    setSourceChain,
    destChain,
    setDestChain,
    asset,
    setAsset,
    amount,
    setAmount,
    requestMax,

    tokenPickerSourceBySender,
    tokenPickerDest,
    sourceChainsBySender,
    destChains,
    sourceAsset,
    destAsset,
    canReverse,
    reverseRoute,

    sourceBalance,
    fees,
    minMaxAmounts,
    extrinsic,
    extrinsicError,
    loading,
  }
}
