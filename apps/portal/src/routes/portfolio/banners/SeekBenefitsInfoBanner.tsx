// import { X } from '@talismn/web-icons'
import { useEffect, useState } from 'react'

import SeekInfoBenefitsBg from '@/assets/seek-benefits-bg.svg?react'

import SeekBenefitsDialog from './SeekBenefitsDialog'

const storageKey = 'hide-seek-benefits-info-banner'

export const SeekBenefitsInfoBanner = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    const hidden = localStorage.getItem(storageKey) === 'true'
    setIsVisible(!hidden)
  }, [])

  // TODO: Enable banner dismissal later
  // const handleClose = () => {
  //   localStorage.setItem(storageKey, 'true')
  //   setIsVisible(false)
  // }

  if (!isVisible) return null
  return (
    <>
      <div
        className="cursor-pointer rounded-[10px] bg-gradient-to-r from-[#2E3128] to-[#1B1B1B] to-[274%] p-[1px] text-[14px]"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative flex h-[64px] rounded-[10px] bg-gradient-to-b from-[rgb(27,27,27)] to-[#3F3F0C] to-[287%] p-2">
          <div className="align-center flex items-center gap-2 pl-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center">
                <div className="font-semibold">Talisman SEEK is live</div>
              </div>
              <div className="text-[12px] text-gray-400">Stake SEEK now to get discounts</div>
            </div>
            <div className="absolute right-8 top-0">
              <SeekInfoBenefitsBg />
            </div>
          </div>
          {/* <X className="ml-auto w-6 cursor-pointer font-semibold text-white" onClick={() => handleClose()} /> */}
        </div>
      </div>
      <SeekBenefitsDialog isOpen={isOpen} onToggleIsOpen={() => setIsOpen(prev => !prev)} />
    </>
  )
}
