import { Button, OutlinedButton } from '@talismn/ui/atoms/Button'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'
import { ArrowRight } from '@talismn/web-icons'
import { useNavigate } from 'react-router-dom'

import SeekLogo from '@/assets/seek.svg?react'
import useGetSeekAvailableBalance from '@/components/widgets/staking/providers/hooks/seek/useGetSeekAvailableBalance'
import { cn } from '@/util/cn'

import useGetSeekStaked from '../../../components/widgets/staking/providers/hooks/seek/useGetSeekStaked'
import { SEEK_TICKER } from './constants'
import { useGetSeekDiscount } from './hooks/useGetSeekDiscount'

const GET_SEEK_LINK = 'https://docs.talisman.xyz/talisman/seek/get-seek'

type GetDiscountDialogProps = {
  isOpen: boolean
  onToggleIsOpen: () => void
}
export const GetDiscountDialog = ({ isOpen, onToggleIsOpen }: GetDiscountDialogProps) => {
  const navigate = useNavigate()
  const { totalAvailableFormatted } = useGetSeekAvailableBalance()

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
      dismissButton={<OutlinedButton onClick={() => navigate('staking/providers')}>Stake {SEEK_TICKER}</OutlinedButton>}
      confirmButton={
        <Button
          onClick={() => {
            open(GET_SEEK_LINK, '_blank', 'noopener,noreferrer')
          }}
        >
          Buy {SEEK_TICKER}
        </Button>
      }
      onRequestDismiss={onToggleIsOpen}
    >
      <div className="flex flex-col gap-10 text-gray-400">
        <div>
          Stake {SEEK_TICKER} to enjoy fee discounts on your subnet staking transactions.{' '}
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
              <div className="text-white">{SEEK_TICKER}</div>
              <div className="text-[14px]">
                Available: {totalAvailableFormatted} {SEEK_TICKER}
              </div>
            </div>
          </div>
          {hasSeekStaked && (
            <div>
              <div className="text-white">
                {totalStaked.amountFormatted} {SEEK_TICKER}
              </div>
              <div className="text-end text-[14px]">Staked</div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-white">{hasSeekStaked ? 'Applied Discount' : 'Get Discounts'}</div>

          <div className={cn('rounded-[43px] px-4 py-1', !discount && 'bg-[#D5FF5C] bg-opacity-[0.1]')}>
            <div className="text-[14px] text-[#D5FF5C]">{hasSeekStaked ? discountPercent : 'Up to 15%'} off fees</div>
          </div>
        </div>
      </div>
    </AlertDialog>
  )
}
