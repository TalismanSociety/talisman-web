import { OutlinedButton } from '@talismn/ui/atoms/Button'
import { useState } from 'react'

import { SEEK_TICKER } from './constants'
import { GetDiscountDialog } from './GetDiscountDialog'

export const SeekDiscountBanner = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  return (
    <>
      <div className="rounded-[10px] bg-gradient-to-r from-[#767A25] to-[#1B1B1B] to-[120%] p-[1px] text-[14px]">
        <div className="from-33.33% flex  w-full rounded-[10px] bg-gradient-to-b from-[#1B1B1B] to-[#767A25] to-[287%] p-5">
          <div className="flex items-center justify-center">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <div className="font-bold">Get Discounts</div>
                <div className="rounded-[43px] bg-[#D5FF5C] bg-opacity-[0.1] px-4 py-1">
                  <div className="text-[#D5FF5C]">Up to 15% off</div>
                </div>
              </div>
              <div className="text-gray-400">Stake {SEEK_TICKER} now to get discounts on dTao staking fees</div>
            </div>
            <OutlinedButton className="h-[35px]" style={{ padding: '0 12px' }} onClick={() => setIsDialogOpen(true)}>
              <div className="truncate">Get Discount</div>
            </OutlinedButton>
          </div>
        </div>
      </div>
      <GetDiscountDialog isOpen={isDialogOpen} onToggleIsOpen={() => setIsDialogOpen(prev => !prev)} />
    </>
  )
}
