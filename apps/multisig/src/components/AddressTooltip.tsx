import { Check, Copy, ExternalLink } from '@talismn/icons'
import { Chain } from '../domains/chains'
import { Address } from '../util/addresses'
import { Tooltip } from './ui/tooltip'
import { useToast } from './ui/use-toast'
import { useEffect, useState } from 'react'
import { cn } from '../util/tailwindcss'

export const AddressTooltip: React.FC<React.PropsWithChildren & { address: Address; chain: Chain; name?: string }> = ({
  children,
  address,
  chain,
  name,
}) => {
  const ss58Address = address.toSs58(chain)
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(ss58Address)
    if (copied) return
    setCopied(true)
    toast({
      title: 'Address copied!',
      description: <p className="text-[12px]">{address.toShortSs58(chain)}</p>,
    })
  }

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2_000)
    }
  }, [copied])
  return (
    <Tooltip
      content={
        <div className="p-3">
          <div className="flex items-center gap-[8px] mb-2">
            <p className="text-gray-100 text-[14px] mt-2">{name ?? 'Unknown Address'}</p>
            <a
              className="cursor-pointer hover:text-offWhite"
              onClick={handleCopy}
              href={address.toSubscanUrl(chain)}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={16} />
            </a>
          </div>
          <div className="flex items-center justify-between gap-4 p-3 bg-gray-500 rounded-[6px]">
            <p className="text-[12px] mt-2">{ss58Address}</p>
            <div className={cn(copied ? 'text-green-400' : 'cursor-pointer hover:text-offWhite')} onClick={handleCopy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </div>
          </div>
        </div>
      }
    >
      {children}
    </Tooltip>
  )
}

export default AddressTooltip
