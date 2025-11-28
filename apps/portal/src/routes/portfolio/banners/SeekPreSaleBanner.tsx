import { X } from '@talismn/web-icons'
import { useEffect, useState } from 'react'

import SeekPreSaleBg from '@/assets/seek-pre-sale-bg.svg?react'
import { IS_PRE_SALE_BANNER_ACTIVE } from '@/util/featureFlags'

const storageKey = 'hide-seek-pre-sale-info-banner'
const preSaleLink = 'https://docs.talisman.xyz/talisman/seek/launchpad-pre-sale'

export const SeekPreSaleBanner = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true)

  useEffect(() => {
    const hidden = localStorage.getItem(storageKey) === 'true'
    setIsVisible(!hidden)
  }, [])

  const handleClose = () => {
    localStorage.setItem(storageKey, 'true')
    setIsVisible(false)
  }

  if (!isVisible || !IS_PRE_SALE_BANNER_ACTIVE) return null
  return (
    <div
      className="cursor-pointer rounded-[10px] bg-gradient-to-r from-[#2E3128] to-[#1B1B1B] to-[274%] p-[1px] text-[14px]"
      onClick={() => window.open(preSaleLink, '_blank')}
    >
      <div className="relative flex h-[64px] rounded-[10px] bg-gradient-to-b from-[rgb(27,27,27)] to-[#3F3F0C] to-[287%] p-2">
        <div className="align-center flex items-center gap-2 pl-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center">
              <div className="font-semibold">SEEK Pre-Sale Ends Soon</div>
            </div>
            <div className="text-[12px] text-gray-400">Closes Dec 2nd. Don’t miss out! Click here to Learn More. </div>
          </div>
          <div className="absolute right-8 top-0">
            <SeekPreSaleBg />
          </div>
        </div>
        <X className="ml-auto w-6 cursor-pointer font-semibold text-white" onClick={() => handleClose()} />
      </div>
    </div>
  )
}
