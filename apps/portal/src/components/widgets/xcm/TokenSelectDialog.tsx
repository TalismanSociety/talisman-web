import { Balances } from '@talismn/balances'
import { allBalancesAtom } from '@talismn/balances-react'
import { AlertDialog, CircularProgressIndicator, Clickable, ListItem, SearchBar, Select, Surface } from '@talismn/ui'
import { encodeAnyAddress, formatDecimals } from '@talismn/util'
import { Globe } from '@talismn/web-icons'
import BigNumber from 'bignumber.js'
import { atom, useAtomValue } from 'jotai'
import { loadable } from 'jotai/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useIntersection } from 'react-use'
import { useRecoilValue } from 'recoil'

import AssetLogoWithChain from '@/components/recipes/AssetLogoWithChain'
import ChainLogo from '@/components/recipes/ChainLogo'
import { selectedCurrencyState } from '@/domains/balances'

import type { TokenPickerAsset, TokenPickerChain } from './api/utils/xcmTokenPickerTypes'
import { senderAtom } from './api/atoms/xcmFieldsAtoms'

export type TokenSelectDialogProps = {
  assets?: TokenPickerAsset[]
  chains?: TokenPickerChain[]
  onChange: (asset: TokenPickerAsset) => void
  onRequestDismiss: () => unknown
}

export function TokenSelectDialog({ assets = [], chains = [], onChange, onRequestDismiss }: TokenSelectDialogProps) {
  const [search, setSearch] = useState('')
  const [searchChain, setSearchChain] = useState('')

  const filteredAssets = useMemo(() => {
    const normalisedSearch = search.trim().toLowerCase()

    const searchFilter: (assets: TokenPickerAsset[]) => TokenPickerAsset[] = search
      ? assets =>
          assets.filter(asset =>
            [asset.chain.name, asset.token.key, asset.token.originSymbol].some(attr =>
              attr.toLowerCase().includes(normalisedSearch)
            )
          )
      : assets => assets

    const chainFilter: (assets: TokenPickerAsset[]) => TokenPickerAsset[] = searchChain
      ? assets => assets.filter(asset => asset.chain.key === searchChain)
      : assets => assets

    return searchFilter(chainFilter(assets))
  }, [assets, search, searchChain])

  return (
    <AlertDialog
      title="Select asset"
      targetWidth="60rem"
      onRequestDismiss={onRequestDismiss}
      css={{ marginTop: '10vh', maxHeight: '80vh', minHeight: '45vh' }}
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row">
        <SearchBar
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
        {filteredAssets.map((asset, index) => (
          <Asset key={index} asset={asset} onClick={() => (onRequestDismiss(), onChange(asset))} />
        ))}
      </div>
    </AlertDialog>
  )
}

type AssetProps = {
  asset: TokenPickerAsset
  onClick: () => void
}

function Asset({ asset, onClick }: AssetProps) {
  const currency = useRecoilValue(selectedCurrencyState)

  const sender = useAtomValue(senderAtom)
  const balancesByLoadable = useAtomValue(loadable(sender ? balancesBySenderByAsset : balancesByAssetAtom))
  const balancesBy = balancesByLoadable?.state === 'hasData' ? balancesByLoadable.data : undefined

  const [tokens, setTokens] = useState<string | undefined>(undefined)
  const [fiat, setFiat] = useState<number | undefined>(undefined)

  // This calculation is scheduled outside of the render (i.e. it is in an effect), and it is also split into three pieces
  // so that we can abort it when the user is scrolling quickly (and this element isn't rendered on-screen for very long)
  useEffect(() => {
    const abort = new AbortController()

    void (async () => {
      const balancesKey = sender
        ? `${encodeAnyAddress(sender)}:${asset.chaindataId}:${asset.token.originSymbol.toLowerCase()}`
        : `${asset.chaindataId}:${asset.token.originSymbol.toLowerCase()}`
      const balances = await delayExec(() => balancesBy?.get(balancesKey))
      if (abort.signal.aborted) return
      if (!balances) {
        setTokens('0.0')
        setFiat(0)
        return
      }

      const tokens = await delayExec(() =>
        balances.each.reduce((sum, b) => sum.plus(b.transferable.tokens), new BigNumber(0)).toString()
      )
      if (abort.signal.aborted) return

      const fiat = await delayExec(() => balances.sum.fiat(currency).total)
      if (abort.signal.aborted) return

      setTokens(tokens)
      setFiat(fiat)
    })()

    return () => abort.abort()
  }, [asset.chaindataId, asset.token.originSymbol, balancesBy, currency, sender])

  // only render visible items to improve performance
  const refContainer = useRef<HTMLDivElement>(null)
  const intersection = useIntersection(refContainer, {
    root: null,
    rootMargin: '1000px',
  })

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
                  {tokens ? (
                    <>
                      {formatDecimals(tokens)}&nbsp;{asset.token.originSymbol}
                    </>
                  ) : (
                    <CircularProgressIndicator size="1em" />
                  )}
                </div>
              }
              supportingContent={fiat ? fiat?.toLocaleString(undefined, { currency, style: 'currency' }) : null}
            />
          </Surface>
        </Clickable.WithFeedback>
      ) : (
        <Clickable.WithFeedback className="w-full" onClick={onClick}>
          <Surface className="grid w-full grid-cols-3 items-center gap-[4px] rounded-[8px] p-[16px] sm:gap-[8px]">
            <div className="flex items-center gap-3">
              <div className="h-[40px] w-[40px] animate-pulse rounded-full bg-gray-600" />
              <div className="h-[1em] w-[50px] animate-pulse rounded-sm bg-gray-600" />
            </div>
            <div className="h-[1em] w-[80px] animate-pulse rounded-sm bg-gray-600" />
            <div className="flex flex-col items-end gap-2 justify-self-end">
              <div className="h-[1em] w-[70px] animate-pulse rounded-sm bg-gray-600" />
              <div className="h-[1em] w-[60px] animate-pulse rounded-sm bg-gray-600" />
            </div>
          </Surface>
        </Clickable.WithFeedback>
      )}
    </div>
  )
}

/** allBalances is organised by asset here so that this work isn't duplicated by every <Asset /> */
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

/** allBalances is organised by sender by asset here so that this work isn't duplicated by every <Asset /> */
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

/** Schedule a computation to be run `delayMs` in the future. */
const delayExec = async <T,>(callback: () => T, delayMs = 20): Promise<T> =>
  await new Promise((resolve, reject) =>
    setTimeout(() => {
      try {
        resolve(callback())
      } catch (e) {
        reject(e)
      }
    }, delayMs)
  )
