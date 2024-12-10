import { Balances } from '@talismn/balances'
import { allBalancesAtom } from '@talismn/balances-react'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { Clickable } from '@talismn/ui/atoms/Clickable'
import { Surface } from '@talismn/ui/atoms/Surface'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'
import { ListItem } from '@talismn/ui/molecules/ListItem'
import { SearchBar } from '@talismn/ui/molecules/SearchBar'
import { Select } from '@talismn/ui/molecules/Select'
import { encodeAnyAddress, formatDecimals } from '@talismn/util'
import { Globe } from '@talismn/web-icons'
import BigNumber from 'bignumber.js'
import { atom, useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useIntersection } from 'react-use'
import { useRecoilValue } from 'recoil'

import { AssetLogoWithChain } from '@/components/recipes/AssetLogoWithChain'
import { ChainLogo } from '@/components/recipes/ChainLogo'
import { selectedCurrencyState } from '@/domains/balances/currency'

import type { TokenPickerAsset, TokenPickerAssetWithBalance, TokenPickerChain } from './api/utils/xcmTokenPickerTypes'
import { senderAtom } from './api/atoms/xcmFieldsAtoms'

export type TokenSelectDialogProps = {
  title?: ReactNode
  assets?: TokenPickerAsset[]
  chains?: TokenPickerChain[]
  onChange: (asset: TokenPickerAsset) => void
  onRequestDismiss: () => unknown
}

export function TokenSelectDialog({
  title = 'Select asset',
  assets = [],
  chains = [],
  onChange,
  onRequestDismiss,
}: TokenSelectDialogProps) {
  const [search, setSearch] = useState('')
  const [searchChain, setSearchChain] = useState('')

  const sortedAssets = useBalanceSortedAssets(assets)
  const filterSortedAssets = useMemo(() => {
    const normalisedSearch = search.trim().toLowerCase()

    const searchFilter: (assets: TokenPickerAssetWithBalance[]) => TokenPickerAssetWithBalance[] = search
      ? assets =>
          assets.filter(asset =>
            `${asset.chain.name}${asset.token.key}${asset.token.originSymbol}`.toLowerCase().includes(normalisedSearch)
          )
      : assets => assets

    const chainFilter: (assets: TokenPickerAssetWithBalance[]) => TokenPickerAssetWithBalance[] = searchChain
      ? assets => assets.filter(asset => asset.chain.key === searchChain)
      : assets => assets

    return searchFilter(chainFilter(sortedAssets))
  }, [sortedAssets, search, searchChain])

  return (
    <AlertDialog
      title={title}
      targetWidth="60rem"
      onRequestDismiss={onRequestDismiss}
      css={{ marginTop: '10vh', maxHeight: '80vh', minHeight: '45vh' }}
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row">
        <SearchBar
          autoFocus
          containerClassName="flex-grow lg:w-3/5 [&>div]:!rounded-[8px]"
          value={search}
          onChangeText={setSearch}
        />
        <Select
          className="flex-grow truncate lg:w-2/5 [&>button]:!h-full [&>button]:!rounded-[8px]"
          value={searchChain}
          onChangeValue={setSearchChain}
        >
          <Select.Option value={''} leadingIcon={<Globe size="24" />} headlineContent="All Networks" />
          {chains.map(chain => (
            <Select.Option
              key={chain.key}
              value={chain.key}
              leadingIcon={<ChainLogo className="text-[24px]" chainId={chain.chaindataId} />}
              headlineContent={chain.name}
            />
          ))}
        </Select>
      </div>
      <div className="flex max-h-[60dvh] flex-col gap-4 overflow-y-auto">
        {filterSortedAssets.map((asset, index) => (
          <Asset key={index} asset={asset} onClick={() => (onRequestDismiss(), onChange(asset))} />
        ))}
      </div>
    </AlertDialog>
  )
}

type AssetProps = {
  asset: TokenPickerAssetWithBalance
  onClick: () => void
}

