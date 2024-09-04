import {
  chainflipAssetsAtom,
  chainflipAssetToSwappableAsset,
  chainflipChainsAtom,
  chainflipSwapStatusAtom,
  type ChainflipSwapActivityData,
} from '../../swap-modules/chainflip.swap-module'
import { useTokens } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { CircularProgressIndicator, SurfaceButton } from '@talismn/ui'
import { ArrowRight, ArrowUpRight, Check, X } from '@talismn/web-icons'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

export const ChainflipActivity: React.FC<{ data: ChainflipSwapActivityData; timestamp: number }> = ({
  data,
  timestamp,
}) => {
  const status = useAtomValue(chainflipSwapStatusAtom(data.id))
  const assets = useAtomValue(chainflipAssetsAtom)
  const chains = useAtomValue(chainflipChainsAtom)
  const dateObj = new Date(status.depositChannelCreatedAt ?? timestamp)

  const fromAsset = useMemo(() => assets.find(asset => asset.asset === status.srcAsset), [assets, status])
  const fromAmount = useMemo(() => {
    const amount = status.depositAmount ?? status.expectedDepositAmount
    if (!amount || !fromAsset) return null
    return Decimal.fromPlanck(amount, fromAsset.decimals, { currency: fromAsset.symbol })
  }, [status, fromAsset])

  const destAsset = useMemo(() => assets.find(asset => asset.asset === status.destAsset), [assets, status])
  const destAmount = useMemo(() => {
    if ('egressAmount' in status && destAsset) {
      return Decimal.fromPlanck(status.egressAmount, destAsset.decimals, { currency: destAsset.symbol })
    }
    return null
  }, [status, destAsset])

  const tokens = useTokens()
  const fromToken = useMemo(() => {
    if (!fromAsset) return null
    const chain = chains.find(chain => chain.chain === fromAsset.chain)
    if (!chain) return null
    const asset = chainflipAssetToSwappableAsset(fromAsset, chain)
    if (!asset) return null
    return tokens[asset.id]
  }, [chains, fromAsset, tokens])

  const destToken = useMemo(() => {
    if (!destAsset) return null
    const chain = chains.find(chain => chain.chain === destAsset.chain)
    if (!chain) return null
    const asset = chainflipAssetToSwappableAsset(destAsset, chain)
    if (!asset) return null
    return tokens[asset.id]
  }, [chains, destAsset, tokens])

  const chainflipUrl = useMemo(() => {
    switch (data.network) {
      case 'mainnet':
        return `https://scan.chainflip.io/channels/${data.id}`
      case 'perseverance':
        return `https://scan.perseverance.chainflip.io/channels/${data.id}`
      default:
        return ''
    }
  }, [data])

  return (
    <Link to={chainflipUrl} target="_blank">
      <SurfaceButton className="!rounded-[8px] min-h-[56px] !w-full [&>div]:!justify-start [&>div>span]:!w-full !px-[8px] py-[12px]">
        <div className="flex items-center w-full justify-between gap-[8px]">
          <div className="flex items-center gap-[8px]">
            <div className="flex items-center min-w-max">
              {fromToken && (
                <img src={fromToken.logo} className="w-[32px] h-[32px] border-2 border-gray-800 rounded-full" />
              )}
              {destToken && (
                <img
                  src={destToken.logo}
                  className="w-[32px] h-[32px] min-w-[32px] -ml-[12px] border-2 border-gray-800 rounded-full"
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-[4px]">
                {!status.expired && (
                  <p className="text-[14px] font-semibold text-white !leading-none whitespace-nowrap">
                    {fromAmount?.toLocaleString()}
                  </p>
                )}
                {!status.expired && <ArrowRight className="text-gray-600" size={16} />}
                {destAmount ? (
                  <p className="text-[14px] font-semibold text-white !leading-none whitespace-nowrap">
                    {destAmount.toLocaleString()}
                  </p>
                ) : status.expired ? (
                  <div className="p-[4px] px-[6px] bg-orange-500/30 rounded-full">
                    <p className="text-[12px] leading-none text-orange-300">Expired</p>
                  </div>
                ) : (
                  <CircularProgressIndicator size={12} />
                )}
              </div>
              <div className="flex items-center justify-start gap-[4px] mt-[2px]">
                {status.state === 'COMPLETE' ? (
                  <Check className="text-primary" size={12} />
                ) : status.state === 'FAILED' || status.expired ? (
                  <X className="text-red-500" size={12} />
                ) : (
                  <CircularProgressIndicator size={12} />
                )}
                <p className="text-gray-400 text-[12px] !leading-none">{dateObj.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <ArrowUpRight className="text-primary" size={20} />
        </div>
      </SurfaceButton>
    </Link>
  )
}
