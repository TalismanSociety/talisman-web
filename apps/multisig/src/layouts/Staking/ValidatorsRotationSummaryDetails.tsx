import { Zap } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion'
import { bondedPoolsState } from '@domains/staking'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { Identicon, Skeleton } from '@talismn/ui'
import AddressTooltip from '@components/AddressTooltip'
import { Chain } from '@domains/chains'
import { Validator, validatorsState } from '@domains/staking/ValidatorsWatcher'
import { shortenAddress } from '@util/addresses'

type Props = {
  currentNominations: string[]
  newNominations: string[]
  poolId?: number
  chain: Chain
}

export const NominationCard: React.FC<{
  address: string
  validators?: Record<string, Validator>
  chain: Chain
}> = ({ validators, address, chain }) => {
  const validator = validators?.[address]

  return (
    <AddressTooltip
      address={address}
      name={
        validator?.name || validator?.subName
          ? `${validator.name}${validator.subName ? ` / ${validator.subName}` : ''}`
          : undefined
      }
      chain={chain}
    >
      <div className="flex items-center overflow-hidden w-full gap-[8px] px-[8px] py-[4px] bg-gray-500 rounded-[8px] h-[44px] text-left">
        <Identicon value={address} size={20} className="min-w-[20px]" />
        <div className="overflow-hidden w-full">
          <p className="text-offWhite text-[14px]  whitespace-nowrap overflow-hidden text-ellipsis">
            {validator?.name ?? shortenAddress(address)}
          </p>
          {validator?.subName !== undefined && (
            <p className="text-[12px] whitespace-nowrap overflow-hidden text-ellipsis">/ {validator.subName}</p>
          )}
        </div>
      </div>
    </AddressTooltip>
  )
}

export const ValidatorsRotationSummaryDetails: React.FC<Props> = ({
  chain,
  currentNominations,
  newNominations,
  poolId,
}) => {
  const bondedPools = useRecoilValue(bondedPoolsState)
  const validators = useRecoilValue(validatorsState)

  const pool = useMemo(() => {
    if (poolId === undefined) return null
    if (bondedPools === undefined) return undefined
    return bondedPools.poolsMap[poolId]
  }, [bondedPools, poolId])

  const addedNominations = useMemo(() => {
    const added: string[] = []
    newNominations.forEach(addedAddress => {
      if (!currentNominations.includes(addedAddress)) added.push(addedAddress)
    })
    return added
  }, [currentNominations, newNominations])

  const removedNominations = useMemo(() => {
    const removed: string[] = []
    currentNominations.forEach(removedAddress => {
      if (!newNominations.includes(removedAddress)) removed.push(removedAddress)
    })
    return removed
  }, [currentNominations, newNominations])

  return (
    <div className="px-[16px] bg-gray-600 rounded-[16px]">
      <Accordion type="single" collapsible>
        <AccordionItem value="1" className="!border-b-0">
          <AccordionTrigger className="!py-[16px]">
            <div className="flex items-center justify-between w-full pr-[8px]">
              <div className="flex gap-[8px] items-center">
                <p className="text-offWhite">Staking</p>
                <div className="text-primary">
                  <Zap size={20} />
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                {pool === null ? null : pool === undefined ? (
                  <Skeleton.Surface className="h-[21px] w-[100px]" />
                ) : (
                  <AddressTooltip address={pool.stash} name={`Pool #${pool.id} (Stash)`} chain={chain}>
                    <div className="flex items-center bg-gray-500 gap-[4px] px-[8px] rounded-[8px]">
                      <Identicon size={14} value={pool.stash.toSs58()} />
                      <p className="text-offWhite text-[14px] mt-[2px]">Pool #{pool.id}</p>
                    </div>
                  </AddressTooltip>
                )}
                <p>
                  {addedNominations.length > 0 && <span className="text-green-500">+ {addedNominations.length}</span>}{' '}
                  {removedNominations.length > 0 && <span className="text-red-400">- {removedNominations.length}</span>}{' '}
                  {(addedNominations.length > 0 || removedNominations.length > 0) && <span>Validators</span>}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-[16px]">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-200 text-[16px]">New Nominated Validators</p>
                  <div className="text-primary bg-primary/20 text-[14px] py-[4px] px-[8px] rounded-[6px]">
                    {newNominations.length} Validators
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-[8px] mt-[8px]">
                  {newNominations.map(addr => (
                    <NominationCard key={addr} address={addr} chain={chain} validators={validators?.validators} />
                  ))}
                </div>
              </div>
              {addedNominations.length > 0 && (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-200 text-[16px]">Added Validators</p>
                    <div className="text-green-500 bg-green-400/20 text-[14px] py-[4px] px-[8px] rounded-[6px]">
                      {addedNominations.length} Added
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-[8px] mt-[8px]">
                    {addedNominations.map(addr => (
                      <NominationCard key={addr} address={addr} chain={chain} validators={validators?.validators} />
                    ))}
                  </div>
                </div>
              )}
              {removedNominations.length > 0 && (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-200 text-[16px]">Removed Validators</p>
                    <div className="text-red-500 bg-red-400/20 text-[14px] py-[4px] px-[8px] rounded-[6px]">
                      {removedNominations.length} Removed
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-[8px] mt-[8px]">
                    {removedNominations.map(addr => (
                      <NominationCard key={addr} address={addr} chain={chain} validators={validators?.validators} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
