import { useBalances } from '@talismn/balances-react'
import { Button, OutlinedButton } from '@talismn/ui/atoms/Button'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'
import { formatDecimals } from '@talismn/util'
import { ArrowRight } from '@talismn/web-icons'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { formatUnits } from 'viem'

import SeekLogo from '@/assets/seek.svg?react'
import { writeableEvmAccountsState } from '@/domains/accounts/recoils'
import { cn } from '@/util/cn'

import { DECIMALS, DEEK_TICKER, DEEK_TOKEN_ADDRESS } from './constants'
import { useGetSeekDiscount } from './hooks/useGetSeekDiscount'
import { useGetSeekStaked } from './hooks/useGetSeekStaked'

type GetDiscountDialogProps = {
  isOpen: boolean
  onToggleIsOpen: () => void
}
export const GetDiscountDialog = ({ isOpen, onToggleIsOpen }: GetDiscountDialogProps) => {
  const navigate = useNavigate()
  const allBalances = useBalances()
  const ethAccounts = useRecoilValue(writeableEvmAccountsState)

  const seekBalances = allBalances.find(b => b.tokenId === `137-evm-erc20-${DEEK_TOKEN_ADDRESS}`)

  const totalAvailable = useMemo(
    () =>
      seekBalances?.each.reduce((acc, t) => {
        if (!ethAccounts.find(a => a.address === t.address)) return acc
        return acc + t.total.planck
      }, 0n) ?? 0n,
    [seekBalances, ethAccounts]
  )

  const totalAvailableFormatted = formatDecimals(formatUnits(totalAvailable, DECIMALS))

  const {
    data: { totalStaked },
  } = useGetSeekStaked()
  const {
    tier: { discount },
  } = useGetSeekDiscount()

  const discountPercent = `${discount * 100}%`

  const hasSeekStaked = totalStaked.amount > 0n

  return (
    <AlertDialog
      open={isOpen}
      title="Get dTao Fee Discounts "
      targetWidth="50rem"
      dismissButton={<OutlinedButton onClick={() => navigate('staking/providers')}>Stake {DEEK_TICKER}</OutlinedButton>}
      confirmButton={
        <Button
          onClick={() => {
            open('https://talisman.xyz/', '_blank', 'noopener,noreferrer')
          }}
        >
          Buy {DEEK_TICKER}
        </Button>
      }
      onRequestDismiss={onToggleIsOpen}
    >
      <div className="flex flex-col gap-10 text-gray-400">
        <div>
          Stake {DEEK_TICKER} to enjoy fee discounts on your subnet staking transactions.{' '}
          <a
            className="inline-flex items-center justify-center gap-1 text-white"
            href="https://talisman.xyz/"
            target="_blank"
            rel="noreferrer"
          >
            <span>Learn more</span>
            <ArrowRight size={14} />
          </a>
        </div>
        <div className="flex justify-between  rounded-[10px] bg-gray-800 p-6">
          <div className="flex gap-4">
            <SeekLogo className="h-[42px] w-[42px] rounded-full" />
            <div>
              <div className="text-white">{DEEK_TICKER}</div>
              <div className="text-[14px]">
                Available: {totalAvailableFormatted} {DEEK_TICKER}
              </div>
            </div>
          </div>
          {hasSeekStaked && (
            <div>
              <div className="text-white">
                {totalStaked.amountFormatted} {DEEK_TICKER}
              </div>
              <div className="text-end text-[14px]">Staked</div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-white">{hasSeekStaked ? 'Applied Discount' : 'Get Discounts'}</div>

          <div className={cn('rounded-[43px] px-4 py-1', !discount && 'bg-[#D5FF5C] bg-opacity-[0.1]')}>
            <div className="text-[14px] text-[#D5FF5C]">{hasSeekStaked ? discountPercent : 'Up to 25%'} off fees</div>
          </div>
        </div>
      </div>
    </AlertDialog>
  )
}
