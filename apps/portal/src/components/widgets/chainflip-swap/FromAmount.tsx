import { SuspensedSwapTokenSelector } from './SwapTokenSelector'
import {
  fromAddressAtom,
  fromAmountAtom,
  fromAmountInputAtom,
  fromAssetAtom,
  toAssetAtom,
  type CommonSwappableAssetType,
} from './swap-modules/common.swap-module'
import { writeableEvmAccountsState, writeableSubstrateAccountsState } from '@/domains/accounts'
import { selectedCurrencyState } from '@/domains/balances'
import { cn } from '@/lib/utils'
import { useTokenRates } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { CircularProgressIndicator, TextInput, Tooltip } from '@talismn/ui'
import { useAtom, useAtomValue } from 'jotai'
import { HelpCircle } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

const hardcodedGasBufferByTokenSymbol: Record<string, number> = {
  dot: 0.03,
  eth: 0.01, // same as uniswap, they give a fixed 0.01 ETH buffer regardless of the chain
}

export const FromAmount: React.FC<{
  // NOTE: we get this as a prop so we dont have to get this balance twice. The parent component also needs this to
  // check whether user has enough balance to swap
  availableBalance?: Decimal
  stayAliveBalance?: Decimal
  insufficientBalance?: boolean
}> = ({ availableBalance, insufficientBalance, stayAliveBalance }) => {
  const [fromAmountInput, setFromAmountInput] = useAtom(fromAmountInputAtom)
  const [fromAsset, setFromAsset] = useAtom(fromAssetAtom)
  const [toAsset, setToAsset] = useAtom(toAssetAtom)
  const fromAddress = useAtomValue(fromAddressAtom)
  const evmAccounts = useRecoilValue(writeableEvmAccountsState)
  const substrateAccounts = useRecoilValue(writeableSubstrateAccountsState)
  const fromAmount = useAtomValue(fromAmountAtom)
  const rates = useTokenRates()
  const currency = useRecoilValue(selectedCurrencyState)
  const handleSelectAsset = useCallback(
    (asset: CommonSwappableAssetType | null) => {
      // reverse
      if (toAsset) if (toAsset.id === asset?.id) setToAsset(fromAsset)
      if (fromAsset) setFromAmountInput('')
      setFromAsset(asset)
    },
    [fromAsset, setFromAmountInput, setFromAsset, setToAsset, toAsset]
  )

  const usdValue = useMemo(() => {
    if (!fromAsset) return null
    const rate = rates[fromAsset.id]
    if (!rate) return null
    const rateInCurrency = rate[currency]
    if (!rateInCurrency) return null
    return +fromAmount.toString() * rateInCurrency
  }, [currency, fromAmount, fromAsset, rates])

  const accountWouldBeReaped = useMemo(() => {
    if (!stayAliveBalance) return false
    return stayAliveBalance < fromAmount
  }, [fromAmount, stayAliveBalance])

  const maxAfterGas = useMemo(() => {
    if (!fromAsset || !availableBalance) return null
    const idParts = fromAsset.id.split('-')
    const assetType = idParts[idParts.length - 1]
    if (assetType === 'native') {
      const gasBuffer = hardcodedGasBufferByTokenSymbol[fromAsset.symbol.toLowerCase()]
      if (gasBuffer) {
        const gasBufferDecimal = Decimal.fromUserInputOrUndefined(gasBuffer?.toString(), fromAsset.decimals)
        return Decimal.fromPlanck(availableBalance.planck - (gasBufferDecimal?.planck ?? 0n), fromAsset.decimals)
      }
    }
    return availableBalance
  }, [availableBalance, fromAsset])

  return (
    <TextInput
      autoComplete="off"
      leadingLabel="You're paying"
      trailingLabel={
        fromAsset && fromAddress ? (
          availableBalance ? (
            `Balance: ${availableBalance.toLocaleString()}`
          ) : (
            <CircularProgressIndicator size={12} />
          )
        ) : null
      }
      textBelowInput={
        <div className="flex">
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
      placeholder="0.00"
      className="text-ellipsis !text-[18px] !font-semibold"
      containerClassName={cn(
        '[&>div:nth-child(2)]:!py-[8px] [&>div]:!pr-[8px] [&>div:nth-child(2)]:border [&>div:nth-child(2)]:border-red-500/0',
        {
          '[&>div:nth-child(2)]:border-red-400 ': insufficientBalance,
        }
      )}
      value={fromAmountInput}
      onChangeText={setFromAmountInput}
      inputMode="decimal"
      type="number"
      trailingIcon={
        <div className="flex items-center gap-[8px] justify-end">
          {maxAfterGas && maxAfterGas.planck > 0 && (
            <TextInput.LabelButton
              css={{ fontSize: 12, paddingTop: 4, paddingBottom: 4 }}
              onClick={() =>
                setFromAmountInput(Decimal.fromPlanck(maxAfterGas.planck, maxAfterGas.decimals).toString())
              }
            >
              <p css={{ fontSize: 12, lineHeight: 1 }}>Max</p>
            </TextInput.LabelButton>
          )}
          <SuspensedSwapTokenSelector
            balanceFor={{
              evm: fromAddress?.startsWith('0x') ? fromAddress : evmAccounts[0]?.address,
              substrate: !fromAddress || fromAddress.startsWith('0x') ? substrateAccounts[0]?.address : fromAddress,
            }}
            onSelectAsset={handleSelectAsset}
            selectedAsset={fromAsset}
          />
        </div>
      }
    />
  )
}
