import { SwapTokensModal } from './SwapTokensModal'
import { SwappableAssetWithDecimals } from './swap-modules/common.swap-module'
import { selectedCurrencyState } from '@/domains/balances'
import { cn } from '@/lib/utils'
import { useTokenRates } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { CircularProgressIndicator, TextInput, Tooltip } from '@talismn/ui'
import { HelpCircle } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

type Props = {
  assets?: SwappableAssetWithDecimals[]
  selectedAsset?: SwappableAssetWithDecimals | null
  evmAddress?: `0x${string}`
  substrateAddress?: string
  amount?: Decimal
  onChangeAmount?: (value: Decimal) => void
  onChangeAsset?: (asset: SwappableAssetWithDecimals | null) => void
  leadingLabel?: React.ReactNode
  availableBalance?: Decimal
  stayAliveBalance?: Decimal
  disabled?: boolean
}

const hardcodedGasBufferByTokenSymbol: Record<string, number> = {
  dot: 0.03,
  eth: 0.01, // same as uniswap, they give a fixed 0.01 ETH buffer regardless of the chain
}

export const TokenAmountInput: React.FC<Props> = ({
  amount,
  assets,
  availableBalance,
  leadingLabel,
  onChangeAsset,
  selectedAsset,
  evmAddress,
  substrateAddress,
  onChangeAmount,
  stayAliveBalance,
  disabled = false,
}) => {
  const [input, setInput] = useState((amount?.planck ?? 0n) > 0n ? amount?.toString() ?? '' : '')

  const currency = useRecoilValue(selectedCurrencyState)
  const rates = useTokenRates()
  const shouldDisplayBalance = useMemo(() => {
    if (!selectedAsset) return false
    if (selectedAsset?.networkType === 'evm') return !!evmAddress
    return !!substrateAddress
  }, [evmAddress, selectedAsset, substrateAddress])

  const parsedDecimal = useMemo(() => {
    if (!selectedAsset) return Decimal.fromPlanck(0, 1)
    try {
      const formattedInput = input.endsWith('.') ? `${input}0` : input
      return Decimal.fromUserInput(formattedInput, selectedAsset.decimals, { currency: selectedAsset.symbol })
    } catch (e) {
      return Decimal.fromPlanck(0, 1)
    }
  }, [input, selectedAsset])

  const usdValue = useMemo(() => {
    if (!selectedAsset) return null
    const rate = rates[selectedAsset.id]
    if (!rate || amount === undefined) return null
    const rateInCurrency = rate[currency]
    if (!rateInCurrency) return null
    return +amount?.toString() * rateInCurrency
  }, [amount, currency, rates, selectedAsset])

  const insufficientBalance = useMemo(
    () => parsedDecimal.planck > (availableBalance?.planck ?? 0n),
    [availableBalance?.planck, parsedDecimal.planck]
  )

  const accountWouldBeReaped = useMemo(() => {
    if (!stayAliveBalance || !amount) return false
    return stayAliveBalance.planck < amount.planck
  }, [amount, stayAliveBalance])

  const maxAfterGas = useMemo(() => {
    if (!selectedAsset || !availableBalance) return null
    const idParts = selectedAsset.id.split('-')
    const assetType = idParts[idParts.length - 1]
    if (assetType === 'native') {
      const gasBuffer = hardcodedGasBufferByTokenSymbol[selectedAsset.symbol.toLowerCase()]
      if (gasBuffer) {
        const gasBufferDecimal = Decimal.fromUserInputOrUndefined(gasBuffer?.toString(), availableBalance.decimals)
        return Decimal.fromPlanck(availableBalance.planck - (gasBufferDecimal?.planck ?? 0n), availableBalance.decimals)
      }
    }
    return availableBalance
  }, [availableBalance, selectedAsset])

  useEffect(() => {
    onChangeAmount?.(parsedDecimal)
  }, [onChangeAmount, parsedDecimal])

  return (
    <TextInput
      disabled={disabled}
      className="text-ellipsis !text-[18px] !font-semibold"
      containerClassName={cn(
        '[&>div:nth-child(2)]:!py-[8px] [&>div]:!pr-[8px] [&>div:nth-child(2)]:border [&>div:nth-child(2)]:border-red-500/0',
        {
          '[&>div:nth-child(2)]:border-red-400 ': insufficientBalance,
        }
      )}
      trailingLabel={
        shouldDisplayBalance ? (
          availableBalance ? (
            `Balance: ${availableBalance.toLocaleString()}`
          ) : (
            <CircularProgressIndicator size={12} />
          )
        ) : null
      }
      leadingLabel={leadingLabel}
      value={input}
      placeholder="0.00"
      onChange={e => setInput(e.target.value)}
      textBelowInput={
        <div className="flex items-center">
          <p className="text-gray-400 text-[10px] leading-none">
            {(usdValue ?? 0)?.toLocaleString(undefined, { currency, style: 'currency' })}
          </p>
          {insufficientBalance ? (
            <p className="text-red-400 text-[10px] leading-none pl-[8px] ml-[8px] border-l border-l-gray-600">
              Insufficient balance
            </p>
          ) : accountWouldBeReaped ? (
            <div className="flex items-center gap-1 text-orange-400">
              <p className="text-[10px] leading-none pl-[8px] ml-[8px] border-l border-l-gray-600">
                Account would be reaped
              </p>

              <Tooltip
                placement="bottom"
                content={
                  <p className="text-[12px]">
                    This amount will cause your balance to go below the network's{' '}
                    <span className="text-white">Existential Deposit</span>,
                    <br />
                    which would cause your account to be reaped.
                    <br />
                    Any remaining funds in a reaped account cannot be recovered.
                  </p>
                }
              >
                <Link to="https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-">
                  <HelpCircle className="w-4 h-4" />
                </Link>
              </Tooltip>
            </div>
          ) : null}
        </div>
      }
      trailingIcon={
        <div className="flex items-center gap-2 justify-end">
          {maxAfterGas && maxAfterGas.planck > 0 && (
            <TextInput.LabelButton
              css={{ fontSize: 12, paddingTop: 4, paddingBottom: 4 }}
              onClick={() => setInput(Decimal.fromPlanck(maxAfterGas.planck, maxAfterGas.decimals).toString())}
            >
              <p css={{ fontSize: 12, lineHeight: 1 }}>Max</p>
            </TextInput.LabelButton>
          )}
          <SwapTokensModal
            onSelectAsset={a => onChangeAsset?.(a)}
            selectedAsset={selectedAsset}
            assets={assets}
            evmAddress={evmAddress}
            substrateAddress={substrateAddress}
          />
        </div>
      }
    />
  )
}
