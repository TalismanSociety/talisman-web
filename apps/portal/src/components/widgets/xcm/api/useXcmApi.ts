import { useAtom, useAtomValue, useSetAtom } from 'jotai'
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
import { xcmSourceChainsAtom } from './atoms/xcmSourceChainsAtom'
import { xcmTokenPickerDestAtom } from './atoms/xcmTokenPickerDestAtom'
import { xcmTokenPickerSourceAtom } from './atoms/xcmTokenPickerSourceAtom'

type Loadable = ReturnType<typeof useAtomValue<ReturnType<typeof loadable>>>

export const useXcmApi = () => {
  const allLoadables: Array<Loadable> = []

  // TODO: Provide an overall loading / error state based on the state of any loadable atoms in this hook
  const tokenPickerSourceLoadable = useAtomValue(loadable(xcmTokenPickerSourceAtom))
  const tokenPickerSource = tokenPickerSourceLoadable?.state === 'hasData' ? tokenPickerSourceLoadable.data : undefined
  const tokenPickerDestLoadable = useAtomValue(loadable(xcmTokenPickerDestAtom))
  const tokenPickerDest = tokenPickerDestLoadable?.state === 'hasData' ? tokenPickerDestLoadable.data : undefined
  allLoadables.push([tokenPickerSourceLoadable as Loadable, tokenPickerDestLoadable as Loadable])

  const sourceChainsLoadable = useAtomValue(loadable(xcmSourceChainsAtom))
  const sourceChains = sourceChainsLoadable?.state === 'hasData' ? sourceChainsLoadable.data : undefined
  const destChainsLoadable = useAtomValue(loadable(xcmDestChainsAtom))
  const destChains = destChainsLoadable?.state === 'hasData' ? destChainsLoadable.data : undefined
  allLoadables.push([sourceChainsLoadable as Loadable, destChainsLoadable as Loadable])

  const [sender, setSender] = useAtom(senderAtom)
  const [recipient, setRecipient] = useAtom(recipientAtom)
  const [sourceChain, setSourceChain] = useAtom(sourceChainAtom)
  const [destChain, setDestChain] = useAtom(destChainAtom)
  const [asset, setAsset] = useAtom(assetAtom)
  // TODO: Separate UI amount (decimals) from extrinsic amount (planck)
  const [amount, setAmount] = useAtom(amountAtom)

  const sourceAssetLoadable = useAtomValue(loadable(sourceAssetAtom))
  const sourceAsset = sourceAssetLoadable.state === 'hasData' ? sourceAssetLoadable.data : undefined
  const destAssetLoadable = useAtomValue(loadable(destAssetAtom))
  const destAsset = destAssetLoadable.state === 'hasData' ? destAssetLoadable.data : undefined
  allLoadables.push([sourceAssetLoadable as Loadable, destAssetLoadable as Loadable])

  const [canReverse, reverseRoute] = useAtom(xcmReverseRouteAtom)

  const sourceBalance = useAtomValue(xcmBalancesAtom).get(asset?.key ?? '')
  const feesLoadable = useAtomValue(loadable(feesAtom))
  const fees = feesLoadable.state === 'hasData' ? feesLoadable.data : undefined
  allLoadables.push([feesLoadable as Loadable])

  const minMaxAmountsLoadable = useAtomValue(loadable(minMaxAmountsAtom))
  const minMaxAmounts = minMaxAmountsLoadable.state === 'hasData' ? minMaxAmountsLoadable.data : undefined
  allLoadables.push([minMaxAmountsLoadable as Loadable])

  const requestMax = useSetAtom(requestMaxAtom)

  const extrinsicLoadable = useAtomValue(loadable(extrinsicAtom))
  const extrinsic = extrinsicLoadable.state === 'hasData' ? extrinsicLoadable.data : undefined
  const extrinsicError = extrinsicLoadable.state === 'hasError' ? (extrinsicLoadable.error as Error) : undefined
  allLoadables.push([extrinsicLoadable as Loadable])

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

    tokenPickerSource,
    tokenPickerDest,
    sourceChains,
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
