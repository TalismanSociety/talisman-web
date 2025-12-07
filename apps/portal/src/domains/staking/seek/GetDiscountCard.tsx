import { X } from '@talismn/web-icons'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import SeekTilted from '@/assets/seek-tilted.svg?react'

type GetDiscountCardProps = {
  storageKey: string
}

export const GetDiscountCard = ({ storageKey }: GetDiscountCardProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(true)

  const navigate = useNavigate()

  useEffect(() => {
    const hidden = localStorage.getItem(`hide-discount-card-${storageKey}`) === 'true'
    setIsVisible(!hidden)
  }, [storageKey])

  const handleClose = () => {
    localStorage.setItem(`hide-discount-card-${storageKey}`, 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null
  return (
    <div
      className="cursor-pointer rounded-[10px] bg-gradient-to-r from-[#767A25] to-[#1B1B1B] to-[120%] p-[1px] text-[14px]"
      onClick={() => navigate('/transport/swap', { replace: true })}
    >
      <div className="relative flex h-[64px] min-w-[250px] max-w-[292px] rounded-[10px] bg-gradient-to-b from-[rgb(27,27,27)] to-[#767A25] to-[287%] p-2">
        <div className="align-center flex items-center gap-2 pl-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center">
              <div className="font-semibold">Get Fee Discounts</div>
            </div>
            <div className="text-[12px] text-gray-400">Buy SEEK and stake now</div>
          </div>
          <SeekTilted />
        </div>
        <X className="w-6 cursor-pointer font-semibold text-white" onClick={() => handleClose()} />
        {/* Green dots */}
        <div className="absolute right-6 top-16 h-[2px] w-[2px] rounded-full bg-[#D5FF5C]" />
        <div className="absolute right-[32%] top-14 h-[2px] w-[2px] rounded-full bg-[#D5FF5C]" />
        <div className="absolute right-[25%] top-4 h-[2px] w-[2px] rounded-full bg-[#D5FF5C]" />
        {/* Gray dots */}
        <div className="absolute right-[7.5%] top-7 h-[2px] w-[2px] rounded-full bg-[#FFFFFF] opacity-20" />
        <div className="absolute right-[38%] top-8 h-[2px] w-[2px] rounded-full bg-[#FFFFFF] opacity-20" />
      </div>
    </div>
  )
}
