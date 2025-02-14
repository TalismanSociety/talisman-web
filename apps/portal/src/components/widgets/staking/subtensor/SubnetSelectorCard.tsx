import { useSurfaceColor, useSurfaceColorAtElevation } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { classNames } from '@talismn/util'
import { useRecoilValue } from 'recoil'

import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { type SubnetData } from '@/domains/staking/subtensor/types'

export type SubnetSelectorCardProps = {
  selected?: boolean
  highlighted?: boolean
  onClick: (subnetPool: SubnetData) => void
  subnetPool: SubnetData
}

export const SubnetSelectorCard = ({ subnetPool, selected, highlighted, onClick }: SubnetSelectorCardProps) => {
  const surfaceVariant = useSurfaceColorAtElevation(x => x + 1)
  const surfaceColor = useSurfaceColor()
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

  const isHighlighted = highlighted || selected
  const alpha = isHighlighted ? 'high' : 'disabled'
  const { symbol, netuid, total_tao, total_alpha, descriptionName } = subnetPool
  const name = `${netuid} | ${descriptionName}`

  const totalTao = nativeTokenAmount.fromPlanckOrUndefined(total_tao).decimalAmount?.toLocaleString() ?? ''
  const totalAlpha = nativeTokenAmount.fromPlanckOrUndefined(total_alpha, symbol).decimalAmount?.toLocaleString() ?? ''

  return (
    <article
      onClick={() => onClick(subnetPool)}
      css={[{ backgroundColor: surfaceColor }, isHighlighted && { borderColor: surfaceVariant }]}
      className={classNames(
        'flex min-h-[7.5rem] cursor-pointer flex-col justify-between rounded-[0.8rem] border border-transparent px-[1.6rem] py-[0.8rem] filter hover:brightness-[1.8]',
        isHighlighted && 'border-[#000] brightness-[1.6]'
      )}
    >
      <Tooltip content={name}>
        <div className="flex items-baseline gap-[0.8rem] overflow-hidden">
          <Text.Body
            alpha={alpha}
            className="m-0 flex flex-1 items-center gap-4 overflow-hidden text-ellipsis whitespace-nowrap font-bold"
          >
            <div>{name}</div>
            <div className="rounded-md bg-gray-700 px-2 py-0.5">{symbol}</div>
          </Text.Body>
        </div>
      </Tooltip>
      <div className="flex items-center justify-between">
        <Tooltip content="Total TAO">
          <Text.Body alpha={alpha}>{totalTao}</Text.Body>
        </Tooltip>
        <Tooltip content="Total Alpha">
          <Text.Body alpha={alpha}>{totalAlpha}</Text.Body>
        </Tooltip>
      </div>
    </article>
  )
}
