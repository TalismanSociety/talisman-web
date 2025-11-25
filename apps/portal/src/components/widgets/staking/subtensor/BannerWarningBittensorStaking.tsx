import { X } from '@talismn/web-icons'
import { useEffect, useState } from 'react'

const storageKey = 'hide-bittensor-info-banner'
const preSaleLink = 'https://chromewebstore.google.com/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld'

export const BannerWarningBittensorStaking = ({ classNames }: { classNames?: string }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true)

  useEffect(() => {
    const hidden = localStorage.getItem(storageKey) === 'true'
    setIsVisible(!hidden)
  }, [])

  const handleClose = () => {
    localStorage.setItem(storageKey, 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null
  return (
    <div className={classNames}>
      <div className="rounded-[7.65px] bg-gradient-to-r from-[#E6007A] via-[#E6007A]/60 to-transparent p-[1px]">
        <div className="relative flex rounded-[7.65px] bg-gradient-to-b from-[#131313] to-[#1D0512] p-4">
          <div className="flex flex-1 items-center gap-2">
            <div className="flex flex-col gap-1">
              <div className="text-[14px] font-semibold leading-[140%] text-[#FAFAFA]">
                Subnet staking in the Portal is currently being upgraded.
              </div>
              <div className="text-[12px] leading-[140%] text-[#A5A5A5]">
                Some low-liquidity routes may not execute. For the best experience, please use the subnet
                staking/swapping feature in Talisman Wallet instead. Download{' '}
                <a
                  href={preSaleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer underline hover:text-gray-300"
                >
                  here
                </a>
                .
              </div>
            </div>
          </div>
          <X className="h-6 w-6 flex-shrink-0 cursor-pointer text-white" onClick={handleClose} />
        </div>
      </div>
    </div>
  )
}