function Asset({ asset, onClick }: AssetProps) {
  const currency = useRecoilValue(selectedCurrencyState)

  // only render visible items to improve performance
  const refContainer = useRef<HTMLDivElement>(null)
  const intersection = useIntersection(refContainer, {
    root: null,
    rootMargin: '1000px',
  })

  // preload token logo
  const imgRef = useRef<HTMLImageElement>()
  useEffect(() => {
    imgRef.current = new Image()
    imgRef.current.src = asset.chaindataTokenLogo ?? ''
  }, [asset.chaindataTokenLogo])

  return (
    <div ref={refContainer}>
      {intersection?.isIntersecting ? (
        <Clickable.WithFeedback className="w-full" onClick={onClick}>
          <Surface className="grid w-full grid-cols-3 gap-[4px] rounded-[8px] p-[16px] sm:gap-[8px]">
            <ListItem
              className="!w-full !p-0"
              css={{ flex: 1, padding: 0 }}
              leadingContent={
                <AssetLogoWithChain chainId={asset.chaindataId} assetLogoUrl={asset.chaindataTokenLogo} />
              }
              headlineContent={<span className="text-[14px]">{asset.token.originSymbol}</span>}
              supportingContent={
                asset.token.key.toLowerCase() !== asset.token.originSymbol.toLowerCase() ? (
                  <span className="text-[12px]">{asset.token.key}</span>
                ) : undefined
              }
            />
            <ListItem
              className="!w-full !p-0"
              headlineContent={<span className="text-[12px] sm:text-[14px]">{asset.chain.name}</span>}
            />
            <ListItem
              css={{ flex: 1, padding: 0, textAlign: 'end' }}
              headlineContent={
                <div className="flex justify-end">
                  {asset.tokens ? (
                    <>
                      {formatDecimals(asset.tokens)}&nbsp;{asset.token.originSymbol}
                    </>
                  ) : (
                    <CircularProgressIndicator size="1em" />
                  )}
                </div>
              }
              supportingContent={asset.fiat?.toLocaleString(undefined, { currency, style: 'currency' })}
            />
          </Surface>
        </Clickable.WithFeedback>
      ) : (
        <Clickable.WithFeedback className="w-full" onClick={onClick}>
          <Surface className="grid w-full grid-cols-3 items-center gap-[4px] rounded-[8px] p-[16px] sm:gap-[8px]">
            <div className="flex items-center gap-3">
              <div className="h-[40px] w-[40px] animate-pulse rounded-full bg-gray-600" />
              <div className="h-[1em] w-[50px] animate-pulse rounded bg-gray-600" />
            </div>
            <div className="h-[1em] w-[80px] animate-pulse rounded bg-gray-600" />
            <div className="flex flex-col items-end gap-2 justify-self-end">
              <div className="h-[1em] w-[70px] animate-pulse rounded bg-gray-600" />
              <div className="h-[1em] w-[60px] animate-pulse rounded bg-gray-600" />
            </div>
          </Surface>
        </Clickable.WithFeedback>
      )}
    </div>
  )
}

const useBalanceSortedAssets = (assets: TokenPickerAsset[]) => {
  const currency = useRecoilValue(selectedCurrencyState)
  const sender = useAtomValue(senderAtom)

  const balanceSortedAssetsAtom = useMemo(
    () =>
      atom(get => {
        const balancesByAtom = sender ? balancesBySenderByAsset : balancesByAssetAtom
        const balancesByLoadable = get(loadable(balancesByAtom))
        const balancesBy = balancesByLoadable?.state === 'hasData' ? balancesByLoadable.data : undefined
        if (!balancesBy)
          return assets.map<TokenPickerAssetWithBalance>(asset => ({ ...asset, tokens: undefined, fiat: undefined }))

        const addBalanceToAsset = (asset: TokenPickerAsset): TokenPickerAssetWithBalance => {
          const balancesKey = sender
            ? `${encodeAnyAddress(sender)}:${asset.chaindataId}:${asset.token.originSymbol.toLowerCase()}`
            : `${asset.chaindataId}:${asset.token.originSymbol.toLowerCase()}`
          const balances = balancesBy?.get(balancesKey)

          if (!balances) return { ...asset, tokens: '0.0', fiat: asset.chaindataCoingeckoId ? 0 : undefined }
          return {
            ...asset,
            tokens: balances.each.reduce((sum, b) => sum.plus(b.transferable.tokens), new BigNumber(0)).toString(),
            fiat: asset.chaindataCoingeckoId ? balances.sum.fiat(currency).total : undefined,
          }
        }

        const sortAssetsByBalance = (a: TokenPickerAssetWithBalance, b: TokenPickerAssetWithBalance) =>
          (b.fiat ?? 0) - (a.fiat ?? 0)

        return assets.map(addBalanceToAsset).sort(sortAssetsByBalance)
      }),
    [sender, assets, currency]
  )

  return useAtomValue(balanceSortedAssetsAtom)
}

/** allBalances is organised by asset here so that this work is done only once instead of once per asset */
const balancesByAssetAtom = atom(async get => {
  const allBalances = await get(allBalancesAtom)
  const byAsset = new Map<string, Balances>()
  allBalances.each.map(b => {
    const key = `${b.chainId}:${b.token?.symbol.toLowerCase()}`
    if (!byAsset.has(key)) byAsset.set(key, new Balances([]))
    byAsset.set(key, byAsset.get(key)!.add(b))
  })
  return byAsset
})

/** allBalances is organised by sender by asset here so that this work is done only once instead of once per asset */
const balancesBySenderByAsset = atom(async get => {
  const allBalances = await get(allBalancesAtom)
  const bySenderByAsset = new Map<string, Balances>()
  allBalances.each.map(b => {
    const key = `${encodeAnyAddress(b.address)}:${b.chainId}:${b.token?.symbol.toLowerCase()}`
    if (!bySenderByAsset.has(key)) bySenderByAsset.set(key, new Balances([]))
    bySenderByAsset.set(key, bySenderByAsset.get(key)!.add(b))
  })
  return bySenderByAsset
})
