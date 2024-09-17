import { SwapTokenRow } from './SwapTokenRow'
import { SwappableAssetWithDecimals } from './swap-modules/common.swap-module'
import { tokenTabAtom, tokenTabs } from './swaps.api'
import { useChains, useEvmNetworks } from '@talismn/balances-react'
import { Chain, EvmNetwork, githubUnknownChainLogoUrl, githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { Decimal } from '@talismn/math'
import { AlertDialog, SearchBar, Select, Skeleton, SurfaceButton, Tabs } from '@talismn/ui'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useAtom } from 'jotai'
import { Globe, X } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'

type Props = {
  assets?: SwappableAssetWithDecimals[]
  selectedAsset?: SwappableAssetWithDecimals | null
  onSelectAsset: (asset: SwappableAssetWithDecimals | null) => void
  evmAddress?: `0x${string}`
  substrateAddress?: string
  balances?: Record<string, Decimal>
}

export const SwapTokensModal: React.FC<Props> = ({
  assets,
  balances,
  selectedAsset,
  onSelectAsset,
  evmAddress,
  substrateAddress,
}) => {
  const [tab, setTab] = useAtom(tokenTabAtom)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const handleClose = useCallback(() => {
    setSearch('')
    setOpen(false)
  }, [])
  const chains = useChains()
  const networks = useEvmNetworks()
  const [filteredChain, setFilteredChain] = useState<string>()
  const selectedAssetChain = useMemo(
    () => (selectedAsset ? chains[selectedAsset.chainId] ?? networks[selectedAsset.chainId] : null),
    [chains, networks, selectedAsset]
  )
  const parentRef = useRef<HTMLDivElement>(null)

  const filteredAssets = useMemo(() => {
    if (!assets) return []
    return assets.filter(asset => {
      if (!search && !filteredChain) return true
      const queryMatch =
        !search ||
        asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
        asset.name.toLowerCase().includes(search.toLowerCase())
      const chainMatch = !filteredChain || `${asset.chainId}` === `${filteredChain}`
      return queryMatch && chainMatch
    })
  }, [assets, filteredChain, search])

  const rowVirtualizer = useVirtualizer({
    count: filteredAssets?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  })

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
      <AlertDialog title="Select token" onRequestDismiss={handleClose} open={open} className="!w-[60rem]">
        <div className="mb-[12px] flex flex-1 gap-[12px] w-full flex-col sm:flex-row">
          <div className="flex-1">
            <SearchBar
              placeholder="Search token name or symbol"
              value={search}
              onChangeText={setSearch}
              css={{ width: '100%' }}
              className="w-full"
            />
          </div>
          <Select
            value={uniqueChains.length === 1 ? uniqueChains[0]?.id : filteredChain}
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
        <div className="w-full overflow-hidden relative">
          {tokenTabs.length > 1 && (
            <Tabs className="overflow-y-auto no-scrollbar w-full px-[16px]">
              {tokenTabs.map(t => (
                <Tabs.Item key={t.value} value={t.value} selected={tab === t.value} onClick={() => setTab(t.value)}>
                  <p className="!text-[14px] !leading-none whitespace-nowrap !mb-[4px]">{t.label}</p>
                </Tabs.Item>
              ))}
            </Tabs>
          )}
          <div className="absolute left-0 top-0 h-full w-[20px] bg-gradient-to-r from-[#1b1b1b] to-[#1b1b1b]/0" />
          <div className="absolute right-0 top-0 h-full w-[20px] bg-gradient-to-l from-[#1b1b1b] to-[#1b1b1b]/0" />
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
                      networkName={
                        chains[asset.chainId]?.name ??
                        networks[asset.chainId]?.name ??
                        (asset.chainId === 'bitcoin' ? 'Bitcoin' : 'Unknown Chain')
                      }
                      evmAddress={evmAddress}
                      substrateAddress={substrateAddress}
                      balance={balances?.[asset.id]}
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
    </>
  )
}
