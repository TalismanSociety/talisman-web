import { SwapTokenRow } from './SwapTokenRow'
import { SwappableAssetWithDecimals } from './swap-modules/common.swap-module'
import { tokenTabAtom, tokenTabs } from './swaps.api'
import { cn } from '@/lib/utils'
import { useChains, useEvmNetworks } from '@talismn/balances-react'
import { Chain, EvmNetwork, githubUnknownChainLogoUrl, githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { AlertDialog, Button, CircularProgressIndicator, SearchBar, Select, Skeleton, SurfaceButton } from '@talismn/ui'
import { useDebounce } from '@talismn/utils/react'
import { AlertTriangle } from '@talismn/web-icons'
import { useVirtualizer } from '@tanstack/react-virtual'
import { PrimitiveAtom, useAtom } from 'jotai'
import { Globe, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
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
  const [assetWithWarning, setAssetWithWarning] = useState<SwappableAssetWithDecimals | null>(null)
  const handleClose = useCallback(() => {
    setOpen(false)
    setAssetWithWarning(null)
  }, [])
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

  const handleSelectAsset = useCallback(
    (asset: SwappableAssetWithDecimals, showWarning: boolean) => {
      if (showWarning) {
        setAssetWithWarning(asset)
      } else {
        setAssetWithWarning(null)
        onSelectAsset(asset)
        setOpen(false)
      }
    },
    [onSelectAsset]
  )

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
          {assetWithWarning ? (
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-[8px] mb-[8px]">
                <div className="p-[8px] rounded-[8px] bg-red-600/20 w-max text-red-500">
                  <AlertTriangle />
                </div>
                <p className="text-white font-semibold">Warning</p>
              </div>
              <p className="pb-[16px] text-gray-400 text-[14px]">
                <span className="text-white">
                  {assetWithWarning.name} (${assetWithWarning.symbol})
                </span>{' '}
                isn&apos;t traded on leading U.S. centralised exchanges or frequently swapped. Always do your own
                research before proceeding.
              </p>
              <div className="border border-gray-700 w-full p-[8px] rounded-[12px] flex items-center justify-between mb-[12px]">
                <div className="flex items-center gap-[8px]">
                  <img
                    src="data:image/png;base64,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"
                    className="h-[24px] w-auto"
                  />
                  <div>
                    <p className="text-[14px] !leading-none font-semibold mb-[4px]">Token Audit Report</p>
                    <p className="text-muted-foreground text-[12px] !leading-none">Powered by GoPlus</p>
                  </div>
                </div>
                <Link
                  to={`https://gopluslabs.io/token-security/${assetWithWarning.chainId}/${assetWithWarning.contractAddress}`}
                  target="_blank"
                >
                  <Button variant="surface" className="!text-[14px] !h-max !py-[8px] !px-[12px] !rounded-[8px]">
                    View Report
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-[8px] w-full">
                <Button
                  className="!w-full !rounded-[12px]"
                  variant="secondary"
                  onClick={() => setAssetWithWarning(null)}
                >
                  Back
                </Button>
                <Button onClick={() => handleSelectAsset(assetWithWarning, false)} className="!w-full !rounded-[12px]">
                  I understand
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-[8px] flex flex-1 gap-[12px] w-full flex-col sm:flex-row">
                <div className="flex-1">
                  <SearchBar
                    placeholder="Search token name or symbol"
                    value={searchText}
                    onChangeText={setSearchText}
                    css={{ width: '100%' }}
                    className="w-full"
                    autoComplete="off"
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
                            onClick={handleSelectAsset}
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
            </>
          )}
        </AlertDialog>
      </div>
    </>
  )
}
