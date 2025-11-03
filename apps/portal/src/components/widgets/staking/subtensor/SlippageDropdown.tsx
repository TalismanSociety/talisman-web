import { Text } from '@talismn/ui/atoms/Text'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { TextInput } from '@talismn/ui/molecules/TextInput'
import { AlertTriangle, Info, Settings } from '@talismn/web-icons'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  bittensorSlippageAtom,
  DEFAULT_MAX_SLIPPAGE,
  maxSlippageAtom,
} from '@/domains/staking/subtensor/atoms/bittensorSlippage'
import { cn } from '@/util/cn'

export const SlippageDropdown = () => {
  const [slippage, setSlippage] = useAtom(maxSlippageAtom)
  const bittensorSlippage = useAtomValue(bittensorSlippageAtom)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isAuto, setIsAuto] = useState<boolean>(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const highestSlippage = Math.max(slippage, bittensorSlippage)

  const handleClose = useCallback(() => {
    if (!slippage) {
      setSlippage(bittensorSlippage)
      setIsAuto(true)
    }
    setIsOpen(false)
  }, [bittensorSlippage, setSlippage, slippage])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [bittensorSlippage, handleClose, setSlippage, slippage])

  const leadingSupportingText = () => {
    if (slippage >= 20) {
      return (
        <div className="flex items-center gap-2 text-[14px] text-red-500">
          <AlertTriangle size={16} />
          <div>Very high slippage</div>
        </div>
      )
    } else if (slippage >= 10) {
      return (
        <div className="flex items-center gap-2 text-[14px] text-orange-500">
          <AlertTriangle size={16} />
          <div>High slippage</div>
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <div ref={dropdownRef} className="relative inline-block w-full text-left">
      <div
        className={cn('flex w-full items-center justify-between', {
          'text-red-500': highestSlippage >= 20,
          'text-orange-500': highestSlippage >= 10 && highestSlippage < 20,
        })}
      >
        <div className="flex items-center gap-2">
          <div className="text-[14px] text-gray-400">Slippage</div>
          <Tooltip
            content={
              <div className="max-w-[35rem]">
                Stake transaction will revert if the price changes more than the allowed slippage percentage.
              </div>
            }
            placement="bottom"
          >
            <Info size={16} className="text-gray-400" />
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip content={<div className="max-w-[35rem]">Set max slippage</div>} placement="top">
            <button
              onClick={() => {
                if (isOpen) {
                  handleClose()
                } else {
                  setIsOpen(true)
                }
              }}
              className="flex cursor-pointer items-center rounded-md shadow-md"
            >
              <Settings size={16} />
            </button>
          </Tooltip>
          <div>{isAuto ? 'Auto' : 'Custom'}</div>
          <div className="text-[14px]">
            {isAuto ? `${bittensorSlippage.toFixed(2)}%` : `${(slippage || 0).toFixed(2)}%`}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2  w-[40rem] rounded-[16px] bg-gray-950 p-4 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Text.Body>Max slippage</Text.Body>

              {leadingSupportingText && leadingSupportingText()}
            </div>
            <TextInput
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              placeholder="0.00%"
              trailingIcon={
                <div className="flex items-center gap-2">
                  <div>%</div>
                  <div
                    className="bg-gray-750 cursor-pointer rounded-[16px] border border-gray-500 px-[1rem] py-[0.5rem] text-gray-300"
                    onClick={() => {
                      setSlippage(bittensorSlippage)
                      setIsAuto(true)
                    }}
                  >
                    Auto
                  </div>
                </div>
              }
              css={{ fontSize: '2rem' }}
              onChange={e => {
                const val = parseFloat(e.target.value)
                setIsAuto(false)
                if (val < 0 || val > 100) return
                setSlippage(val)
              }}
              value={slippage}
              containerClassName="w-[20rem] text-[14px]"
              inputContainerClassName="text-[14px]!"
            />
          </div>
        </div>
      )}
    </div>
  )
}
