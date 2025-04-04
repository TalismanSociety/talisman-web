import { useTokenRates, useTokens } from '@talismn/balances-react'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { TextInput } from '@talismn/ui/molecules/TextInput'
import { PrimitiveAtom } from 'jotai'
import { HelpCircle } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { selectedCurrencyState } from '@/domains/balances/currency'
import { useTokenRatesFromUsd } from '@/hooks/useTokenRatesFromUsd'
import { cn } from '@/util/cn'
import { Decimal } from '@/util/Decimal'

import { SwappableAssetWithDecimals } from './swap-modules/common.swap-module'
import { SwapTokensModal } from './SwapTokensModal'

type Props = {
  amount?: Decimal
  assets?: SwappableAssetWithDecimals[]
  selectedAsset?: SwappableAssetWithDecimals | null
  evmAddress?: `0x${string}`
  substrateAddress?: string
  onChangeAmount?: (value: Decimal) => void
  onChangeAsset?: (asset: SwappableAssetWithDecimals | null) => void
  leadingLabel?: React.ReactNode
  availableBalance?: Decimal
  stayAliveBalance?: Decimal
  disabled?: boolean
  balances?: Record<string, Decimal>
  hideBalance?: boolean
  disableBtc?: boolean
  searchAtom: PrimitiveAtom<string>
  usdOverride?: number
}

const hardcodedGasBufferByTokenSymbol: Record<string, number> = {
  dot: 0.03,
  eth: 0.01, // same as uniswap, they give a fixed 0.01 ETH buffer regardless of the chain
}

export const TokenAmountInput: React.FC<Props> = ({
  amount,
  assets,
  availableBalance,
  balances,
  disableBtc,
  hideBalance,
  leadingLabel,
  onChangeAsset,
  selectedAsset,
  evmAddress,
  substrateAddress,
  onChangeAmount,
  stayAliveBalance,
  disabled = false,
  searchAtom,
  usdOverride,
}) => {
  const [input, setInput] = useState((amount?.planck ?? 0n) > 0n ? amount?.toString() ?? '' : '')

  const currency = useRecoilValue(selectedCurrencyState)
  const tokens = useTokens()
  const rates = useTokenRates()

  const shouldDisplayBalance = useMemo(() => {
    if (hideBalance || !selectedAsset) return false
    if (selectedAsset?.networkType === 'evm') return !!evmAddress
    return !!substrateAddress
  }, [evmAddress, hideBalance, selectedAsset, substrateAddress])

  const parseInput = useCallback(
    (value: string) => {
      if (!selectedAsset) return Decimal.fromPlanck(0, 1)
      try {
        const formattedInput = value.endsWith('.') ? `${value}0` : value
        return Decimal.fromUserInput(formattedInput, selectedAsset.decimals, { currency: selectedAsset.symbol })
      } catch (e) {
        return Decimal.fromPlanck(0, 1)
      }
    },
    [selectedAsset]
  )

  const handleChangeAsset = useCallback(
    (asset: SwappableAssetWithDecimals | null) => {
      setInput('')
      onChangeAsset?.(asset)
      onChangeAmount?.(Decimal.fromPlanck(0, asset?.decimals ?? 1))
    },
    [onChangeAmount, onChangeAsset]
  )

  const handleChangeInput = useCallback(
    (value: string) => {
      setInput(value)
      const parsedDecimal = parseInput(value)
      onChangeAmount?.(parsedDecimal)
    },
    [onChangeAmount, parseInput]
  )

  const fiatOverride = useTokenRatesFromUsd(usdOverride)

  const bestGuessRate = useMemo(() => {
    if (!selectedAsset) return null
    const confirmedRate = rates[selectedAsset.id]
    if (confirmedRate) return confirmedRate
    return Object.entries(rates ?? {}).find(([id]) => tokens[id]?.symbol === selectedAsset.symbol)?.[1]
  }, [selectedAsset, rates, tokens])

  const fiatValue = useMemo(() => {
    if (!selectedAsset) return null
    if (!bestGuessRate || amount === undefined) return fiatOverride?.[currency]
    const rateInCurrency = bestGuessRate[currency]?.price
    if (!rateInCurrency) return null
    return +amount?.toString() * rateInCurrency
  }, [amount, bestGuessRate, currency, fiatOverride, selectedAsset])

  const insufficientBalance = useMemo(() => {
    if (availableBalance === undefined || !amount) return false
    return amount.planck > (availableBalance?.planck ?? 0n)
  }, [amount, availableBalance])

  const accountWouldBeReaped = useMemo(() => {
    if (!stayAliveBalance || !amount || amount.planck === 0n) return false
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
    if (!amount) return setInput('')
    const parsedDecimal = parseInput(input)
    if (parsedDecimal.planck !== amount.planck) {
      if (amount.planck > 0n) {
        setInput(amount.toString())
      } else {
        if (parsedDecimal.planck !== 0n) {
          setInput('')
        }
      }
    }
  }, [amount, input, parseInput])

  return (
    <TextInput
      autoComplete="off"
      disabled={disabled}
      className="text-ellipsis !text-[18px] !font-semibold"
      containerClassName={cn(
        '[&>div:nth-child(2)]:!py-[8px] [&>div]:!pr-[8px] [&>div:nth-child(2)]:border [&>div:nth-child(2)]:border-red-500/0',
        {
          '[&>div:nth-child(2)]:border-red-400 ':
            insufficientBalance || (disableBtc && selectedAsset?.id === 'btc-native'),
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
      onChange={e => handleChangeInput(e.target.value)}
      textBelowInput={
        <div className="flex items-center">
          <p className="text-[10px] leading-none text-gray-400">
            {(fiatValue ?? 0)?.toLocaleString(undefined, { currency, style: 'currency' })}
          </p>
          {insufficientBalance ? (
            <p className="ml-[8px] border-l border-l-gray-600 pl-[8px] text-[10px] leading-none text-red-400">
              Insufficient balance
            </p>
          ) : accountWouldBeReaped ? (
            <div className="flex items-center gap-1 text-orange-400">
              <p className="ml-[8px] border-l border-l-gray-600 pl-[8px] text-[10px] leading-none">
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
                  <HelpCircle className="h-4 w-4" />
                </Link>
              </Tooltip>
            </div>
          ) : disableBtc && selectedAsset?.id === 'btc-native' ? (
            <p className="ml-[8px] border-l border-l-gray-600 pl-[8px] text-[10px] leading-none text-red-400">
              Swapping from BTC not supported.
            </p>
          ) : null}
        </div>
      }
      trailingIcon={
        <div className="flex items-center justify-end gap-2">
          {maxAfterGas && maxAfterGas.planck > 0 && (
            <TextInput.LabelButton
              css={{ fontSize: 12, paddingTop: 4, paddingBottom: 4 }}
              onClick={() => handleChangeInput(Decimal.fromPlanck(maxAfterGas.planck, maxAfterGas.decimals).toString())}
            >
              <p css={{ fontSize: 12, lineHeight: 1 }}>Max</p>
            </TextInput.LabelButton>
          )}
          <SwapTokensModal
            searchAtom={searchAtom}
            onSelectAsset={handleChangeAsset}
            selectedAsset={selectedAsset}
            assets={assets}
            evmAddress={evmAddress}
            substrateAddress={substrateAddress}
            balances={balances}
          />
        </div>
      }
    />
  )
}
