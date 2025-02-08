import { useSurfaceColor, useSurfaceColorAtElevation } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { classNames } from '@talismn/util'
import { useRecoilValue } from 'recoil'

import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { SubnetPool } from '@/domains/staking/subtensor/types'

export type SubnetSelectorCardProps = {
  selected?: boolean
  onClick: () => void
  subnetPool: SubnetPool
}

export const SubnetSelectorCard = ({ subnetPool, selected, onClick }: SubnetSelectorCardProps) => {
  const surfaceVariant = useSurfaceColorAtElevation(x => x + 1)
  const surfaceColor = useSurfaceColor()
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

  const alpha = selected ? 'high' : 'disabled'
  const { symbol, netuid, total_tao } = subnetPool
  const name = `${netuid}: ${symbol}`

  const totalTao = nativeTokenAmount.fromPlanckOrUndefined(total_tao).decimalAmount?.toLocaleString() ?? ''

  return (
    <article
      onClick={onClick}
      css={[{ backgroundColor: surfaceColor }, selected && { borderColor: surfaceVariant }]}
      className={classNames(
        'min-h-[9.7rem] cursor-pointer rounded-[0.8rem] border border-transparent px-[1.6rem] py-[0.8rem] filter hover:brightness-[1.8]',
        selected && 'border-[#000] brightness-[1.6]'
      )}
    >
      <header className="mb-[0.6rem] flex items-baseline justify-between gap-4">
        <Tooltip content={name}>
          <div className="flex items-baseline gap-[0.8rem] overflow-hidden">
            <Text.Body alpha={alpha} className="m-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-bold">
              {name}
            </Text.Body>
          </div>
        </Tooltip>
      </header>
      <Tooltip content="Total TAO">
        <Text.Body alpha={alpha}>{totalTao}</Text.Body>
      </Tooltip>
    </article>
  )
}
