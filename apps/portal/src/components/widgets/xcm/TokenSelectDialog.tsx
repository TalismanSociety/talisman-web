import type { Decimal } from '@talismn/math'
import { AlertDialog, Clickable, ListItem, SearchBar, Select, Skeleton, Surface } from '@talismn/ui'
import { Globe } from '@talismn/web-icons'
import { useMemo, useRef, useState } from 'react'
import { useIntersection } from 'react-use'
import { useRecoilValue } from 'recoil'

import type { UseFastBalanceProps } from '@/hooks/useFastBalance'
import AssetLogoWithChain from '@/components/recipes/AssetLogoWithChain'
import ChainLogo from '@/components/recipes/ChainLogo'
import { selectedCurrencyState } from '@/domains/balances'
import { useFastBalance } from '@/hooks/useFastBalance'

import type { TokenPickerAsset, TokenPickerChain } from './api/utils/xcmTokenPickerTypes'

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
  // const fastBalance = useFastBalance(props.balanceFetcher)
  // const currency = useRecoilValue(selectedCurrencyState)

  // const value = useMemo(() => {
  //   if (props.rates === undefined) return null
  //   const balance = fastBalance?.balance?.transferrable ?? props.defaultBalanceDecimal
  //   if (balance === undefined) return <Skeleton.Surface className="ml-auto h-[18px] w-[50px]" />
  //   return (props.rates * balance.toNumber()).toLocaleString(undefined, { currency, style: 'currency' })
  // }, [currency, fastBalance, props.defaultBalanceDecimal, props.rates])

  // const balanceUI = useMemo(() => {
  //   const balance = fastBalance?.balance?.transferrable ?? props.defaultBalanceDecimal
  //   if (balance === undefined) return <Skeleton.Surface className="h-[21px] w-[70px]" />
  //   return balance.toLocaleString(undefined, { maximumFractionDigits: 4 })
  // }, [fastBalance?.balance, props.defaultBalanceDecimal])

  // only render visible items to improve performance
  const refContainer = useRef<HTMLDivElement>(null)
  const intersection = useIntersection(refContainer, {
    root: null,
    rootMargin: '1000px',
  })

  return (
    <div ref={refContainer} className="min-h-[72px]">
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
            {/* {props.balanceFetcher || props.defaultBalanceDecimal ? ( */}
            <ListItem
              css={{ flex: 1, padding: 0, textAlign: 'end' }}
              headlineContent={
                // TODO: use @talismn/balances
                // in this context, `balances` is only valid for the sourceChain that we are connected to
                <>
                  {asset.balance?.toDecimal().toString() ?? 0} {asset.token.originSymbol}
                </>
              }
              supportingContent={asset.balance?.toDecimal().toString()}
            />
            {/* ) : null} */}
          </Surface>
        </Clickable.WithFeedback>
      ) : null}
    </div>
  )
}
