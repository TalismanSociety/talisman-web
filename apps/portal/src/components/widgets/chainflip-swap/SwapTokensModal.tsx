import { SwapTokenRow } from './SwapTokenRow'
import { SwappableAssetWithDecimals } from './swap-modules/common.swap-module'
import { tokenTabAtom, tokenTabs } from './swaps.api'
import { cn } from '@/lib/utils'
import { useChains, useEvmNetworks } from '@talismn/balances-react'
import { Chain, EvmNetwork, githubUnknownChainLogoUrl, githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { AlertDialog, Button, CircularProgressIndicator, SearchBar, Select, Skeleton, SurfaceButton } from '@talismn/ui'
import { useDebounce } from '@talismn/utils/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { PrimitiveAtom, useAtom } from 'jotai'
import { Globe, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isAddress } from 'viem'
import * as allChains from 'viem/chains'

type Props = {
  assets?: SwappableAssetWithDecimals[]
  selectedAsset?: SwappableAssetWithDecimals | null
  onSelectAsset: (asset: SwappableAssetWithDecimals | null) => void
  evmAddress?: `0x${string}`
  substrateAddress?: string
  balances?: Record<string, Decimal>
  searchAtom: PrimitiveAtom<string>
}

export const SwapTokensModal: React.FC<Props> = ({
  assets,
  balances,
  selectedAsset,
  onSelectAsset,
  evmAddress,
  substrateAddress,
  searchAtom,
}) => {
  const [tab, setTab] = useAtom(tokenTabAtom)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useAtom(searchAtom)
  const [searchText, setSearchText] = useState(search)
  const handleClose = useCallback(() => setOpen(false), [])
  const chains = useChains()
  const networks = useEvmNetworks()
  const [filteredChain, setFilteredChain] = useState<string>()
  const selectedAssetChain = useMemo(
    () => (selectedAsset ? chains[selectedAsset.chainId] ?? networks[selectedAsset.chainId] : null),
    [chains, networks, selectedAsset]
  )
  const debouncedSearch = useDebounce(searchText, 500)

  useEffect(() => {
    setSearch(debouncedSearch)
  }, [debouncedSearch, setSearch])

  const parentRef = useRef<HTMLDivElement>(null)

  const uniqueChains = useMemo(() => {
    return Object.values(
      assets?.reduce((acc, cur) => {
        if (acc[cur.chainId]) return acc
        const chain = networks[cur.chainId] ?? chains[cur.chainId]
        if (!chain) return acc
        acc[cur.chainId.toString()] = chain
        return acc
      }, {} as Record<string, Chain | EvmNetwork>) ?? {}
    )
  }, [assets, chains, networks])

  const selectedChain = useMemo(() => {
    return uniqueChains.find(c => c.id === filteredChain)
  }, [filteredChain, uniqueChains])

  const filteredAssets = useMemo(() => {
    if (!assets) return []
    return assets.filter(asset => {
      if (!search && !selectedChain) return true
      const queryMatch =
        !search ||
        asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        (isAddress(search) && asset.contractAddress?.toLowerCase() === search.toLowerCase())
      const chainMatch = !selectedChain || `${asset.chainId}` === `${selectedChain?.id}`
      return queryMatch && chainMatch
    })
  }, [assets, search, selectedChain])

  const rowVirtualizer = useVirtualizer({
    count: filteredAssets?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
  })

  const sortedTokensByBalances = useMemo(() => {
    const sortOverride = tokenTabs.find(t => t.value === tab)?.sort
    if (!balances || sortOverride) return filteredAssets
    return filteredAssets.sort((a, b) => {
      const aBalance = balances[a.id]?.toNumber()
      const bBalance = balances[b.id]?.toNumber()
      if (aBalance === undefined || bBalance === undefined) return 0
      return bBalance - aBalance
    })
  }, [balances, filteredAssets, tab])

  return (
    <>
      <SurfaceButton
        className="!py-[4px] !px-[8px] !h-[40px] !rounded-[8px] items-center flex"
        leadingIcon={
          selectedAsset ? (
            <img
              key={selectedAsset?.image ?? githubUnknownTokenLogoUrl}
              src={selectedAsset?.image ?? githubUnknownTokenLogoUrl}
              className="w-[24px] h-[24px] min-w-[24px] rounded-full"
            />
          ) : undefined
        }
        onClick={() => setOpen(true)}
      >
        <div>
          {selectedAsset ? (
            <div className="flex items-center gap-[4px]">
              <div className="text-left">
                <p className="text-[14px] leading-none mb-[2px]">{selectedAsset.symbol}</p>
                <p className="text-[10px] text-gray-400 leading-none whitespace-nowrap max-w-[52px] overflow-hidden text-ellipsis">
                  {selectedAssetChain?.name}
                </p>
              </div>
              <X
                size={16}
                onClick={e => {
                  e.stopPropagation()
                  onSelectAsset(null)
                }}
              />
            </div>
          ) : (
            <p className="text-gray-400 text-[12px] sm:text-[14px] whitespace-nowrap">Select Token</p>
          )}
        </div>
      </SurfaceButton>
      <div className="[&>dialog>header]:hidden">
        <AlertDialog onRequestDismiss={handleClose} open={open} className="!w-[60rem]">
          <div className="mb-[8px] flex flex-1 gap-[12px] w-full flex-col sm:flex-row">
            <div className="flex-1">
              <SearchBar
                placeholder="Search token name or symbol"
                value={searchText}
                onChangeText={setSearchText}
                css={{ width: '100%' }}
                className="w-full"
              />
            </div>
            <Select
              value={uniqueChains.length === 1 ? uniqueChains[0]?.id : selectedChain?.id}
              onChangeValue={setFilteredChain}
              className="[&>button]:!rounded-[8px]"
            >
              <Select.Option value={undefined} leadingIcon={<Globe />} headlineContent="All Networks" />
              {uniqueChains.map(chain => (
                <Select.Option
                  key={chain.id}
                  value={chain.id}
                  leadingIcon={
                    <img className="w-[24px] h-[24px] rounded-full" src={chain.logo ?? githubUnknownChainLogoUrl} />
                  }
                  headlineContent={chain.name}
                />
              ))}
            </Select>
          </div>
          {search || searchText ? (
            <div className="mb-[16px] pl-[12px] flex items-center gap-[8px] [&>p]:!text-[14px] text-muted-foreground">
              {assets && search === searchText ? (
                <p>
                  Found <span className="text-white">{assets.length} tokens</span> on{' '}
                  <span className="text-white">{uniqueChains.length} networks</span>
                </p>
              ) : (
                <>
                  <CircularProgressIndicator size={16} />
                  <p>Searching</p>
                </>
              )}
            </div>
          ) : (
            <div className="w-full overflow-hidden relative mb-[16px]">
              {tokenTabs.length > 1 && (
                <div className="overflow-y-auto flex gap-[8px] no-scrollbar w-full pl-[8px] !pr-[24px]">
                  {tokenTabs.map(t => (
                    <Button
                      className={cn(
                        '!rounded-[12px] !h-max !py-[4px] !px-[12px]',
                        t.value === tab ? '!bg-primary' : '!bg-white/5 !text-gray-400'
                      )}
                      key={t.value}
                      value={t.value}
                      onClick={() => setTab(t.value)}
                    >
                      <p className="!text-[14px] !leading-none whitespace-nowrap !mt-[1px] ">{t.label}</p>
                    </Button>
                  ))}
                </div>
              )}
              <div className="absolute left-0 top-0 h-full w-[12px] bg-gradient-to-r from-[#1b1b1b] to-[#1b1b1b]/0" />
              <div className="absolute right-0 top-0 h-full w-[20px] bg-gradient-to-l from-[#1b1b1b] to-[#1b1b1b]/0" />
            </div>
          )}
          <div className="flex items-center justify-between px-[16px]">
            <p className="text-[12px] text-gray-500 w-full">Token</p>
            <p className="text-[12px] text-gray-500 w-full">Network</p>
            <p className="text-[12px] text-gray-500 w-full text-right">Balance</p>
          </div>
          <div className="flex relative w-full h-[420px]">
            <div
              className="flex flex-col w-full gap-[8px] h-[420px] relative overflow-y-auto no-scrollbar"
              ref={parentRef}
            >
              {assets ? (
                rowVirtualizer.getVirtualItems().map(item => {
                  const asset = sortedTokensByBalances[item.index]
                  if (!asset) return null
                  return (
                    <div
                      key={item.key}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${item.size}px`,
                        transform: `translateY(${item.start}px)`,
                      }}
                    >
                      <SwapTokenRow
                        asset={asset}
                        networkLogo={chains[asset.chainId]?.logo ?? networks[asset.chainId]?.logo ?? undefined}
                        networkName={
                          chains[asset.chainId]?.name ??
                          networks[asset.chainId]?.name ??
                          (asset.chainId === 'bitcoin' ? 'Bitcoin' : 'Unknown Chain')
                        }
                        erc20Address={asset.contractAddress}
                        evmAddress={evmAddress}
                        substrateAddress={substrateAddress}
                        balance={balances?.[asset.id]}
                        explorerUrl={
                          Object.values(allChains).find(c => c.id === +asset.chainId)?.blockExplorers?.default.url
                        }
                        onClick={a => {
                          setOpen(false)
                          onSelectAsset(a)
                        }}
                      />
                    </div>
                  )
                })
              ) : (
                <>
                  <Skeleton.Surface className="w-full h-[72px] rounded-[8px]" />
                  <Skeleton.Surface className="w-full h-[72px] rounded-[8px]" />
                  <Skeleton.Surface className="w-full h-[72px] rounded-[8px]" />
                  <Skeleton.Surface className="w-full h-[72px] rounded-[8px]" />
                  <Skeleton.Surface className="w-full h-[72px] rounded-[8px]" />
                </>
              )}
            </div>
            {sortedTokensByBalances.length > 5 && (
              <div className="absolute left-0 bottom-0 h-[24px] w-full bg-gradient-to-t from-[#1b1b1b] to-[#1b1b1b]/0" />
            )}
          </div>
        </AlertDialog>
      </div>
    </>
  )
}
